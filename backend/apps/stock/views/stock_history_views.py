from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
import yfinance as yf
from datetime import datetime, timedelta
from ..models import Stock
from ..serializers import (
    HistoryResponseSerializer,
    AllStocksHistoryResponseSerializer,
    ErrorResponseSerializer
)
from ..permissions import IsAdminOrReadOnly
from ...users.actions import Action
from ...users.utils import log_action


@extend_schema(tags=['stocks-history'])
class StockHistoryViewSet(viewsets.GenericViewSet):
    """
    ViewSet para datos históricos de stocks
    """
    queryset = Stock.objects.filter(is_active=True)
    permission_classes = [IsAdminOrReadOnly]

    @extend_schema(
        summary="Obtener historial de una acción",
        parameters=[
            OpenApiParameter('symbol', OpenApiTypes.STR, required=True, description='Símbolo de la acción'),
            OpenApiParameter('days', OpenApiTypes.INT, description='Días de historial (default: 7)'),
            OpenApiParameter('interval', OpenApiTypes.STR, description='Intervalo: 1d, 1h, etc. (default: 1d)'),
        ],
        responses={
            200: HistoryResponseSerializer,
            400: ErrorResponseSerializer,
            404: ErrorResponseSerializer
        }
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
            stock_db = Stock.objects.get(symbol=symbol.upper(), is_active=True)
            current_price_db = float(stock_db.current_price)
            stock_name = str(stock_db.name)
            exchange = str(stock_db.exchange)
        except Stock.DoesNotExist:
            return Response(
                {"error": "Stock not found in database"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            stock = yf.Ticker(symbol.upper())
            end_date = datetime.now()
            if end_date.weekday() >= 5:
                days_to_subtract = end_date.weekday() - 4
                end_date -= timedelta(days=days_to_subtract)
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
            
            return Response(
                {
                    "id": stock_db.id,
                    "stock": stock_name,
                    "symbol": symbol.upper(),
                    "exchange": exchange,
                    "last": current_price_db,
                    "days": days,
                    "interval": interval,
                    "data": {
                        "t": timestamps,
                        "c": close_prices
                    }
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": f"Error fetching data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Obtener historial de todas las acciones",
        description="Devuelve el historial de los últimos días para todas las acciones activas",
        responses={
            200: AllStocksHistoryResponseSerializer,
            404: ErrorResponseSerializer
        }
    )
    @action(detail=False, methods=['get'])
    def all_history(self, request):
        stocks = Stock.objects.filter(is_active=True)
        
        if not stocks.exists():
            return Response(
                {"error": "No active stocks found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        results = []
        
        for stock_db in stocks:
            try:
                ticker = yf.Ticker(stock_db.symbol)
                hist = ticker.history(period='5d', interval='1d')
                
                if not hist.empty:
                    hist = hist.tail(7)
                    
                    timestamps = [int(date.timestamp()) for date in hist.index]
                    close_prices = hist['Close'].tolist()
                    
                    current_timestamp = int(datetime.now().timestamp())
                    current_price_db = float(stock_db.current_price)
                    
                    timestamps.append(current_timestamp)
                    close_prices.append(current_price_db)
                    
                    results.append({
                        "id": stock_db.id,
                        "name": stock_db.name,
                        "symbol": stock_db.symbol,
                        "current_price": current_price_db,
                        "category": stock_db.category.name if stock_db.category else None,
                        "data": {
                            "t": timestamps,
                            "c": close_prices
                        }
                    })
            except Exception as e:
                print(f"Error processing {stock_db.symbol}: {str(e)}")
                continue
        
        return Response({
            "message": "Historical data retrieved successfully",
            "total_stocks": len(results),
            "stocks": results
        }, status=status.HTTP_200_OK)