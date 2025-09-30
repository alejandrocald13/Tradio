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

    @action(detail=False, methods=['post'])
    def buy(self, request):
        stock_id = request.data.get("stock_id")
        amount = float(request.data.get("amount", 0))
        print(request.user)
        if not stock_id or amount <= 0:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            stock = Stock.objects.get(id=stock_id, is_active=True)
        except Stock.DoesNotExist:
            return Response({"error": "Stock not found"}, status=status.HTTP_404_NOT_FOUND)

        portfolio, _ = Portfolio.objects.get_or_create(user=request.user, stock=stock)
        portfolio.buy(amount)

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
