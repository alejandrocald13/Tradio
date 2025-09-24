from rest_framework import viewsets, permissions
from .models import Stock
from .serializers import StockSerializer
from .permissions import IsAdminOrReadOnly


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    permission_classes = [IsAdminOrReadOnly] 
    serializer_class = StockSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()
