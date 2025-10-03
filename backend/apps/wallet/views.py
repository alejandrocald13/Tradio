from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Wallet, Movement
from .serializers import WalletSerializer, MovementSerializer
from .task import publish_event
from .market_clock import is_open
from .services import apply_refered_code

class WalletBalanceView(generics.RetrieveAPIView):
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        wallet, _ = Wallet.objects.get_or_create(user=self.request.user)
        return wallet

class WalletMovementsView(generics.ListAPIView):
    serializer_class = MovementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Movement.objects.filter(user=self.request.user).order_by("-created_at")


class WalletTopupView(generics.CreateAPIView):
    serializer_class = MovementSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not is_open():
            return Response(
                {"detail": "Market is closed, transactions only allowed 09:30-16:00, Mon-Fri"},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        monto = float(request.data.get("monto"))
        referencia = request.data.get("referencia")
        referal_code = request.data.get("referal_code")
        commission = monto * 0.02
        total = monto - commission

        with transaction.atomic():
            wallet, _ = Wallet.objects.get_or_create(user=request.user)
            wallet.balance += total
            wallet.save()

            movement = Movement.objects.create(
                user=request.user,
                numero_transferencia=referencia,
                tipo="TOPUP",
                monto=monto,
                comision=commission,
                total=total,
            )
            if referal_code:
                apply_refered_code(request.user, referal_code)

            publish_event.delay(
                "wallet.movement.posted",
                {"user": request.user.id, "movement": movement.id}
            )

        return Response(MovementSerializer(movement).data, status=status.HTTP_201_CREATED)

class WalletWithdrawView(generics.CreateAPIView):
    serializer_class = MovementSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not is_open():
            return Response(
                {"detail": "Market is closed, transactions only allowed 09:30-16:00, Mon-Fri"},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        monto = float(request.data.get("monto"))
        referencia = request.data.get("referencia")
        commission = monto * 0.02
        total = monto + commission

        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        if wallet.balance < total:
            return Response({"error": "insufficient_funds"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        with transaction.atomic():
            wallet.balance -= total
            wallet.save()

            movement = Movement.objects.create(
                user=request.user,
                numero_transferencia=referencia,
                tipo="WITHDRAW",
                monto=monto,
                comision=commission,
                total=-total,
            )

            publish_event.delay(
                "wallet.movement.posted",
                {"user": request.user.id, "movement": movement.id}
            )

        return Response(MovementSerializer(movement).data, status=status.HTTP_201_CREATED)
