from rest_framework import serializers
from .models import BuyTransaction, SellTransaction

class BuyTransactionSerializer(serializers.ModelSerializer):
    symbol = serializers.CharField(source='stock.symbol', read_only=True)
    stock_name = serializers.CharField(source='stock.name', read_only=True)
    
    class Meta:
        model = BuyTransaction
        fields = ['id', 'stock', 'symbol', 'stock_name', 'quantity', 'unit_price', 'created_at']
        read_only_fields = ['user', 'created_at']

class SellTransactionSerializer(serializers.ModelSerializer):
    symbol = serializers.CharField(source='stock.symbol', read_only=True)
    stock_name = serializers.CharField(source='stock.name', read_only=True)
    
    class Meta:
        model = SellTransaction
        fields = ['id', 'stock', 'symbol', 'stock_name', 'quantity', 'unit_price', 'average_cost', 'created_at']
        read_only_fields = ['user', 'created_at', 'average_cost']

class BuySerializer(serializers.Serializer):
    stock_id = serializers.IntegerField()
    quantity = serializers.FloatField(min_value=0.01)

class SellSerializer(serializers.Serializer):
    stock_id = serializers.IntegerField()
    quantity = serializers.FloatField(min_value=0.01)