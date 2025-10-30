from decimal import Decimal
from django.db import transaction
from django.utils.dateparse import parse_date

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
)

from apps.users.auth0_authentication import Auth0JWTAuthentication
from apps.wallet.models import Wallet, Movement
from apps.users.models import Profile



TYPE_LABELS = {
    "TOPUP": "Deposit",
    "WITHDRAW": "Withdrawal",
    "REFERRAL_CODE": "Referral Bonus",
}


@extend_schema(
    tags=['wallet'],
    summary="Lista los movimientos de la wallet (admin view)",
    description=(
        "Historial de movimientos de TODOS los usuarios.\n\n"
        "Filtros opcionales:\n"
        "- email=<user email substring>\n"
        "- type=TOPUP|WITHDRAW|REFERRAL_CODE\n"
        "- date_from=YYYY-MM-DD\n"
        "- date_to=YYYY-MM-DD\n\n"
        "Devuelve una lista con llaves: "
        "Type, User Email, Amount, Date (lo que consume /movements en admin)."
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
    """
    GET /api/wallet/movements/
    Vista ADMIN: lista movimientos de cualquier usuario,
    con filtros, para la página /movements del admin.
    """
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

        return Response(data, status=status.HTTP_200_OK)


class WalletMeView(APIView):
    """
    GET /api/wallet/me/
    Devuelve balance actual del usuario autenticado
    + SU historial personal (no de todos).
    """
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["wallet"],
        summary="Estado de la wallet del usuario autenticado",
        description=(
            "Devuelve el balance actual de la wallet y el historial de movimientos "
            "del usuario autenticado."
        ),
        responses={
            200: OpenApiResponse(description="OK"),
            401: OpenApiResponse(description="Unauthorized"),
        },
    )
    def get(self, request):
        user = request.user

        wallet_obj, _ = Wallet.objects.get_or_create(
            user=user,
            defaults={"balance": Decimal("0.00")}
        )

        moves_qs = Movement.objects.filter(user=user).order_by("-created_at")

        movements = []
        for mv in moves_qs:
            human_type = TYPE_LABELS.get(mv.type, mv.type)
            movements.append({
                "id": mv.id,
                "transfer_number": mv.transfer_number,  # <--- añadido
                "date": mv.created_at.date().isoformat(),
                "amount": float(mv.total or mv.amount or 0),
                "type": human_type,
    })

        data = {
            "balance": float(wallet_obj.balance),
            "transactions": movements,
        }

        return Response(data, status=status.HTTP_200_OK)


class WalletDepositView(APIView):
    """
    POST /api/wallet/deposit/
    Body:
    {
      "amount": 100.50,
      "bank": "Banco Industrial",
      "code": "ABC123"
    }

    Lógica:
    - suma al balance
    - registra Movement con type='TOPUP'
    """
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["wallet"],
        summary="Depositar dinero en la wallet del usuario",
        description="Aumenta el balance del usuario y registra un movimiento TOPUP.",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "amount": {"type": "number"},
                    "bank": {"type": "string"},
                    "code": {"type": "string"},
                },
                "required": ["amount"],
            }
        },
        responses={
            200: OpenApiResponse(description="OK"),
            400: OpenApiResponse(description="Bad Request"),
        },
    )
    def post(self, request):
        user = request.user
        amount = request.data.get("amount")
        bank = request.data.get("bank")
        code = request.data.get("code")

        try:
            amount_dec = Decimal(str(amount))
            if amount_dec <= 0:
                return Response(
                    {"detail": "Amount must be > 0"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception:
            return Response(
                {"detail": "Invalid amount"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            wallet_obj, _ = Wallet.objects.select_for_update().get_or_create(
                user=user,
                defaults={"balance": Decimal("0.00")}
            )

            new_balance = wallet_obj.balance + amount_dec
            wallet_obj.balance = new_balance
            wallet_obj.save()

            mv = Movement.objects.create(
                user=user,
                type="TOPUP",
                amount=amount_dec,
                commission=Decimal("0.00"),
                total=amount_dec,         
                transfer_number=code or "",
            )

        return Response({
            "detail": "Deposit successful",
            "new_balance": float(wallet_obj.balance),
            "movement": {
                "id": mv.id,
                "date": mv.created_at.date().isoformat(),
                "amount": float(mv.total),
                "type": TYPE_LABELS.get(mv.type, mv.type),
            }
        }, status=status.HTTP_200_OK)


class WalletWithdrawView(APIView):
    """
    POST /api/wallet/withdraw/
    Body:
    {
      "amount": 50.00,
      "bank": "Banco Industrial",
      "code": "XYZ999"
    }

    Lógica:
    - resta del balance (no deja negativo)
    - registra Movement con type='WITHDRAW'
    """
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["wallet"],
        summary="Retirar dinero de la wallet del usuario",
        description="Disminuye el balance del usuario y registra un movimiento WITHDRAW.",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "amount": {"type": "number"},
                    "bank": {"type": "string"},
                    "code": {"type": "string"},
                },
                "required": ["amount"],
            }
        },
        responses={
            200: OpenApiResponse(description="OK"),
            400: OpenApiResponse(description="Bad Request"),
        },
    )
    def post(self, request):
        user = request.user
        amount = request.data.get("amount")
        bank = request.data.get("bank")
        code = request.data.get("code")

        try:
            amount_dec = Decimal(str(amount))
            if amount_dec <= 0:
                return Response(
                    {"detail": "Amount must be > 0"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception:
            return Response(
                {"detail": "Invalid amount"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            wallet_obj, _ = Wallet.objects.select_for_update().get_or_create(
                user=user,
                defaults={"balance": Decimal("0.00")}
            )

            if wallet_obj.balance < amount_dec:
                return Response(
                    {"detail": "Insufficient funds"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            new_balance = wallet_obj.balance - amount_dec
            wallet_obj.balance = new_balance
            wallet_obj.save()

            mv = Movement.objects.create(
                user=user,
                type="WITHDRAW",
                amount=amount_dec,
                commission=Decimal("0.00"),
                total=-amount_dec,         
                transfer_number=code or "",
            )

        return Response({
            "detail": "Withdrawal successful",
            "new_balance": float(wallet_obj.balance),
            "movement": {
                "id": mv.id,
                "date": mv.created_at.date().isoformat(),
                "amount": float(mv.total),  # negativo
                "type": TYPE_LABELS.get(mv.type, mv.type),
            }
        }, status=status.HTTP_200_OK)

class ReferralApplyView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["wallet"],
        summary="Usar un código de referido",
        description=(
            "El usuario autenticado ingresa un código de otra persona. "
            "Se acreditan $5 al dueño del código y se registra un Movement en su wallet. "
            "Restricciones: no puedes usar tu propio código y solo puedes usar un código una vez."
        ),
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "code": {"type": "string"},
                },
                "required": ["code"],
            }
        },
        responses={
            200: OpenApiResponse(description="OK"),
            400: OpenApiResponse(description="Bad Request"),
            404: OpenApiResponse(description="Not Found"),
        },
    )
    def post(self, request):
        user = request.user
        code = (request.data.get("code") or "").strip()

        if not code:
            return Response({"detail": "Debe proporcionar un código."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            my_profile = Profile.objects.select_related("user").get(user=user)
        except Profile.DoesNotExist:
            return Response({"detail": "Perfil del usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if my_profile.has_used_referral:
            return Response({"detail": "Ya usaste un código de referido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            owner_profile = Profile.objects.select_related("user").get(referral_code__iexact=code)
        except Profile.DoesNotExist:
            return Response({"detail": "Código inválido."}, status=status.HTTP_404_NOT_FOUND)

        if owner_profile.user_id == user.id:
            return Response({"detail": "No puedes usar tu propio código."}, status=status.HTTP_400_BAD_REQUEST)

        credit_amount = Decimal("5.00")

        with transaction.atomic():
            owner_wallet, _ = Wallet.objects.select_for_update().get_or_create(
                user=owner_profile.user,
                defaults={"balance": Decimal("0.00")}
            )
            owner_wallet.balance = owner_wallet.balance + credit_amount
            owner_wallet.save()

            mv = Movement.objects.create(
                user=owner_profile.user,
                type="REFERRAL_CODE",
                amount=credit_amount,
                commission=Decimal("0.00"),
                total=credit_amount,
                transfer_number=code,  
            )

            my_profile.has_used_referral = True
            my_profile.save(update_fields=["has_used_referral"])

        return Response({
            "detail": "Código aplicado correctamente. Se acreditaron $5 al dueño del código.",
            "credited_user": owner_profile.user.email,
            "movement": {
                "id": mv.id,
                "date": mv.created_at.date().isoformat(),
                "amount": float(mv.total),
                "type": "Referral Bonus",
                "transfer_number": mv.transfer_number,
            }
        }, status=status.HTTP_200_OK)