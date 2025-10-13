from decimal import Decimal
from .models import Wallet, Movement
from apps.users.models import SecurityLog, UserAction

class WalletService:
    DEPOSIT_COMMISSION = Decimal('0.02')  # 2%
    WITHDRAWAL_COMMISSION = Decimal('0.03')  # 3%
    
    def _log_security(self, user, action, success=True):
        try:
            user_action, _ = UserAction.objects.get_or_create(
                name=action,
                defaults={'description': f'{action} action in wallet'}
            )
            SecurityLog.objects.create(
                user=user,
                action=user_action,
                ip='127.0.0.1',
                user_agent='Wallet Service'
            )
        except Exception:
            pass  # Don't break flow for log errors
    
    def deposit(self, user, amount, reference):
        wallet, created = Wallet.objects.get_or_create(user=user)
        
        commission = amount * self.DEPOSIT_COMMISSION
        total_credited = amount - commission
        
        movement = Movement.objects.create(
            user=user,
            transfer_number=reference,
            type='TOPUP',
            amount=amount,
            commission=commission,
            total=total_credited
        )
        
        wallet.balance += total_credited
        wallet.save()
        
        self._log_security(user, 'DEPOSIT_SUCCESS', True)
        return movement
    
    def withdraw(self, user, amount, reference):
        wallet, created = Wallet.objects.get_or_create(user=user)
        
        commission = amount * self.WITHDRAWAL_COMMISSION
        total_debited = amount + commission
        
        if wallet.balance < total_debited:
            self._log_security(user, 'WITHDRAWAL_INSUFFICIENT_FUNDS', False)
            raise ValueError("Insufficient funds for withdrawal")
        
        movement = Movement.objects.create(
            user=user,
            transfer_number=reference,
            type='WITHDRAW',
            amount=amount,
            commission=commission,
            total=total_debited
        )
        
        wallet.balance -= total_debited
        wallet.save()
        
        self._log_security(user, 'WITHDRAWAL_SUCCESS', True)
        return movement