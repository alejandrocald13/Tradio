from rest_framework import routers
from .api import StockViewSet, CategoryViewSet


router = routers.DefaultRouter()

router.register('api/stocks', StockViewSet, 'stocks')
router.register('api/categories', CategoryViewSet, 'categories')

urlpatterns = router.urls
