from django.db import models
from django.contrib.auth.models import User

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

class Movement(models.Model):
    MOVEMENT_TYPES = [
        ("TOPUP", "Topup"),
        ("WITHDRAW", "Withdraw"),
        ("CODE-REFERRAL", "Code Referral"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="movements")
    reference = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    commission = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class ReferalCode(models.Model):
        code = models.CharField(max_length=50, unique=True)
        amount = models.DecimalField(max_digits=10, decimal_places=2)
        created_at = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return self.code
