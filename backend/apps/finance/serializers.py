from rest_framework import serializers
from apps.finance.models import Transaction, Wallet
from apps.users.models import SecurityLog, UserAction
from apps.stock.models import Stock

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'stock', 'type', 'quantity', 'price', 'date']
        read_only_fields = ['id', 'user', 'date']

    def validate(self, attrs):
        user = self.context['request'].user
        stock = attrs['stock']
        quantity = attrs['quantity']
        type = attrs['type']
        price = attrs['price']

        wallet = Wallet.objects.get(user=user)

        if type == 'BUY':
            total_cost = quantity * price
            if wallet.balance < total_cost:
                raise serializers.ValidationError("Insufficient balance to buy this quantity.")
        elif type == 'SELL':
            total_bought = Transaction.objects.filter(user=user, stock=stock, type='BUY').aggregate(total=models.Sum('quantity'))['total'] or 0
            total_sold = Transaction.objects.filter(user=user, stock=stock, type='SELL').aggregate(total=models.Sum('quantity'))['total'] or 0
            holdings = total_bought - total_sold
            if quantity > holdings:
                raise serializers.ValidationError("Cannot sell more than you hold.")

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        type = validated_data['type']
        quantity = validated_data['quantity']
        price = validated_data['price']
        stock = validated_data['stock']

        wallet = Wallet.objects.get(user=user)
        if type == 'BUY':
            wallet.balance -= quantity * price
        elif type == 'SELL':
            wallet.balance += quantity * price
        wallet.save()

        transaction = Transaction.objects.create(user=user, **validated_data)

        action, _ = UserAction.objects.get_or_create(name=f"{type} {quantity} {stock.symbol}")
        SecurityLog.objects.create(
            user=user,
            action=action,
            ip=self.context['request'].META.get('REMOTE_ADDR', ''),
            user_agent=self.context['request'].META.get('HTTP_USER_AGENT', ''),
        )

        return transaction
