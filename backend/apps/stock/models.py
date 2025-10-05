from django.db import models

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Stock(models.Model):
    name = models.CharField(max_length=150)
    symbol = models.CharField(max_length=10, unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    is_active = models.BooleanField(default=True)  # status: 1 = active, 0 = deleted (soft delete)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def soft_delete(self):
        self.is_active = False
        self.save()
