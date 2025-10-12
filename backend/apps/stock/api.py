from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
import requests
import os
import yfinance as yf
from datetime import datetime, timedelta
from .models import Stock, Category
from .serializers import (
    StockSerializer, 
    CategorySerializer,
    AddStockRequestSerializer,
    AddStockResponseSerializer,
    DeleteStockSerializer,
    DeleteStockResponseSerializer,
    UpdatePricesResponseSerializer,
    HistoryResponseSerializer,
    TopGainersResponseSerializer,
    TopLosersResponseSerializer,
    ErrorResponseSerializer
)
from .permissions import IsAdminOrReadOnly

API_KEY = os.getenv("FINNHUB_API_KEY")

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    permission_classes = [IsAdminOrReadOnly] 
    serializer_class = StockSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'symbol', 'category__name'] # /api/stocks/?search=<valor>
    ordering_fields = ['current_price', 'name']  # /api/stocks/?ordering=-<valor>

    @extend_schema(
        summary="Aplicar soft-delete sobre una acción",
        description="Busca la acción en BD y la desactiva",
        request=DeleteStockSerializer,
        responses={
            204: DeleteStockResponseSerializer,
        },
        tags=['stocks']
    )
    def perform_destroy(self, instance):
        instance.soft_delete()


    @extend_schema(
        summary="Agregar acción por símbolo",
        description="Busca y agrega una acción desde Finnhub si no existe en BD",
        request=AddStockRequestSerializer,
        responses={
            200: AddStockResponseSerializer,
            201: AddStockResponseSerializer,
            400: ErrorResponseSerializer,
            404: ErrorResponseSerializer,
        },
        tags=['stocks']
    )
    @action(detail=False, methods=['post'])
    def add_stock(self, request):
        symbol = request.data.get("symbol", "").upper().strip()
        
        if not symbol:
            return Response(
                {"error": "Symbol is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            stock = Stock.objects.get(symbol=symbol)
            return Response(
                {
                    "message": "Stock already exists in database",
                    "stock": {
                        "id": stock.id,
                        "name": stock.name,
                        "symbol": stock.symbol,
                        "current_price": float(stock.current_price),
                        "category": stock.category.name if stock.category else None
                    }
                },
                status=status.HTTP_200_OK
            )
        except Stock.DoesNotExist:
            pass
        
        try:
            profile_url = f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={API_KEY}"
            profile_response = requests.get(profile_url)
            profile_data = profile_response.json()
            
            quote_url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}"
            quote_response = requests.get(quote_url)
            quote_data = quote_response.json()
            
            current_price = quote_data.get('c')
            company_name = profile_data.get('name')
            industry = profile_data.get('finnhubIndustry', 'General')
            
            if not current_price or not company_name:
                return Response(
                    {"error": "Stock not found in Finnhub or incomplete data"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            category, _ = Category.objects.get_or_create(
                name=industry,
                defaults={"description": f"Industry: {industry}"}
            )
            
            stock = Stock.objects.create(
                name=company_name,
                symbol=symbol,
                category=category,
                current_price=current_price,
                is_active=True
            )
            
            return Response(
                {
                    "message": "Stock added successfully",
                    "stock": {
                        "id": stock.id,
                        "name": stock.name,
                        "symbol": stock.symbol,
                        "current_price": float(stock.current_price),
                        "category": stock.category.name
                    }
                },
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {"error": f"Error fetching stock from Finnhub: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Actualizar precios de todas las acciones (admin)",
        responses={200: UpdatePricesResponseSerializer},
        tags=['stocks']
    )
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def update_prices(self, request):
        activos = Stock.objects.filter(is_active=True)
        resultados = []

        for stock in activos:
            symbol = stock.symbol
            url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}"
            try:
                response = requests.get(url)
                data = response.json()
                new_price = data.get('c')

                if new_price:
                    stock.current_price = new_price
                    stock.save()
                    resultados.append({
                        "symbol": symbol,
                        "price": new_price,
                        "status": "updated"
                    })
                else:
                    resultados.append({
                        "symbol": symbol,
                        "status": "no_price_returned"
                    })

            except Exception as e:
                resultados.append({
                    "symbol": symbol,
                    "status": f"error: {e}"
                })

        return Response({
            "message": "Update completed",
            "results": resultados
        }, status=status.HTTP_200_OK)
    
    @extend_schema(
        summary="Obtener historial de precios",
        parameters=[
            OpenApiParameter('symbol', OpenApiTypes.STR, required=True, description='Símbolo de la acción'),
            OpenApiParameter('days', OpenApiTypes.INT, description='Días de historial (default: 7)'),
            OpenApiParameter('interval', OpenApiTypes.STR, description='Intervalo: 1m, 5m, 1h, 1d, etc. (default: 1d)'),
        ],
        responses={
            200: HistoryResponseSerializer,
            400: ErrorResponseSerializer,
            404: ErrorResponseSerializer
        },
        tags=['stocks']
    )
    @action(detail=False, methods=['get'])
    def history(self, request):
        symbol = request.query_params.get('symbol', None)
        days = int(request.query_params.get('days', 7))
        interval = request.query_params.get('interval', '1d') 
        
        if not symbol:
            return Response(
                {"error": "El parámetro 'symbol' es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        valid_intervals = ['1m', '2m', '5m', '15m', '30m', '60m', '90m', 
                        '1h', '1d', '5d', '1wk', '1mo', '3mo']
        
        if interval not in valid_intervals:
            return Response(
                {
                    "error": f"Interval '{interval}' is not valid.",
                    "valid_intervals": valid_intervals
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if interval in ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h']:
            if days > 60:
                return Response(
                    {
                        "error": "Los intervalos intradiarios solo están disponibles para máximo 60 días.",
                        "tip": "Reduce el parámetro 'days' o usa un intervalo mayor (1d, 1wk, 1mo)"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        try:
            try:
                stock_db = Stock.objects.get(symbol=symbol.upper(), is_active=True)
                current_price_db = float(stock_db.current_price)
                stock_name = str(stock_db.name)
            except Stock.DoesNotExist:
                return Response(
                    {"error": "Stock not found in database"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            stock = yf.Ticker(symbol.upper())
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            hist = stock.history(start=start_date, end=end_date, interval=interval)
            
            if hist.empty:
                return Response(
                    {"error": "Data not found for the symbol"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            timestamps = [int(date.timestamp()) for date in hist.index]
            close_prices = hist['Close'].tolist()
            
            current_timestamp = int(datetime.now().timestamp())
            timestamps.append(current_timestamp)
            close_prices.append(current_price_db)
            
            data = {
                "t": timestamps,
                "c": close_prices 
            }
            
            return Response(
                {
                    "stock": stock_name,
                    "symbol": symbol.upper(),
                    "last": current_price_db,
                    "days": days,
                    "interval": interval,
                    "data": data
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": f"Error fetching data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    @extend_schema(
        summary="Top 3 acciones ganadoras del día",
        responses={200: TopGainersResponseSerializer},
        tags=['stocks']
    )
    @action(detail=False, methods=['get'])
    def top_gainers(self, request):
        stocks = Stock.objects.filter(is_active=True)
        
        if not stocks.exists():
            return Response(
                {"error": "No active stocks found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        gainers = []
        
        for stock in stocks:
            try:
                ticker = yf.Ticker(stock.symbol)
                hist = ticker.history(period='1d', interval='1d')
                
                if not hist.empty:
                    open_price = hist['Open'].iloc[0]
                    current_price = float(stock.current_price)
                    
                    if open_price > 0:
                        change_percentage = ((current_price - open_price) / open_price) * 100
                        
                        if current_price > open_price:
                            gainers.append({
                                "id": stock.id,
                                "name": stock.name,
                                "symbol": stock.symbol,
                                "open_price": round(open_price, 2),
                                "current_price": round(current_price, 2),
                                "change_percentage": round(change_percentage, 2)
                            })
            except Exception:
                continue
        
        top_3_gainers = sorted(gainers, key=lambda x: x['change_percentage'], reverse=True)[:3]
        
        return Response({
            "top_gainers": top_3_gainers
        }, status=status.HTTP_200_OK)
    
    @extend_schema(
        summary="Top 3 acciones perdedoras del día",
        responses={200: TopLosersResponseSerializer},
        tags=['stocks']
    )
    @action(detail=False, methods=['get'])
    def top_losers(self, request):
        stocks = Stock.objects.filter(is_active=True)
        
        if not stocks.exists():
            return Response(
                {"error": "No active stocks found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        losers = []

        for stock in stocks:
            try:
                ticker = yf.Ticker(stock.symbol)
                hist = ticker.history(period='1d', interval='1d')
                
                if not hist.empty:
                    open_price = hist['Open'].iloc[0]
                    current_price = float(stock.current_price)
                    
                    if open_price > 0:
                        change_percentage = ((current_price - open_price) / open_price) * 100

                        if open_price > current_price:
                            losers.append({
                                "id": stock.id,
                                "name": stock.name,
                                "symbol": stock.symbol,
                                "open_price": round(open_price, 2),
                                "current_price": round(current_price, 2),
                                "change_percentage": round(change_percentage, 2)
                            })
            except Exception:
                continue
        
        top_3_losers = sorted(losers, key=lambda x: x['change_percentage'])[:3]
        
        return Response({
            "top_losers": top_3_losers
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['categories'])
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]