from django.urls import path
from .views import (
    WalletMovementListView,
    WalletMeView,
    WalletDepositView,
    WalletWithdrawView,
    ReferralApplyView,
)


urlpatterns = [
    path('movements/', WalletMovementListView.as_view(), name='wallet-movements-admin'),
    path('me/', WalletMeView.as_view(), name='wallet-me'),
    path('deposit/', WalletDepositView.as_view(), name='wallet-deposit'),
    path('withdraw/', WalletWithdrawView.as_view(), name='wallet-withdraw'),
    path("referral/apply/", ReferralApplyView.as_view(), name="wallet-referral-apply"),
]
