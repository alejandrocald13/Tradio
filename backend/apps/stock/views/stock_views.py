from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from ..models import Stock
from ..serializers import StockSerializer
from ..permissions import IsAdminOrReadOnly
from ...users.actions import Action
from ...users.utils import log_action


@extend_schema(tags=['stocks'])
class StockViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para operaciones básicas de lectura de stocks
    """
    queryset = Stock.objects.filter(is_active=True)
    serializer_class = StockSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'symbol', 'category__name']
    ordering_fields = ['current_price', 'name']


    def get_queryset(self):
        # Retorna solo acciones activas
        return Stock.objects.filter(is_active=True)


    @extend_schema(
        summary="Listar todas las acciones activas",
        description="Devuelve todas las acciones activas con filtros opcionales"
    )
    def list(self, request, *args, **kwargs):
        log_action(request, request.user, Action.STOCK_VIEWED)
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Obtener acción por ID",
        description="Devuelve el detalle de una acción específica"
    )
    def retrieve(self, request, *args, **kwargs):
        log_action(request, request.user, Action.STOCK_VIEWED)
        return super().retrieve(request, *args, **kwargs)