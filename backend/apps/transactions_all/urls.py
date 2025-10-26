from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    PurchaseTransactionViewSet,
    SaleTransactionViewSet,
    TransactionReportView,
)

router = DefaultRouter()
router.register(r'purchases', PurchaseTransactionViewSet, basename='purchases')
router.register(r'sales', SaleTransactionViewSet, basename='sales')

urlpatterns = [
    *router.urls,
    path('report/', TransactionReportView.as_view(), name='transactions-report'),
]
