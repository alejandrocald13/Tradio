from decimal import Decimal
from django.db import transaction
from .models import BuyTransaction, SellTransaction
from apps.wallet.models import Wallet
from apps.portfolio.models import Portfolio
from apps.stock.models import Stock
from apps.users.models import SecurityLog, UserAction

class TransactionService:
    def _log_security(self, user, action, success=True):
        try:
            user_action, _ = UserAction.objects.get_or_create(
                name=action,
                defaults={'description': f'{action} action in transactions'}
            )
            SecurityLog.objects.create(
                user=user,
                action=user_action,
                ip='127.0.0.1',
                user_agent='Transaction Service'
            )
        except Exception:
            pass
    
    @transaction.atomic
    def buy_stocks(self, user, stock_id, quantity):
        stock = Stock.objects.get(id=stock_id, is_active=True)
        wallet, created = Wallet.objects.get_or_create(user=user)
        
        total_cost = quantity * float(stock.current_price)
        
        if wallet.balance < Decimal(str(total_cost)):
            self._log_security(user, 'BUY_INSUFFICIENT_FUNDS', False)
            raise ValueError("Insufficient funds in wallet")
        

        transaction = BuyTransaction.objects.create(
            user=user,
            stock=stock,
            quantity=quantity,
            unit_price=stock.current_price
        )
        

        wallet.balance -= Decimal(str(total_cost))
        wallet.save()
        

        portfolio, created = Portfolio.objects.get_or_create(
            user=user,
            stock=stock,
            defaults={'quantity': 0, 'total_cost': 0}
        )
        portfolio.buy(quantity, float(stock.current_price))
        
        self._log_security(user, 'BUY_SUCCESS', True)
        return transaction
    
    @transaction.atomic
    def sell_stocks(self, user, stock_id, quantity):
        stock = Stock.objects.get(id=stock_id, is_active=True)
        
        try:
            portfolio = Portfolio.objects.get(user=user, stock=stock, is_active=True)
        except Portfolio.DoesNotExist:
            self._log_security(user, 'SELL_NO_STOCKS', False)
            raise ValueError("You don't own any shares of this stock")
        
        if portfolio.quantity < quantity:
            self._log_security(user, 'SELL_INSUFFICIENT_STOCKS', False)
            raise ValueError(f"Insufficient shares. Available: {portfolio.quantity}")

        average_cost = portfolio.get_average_price()
        
        transaction = SellTransaction.objects.create(
            user=user,
            stock=stock,
            quantity=quantity,
            unit_price=stock.current_price,
            average_cost=average_cost
        )
        
        wallet, created = Wallet.objects.get_or_create(user=user)
        income = quantity * float(stock.current_price)
        wallet.balance += Decimal(str(income))
        wallet.save()
        
        portfolio.sell(quantity)
        
        self._log_security(user, 'SELL_SUCCESS', True)
        return transaction