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


class SaleTransactionViewSet(viewsets.ModelViewSet):
    queryset = SaleTransaction.objects.all().select_related("user", "stock")
    serializer_class = SaleTransactionSerializer
    permission_classes = [IsAuthenticated]


class AdminTransactionsReportView(APIView):
    """
    GET /api/transactions/report/?type=Purchases|Sale&stock=TSLA&email=x&date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
    Respuesta lista para TableAdmin en /transaction/page.jsx
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tx_type = request.query_params.get("type")           
        stock_symbol = request.query_params.get("stock")     
        email_filter = request.query_params.get("email")   
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        purchase_qs = PurchaseTransaction.objects.all().select_related("user", "stock")
        sale_qs = SaleTransaction.objects.all().select_related("user", "stock")

        if stock_symbol:
            purchase_qs = purchase_qs.filter(stock__symbol=stock_symbol)
            sale_qs = sale_qs.filter(stock__symbol=stock_symbol)

        if email_filter:
            purchase_qs = purchase_qs.filter(user__email__icontains=email_filter)
            sale_qs = sale_qs.filter(user__email__icontains=email_filter)

       
        if date_from and date_to:
            def apply_date_filter(qs, fields):
                for f in fields:
                    if f in [fld.name for fld in qs.model._meta.get_fields()]:
                        return qs.filter(**{f"{f}__range": [date_from, date_to]})
                return qs

            purchase_qs = apply_date_filter(
                purchase_qs,
                ["created_at", "date", "timestamp", "transaction_date", "datetime"],
            )
            sale_qs = apply_date_filter(
                sale_qs,
                ["created_at", "date", "timestamp", "transaction_date", "datetime"],
            )

        rows = []

        if not tx_type or tx_type == "Purchases":
            for p in purchase_qs:
                rows.append({
                    "Type": "Purchases",
                    "User Email": getattr(p.user, "email", ""),
                    "Action": getattr(p.stock, "symbol", "") if getattr(p, "stock", None) else "",
                    "Quantity": getattr(p, "quantity", ""),
                    "Total": f"{safe_total(p)}",
                    "Date": safe_date(p),
                })

        if not tx_type or tx_type == "Sale":
            for s in sale_qs:
                rows.append({
                    "Type": "Sale",
                    "User Email": getattr(s.user, "email", ""),
                    "Action": getattr(s.stock, "symbol", "") if getattr(s, "stock", None) else "",
                    "Quantity": getattr(s, "quantity", ""),
                    "Total": f"{safe_total(s)}",
                    "Date": safe_date(s),
                })

        return Response(rows)


class UserPurchasesView(APIView):
    """
    /api/transactions/me/purchases/?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
    para la pestaña "Compras" del usuario en purchases-sales/page.jsx
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
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

    def get(self, request):
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
            sell_price = getattr(row, "unit_price", None)
            if sell_price is None:
                sell_price = Decimal("0")
            else:
                sell_price = Decimal(sell_price)

            avg_cost = getattr(row, "average_cost", None)
            if avg_cost is None:
                avg_cost = Decimal("0")
            else:
                avg_cost = Decimal(avg_cost)

            pct_gain = Decimal("0")
            if avg_cost > 0:
                pct_gain = ((sell_price - avg_cost) / avg_cost) * Decimal("100")

            data.append({
                "accion": getattr(row.stock, "name", "-") if getattr(row, "stock", None) else "-",
                "compra": f"${avg_cost:.2f}",
                "venta": f"${sell_price:.2f}",
                "pct": f"{pct_gain:.2f}%",
                "cantidad": str(getattr(row, "quantity", "")),
                "fecha": safe_date(row),
            })

        return Response(data)
