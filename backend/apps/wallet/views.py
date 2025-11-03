from decimal import Decimal, ROUND_HALF_UP
from django.db import transaction
from django.utils.dateparse import parse_date
import uuid

from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
    OpenApiExample,
    inline_serializer,
)

from apps.users.auth0_authentication import Auth0JWTAuthentication
from apps.wallet.models import Wallet, Movement
from apps.users.models import Profile
from apps.common.email_service import send_wallet_movement_email

from apps.users.utils import log_action
from apps.users.actions import Action

import logging

logger = logging.getLogger(__name__)

TYPE_LABELS = {
    "TOPUP": "Deposit",
    "WITHDRAW": "Withdrawal",
    "REFERRAL_CODE": "Referral Bonus",
}

def _q(x: Decimal) -> Decimal:
    return x.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def _commission(amount_dec: Decimal) -> Decimal:
    return _q(amount_dec * Decimal("0.0365")) if amount_dec > Decimal("100") else Decimal("3.00")

def _safe_transfer_number(requested_code: str | None, prefix: str | None = None) -> str:
    """
    Si el cliente envía un transfer_number (code) y ya existe, devolvemos cadena vacía
    para que el modelo Movement autogenere uno único en save().
    Si se pasa un prefix, lo usamos para construir uno único con el código.
    """
    code = (requested_code or "").strip()
    if prefix:
        candidate = f"{prefix}-{code.upper()}-{uuid.uuid4().hex[:6].upper()}"
        return candidate
    if not code:
        return "" 
    if Movement.objects.filter(transfer_number=code).exists():
        return "" 
    return code


class WalletMovementListView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["wallet"],
        summary="Listado de movimientos de wallet (admin)",
        parameters=[
            OpenApiParameter(name="email", required=False, type=str, description="Filtro por email (icontains)"),
            OpenApiParameter(name="type", required=False, type=str, description="TOPUP | WITHDRAW | REFERRAL_CODE"),
            OpenApiParameter(name="date_from", required=False, type=str, description="YYYY-MM-DD"),
            OpenApiParameter(name="date_to", required=False, type=str, description="YYYY-MM-DD"),
        ],
        responses={200: OpenApiResponse(description="OK")},
    )
    def get(self, request):
        # no repudio: consulta de movimientos (admin)
        try:
            log_action(request, request.user, Action.REPORTS_REQUESTED)
        except Exception:
            logger.debug("No-repudio: fallo log REPORTS_REQUESTED", exc_info=True)

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
                "Commission": float(mv.commission or 0),           # <<--- NUEVO
                "Date": mv.created_at.date().isoformat(),
            })

        # no repudio: listado generado
        try:
            log_action(request, request.user, Action.REPORTS_GENERATED)
        except Exception:
            logger.debug("No-repudio: fallo log REPORTS_GENERATED", exc_info=True)

        return Response(data, status=status.HTTP_200_OK)


class WalletMeView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["wallet"],
        summary="Mi wallet: balance y movimientos",
        responses={200: OpenApiResponse(description="OK")},
    )
    def get(self, request):
        # no repudio: vista de transacciones del usuario
        try:
            log_action(request, request.user, Action.TRANSACTIONS_VIEWED)
        except Exception:
            logger.debug("No-repudio: fallo log TRANSACTIONS_VIEWED", exc_info=True)

        user = request.user

        wallet_obj, _ = Wallet.objects.get_or_create(
            user=user, defaults={"balance": Decimal("0.00")}
        )

        moves_qs = Movement.objects.filter(user=user).order_by("-created_at")

        movements = []
        for mv in moves_qs:
            movements.append({
                "id": mv.id,
                "transfer_number": mv.transfer_number,
                "date": mv.created_at.date().isoformat(),
                "amount": float(mv.total or mv.amount or 0),
                "commission": float(mv.commission or 0),            # opcionalmente también aquí
                "type": TYPE_LABELS.get(mv.type, mv.type),
            })

        return Response({
            "balance": float(wallet_obj.balance),
            "transactions": movements,
        }, status=status.HTTP_200_OK)


