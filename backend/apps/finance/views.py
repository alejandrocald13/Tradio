from rest_framework import generics, permissions
from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
    OpenApiResponse,
)
from drf_spectacular.types import OpenApiTypes

from .models import Transaction
from .serializers import TransactionSerializer


class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # asocia el usuario autenticado; no necesitas enviarlo en el body
        serializer.save(user=self.request.user)

    # Documenta el GET (lista)
    @extend_schema(
        responses={200: TransactionSerializer(many=True)},
        tags=["transactions"],
        summary="Listar transacciones del usuario",
        description="Devuelve solo las transacciones del usuario autenticado.",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    # Documenta el POST (crear)
    @extend_schema(
        request=TransactionSerializer,
        responses={
            201: TransactionSerializer,
            400: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Errores de validación",
                examples=[
                    OpenApiExample(
                        name="Saldo insuficiente",
                        summary="Error - insufficient balance",
                        value={"detail": "Insufficient balance to complete BUY."},
                        response_only=True,
                    ),
                    OpenApiExample(
                        name="Venta mayor a posición",
                        summary="Error - trying to sell more than holdings",
                        value={"detail": "Cannot SELL more than current holdings."},
                        response_only=True,
                    ),
                ],
            ),
        },
        tags=["transactions"],
        summary="Crear transacción",
        description=(
            "Crea una transacción de tipo BUY o SELL. "
            "No envíes el campo 'user'; se asigna automáticamente al usuario autenticado."
        ),
        examples=[
            OpenApiExample(
                name="BUY OK",
                summary="Successful BUY",
                value={"stock": 1, "type": "BUY", "quantity": 5, "price": "100.00"},
                request_only=True,
            ),
            OpenApiExample(
                name="SELL OK",
                summary="Successful SELL",
                value={"stock": 1, "type": "SELL", "quantity": 2, "price": "100.00"},
                request_only=True,
            ),
        ],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
