from django.db import models
from django.conf import settings
from apps.stock.models import Stock


class Wallet(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallets"
    )
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Wallet of {self.user.username} - Balance: {self.balance}"


class Transaction(models.Model):
    TYPE_CHOICES = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions"
    )
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    type = models.CharField(max_length=4, choices=TYPE_CHOICES)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} {self.quantity} of {self.stock.symbol} by {self.user.username}"