class WalletDepositView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["wallet"],
        summary="Depósito en wallet",
        request=inline_serializer(
            name="WalletDepositRequest",
            fields={
                "amount": serializers.DecimalField(max_digits=12, decimal_places=2),
                "bank": serializers.CharField(required=False, allow_blank=True),
                "code": serializers.CharField(required=False, allow_blank=True),
            },
        ),
        responses={
            200: OpenApiResponse(description="Deposit successful"),
            400: OpenApiResponse(description="Invalid amount / Amount must be > 0"),
        },
        examples=[
            OpenApiExample(
                "Ejemplo de depósito",
                value={"amount": "120.00", "bank": "BBVA", "code": "TRX-123"},
                request_only=True,
            )
        ],
    )
    def post(self, request):
        # no repudio: solicitud de depósito
        try:
            log_action(request, request.user, Action.FUNDS_DEPOSIT_REQUESTED)
        except Exception:
            logger.debug("No-repudio: fallo log FUNDS_DEPOSIT_REQUESTED", exc_info=True)

        user = request.user
        amount = request.data.get("amount")
        bank = request.data.get("bank")
        code = request.data.get("code")

        try:
            amount_dec = Decimal(str(amount))
            if amount_dec <= 0:
                return Response({"detail": "Amount must be > 0"}, status=400)
        except Exception:
            return Response({"detail": "Invalid amount"}, status=400)

        with transaction.atomic():
            wallet_obj, _ = Wallet.objects.select_for_update().get_or_create(
                user=user, defaults={"balance": Decimal("0.00")}
            )

            commission = _commission(amount_dec)
            net = _q(amount_dec - commission)

            wallet_obj.balance = _q(wallet_obj.balance + net)
            wallet_obj.save()

            transfer_number = _safe_transfer_number(code)
            mv = Movement.objects.create(
                user=user,
                type="TOPUP",
                amount=_q(amount_dec),
                commission=commission,
                total=net,
                transfer_number=transfer_number,
            )

            try:
                send_wallet_movement_email(
                    user,
                    movement={
                        "type": "Depósito",
                        "amount": str(mv.amount),
                        "reference": mv.transfer_number,
                        "balance_after": str(wallet_obj.balance),
                        "created_at": mv.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                    },
                )
                # no repudio: correo enviado
                try:
                    log_action(request, request.user, Action.EMAIL_MOVEMENT_SENT)
                except Exception:
                    logger.debug("No-repudio: fallo log EMAIL_MOVEMENT_SENT", exc_info=True)
            except Exception as e:
                logger.warning(f"Error al enviar correo de depósito: {e}")

        # no repudio: depósito confirmado
        try:
            log_action(request, request.user, Action.FUNDS_DEPOSIT_CONFIRMED)
        except Exception:
            logger.debug("No-repudio: fallo log FUNDS_DEPOSIT_CONFIRMED", exc_info=True)

        return Response({
            "detail": "Deposit successful",
            "new_balance": float(wallet_obj.balance),
            "movement": {
                "id": mv.id,
                "date": mv.created_at.date().isoformat(),
                "amount": float(mv.total),
                "type": TYPE_LABELS.get(mv.type, mv.type),
            }
        }, status=200)


