from decimal import Decimal
from django.db import transaction
from django.core.exceptions import ValidationError
from apps.wallet.models import Wallet
from apps.wallet.services import WalletService
from apps.portfolio.models import Portfolio
from apps.stock.models import Stock
from .models import PurchaseTransaction, SaleTransaction


def to_dec(v):
    return v if isinstance(v, Decimal) else Decimal(str(v))


class TradeService:
    @transaction.atomic
    def buy(self, *, user, stock_id, quantity, reference="BUY"):
        quantity = to_dec(quantity)

        wallet = Wallet.objects.select_for_update().get(user=user)
        stock = Stock.objects.select_for_update().get(id=stock_id)

        unit_price = to_dec(stock.current_price)
        cost = quantity * unit_price

        if wallet.balance < cost:
            raise ValidationError("Insufficient funds for purchase")

        if not stock.is_active:
            raise ValidationError("This stock is not available for trading")

        purchase = PurchaseTransaction.objects.create(
            user=user,
            stock=stock,
            quantity=quantity,
            unit_price=unit_price,
        )

        portfolio, _ = Portfolio.objects.select_for_update().get_or_create(
            user=user, stock=stock,
            defaults={"quantity": 0, "total_cost": 0, "is_active": True}
        )
        portfolio.buy(float(quantity), float(unit_price))

        wallet.balance -= cost
        wallet.save(update_fields=["balance", "updated_at"])

        WalletService()._log_security(user, 'TRADE_BUY_SUCCESS', True)

        return purchase, wallet, portfolio, unit_price

    @transaction.atomic
    def sell(self, *, user, stock_id, quantity, reference="SELL"):
        quantity = to_dec(quantity)

        wallet = Wallet.objects.select_for_update().get(user=user)
        stock = Stock.objects.select_for_update().get(id=stock_id)
        portfolio = Portfolio.objects.select_for_update().filter(user=user, stock=stock).first()

        if not portfolio:
            raise ValidationError("No position to sell for this stock")

        if portfolio.quantity < float(quantity):
            raise ValidationError("Insufficient position to sell")

        unit_price = to_dec(stock.current_price)
        proceeds = quantity * unit_price

        avg_cost = Decimal(str(portfolio.get_average_price() or 0))

        sale = SaleTransaction.objects.create(
            user=user,
            stock=stock,
            quantity=quantity,
            unit_price=unit_price,
            average_cost=avg_cost
        )

        portfolio.sell(float(quantity))

        wallet.balance += proceeds
        wallet.save(update_fields=["balance", "updated_at"])

        WalletService()._log_security(user, 'TRADE_SELL_SUCCESS', True)

        return sale, wallet, portfolio, unit_price
