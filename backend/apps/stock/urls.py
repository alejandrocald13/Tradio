from rest_framework import routers
from .api import StockViewSet, CategoryViewSet


router = routers.DefaultRouter()

router.register('stocks', StockViewSet, 'stocks')
router.register('categories', CategoryViewSet, 'categories')

urlpatterns = router.urls