class WalletWithdrawView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["wallet"],
        summary="Retiro desde wallet",
        request=inline_serializer(
            name="WalletWithdrawRequest",
            fields={
                "amount": serializers.DecimalField(max_digits=12, decimal_places=2),
                "bank": serializers.CharField(required=False, allow_blank=True),
                "code": serializers.CharField(required=False, allow_blank=True),
            },
        ),
        responses={
            200: OpenApiResponse(description="Withdrawal successful"),
            400: OpenApiResponse(description="Invalid amount / Amount must be > 0 / Insufficient funds"),
        },
        examples=[
            OpenApiExample(
                "Ejemplo de retiro",
                value={"amount": "50.00", "bank": "BBVA", "code": "TRX-987"},
                request_only=True,
            )
        ],
    )
    def post(self, request):
        # no repudio: solicitud de retiro
        try:
            log_action(request, request.user, Action.FUNDS_WITHDRAWAL_REQUESTED)
        except Exception:
            logger.debug("No-repudio: fallo log FUNDS_WITHDRAWAL_REQUESTED", exc_info=True)

        user = request.user
        amount = request.data.get("amount")
        bank = request.data.get("bank")
        code = request.data.get("code")

        try:
            amount_dec = Decimal(str(amount))
            if amount_dec <= 0:
                return Response({"detail": "Amount must be > 0"}, status=400)
        except Exception:
            return Response({"detail": "Invalid amount"}, status=400)

        with transaction.atomic():
            wallet_obj, _ = Wallet.objects.select_for_update().get_or_create(
                user=user, defaults={"balance": Decimal("0.00")}
            )

            commission = _commission(amount_dec)
            net = _q(amount_dec + commission)

            if wallet_obj.balance < net:
                return Response({"detail": "Insufficient funds"}, status=400)

            wallet_obj.balance = _q(wallet_obj.balance - net)
            wallet_obj.save()

            transfer_number = _safe_transfer_number(code)
            mv = Movement.objects.create(
                user=user,
                type="WITHDRAW",
                amount=_q(amount_dec),
                commission=commission,
                total=-net,
                transfer_number=transfer_number,
            )

            try:
                send_wallet_movement_email(
                    user,
                    movement={
                        "type": "Retiro",
                        "amount": str(mv.amount),
                        "reference": mv.transfer_number or mv.id,
                        "balance_after": str(wallet_obj.balance),
                        "created_at": mv.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                    },
                )
                # no repudio: correo enviado
                try:
                    log_action(request, request.user, Action.EMAIL_MOVEMENT_SENT)
                except Exception:
                    logger.debug("No-repudio: fallo log EMAIL_MOVEMENT_SENT", exc_info=True)
            except Exception as e:
                logger.warning(f"Error al enviar correo de retiro: {e}")

        # no repudio: retiro confirmado
        try:
            log_action(request, request.user, Action.FUNDS_WITHDRAWAL_CONFIRMED)
        except Exception:
            logger.debug("No-repudio: fallo log FUNDS_WITHDRAWAL_CONFIRMED", exc_info=True)

        return Response({
            "detail": "Withdrawal successful",
            "new_balance": float(wallet_obj.balance),
            "movement": {
                "id": mv.id,
                "date": mv.created_at.date().isoformat(),
                "amount": float(mv.total),
                "type": TYPE_LABELS.get(mv.type, mv.type),
            }
        }, status=200)


class ReferralApplyView(APIView):
    authentication_classes = [Auth0JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["wallet"],
        summary="Aplicar código de referido",
        request=inline_serializer(
            name="ReferralApplyRequest",
            fields={
                "code": serializers.CharField(),
            },
        ),
        responses={
            200: OpenApiResponse(description="Código aplicado"),
            400: OpenApiResponse(description="Errores de validación (p.ej., ya usado / propio)"),
            404: OpenApiResponse(description="Perfil o código no encontrado"),
        },
        examples=[
            OpenApiExample(
                "Ejemplo de referral",
                value={"code": "FRIEND-ABC123"},
                request_only=True,
            )
        ],
    )
    def post(self, request):
        user = request.user
        code = (request.data.get("code") or "").strip()

        if not code:
            return Response({"detail": "Debe proporcionar un código."}, status=400)

        try:
            my_profile = Profile.objects.select_related("user").get(user=user)
        except Profile.DoesNotExist:
            return Response({"detail": "Perfil del usuario no encontrado."}, status=404)

        with transaction.atomic():
            my_profile = Profile.objects.select_for_update().select_related("user").get(pk=my_profile.pk)

            if getattr(my_profile, "has_used_referral", False):
                return Response({"detail": "Ya usaste un código de referido."}, status=400)

            try:
                owner_profile = Profile.objects.select_related("user").get(referral_code__iexact=code)
            except Profile.DoesNotExist:
                return Response({"detail": "Código inválido."}, status=404)

            if owner_profile.user_id == user.id:
                return Response({"detail": "No puedes usar tu propio código."}, status=400)

            credit_amount = Decimal("5.00")

            owner_wallet, _ = Wallet.objects.select_for_update().get_or_create(
                user=owner_profile.user, defaults={"balance": Decimal("0.00")}
            )
            owner_wallet.balance = _q(owner_wallet.balance + credit_amount)
            owner_wallet.save()

            ref_transfer = _safe_transfer_number(code, prefix="REF")
            mv = Movement.objects.create(
                user=owner_profile.user,
                type="REFERRAL_CODE",
                amount=credit_amount,
                commission=Decimal("0.00"),
                total=credit_amount,
                transfer_number=ref_transfer,
            )

            my_profile.has_used_referral = True
            my_profile.save()

        try:
            log_action(request, request.user, Action.REFERRAL_CODE_APPLIED)
        except Exception:
            logger.debug("No-repudio: fallo log REFERRAL_CODE_APPLIED", exc_info=True)

        try:
            log_action(request, owner_profile.user, Action.REFERRAL_REWARD_GRANTED)
        except Exception:
            logger.debug("No-repudio: fallo log REFERRAL_REWARD_GRANTED", exc_info=True)

        return Response({"detail": "Código aplicado"}, status=200)
