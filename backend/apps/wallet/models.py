from django.db import models
from django.conf import settings
import uuid

class Wallet(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="wallet"
    )
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Wallet {self.user.username} - ${self.balance}"

class Movement(models.Model):
    TYPE_CHOICES = [
        ('TOPUP', 'Deposit'),
        ('WITHDRAW', 'Withdrawal'),
        ('REFERRAL_CODE', 'Referral Code'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="movements"
    )
    transfer_number = models.CharField(max_length=100, unique=True, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    commission = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.type} - {self.user.username} - ${self.amount}"
    
    def save(self, *args, **kwargs):
        if not self.transfer_number:
            self.transfer_number = f"TRF-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
