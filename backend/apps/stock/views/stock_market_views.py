from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
import yfinance as yf
from ..models import Stock
from ..serializers import (
    TopGainersResponseSerializer,
    TopLosersResponseSerializer,
    ErrorResponseSerializer
)
from ..permissions import IsAdminOrReadOnly


@extend_schema(tags=['stocks-market'])
class StockMarketViewSet(viewsets.GenericViewSet):
    """
    ViewSet para análisis de mercado (gainers, losers)
    """
    queryset = Stock.objects.filter(is_active=True)
    permission_classes = [IsAdminOrReadOnly]

    @extend_schema(
        summary="Top 3 acciones ganadoras del día",
        responses={200: TopGainersResponseSerializer, 404: ErrorResponseSerializer}
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
                    
                    if open_price > 0 and current_price > open_price:
                        change_percentage = ((current_price - open_price) / open_price) * 100
                        gainers.append({
                            "id": stock.id,
                            "name": stock.name,
                            "symbol": stock.symbol,
                            "exchange": stock.exchange,
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
        responses={200: TopLosersResponseSerializer, 404: ErrorResponseSerializer}
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
                    
                    if open_price > 0 and open_price > current_price:
                        change_percentage = ((current_price - open_price) / open_price) * 100
                        losers.append({
                            "id": stock.id,
                            "name": stock.name,
                            "symbol": stock.symbol,
                            "exchange": stock.exchange,
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