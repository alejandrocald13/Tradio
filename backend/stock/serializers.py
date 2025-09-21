from rest_framework import serializers
from .models import Stock

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ('id', 'name', 'symbol', 'category', 'current_price', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at')