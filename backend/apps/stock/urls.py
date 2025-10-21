from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StockViewSet,
    StockAdminViewSet,
    StockMarketViewSet,
    StockHistoryViewSet,
    CategoryViewSet
)

router = DefaultRouter()
router.register(r'stocks', StockViewSet, basename='stock')
router.register(r'stocks-admin', StockAdminViewSet, basename='stock-admin')
router.register(r'stocks-market', StockMarketViewSet, basename='stock-market')
router.register(r'stocks-history', StockHistoryViewSet, basename='stock-history')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
