from decimal import Decimal
from django.utils.dateparse import parse_date

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

from apps.transactions_all.models import PurchaseTransaction, SaleTransaction
from apps.transactions_all.serializers import (
    PurchaseTransactionSerializer,
    SaleTransactionSerializer,
)

from apps.users.auth0_authentication import Auth0JWTAuthentication


@extend_schema(
    tags=['transactions'],
    summary="Purchase Transactions",
    description="CRUD de transacciones de compra.",
)
class PurchaseTransactionViewSet(viewsets.ModelViewSet):
    queryset = PurchaseTransaction.objects.all().select_related("user", "stock")
    serializer_class = PurchaseTransactionSerializer
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]


@extend_schema(
    tags=['transactions'],
    summary="Sale Transactions",
    description="CRUD de transacciones de venta.",
)
class SaleTransactionViewSet(viewsets.ModelViewSet):
    queryset = SaleTransaction.objects.all().select_related("user", "stock")
    serializer_class = SaleTransactionSerializer
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]


@extend_schema(
    tags=['transactions'],
    summary="Listado unificado de transacciones (compras y ventas) para la tabla del admin",
    description=(
        "Devuelve compras y ventas combinadas en un solo array, con las llaves exactas "
        "que consume el frontend (/transaction). Soporta filtros opcionales.\n\n"
        "Query params soportados:\n"
        "- type=Sale|Purchases\n"
        "- stock=<stock symbol>\n"
        "- email=<user email substring>\n"
        "- date_from=YYYY-MM-DD\n"
        "- date_to=YYYY-MM-DD\n\n"
        "Formato de cada fila:\n"
        "{ 'Type', 'User Email', 'Action', 'Quantity', 'Total', 'Date' }"
    ),
    parameters=[
        OpenApiParameter(name="type", description="Sale | Purchases", required=False, type=str),
        OpenApiParameter(name="stock", description="Stock symbol (e.g. AAPL)", required=False, type=str),
        OpenApiParameter(name="email", description="User email (partial match)", required=False, type=str),
        OpenApiParameter(name="date_from", description="YYYY-MM-DD", required=False, type=str),
        OpenApiParameter(name="date_to", description="YYYY-MM-DD", required=False, type=str),
    ],
    responses={
        200: OpenApiResponse(description="OK"),
        401: OpenApiResponse(description="Unauthorized"),
    }
)
class TransactionReportView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        type_filter = request.query_params.get("type")
        stock_symbol = request.query_params.get("stock")
        email_filter = request.query_params.get("email")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        purchases_qs = PurchaseTransaction.objects.select_related("user", "stock").all()
        sales_qs = SaleTransaction.objects.select_related("user", "stock").all()

        if email_filter:
            purchases_qs = purchases_qs.filter(user__email__icontains=email_filter)
            sales_qs = sales_qs.filter(user__email__icontains=email_filter)

        if stock_symbol:
            purchases_qs = purchases_qs.filter(stock__symbol__iexact=stock_symbol)
            sales_qs = sales_qs.filter(stock__symbol__iexact=stock_symbol)

        if date_from:
            df = parse_date(date_from)
            if df:
                purchases_qs = purchases_qs.filter(date__date__gte=df)
                sales_qs = sales_qs.filter(date__date__gte=df)

        if date_to:
            dt = parse_date(date_to)
            if dt:
                purchases_qs = purchases_qs.filter(date__date__lte=dt)
                sales_qs = sales_qs.filter(date__date__lte=dt)

        purchase_rows = []
        for p in purchases_qs:
            total = (p.quantity or Decimal("0")) * (p.unit_price or Decimal("0"))
            purchase_rows.append({
                "Type": "Purchases",
                "User Email": p.user.email,
                "Action": p.stock.name,
                "Quantity": float(p.quantity),
                "Total": float(total),
                "Date": p.date.date().isoformat(),  # "YYYY-MM-DD"
            })

        sale_rows = []
        for s in sales_qs:
            total = (s.quantity or Decimal("0")) * (s.unit_price or Decimal("0"))
            sale_rows.append({
                "Type": "Sale",
                "User Email": s.user.email,
                "Action": s.stock.name,
                "Quantity": float(s.quantity),
                "Total": float(total),
                "Date": s.date.date().isoformat(),
            })

        combined = purchase_rows + sale_rows

        if type_filter == "Purchases":
            combined = [row for row in combined if row["Type"] == "Purchases"]
        elif type_filter == "Sale":
            combined = [row for row in combined if row["Type"] == "Sale"]

        combined.sort(key=lambda r: r["Date"], reverse=True)

        return Response(combined)
