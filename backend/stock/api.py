from rest_framework import viewsets, permissions
from .models import Stock
from .serializers import StockSerializer

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    permission_classes = [permissions.AllowAny] # De momento AllowAny, al tener Users se modificará la lógica
    serializer_class = StockSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()
