from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse, OpenApiParameter
from .models import Wallet, Movement
from .serializers import WalletSerializer, MovementSerializer, TopUpSerializer, WithdrawSerializer, ReferralCodeSerializer
from .services import WalletService

@extend_schema(tags=['wallet'])
class WalletViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Consultar saldo de la wallet",
        description="Devuelve el saldo actual de la wallet del usuario y la fecha de última actualización.",
        responses={200: WalletSerializer, 401: OpenApiResponse(description="Unauthorized")}
    )
    @action(detail=False, methods=['get'])
    def balance(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)

    @extend_schema(
        summary="Recargar (topup) la wallet",
        description="Aumenta el saldo de la wallet. Calcula comisión, guarda movimiento y registra auditoría.",
        request=TopUpSerializer,
        responses={200: OpenApiResponse(description="Depósito exitoso"), 400: OpenApiResponse(description="Datos inválidos")},
        examples=[
            OpenApiExample("Ejemplo de request", value={"amount": "100.00", "reference": "TOP-123"}, request_only=True),
            OpenApiExample("Ejemplo de respuesta", value={"message": "Deposit completed successfully", "current_balance": "98.00"}, response_only=True),
        ]
    )
    @action(detail=False, methods=['post'])
    def topup(self, request):
        serializer = TopUpSerializer(data=request.data)
        if serializer.is_valid():
            service = WalletService()
            movement = service.deposit(user=request.user, amount=serializer.validated_data['amount'], reference=serializer.validated_data['reference'])
            return Response({'message': 'Deposit completed successfully', 'current_balance': movement.user.wallet.balance}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Retiro (withdraw) de la wallet",
        description="Disminuye el saldo de la wallet. Valida fondos, calcula comisión y registra auditoría.",
        request=WithdrawSerializer,
        responses={200: OpenApiResponse(description="Retiro exitoso"), 422: OpenApiResponse(description="Fondos insuficientes")},
        examples=[
            OpenApiExample("Ejemplo de request", value={"amount": "50.00", "reference": "WD-001"}, request_only=True),
            OpenApiExample("Error por fondos insuficientes", value={"error": "Insufficient funds for withdrawal"}, response_only=True),
        ]
    )
    @action(detail=False, methods=['post'])
    def withdraw(self, request):
        serializer = WithdrawSerializer(data=request.data)
        if serializer.is_valid():
            service = WalletService()
            try:
                movement = service.withdraw(user=request.user, amount=serializer.validated_data['amount'], reference=serializer.validated_data['reference'])
                return Response({'message': 'Withdrawal completed successfully', 'current_balance': movement.user.wallet.balance}, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Aplicar código de referido",
        description="Agrega saldo por referido y guarda el movimiento en la wallet.",
        request=ReferralCodeSerializer,
        responses={200: OpenApiResponse(description="Referral aplicado"), 400: OpenApiResponse(description="Datos inválidos")},
        examples=[OpenApiExample("Ejemplo de request", value={"code": "ABC123", "amount": "10.00"}, request_only=True)]
    )
    @action(detail=False, methods=['post'])
    def referral(self, request):
        serializer = ReferralCodeSerializer(data=request.data)
        if serializer.is_valid():
            service = WalletService()
            movement = service.add_referral(user=request.user, code=serializer.validated_data['code'], amount=serializer.validated_data['amount'])
            return Response({'message': 'Referral added successfully', 'current_balance': movement.user.wallet.balance}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['wallet-movements'])
class MovementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MovementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'created_at']

    @extend_schema(
        summary="Listar movimientos",
        description="Lista movimientos de la wallet del usuario autenticado. Permite filtrar por tipo y fecha.",
        parameters=[
            OpenApiParameter(name="type", description="TOPUP | WITHDRAW | REFERRAL_CODE", required=False, type=str),
            OpenApiParameter(name="created_at", description="Fecha exacta (YYYY-MM-DD)", required=False, type=str),
        ],
        responses={200: MovementSerializer, 401: OpenApiResponse(description="Unauthorized")}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return Movement.objects.filter(user=self.request.user)

    @extend_schema(
        summary="Filtrar movimientos por rango de fechas",
        description="Filtro adicional por `date_from` y `date_to` (YYYY-MM-DD).",
        parameters=[
            OpenApiParameter(name="date_from", required=False, type=str),
            OpenApiParameter(name="date_to", required=False, type=str),
        ],
        responses={200: MovementSerializer}
    )
    @action(detail=False, methods=['get'])
    def filter(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(created_at__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__date__lte=date_to)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
