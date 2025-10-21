from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from market_clock.utils import is_open
from .models import PurchaseTransaction, SaleTransaction
from .serializers import PurchaseTransactionSerializer, SaleTransactionSerializer
from .services import TradeService


class PurchaseTransactionViewSet(viewsets.ModelViewSet):

    serializer_class = PurchaseTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseTransaction.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        if not is_open():
            return Response(
                {"detail": "Market is closed"},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        data = request.data
        stock_id = data.get("stock")
        quantity = data.get("quantity")
        reference = data.get("reference", "BUY")

        if not stock_id or not quantity:
            return Response(
                {"detail": "Fields 'stock' and 'quantity' are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            trade = TradeService()
            purchase, wallet, portfolio, unit_price = trade.buy(
                user=request.user,
                stock_id=stock_id,
                quantity=quantity,
                reference=reference
            )

            serializer = self.get_serializer(purchase)
            return Response({
                "message": "Purchase executed successfully",
                "purchase": serializer.data,
                "unit_price_used": str(unit_price),
                "wallet_balance": str(wallet.balance),
                "portfolio_quantity": portfolio.quantity,
                "portfolio_avg_price": portfolio.get_average_price(),
            }, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SaleTransactionViewSet(viewsets.ModelViewSet):

    serializer_class = SaleTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SaleTransaction.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        if not is_open():
            return Response(
                {"detail": "Market is closed"},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        data = request.data
        stock_id = data.get("stock")
        quantity = data.get("quantity")
        reference = data.get("reference", "SELL")

        if not stock_id or not quantity:
            return Response(
                {"detail": "Fields 'stock' and 'quantity' are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            trade = TradeService()
            sale, wallet, portfolio, unit_price = trade.sell(
                user=request.user,
                stock_id=stock_id,
                quantity=quantity,
                reference=reference
            )

            serializer = self.get_serializer(sale)
            return Response({
                "message": "Sale executed successfully",
                "sale": serializer.data,
                "unit_price_used": str(unit_price),
                "wallet_balance": str(wallet.balance),
                "portfolio_quantity": portfolio.quantity,
                "portfolio_avg_price": portfolio.get_average_price(),
            }, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
