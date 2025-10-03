from rest_framework.routers import DefaultRouter
from .api import PortfolioViewSet

router = DefaultRouter()
router.register('api/portfolios', PortfolioViewSet, 'portfolios')

urlpatterns = router.urls
