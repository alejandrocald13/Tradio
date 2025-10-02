from django.db import models
from django.conf import settings
from apps.stock.models import Stock
# Create your models here.

class Portfolio(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  
        on_delete=models.PROTECT,  
        related_name='portfolios', 
    )
    stock = models.ForeignKey(Stock, on_delete=models.PROTECT)
    quantity = models.FloatField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def buy(self, amount):
        self.quantity += amount
        self.is_active = True
        self.save()

    def sell(self, amount):
        self.quantity -= amount
        if self.quantity <= 0:
            self.quantity = 0
            self.is_active = False
        self.save()
