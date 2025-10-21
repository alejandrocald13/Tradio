from rest_framework import serializers
from .models import PurchaseTransaction, SaleTransaction
from apps.portfolio.models import Portfolio

class PurchaseTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseTransaction
        fields = "__all__"


class SaleTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleTransaction
        fields = "__all__"
        read_only_fields = ('average_cost',)  

    def create(self, validated_data):
        user = validated_data['user']
        stock = validated_data['stock']

        portfolio = Portfolio.objects.filter(user=user, stock=stock).first()
        average_cost = portfolio.get_average_price() if portfolio else 0


        validated_data['average_cost'] = average_cost

        return super().create(validated_data)
