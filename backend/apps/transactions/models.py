from django.db import models
from django.conf import settings

class BuyTransaction(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="buy_transactions"
    )
    stock = models.ForeignKey(
        'stock.Stock',
        on_delete=models.PROTECT,
        related_name="buy_transactions"
    )
    quantity = models.FloatField()
    unit_price = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Buy {self.user.username} - {self.stock.symbol} x {self.quantity}"

class SellTransaction(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="sell_transactions"
    )
    stock = models.ForeignKey(
        'stock.Stock',
        on_delete=models.PROTECT,
        related_name="sell_transactions"
    )
    quantity = models.FloatField()
    unit_price = models.FloatField()
    average_cost = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Sell {self.user.username} - {self.stock.symbol} x {self.quantity}"