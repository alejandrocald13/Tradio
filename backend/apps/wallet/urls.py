from django.urls import path
from .views import WalletMovementListView

urlpatterns = [
    path('movements/', WalletMovementListView.as_view(), name='wallet-movements'),
]
