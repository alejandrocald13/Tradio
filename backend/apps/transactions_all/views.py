from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PurchaseTransaction, SaleTransaction
from .serializers import PurchaseTransactionSerializer, SaleTransactionSerializer
from market_clock.utils import is_open
from apps.portfolio.models import Portfolio

class PurchaseTransactionViewSet(viewsets.ModelViewSet):
    queryset = PurchaseTransaction.objects.all()
    serializer_class = PurchaseTransactionSerializer
    permission_classes = [IsAuthenticated] 

    def create(self, request, *args, **kwargs):
        if not is_open():
            return Response({"detail": "Market is closed"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        return super().create(request, *args, **kwargs)

class SaleTransactionViewSet(viewsets.ModelViewSet):
    queryset = SaleTransaction.objects.all()
    serializer_class = SaleTransactionSerializer
    permission_classes = [IsAuthenticated]  

    def create(self, request, *args, **kwargs):
        if not is_open():
            return Response({"detail": "Market is closed"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        user = request.user
        stock = request.data.get("stock")
        quantity = request.data.get("quantity")
        unit_price = request.data.get("unit_price")

        if not stock or not quantity or not unit_price:
            return Response({"detail": "Stock, quantity and unit_price are required"}, status=status.HTTP_400_BAD_REQUEST)

        from apps.stock.models import Stock as StockModel
        stock_obj = StockModel.objects.get(id=stock)
        portfolio = Portfolio.objects.filter(user=user, stock=stock_obj).first()
        average_cost = portfolio.get_average_price() if portfolio else 0

        mutable_data = request.data.copy()
        mutable_data['user'] = user.id
        mutable_data['average_cost'] = average_cost
        request._full_data = mutable_data

        return super().create(request, *args, **kwargs)
