from django.db import models
from django.conf import settings
from apps.stock.models import Stock

class PurchaseTransaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="purchase_transactions")
    stock = models.ForeignKey(Stock, on_delete=models.PROTECT, related_name="purchase_transactions")
    quantity = models.DecimalField(max_digits=15, decimal_places=2)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

class SaleTransaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="sale_transactions")
    stock = models.ForeignKey(Stock, on_delete=models.PROTECT, related_name="sale_transactions")
    quantity = models.DecimalField(max_digits=15, decimal_places=2)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    average_cost = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
