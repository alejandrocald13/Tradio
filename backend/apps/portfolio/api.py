from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from .models import Portfolio
from .serializers import (
    PortfolioSerializer,
    TotalResponseSerializer,
    StockPerformanceDetailSerializer,
    PortfolioErrorResponseSerializer
)
from apps.stock.models import Stock


@extend_schema(tags=['portfolio'])
class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'
    lookup_value_regex = '[0-9]+'

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Portfolio.objects.none()
        return Portfolio.objects.filter(user=self.request.user, is_active=True).select_related('stock')


    @extend_schema(
        summary="Total invertido en el portafolio",
        description="Retorna la suma total del costo de todas las acciones activas del usuario",
        responses={200: TotalResponseSerializer}
    )
    @action(detail=False, methods=['get'])
    def total(self, request):
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True)
        total = sum(portfolio.total_cost for portfolio in portfolios)
        return Response({"total": total}, status=status.HTTP_200_OK)
    

    @extend_schema(
        summary="Valor actual del portafolio",
        description="Retorna el valor actual total del portafolio basado en los precios actuales de las acciones",
        responses={200: TotalResponseSerializer}
    )
    @action(detail=False, methods=['get'])
    def current_total(self, request):
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True).select_related('stock')
        total = sum(portfolio.quantity * float(portfolio.stock.current_price) for portfolio in portfolios)
        return Response({"total": round(total, 2)}, status=status.HTTP_200_OK)


    @extend_schema(
        summary="Acción con mayor peso en el portafolio",
        description="Retorna la acción con mayor cantidad de acciones en el portafolio del usuario",
        responses={
            200: StockPerformanceDetailSerializer,
            404: PortfolioErrorResponseSerializer
        }
    )
    @action(detail=False, methods=['get'])
    def highest_weight(self, request):
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True).select_related('stock')
        
        if not portfolios.exists():
            return Response({"error": "No active portfolios found"}, status=status.HTTP_404_NOT_FOUND)
        
        max_portfolio = max(portfolios, key=lambda p: p.quantity)
        
        total_quantity = sum(p.quantity for p in portfolios)
        total_invested = sum(p.total_cost for p in portfolios)
        
        avg_price = max_portfolio.get_average_price()
        current_price = float(max_portfolio.stock.current_price)
        performance = ((current_price - avg_price) / avg_price * 100) if avg_price > 0 else 0
        weight_percentage = (max_portfolio.quantity / total_quantity * 100) if total_quantity > 0 else 0
        
        return Response({
            "name": max_portfolio.stock.name,
            "symbol": max_portfolio.stock.symbol,
            "quantity": max_portfolio.quantity,
            "weight_percentage": round(weight_percentage, 2),
            "performance_percentage": round(performance, 2)
        }, status=status.HTTP_200_OK)


    @extend_schema(
        summary="Acción con peor rendimiento",
        description="Retorna la acción con menor ganancia (peor rendimiento) del portafolio",
        responses={
            200: StockPerformanceDetailSerializer,
            404: PortfolioErrorResponseSerializer
        }
    )
    @action(detail=False, methods=['get'])
    def lowest_performance(self, request):
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True).select_related('stock')
        
        if not portfolios.exists():
            return Response({"error": "No active portfolios found"}, status=status.HTTP_404_NOT_FOUND)
        
        performances = []
        total_quantity = sum(p.quantity for p in portfolios)
        
        for p in portfolios:
            avg_price = p.get_average_price()
            current_price = float(p.stock.current_price)
            
            performance = ((current_price - avg_price) / avg_price * 100) if avg_price > 0 else 0
            performances.append({
                'portfolio': p,
                'performance': performance
            })
        
        worst = min(performances, key=lambda x: x['performance'])
        portfolio = worst['portfolio']
        
        weight_percentage = (portfolio.quantity / total_quantity * 100) if total_quantity > 0 else 0
        
        return Response({
            "name": portfolio.stock.name,
            "symbol": portfolio.stock.symbol,
            "weight_percentage": round(weight_percentage, 2),
            "performance_percentage": round(worst['performance'], 2)
        }, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Acción con mejor rendimiento",
        description="Retorna la acción con mayor ganancia (mejor rendimiento) del portafolio",
        responses={
            200: StockPerformanceDetailSerializer,
            404: PortfolioErrorResponseSerializer
        }
    )
    @action(detail=False, methods=['get'])
    def highest_performance(self, request):
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True).select_related('stock')
        
        if not portfolios.exists():
            return Response({"error": "No active portfolios found"}, status=status.HTTP_404_NOT_FOUND)
        
        performances = []
        total_value = 0
        total_quantity = sum(p.quantity for p in portfolios)
        
        for p in portfolios:
            avg_price = p.get_average_price()
            current_price = float(p.stock.current_price)
            current_value = p.quantity * current_price
            total_value += current_value
            
            performance = ((current_price - avg_price) / avg_price * 100) if avg_price > 0 else 0
            performances.append({
                'portfolio': p,
                'performance': performance,
                'current_value': current_value
            })
        
        best = max(performances, key=lambda x: x['performance'])
        portfolio = best['portfolio']
        
        weight_percentage = (portfolio.quantity / total_quantity * 100) if total_quantity > 0 else 0
        
        return Response({
            "name": portfolio.stock.name,
            "symbol": portfolio.stock.symbol,
            "weight_percentage": round(weight_percentage, 2),
            "performance_percentage": round(best['performance'], 2)
        }, status=status.HTTP_200_OK)


    # @action(detail=False, methods=['post'])
    # def buy(self, request):
    #     stock_id = request.data.get("stock_id")
    #     amount = float(request.data.get("amount", 0))
    #     current_price = float(request.data.get("current_price"))
        
    #     if not stock_id or amount <= 0:
    #         return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    #     try:
    #         stock = Stock.objects.get(id=stock_id, is_active=True)
    #     except Stock.DoesNotExist:
    #         return Response({"error": "Stock not found"}, status=status.HTTP_404_NOT_FOUND)

    #     portfolio, _ = Portfolio.objects.get_or_create(user=request.user, stock=stock)
    #     portfolio.buy(amount, current_price)

    #     return Response(PortfolioSerializer(portfolio).data, status=status.HTTP_200_OK)

    # @action(detail=False, methods=['post'])
    # def sell(self, request):
    #     stock_id = request.data.get("stock_id")
    #     amount = float(request.data.get("amount", 0))

    #     if not stock_id or amount <= 0:
    #         return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    #     try:
    #         portfolio = Portfolio.objects.get(user=request.user, stock_id=stock_id, is_active=True)
    #     except Portfolio.DoesNotExist:
    #         return Response({"error": "Stock not found in your portfolio"}, status=status.HTTP_404_NOT_FOUND)
        
    #     if portfolio.quantity < amount:
    #         return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    #     portfolio.sell(amount)
    #     return Response(PortfolioSerializer(portfolio).data, status=status.HTTP_200_OK)