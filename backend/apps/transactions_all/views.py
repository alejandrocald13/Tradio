from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from market_clock.utils import is_open
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from .models import PurchaseTransaction, SaleTransaction
from .serializers import PurchaseTransactionSerializer, SaleTransactionSerializer
from .services import TradeService

@extend_schema(tags=['transactions'])
class PurchaseTransactionViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseTransaction.objects.filter(user=self.request.user).order_by('-date')

    @extend_schema(
        summary="Ejecutar compra",
        description="Crea una compra tomando automáticamente el `current_price` del Stock. Actualiza wallet y portfolio.",
        request=PurchaseTransactionSerializer,
        responses={201: OpenApiResponse(description="Compra ejecutada"), 422: OpenApiResponse(description="Fondos insuficientes / mercado cerrado")},
        examples=[OpenApiExample("Request de compra", value={"stock": 3, "quantity": "2.00"}, request_only=True)]
    )
    def create(self, request, *args, **kwargs):
        if not is_open():
            return Response({"detail": "Market is closed"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        data = request.data
        stock_id = data.get("stock")
        quantity = data.get("quantity")
        reference = data.get("reference", "BUY")
        if not stock_id or not quantity:
            return Response({"detail": "Fields 'stock' and 'quantity' are required"}, status=400)
        try:
            trade = TradeService()
            purchase, wallet, portfolio, unit_price = trade.buy(user=request.user, stock_id=stock_id, quantity=quantity, reference=reference)
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
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@extend_schema(tags=['transactions'])
class SaleTransactionViewSet(viewsets.ModelViewSet):
    serializer_class = SaleTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SaleTransaction.objects.filter(user=self.request.user).order_by('-date')

    @extend_schema(
        summary="Ejecutar venta",
        description="Crea una venta tomando automáticamente el `current_price` del Stock. Valida posición y actualiza wallet/portfolio.",
        request=SaleTransactionSerializer,
        responses={201: OpenApiResponse(description="Venta ejecutada"), 422: OpenApiResponse(description="Posición insuficiente / mercado cerrado")},
        examples=[OpenApiExample("Request de venta", value={"stock": 3, "quantity": "1.00"}, request_only=True)]
    )
    def create(self, request, *args, **kwargs):
        if not is_open():
            return Response({"detail": "Market is closed"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        data = request.data
        stock_id = data.get("stock")
        quantity = data.get("quantity")
        reference = data.get("reference", "SELL")
        if not stock_id or not quantity:
            return Response({"detail": "Fields 'stock' and 'quantity' are required"}, status=400)
        try:
            trade = TradeService()
            sale, wallet, portfolio, unit_price = trade.sell(user=request.user, stock_id=stock_id, quantity=quantity, reference=reference)
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
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
