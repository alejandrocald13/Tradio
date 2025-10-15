from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WalletViewSet, MovementViewSet

router = DefaultRouter()
router.register(r'movements', MovementViewSet, basename='movements')

urlpatterns = [
    path('', include(router.urls)),
    path('balance/', WalletViewSet.as_view({'get': 'balance'}), name='wallet-balance'),
    path('topup/', WalletViewSet.as_view({'post': 'topup'}), name='wallet-topup'),
    path('withdraw/', WalletViewSet.as_view({'post': 'withdraw'}), name='wallet-withdraw'),
]