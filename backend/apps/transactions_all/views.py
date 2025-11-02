from decimal import Decimal
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.exceptions import ValidationError

from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,      
    OpenApiParameter,
    OpenApiResponse,
    OpenApiExample
)

from apps.transactions_all.models import PurchaseTransaction, SaleTransaction
from apps.transactions_all.serializers import (
    PurchaseTransactionSerializer,
    SaleTransactionSerializer,
)

from apps.transactions_all.market_clock.utils import is_open

from apps.common.email_service import send_trade_confirmation_email
from apps.transactions_all.services import TradeService

# --- no repudio ---
from apps.users.utils import log_action
from apps.users.actions import Action

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


@extend_schema_view(
    update=extend_schema(exclude=True),
    partial_update=extend_schema(exclude=True),
    destroy=extend_schema(exclude=True),
)
@extend_schema(tags=["transactions"])
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
        # no repudio: intento de compra
        try:
            log_action(request, request.user, Action.TRADING_BUY_SUBMITTED)
        except Exception:
            logger.debug("No-repudio: fallo log TRADING_BUY_SUBMITTED", exc_info=True)

        if not is_open():
            try:
                log_action(request, request.user, Action.TRADING_BUY_CANCELLED)
            except Exception:
                logger.debug("No-repudio: fallo log TRADING_BUY_CANCELLED", exc_info=True)
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

            # intento de email -> log de envío si fue ok
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
                try:
                    log_action(request, request.user, Action.EMAIL_MOVEMENT_SENT)
                except Exception:
                    logger.debug("No-repudio: fallo log EMAIL_MOVEMENT_SENT", exc_info=True)
            except Exception as e:
                logger.warning(f"Error enviando correo de confirmación de compra: {e}")

            # no repudio: compra ejecutada
            try:
                log_action(request, request.user, Action.TRADING_BUY_EXECUTED)
            except Exception:
                logger.debug("No-repudio: fallo log TRADING_BUY_EXECUTED", exc_info=True)

            return Response({
                "message": "Purchase executed successfully",
                "purchase": serializer.data,
                "unit_price_used": str(unit_price),
                "wallet_balance": str(wallet.balance),
                "portfolio_quantity": portfolio.quantity,
                "portfolio_avg_price": portfolio.get_average_price(),
            }, status=status.HTTP_201_CREATED)
        
        except ValidationError as e:
            try:
                log_action(request, request.user, Action.TRADING_BUY_CANCELLED)
            except Exception:
                logger.debug("No-repudio: fallo log TRADING_BUY_CANCELLED", exc_info=True)
            return Response({"detail": str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema_view(
    update=extend_schema(exclude=True),
    partial_update=extend_schema(exclude=True),
    destroy=extend_schema(exclude=True),
)
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
        # no repudio: intento de venta
        try:
            log_action(request, request.user, Action.TRADING_SELL_SUBMITTED)
        except Exception:
            logger.debug("No-repudio: fallo log TRADING_SELL_SUBMITTED", exc_info=True)

        if not is_open():
            try:
                log_action(request, request.user, Action.TRADING_SELL_CANCELLED)
            except Exception:
                logger.debug("No-repudio: fallo log TRADING_SELL_CANCELLED", exc_info=True)
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
                try:
                    log_action(request, request.user, Action.EMAIL_MOVEMENT_SENT)
                except Exception:
                    logger.debug("No-repudio: fallo log EMAIL_MOVEMENT_SENT", exc_info=True)
            except Exception as e:
                logger.warning(f"Error enviando correo de confirmación de venta: {e}")

            # no repudio: venta ejecutada
            try:
                log_action(request, request.user, Action.TRADING_SELL_EXECUTED)
            except Exception:
                logger.debug("No-repudio: fallo log TRADING_SELL_EXECUTED", exc_info=True)

            return Response({
                "message": "Sale executed successfully",
                "sale": serializer.data,
                "unit_price_used": str(unit_price),
                "wallet_balance": str(wallet.balance),
                "portfolio_quantity": portfolio.quantity,
                "portfolio_avg_price": portfolio.get_average_price(),
            }, status=status.HTTP_201_CREATED)
        
        except ValidationError as e:
            try:
                log_action(request, request.user, Action.TRADING_SELL_CANCELLED)
            except Exception:
                logger.debug("No-repudio: fallo log TRADING_SELL_CANCELLED", exc_info=True)
            return Response({"detail": str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserPurchasesView(APIView):
    """
    /api/transactions/me/purchases/?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
    para la pestaña "Compras" del usuario en purchases-sales/page.jsx
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["transactions"],
        summary="Compras del usuario autenticado",
        parameters=[
            OpenApiParameter(name="date_from", required=False, type=str, description="YYYY-MM-DD"),
            OpenApiParameter(name="date_to", required=False, type=str, description="YYYY-MM-DD"),
        ],
        responses={200: OpenApiResponse(description="OK")},
    )
    def get(self, request):
        # no repudio: vista de transacciones
        try:
            log_action(request, request.user, Action.TRANSACTIONS_VIEWED)
        except Exception:
            logger.debug("No-repudio: fallo log TRANSACTIONS_VIEWED", exc_info=True)

        user = request.user
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        qs = PurchaseTransaction.objects.filter(user=user).select_related("stock")

        if date_from and date_to:
            def apply_date_filter(qs, fields):
                for f in fields:
                    if f in [fld.name for fld in qs.model._meta.get_fields()]:
                        return qs.filter(**{f"{f}__range": [date_from, date_to]})
                return qs
            qs = apply_date_filter(
                qs,
                ["created_at", "date", "timestamp", "transaction_date", "datetime"],
            )

        data = []
        for row in qs:
            data.append({
                "accion": getattr(row.stock, "name", "-") if getattr(row, "stock", None) else "-",
                "compra": f"${getattr(row, 'unit_price', Decimal('0'))}",
                "cantidad": str(getattr(row, "quantity", "")),
                "fecha": safe_date(row),
            })

        return Response(data)


class UserSalesView(APIView):
    """
    /api/transactions/me/sales/?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
    para la pestaña "Ventas" del usuario en purchases-sales/page.jsx
    calcula % de ganancia usando unit_price vs average_cost si existe
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["transactions"],
        summary="Ventas del usuario autenticado",
        parameters=[
            OpenApiParameter(name="date_from", required=False, type=str, description="YYYY-MM-DD"),
            OpenApiParameter(name="date_to", required=False, type=str, description="YYYY-MM-DD"),
        ],
        responses={200: OpenApiResponse(description="OK")},
    )
    def get(self, request):
        # no repudio: vista de transacciones
        try:
            log_action(request, request.user, Action.TRANSACTIONS_VIEWED)
        except Exception:
            logger.debug("No-repudio: fallo log TRANSACTIONS_VIEWED", exc_info=True)

        user = request.user
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        qs = SaleTransaction.objects.filter(user=user).select_related("stock")

        if date_from and date_to:
            def apply_date_filter(qs, fields):
                for f in fields:
                    if f in [fld.name for fld in qs.model._meta.get_fields()]:
                        return qs.filter(**{f"{f}__range": [date_from, date_to]})
                return qs
            qs = apply_date_filter(
                qs,
                ["created_at", "date", "timestamp", "transaction_date", "datetime"],
            )

        data = []
        for row in qs:
            data.append({
                "accion": getattr(row.stock, "name", "-") if getattr(row, "stock", None) else "-",
                "venta": f"${getattr(row, 'unit_price', Decimal('0'))}",
                "cantidad": str(getattr(row, "quantity", "")),
                "fecha": safe_date(row),
            })

        return Response(data)


class AdminTransactionsReportView(APIView):
    """
    GET /api/transactions/report/?type=Purchases|Sale&stock=TSLA&email=x&date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
    Respuesta lista para TableAdmin en /transaction/page.jsx
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["transactions"],
        summary="Reporte admin de transacciones",
        parameters=[
            OpenApiParameter(name="type", required=False, type=str, description="Purchases | Sale"),
            OpenApiParameter(name="stock", required=False, type=str, description="Símbolo del activo (p.ej. TSLA)"),
            OpenApiParameter(name="email", required=False, type=str, description="Filtro por correo (icontains)"),
            OpenApiParameter(name="date_from", required=False, type=str, description="YYYY-MM-DD"),
            OpenApiParameter(name="date_to", required=False, type=str, description="YYYY-MM-DD"),
        ],
        responses={200: OpenApiResponse(description="OK")},
    )
    def get(self, request):
        try:
            log_action(request, request.user, Action.REPORTS_REQUESTED)
        except Exception:
            logger.debug("No-repudio: fallo log REPORTS_REQUESTED", exc_info=True)

        tx_type = request.query_params.get("type")
        stock_symbol = request.query_params.get("stock")
        email_filter = request.query_params.get("email")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        purchase_qs = PurchaseTransaction.objects.all().select_related("user", "stock")
        sale_qs = SaleTransaction.objects.all().select_related("user", "stock")

        if tx_type:
            tx_type = tx_type.lower()

        rows = []

        if stock_symbol:
            purchase_qs = purchase_qs.filter(stock__symbol__iexact=stock_symbol)
            sale_qs = sale_qs.filter(stock__symbol__iexact=stock_symbol)
        if email_filter:
            purchase_qs = purchase_qs.filter(user__email__icontains=email_filter)
            sale_qs = sale_qs.filter(user__email__icontains=email_filter)
        if date_from and date_to:
            for qs, model in [(purchase_qs, PurchaseTransaction), (sale_qs, SaleTransaction)]:
                fields = [f.name for f in model._meta.get_fields()]
                for candidate in ["created_at", "date", "timestamp", "transaction_date", "datetime"]:
                    if candidate in fields:
                        if model is PurchaseTransaction:
                            purchase_qs = qs.filter(**{f"{candidate}__range": [date_from, date_to]})
                        else:
                            sale_qs = qs.filter(**{f"{candidate}__range": [date_from, date_to]})
                        break

        if not tx_type or tx_type == "purchases":
            for p in purchase_qs:
                rows.append({
                    "Type": "Purchase",
                    "User Email": getattr(p.user, "email", ""),
                    "Symbol": getattr(p.stock, "symbol", "") if getattr(p, "stock", None) else "",
                    "Quantity": getattr(p, "quantity", ""),
                    "Total": f"{safe_total(p)}",
                    "Date": safe_date(p),
                })
        if not tx_type or tx_type == "sale":
            for s in sale_qs:
                rows.append({
                    "Type": "Sale",
                    "User Email": getattr(s.user, "email", ""),
                    "Symbol": getattr(s.stock, "symbol", "") if getattr(s, "stock", None) else "",
                    "Quantity": getattr(s, "quantity", ""),
                    "Total": f"{safe_total(s)}",
                    "Date": safe_date(s),
                })


        try:
            log_action(request, request.user, Action.REPORTS_GENERATED)
        except Exception:
            logger.debug("No-repudio: fallo log REPORTS_GENERATED", exc_info=True)

        return Response(rows)
