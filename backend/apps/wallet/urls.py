from django.urls import path
from .views import WalletBalanceView, WalletMovementsView, WalletTopupView, WalletWithdrawView

urlpatterns = [
    path("balance/", WalletBalanceView.as_view(), name="wallet-balance"),
    path("movements/", WalletMovementsView.as_view(), name="wallet-movements"),
    path("topup/", WalletTopupView.as_view(), name="wallet-topup"),
    path("withdraw/", WalletWithdrawView.as_view(), name="wallet-withdraw"),
]
