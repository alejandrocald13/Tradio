from decimal import Decimal
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.transactions_all.models import PurchaseTransaction, SaleTransaction
from apps.transactions_all.serializers import (
    PurchaseTransactionSerializer,
    SaleTransactionSerializer,
)

from apps.common.email_service import send_trade_confirmation_email

from django.utils.timezone import now
import logging

logger = logging.getLogger(__name__)


def safe_total(obj):
    for field in ["total_amount", "total", "amount_total"]:
        if hasattr(obj, field) and getattr(obj, field) is not None:
            return Decimal(getattr(obj, field))

    qty = getattr(obj, "quantity", None)
    price = getattr(obj, "unit_price", None)
    if qty is not None and price is not None:
        try:
            return Decimal(qty) * Decimal(price)
        except Exception:
            pass

    return Decimal("0")


def safe_date(obj):
    for field in ["created_at", "date", "timestamp", "transaction_date", "datetime"]:
        if hasattr(obj, field) and getattr(obj, field) is not None:
            dt = getattr(obj, field)
            try:
                return dt.strftime("%d/%m/%Y")
            except Exception:
                return str(dt)
    return ""


class PurchaseTransactionViewSet(viewsets.ModelViewSet):
    queryset = PurchaseTransaction.objects.all().select_related("user", "stock")
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

            try:
                total = float(purchase.quantity) * float(purchase.unit_price)
                send_trade_confirmation_email(
                    user=request.user,
                    trade={
                        "type": "compra",
                        "symbol": purchase.stock.symbol,
                        "qty": str(purchase.quantity),
                        "price": str(purchase.unit_price),
                        "total": f"{total:.2f}",
                        "executed_at": purchase.date.strftime("%Y-%m-%d %H:%M:%S"),
                        "id": purchase.id,
                    },
                )
            except Exception as e:
                logger.warning(f"Error enviando correo de confirmación de compra: {e}")

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
    queryset = SaleTransaction.objects.all().select_related("user", "stock")
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
            try:

                total = float(sale.quantity) * float(sale.unit_price)
                send_trade_confirmation_email(
                    user=request.user,
                    trade={
                        "type": "venta",
                        "symbol": sale.stock.symbol,
                        "qty": str(sale.quantity),
                        "price": str(sale.unit_price),
                        "total": f"{total:.2f}",
                        "executed_at": sale.date.strftime("%Y-%m-%d %H:%M:%S"),
                        "id": sale.id,
                    },
                )
            except Exception as e:
                logger.warning(f"Error enviando correo de confirmación de venta: {e}")

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
