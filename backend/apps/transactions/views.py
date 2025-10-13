from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import BuyTransaction, SellTransaction
from .serializers import *
from .services import TransactionService
from core.services import MarketClock

class TransactionViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        buys = BuyTransaction.objects.filter(user=request.user)
        sells = SellTransaction.objects.filter(user=request.user)

        email = request.query_params.get('email')
        transaction_type = request.query_params.get('type') 
        stock_symbol = request.query_params.get('stock')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        if email:
            buys = buys.filter(user__email__icontains=email)
            sells = sells.filter(user__email__icontains=email)
        
        if transaction_type == 'BUY':
            sells = sells.none()
        elif transaction_type == 'SELL':
            buys = buys.none()
        
        if stock_symbol:
            buys = buys.filter(stock__symbol__icontains=stock_symbol)
            sells = sells.filter(stock__symbol__icontains=stock_symbol)
        
        if date_from:
            buys = buys.filter(created_at__date__gte=date_from)
            sells = sells.filter(created_at__date__gte=date_from)
        
        if date_to:
            buys = buys.filter(created_at__date__lte=date_to)
            sells = sells.filter(created_at__date__lte=date_to)
        
        buys_data = BuyTransactionSerializer(buys, many=True).data
        sells_data = SellTransactionSerializer(sells, many=True).data
        
        for item in buys_data:
            item['transaction_type'] = 'BUY'
        for item in sells_data:
            item['transaction_type'] = 'SELL'
        
        return Response(buys_data + sells_data)
    
    @action(detail=False, methods=['post'])
    def buy(self, request):
        serializer = BuySerializer(data=request.data)
        if serializer.is_valid():
            service = TransactionService()
            market_clock = MarketClock()
            
            if not market_clock.is_open():
                return Response(
                    {'error': 'Market is closed. Trading hours: Monday-Friday 09:30-16:00'},
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY
                )
            
            try:
                transaction = service.buy_stocks(
                    user=request.user,
                    stock_id=serializer.validated_data['stock_id'],
                    quantity=serializer.validated_data['quantity']
                )
                return Response({
                    'message': 'Purchase completed successfully',
                    'transaction': BuyTransactionSerializer(transaction).data
                }, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def sell(self, request):
        serializer = SellSerializer(data=request.data)
        if serializer.is_valid():
            service = TransactionService()
            market_clock = MarketClock()
            
            if not market_clock.is_open():
                return Response(
                    {'error': 'Market is closed. Trading hours: Monday-Friday 09:30-16:00'},
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY
                )
            
            try:
                transaction = service.sell_stocks(
                    user=request.user,
                    stock_id=serializer.validated_data['stock_id'],
                    quantity=serializer.validated_data['quantity']
                )
                return Response({
                    'message': 'Sale completed successfully',
                    'transaction': SellTransactionSerializer(transaction).data
                }, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)