from rest_framework import viewsets, filters
from .models import Stock, Category
from .serializers import StockSerializer, CategorySerializer
from .permissions import IsAdminOrReadOnly


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all() # para devolver únicamente stocks activos
    permission_classes = [IsAdminOrReadOnly] 
    serializer_class = StockSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'symbol', 'category__name'] # /api/stocks/?search=<valor>
    ordering_fields = ['current_price', 'name']  # /api/stocks/?ordering=-<valor>

    def perform_destroy(self, instance):
        instance.soft_delete()


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
