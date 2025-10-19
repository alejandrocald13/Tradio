from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Wallet, Movement
from .serializers import *
from .services import WalletService

class WalletViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def balance(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def topup(self, request):
        serializer = TopUpSerializer(data=request.data)
        if serializer.is_valid():
            service = WalletService()
            movement = service.deposit(
                user=request.user,
                amount=serializer.validated_data['amount'],
                reference=serializer.validated_data['reference']
            )
            return Response({
                'message': 'Deposit completed successfully',
                'current_balance': movement.user.wallet.balance
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def withdraw(self, request):
        serializer = WithdrawSerializer(data=request.data)
        if serializer.is_valid():
            service = WalletService()
            try:
                movement = service.withdraw(
                    user=request.user,
                    amount=serializer.validated_data['amount'],
                    reference=serializer.validated_data['reference']
                )
                return Response({
                    'message': 'Withdrawal completed successfully',
                    'current_balance': movement.user.wallet.balance
                }, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def referral(self, request):
        serializer = ReferralCodeSerializer(data=request.data)
        if serializer.is_valid():
            service = WalletService()
            movement = service.add_referral(
                user=request.user,
                code=serializer.validated_data['code'],
                amount=serializer.validated_data['amount']
            )
            return Response({
                'message': 'Referral added successfully',
                'current_balance': movement.user.wallet.balance
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MovementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MovementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'created_at']
    
    def get_queryset(self):
        return Movement.objects.filter(user=self.request.user)
    
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
