from rest_framework import generics, permissions
from drf_spectacular.utils import extend_schema
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    @extend_schema(
        request=TransactionSerializer,
        responses={
            201: TransactionSerializer,
            400: TransactionSerializer,
        },
        examples=[
            {
                "summary": "Successful BUY",
                "value": {
                    "stock": 1,
                    "type": "BUY",
                    "quantity": 5,
                    "price": "100.00"
                }
            },
            {
                "summary": "Successful SELL",
                "value": {
                    "stock": 1,
                    "type": "SELL",
                    "quantity": 2,
                    "price": "100.00"
                }
            },
            {
                "summary": "Error - insufficient balance",
                "value": {
                    "stock": 1,
                    "type": "BUY",
                    "quantity": 1000,
                    "price": "100.00"
                }
            },
            {
                "summary": "Error - trying to sell more than holdings",
                "value": {
                    "stock": 1,
                    "type": "SELL",
                    "quantity": 10,
                    "price": "100.00"
                }
            }
        ]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
