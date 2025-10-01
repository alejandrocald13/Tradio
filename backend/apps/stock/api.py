from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
import requests
import os
import yfinance as yf
from datetime import datetime, timedelta
from .models import Stock, Category
from .serializers import StockSerializer, CategorySerializer
from .permissions import IsAdminOrReadOnly

API_KEY = os.getenv("FINNHUB_API_KEY")

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all() # para devolver únicamente stocks activos
    permission_classes = [IsAdminOrReadOnly] 
    serializer_class = StockSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'symbol', 'category__name'] # /api/stocks/?search=<valor>
    ordering_fields = ['current_price', 'name']  # /api/stocks/?ordering=-<valor>

    def perform_destroy(self, instance):
        instance.soft_delete()

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
                new_price = data.get('c')  # current price

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
    

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def history(self, request):
        symbol = request.query_params.get('symbol', None)
        days = int(request.query_params.get('days', 7))
        interval = request.query_params.get('interval', '1d') 
        
        # Validar parámetros
        if not symbol:
            return Response(
                {"error": "El parámetro 'symbol' es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Intervalos válidos en yfinance
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
        
        # Restricciones de yfinance para datos intradiarios
        # Los intervalos de minutos solo están disponibles para los últimos 60 días
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
            stock = yf.Ticker(symbol.upper())
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            # Obtener datos históricos con el intervalo especificado
            hist = stock.history(start=start_date, end=end_date, interval=interval)
            
            if hist.empty:
                return Response(
                    {"error": "Data not found for the symbol"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            data = {
                "t": [int(date.timestamp()) for date in hist.index],    # Timestamps en formato Unix
                "o": hist['Open'].tolist(),                             # Open (precio de apertura)
                "h": hist['High'].tolist(),                             # High (precio máximo del día)
                "l": hist['Low'].tolist(),                              # Low (precio más bajo del día)
                "c": hist['Close'].tolist(),                            # Close (precio de cierre)
                "v": hist['Volume'].tolist()                            # Volume (volumen de acciones negociadas)
            }
            
            return Response(
                {
                    "symbol": symbol.upper(),
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


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
