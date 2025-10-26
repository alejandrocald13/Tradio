from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    PurchaseTransactionViewSet,
    SaleTransactionViewSet,
    AdminTransactionsReportView,
    UserPurchasesView,
    UserSalesView,
)

router = DefaultRouter()
router.register(r'purchases', PurchaseTransactionViewSet, basename='purchases')
router.register(r'sales', SaleTransactionViewSet, basename='sales')

urlpatterns = [
    *router.urls,
    path('report/', AdminTransactionsReportView.as_view(), name='transactions-report'),
    path('me/purchases/', UserPurchasesView.as_view(), name='user-purchases'),
    path('me/sales/', UserSalesView.as_view(), name='user-sales'),
]
