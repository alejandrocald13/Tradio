from rest_framework import viewsets
from drf_spectacular.utils import extend_schema
from ..models import Category
from ..serializers import CategorySerializer
from ..permissions import IsAdminOrReadOnly
from ...users.actions import Action
from ...users.utils import log_action


@extend_schema(tags=['categories'])
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para operaciones de lectura de categorías
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

    @extend_schema(
        summary="Listar todas las categorías",
        description="Devuelve todas las categorías existentes en BD"
    )
    def list(self, request, *args, **kwargs):
        log_action(request, request.user, Action.SEARCH_BY_CATEGORY)
        return super().list(request, *args, **kwargs)