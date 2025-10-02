from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from .models import Portfolio
from .serializers import PortfolioSerializer
from apps.stock.models import Stock


class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user, is_active=True)

    @action(detail=False, methods=['get'])
    def total(self, request):
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True)
        total = sum(portfolio.total_cost for portfolio in portfolios)
        return Response({"total": total}, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['get'])
    def current_total(self, request):
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True).select_related('stock')
        total = sum(portfolio.quantity * float(portfolio.stock.current_price) for portfolio in portfolios)
        return Response({"total": round(total, 2)}, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'])
    def highest_weight(self, request):
        # Acción con más cantidad de acciones en el portafolio
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True).select_related('stock')
        
        if not portfolios.exists():
            return Response({"error": "No active portfolios found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Encontrar el portfolio con mayor cantidad
        max_portfolio = max(portfolios, key=lambda p: p.quantity)
        
        # Calcular totales
        total_quantity = sum(p.quantity for p in portfolios)
        total_invested = sum(p.total_cost for p in portfolios)
        
        # Calcular métricas
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


    @action(detail=False, methods=['get'])
    def lowest_performance(self, request):
        # Acción con menor ganancia (peor rendimiento)
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True).select_related('stock')
        
        if not portfolios.exists():
            return Response({"error": "No active portfolios found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Calcular rendimiento para cada portfolio
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
        
        # Encontrar el de menor rendimiento
        worst = min(performances, key=lambda x: x['performance'])
        portfolio = worst['portfolio']
        
        weight_percentage = (portfolio.quantity / total_quantity * 100) if total_quantity > 0 else 0
        
        return Response({
            "name": portfolio.stock.name,
            "symbol": portfolio.stock.symbol,
            "weight_percentage": round(weight_percentage, 2),
            "performance_percentage": round(worst['performance'], 2)
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def highest_performance(self, request):
        # Acción con mayor ganancia del portfolio (mejor rendimiento)
        portfolios = Portfolio.objects.filter(user=request.user, is_active=True).select_related('stock')
        
        if not portfolios.exists():
            return Response({"error": "No active portfolios found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Calcular rendimiento para cada portfolio
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
        
        # Encontrar el de mayor rendimiento
        best = max(performances, key=lambda x: x['performance'])
        portfolio = best['portfolio']
        
        weight_percentage = (portfolio.quantity / total_quantity * 100) if total_quantity > 0 else 0
        
        return Response({
            "name": portfolio.stock.name,
            "symbol": portfolio.stock.symbol,
            "weight_percentage": round(weight_percentage, 2),
            "performance_percentage": round(best['performance'], 2)
        }, status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'])
    def buy(self, request):
        stock_id = request.data.get("stock_id")
        amount = float(request.data.get("amount", 0))
        current_price = float(request.data.get("current_price"))
        print(request.user)
        if not stock_id or amount <= 0:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            stock = Stock.objects.get(id=stock_id, is_active=True)
        except Stock.DoesNotExist:
            return Response({"error": "Stock not found"}, status=status.HTTP_404_NOT_FOUND)

        portfolio, _ = Portfolio.objects.get_or_create(user=request.user, stock=stock)
        portfolio.buy(amount, current_price)

        return Response(PortfolioSerializer(portfolio).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def sell(self, request):
        stock_id = request.data.get("stock_id")
        amount = float(request.data.get("amount", 0))

        if not stock_id or amount <= 0:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            portfolio = Portfolio.objects.get(user=request.user, stock_id=stock_id, is_active=True)
        except Portfolio.DoesNotExist:
            return Response({"error": "Stock not found in your portfolio"}, status=status.HTTP_404_NOT_FOUND)
        if portfolio.quantity < amount:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

        portfolio.sell(amount)
        return Response(PortfolioSerializer(portfolio).data, status=status.HTTP_200_OK)