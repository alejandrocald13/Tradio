from rest_framework import serializers
from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    stock_name = serializers.CharField(source='stock.name', read_only=True)
    stock_symbol = serializers.CharField(source='stock.symbol', read_only=True)
    weight_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = ('id', 'user', 'stock', 'stock_name', 'stock_symbol', 'quantity', 'total_cost', 'weight_percentage', 'is_active')
        read_only_fields = ('id', 'updated_at')

    def get_weight_percentage(self, obj):
        user = obj.user
        portfolios = Portfolio.objects.filter(user=user, is_active=True)
        total_quantity = sum(p.quantity for p in portfolios)
        
        if total_quantity > 0:
            return round((obj.quantity / total_quantity * 100), 2)
        return 0