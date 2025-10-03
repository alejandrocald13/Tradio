from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Transaction
        fields = ["type", "email", "stock", "quantity", "total", "created_at"]

    def get_total(self, obj):
        return obj.total
