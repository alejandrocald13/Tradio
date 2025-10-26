from django.utils.dateparse import parse_date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

from apps.users.auth0_authentication import Auth0JWTAuthentication
from apps.wallet.models import Movement


# Mapeo interno para mostrar un label legible en la tabla
TYPE_LABELS = {
    "TOPUP": "Deposit",
    "WITHDRAW": "Withdrawal",
    "REFERRAL_CODE": "Referral Bonus",
}


@extend_schema(
    tags=['wallet'],
    summary="Lista los movimientos de la wallet (admin view)",
    description=(
        "Historial de movimientos de todos los usuarios (wallet_movement).\n\n"
        "Filtros opcionales:\n"
        "- email=<user email, substring>\n"
        "- type=TOPUP|WITHDRAW|REFERRAL_CODE\n"
        "- date_from=YYYY-MM-DD\n"
        "- date_to=YYYY-MM-DD\n\n"
        "Devuelve una lista ya formateada para la tabla del frontend con llaves:\n"
        "Type, User Email, Amount, Date"
    ),
    parameters=[
        OpenApiParameter(name="email", required=False, type=str),
        OpenApiParameter(name="type", required=False, type=str),
        OpenApiParameter(name="date_from", required=False, type=str),
        OpenApiParameter(name="date_to", required=False, type=str),
    ],
    responses={
        200: OpenApiResponse(description="OK"),
        401: OpenApiResponse(description="Unauthorized"),
    }
)
class WalletMovementListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email_filter = request.query_params.get("email")
        type_filter = request.query_params.get("type")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        qs = Movement.objects.select_related("user").all().order_by("-created_at")

        if email_filter:
            qs = qs.filter(user__email__icontains=email_filter)

        if type_filter:
            qs = qs.filter(type__iexact=type_filter)

        if date_from:
            df = parse_date(date_from)
            if df:
                qs = qs.filter(created_at__date__gte=df)

        if date_to:
            dt = parse_date(date_to)
            if dt:
                qs = qs.filter(created_at__date__lte=dt)

        data = []
        for mv in qs:
            human_type = TYPE_LABELS.get(mv.type, mv.type)
            data.append({
                "Type": human_type,
                "User Email": mv.user.email,
                "Amount": float(mv.total or mv.amount or 0),
                "Date": mv.created_at.date().isoformat(),
            })

        return Response(data)
