from rest_framework.routers import DefaultRouter
from .views import PurchaseTransactionViewSet, SaleTransactionViewSet

router = DefaultRouter()
router.register(r'purchases', PurchaseTransactionViewSet, basename='purchases')
router.register(r'sales', SaleTransactionViewSet, basename='sales')

urlpatterns = router.urls
