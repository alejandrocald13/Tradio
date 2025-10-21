from rest_framework import viewsets, status, serializers, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from drf_spectacular.utils import extend_schema, inline_serializer
import requests
import os
from ..models import Stock, Category
from ..serializers import (
    StockSerializer,
    AddStockRequestSerializer,
    AddStockResponseSerializer,
    UpdatePricesResponseSerializer,
    ErrorResponseSerializer
)
from ...users.actions import Action
from ...users.utils import log_action

API_KEY = os.getenv("FINNHUB_API_KEY")


@extend_schema(tags=['stocks-admin'])
class StockAdminViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """
    ViewSet para operaciones administrativas de stocks.
    Solo accesible para administradores.
    """
    serializer_class = StockSerializer
    permission_classes = [IsAdminUser]


    def get_queryset(self):
        """
        Retorna TODAS las acciones en bd para admins
        """
        return Stock.objects.all()


    @extend_schema(
        summary="Listar todas las acciones (admin)",
        description="Devuelve todas las acciones registradas. Solo para administradores."
    )
    def list(self, request, *args, **kwargs):
        log_action(request, request.user, Action.STOCK_VIEWED)
        return super().list(request, *args, **kwargs)


    @extend_schema(
        summary="Obtener acción por ID (admin)",
        description="Devuelve el detalle de cualquier acción"
    )
    def retrieve(self, request, *args, **kwargs):
        log_action(request, request.user, Action.STOCK_VIEWED)
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Agregar acción por símbolo",
        description="Busca y agrega una acción desde Finnhub",
        request=AddStockRequestSerializer,
        responses={
            200: AddStockResponseSerializer,
            201: AddStockResponseSerializer,
            400: ErrorResponseSerializer,
            404: ErrorResponseSerializer,
        }
    )
    @action(detail=False, methods=['post'])
    def add_stock(self, request):
        symbol = request.data.get("symbol", "").upper().strip()
        
        if not symbol:
            return Response(
                {"error": "Symbol is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            stock = Stock.objects.get(symbol=symbol)
            return Response(
                {
                    "message": "Stock already exists in database",
                    "stock": {
                        "id": stock.id,
                        "name": stock.name,
                        "symbol": stock.symbol,
                        "current_price": float(stock.current_price),
                        "category": stock.category.name if stock.category else None,
                        "exchange": stock.exchange
                    }
                },
                status=status.HTTP_200_OK
            )
        except Stock.DoesNotExist:
            pass
        
        try:
            profile_url = f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={API_KEY}"
            profile_response = requests.get(profile_url)
            profile_data = profile_response.json()
            
            quote_url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}"
            quote_response = requests.get(quote_url)
            quote_data = quote_response.json()
            
            current_price = quote_data.get('c')
            company_name = profile_data.get('name')
            industry = profile_data.get('finnhubIndustry', 'General')
            exchange = profile_data.get('exchange')
            
            if not current_price or not company_name:
                return Response(
                    {"error": "Stock not found in Finnhub or incomplete data"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            category, _ = Category.objects.get_or_create(
                name=industry,
                defaults={"description": f"Industry: {industry}"}
            )
            
            stock = Stock.objects.create(
                name=company_name,
                symbol=symbol,
                category=category,
                current_price=current_price,
                exchange=exchange,
                is_active=True
            )
            log_action(request, request.user, Action.ADMIN_STOCK_CREATED)
            return Response(
                {
                    "message": "Stock added successfully",
                    "stock": {
                        "id": stock.id,
                        "name": stock.name,
                        "symbol": stock.symbol,
                        "current_price": float(stock.current_price),
                        "category": stock.category.name,
                        "exchange": stock.exchange
                    }
                },
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            return Response(
                {"error": f"Error fetching stock from Finnhub: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Desactivar una acción",
        description="Desactiva una acción específica (soft delete)",
        responses={
            200: inline_serializer(
                name='DisableStockResponse',
                fields={'message': serializers.CharField()}
            ),
            404: ErrorResponseSerializer
        }
    )
    @action(detail=True, methods=['post'])
    def disable(self, request, pk=None):
        stock = self.get_object()
        stock.soft_delete()
        log_action(request, request.user, Action.ADMIN_STOCK_UPDATED)
        return Response(
            {"message": "La acción fue desactivada con éxito"},
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Activar una acción",
        description="Activa una acción previamente desactivada",
        responses={
            200: inline_serializer(
                name='EnableStockResponse',
                fields={'message': serializers.CharField()}
            ),
            404: ErrorResponseSerializer
        }
    )
    @action(detail=True, methods=['post'])
    def enable(self, request, pk=None):
        stock = self.get_object()
        stock.enable()
        log_action(request, request.user, Action.ADMIN_STOCK_UPDATED)
        return Response(
            {"message": "La acción fue activada con éxito"},
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Actualizar precios de todas las acciones",
        description="Actualiza los precios actuales desde Finnhub",
        responses={200: UpdatePricesResponseSerializer}
    )
    @action(detail=False, methods=['post'])
    def update_prices(self, request):
        activos = Stock.objects.filter(is_active=True)
        resultados = []

        for stock in activos:
            symbol = stock.symbol
            url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}"
            try:
                response = requests.get(url)
                data = response.json()
                new_price = data.get('c')

                if new_price:
                    stock.current_price = new_price
                    stock.save()
                    resultados.append({
                        "symbol": symbol,
                        "price": new_price,
                        "status": "updated"
                    })
                else:
                    resultados.append({
                        "symbol": symbol,
                        "status": "no_price_returned"
                    })

            except Exception as e:
                resultados.append({
                    "symbol": symbol,
                    "status": f"error: {e}"
                })

        log_action(request, request.user, Action.ADMIN_STOCK_UPDATED)
        return Response({
            "message": "Update completed",
            "results": resultados
        }, status=status.HTTP_200_OK)