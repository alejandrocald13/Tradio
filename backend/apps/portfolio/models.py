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
