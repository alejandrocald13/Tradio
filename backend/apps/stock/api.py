from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
import requests
import os
from .models import Stock, Category
from .serializers import StockSerializer, CategorySerializer
from .permissions import IsAdminOrReadOnly

API_KEY = os.getenv("FINNHUB_API_KEY")

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all() # para devolver únicamente stocks activos
    permission_classes = [IsAdminOrReadOnly] 
    serializer_class = StockSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'symbol', 'category__name'] # /api/stocks/?search=<valor>
    ordering_fields = ['current_price', 'name']  # /api/stocks/?ordering=-<valor>

    def perform_destroy(self, instance):
        instance.soft_delete()

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def update_prices(self, request):
        activos = Stock.objects.filter(is_active=True)
        resultados = []

        for stock in activos:
            symbol = stock.symbol
            url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}"
            try:
                response = requests.get(url)
                data = response.json()
                new_price = data.get('c')  # current price

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

        return Response({
            "message": "Update completed",
            "results": resultados
        }, status=status.HTTP_200_OK)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
