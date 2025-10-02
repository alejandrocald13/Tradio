from rest_framework import serializers
from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ('id', 'user', 'stock', 'quantity', 'is_active', 'updated_at')
        read_only_fields = ('id', 'updated_at')
