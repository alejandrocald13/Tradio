from rest_framework import serializers
from .models import Stock, Category


class StockSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Stock
        fields = ('id', 'name', 'symbol', 'category', 'category_name', 'current_price', 'exchange', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'description', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at')


class AddStockRequestSerializer(serializers.Serializer):
    symbol = serializers.CharField(help_text='Símbolo de la acción (ej: AAPL)')


class DisableStockSerializer(serializers.Serializer):
    id = serializers.IntegerField()

class DisableStockResponseSerializer(serializers.Serializer):
    message = serializers.CharField()


class EnableStockSerializer(serializers.Serializer):
    id = serializers.IntegerField()

class EnableStockResponseSerializer(serializers.Serializer):
    message = serializers.CharField()


class StockDataSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    symbol = serializers.CharField()
    current_price = serializers.FloatField()
    category = serializers.CharField(allow_null=True)
    exchange = serializers.CharField(allow_null=True)



class AddStockResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    stock = StockDataSerializer()


class PriceUpdateSerializer(serializers.Serializer):
    symbol = serializers.CharField()
    price = serializers.FloatField(required=False)
    status = serializers.CharField()


class UpdatePricesResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    results = PriceUpdateSerializer(many=True)


class HistoryDataSerializer(serializers.Serializer):
    t = serializers.ListField(child=serializers.IntegerField(), help_text='Timestamps')
    c = serializers.ListField(child=serializers.FloatField(), help_text='Precios de cierre')


class HistoryResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    stock = serializers.CharField()
    symbol = serializers.CharField()
    exchange = serializers.CharField()
    last = serializers.FloatField()
    days = serializers.IntegerField()
    interval = serializers.CharField()
    data = HistoryDataSerializer()


class StockPerformanceSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    symbol = serializers.CharField()
    exchange = serializers.CharField()
    open_price = serializers.FloatField()
    current_price = serializers.FloatField()
    change_percentage = serializers.FloatField()


class TopGainersResponseSerializer(serializers.Serializer):
    top_gainers = StockPerformanceSerializer(many=True)


class TopLosersResponseSerializer(serializers.Serializer):
    top_losers = StockPerformanceSerializer(many=True)


class StockHistoryDataSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    symbol = serializers.CharField()
    current_price = serializers.FloatField()
    open_price = serializers.FloatField()
    change_percentage = serializers.FloatField()
    category = serializers.CharField(allow_null=True)
    data = HistoryDataSerializer()


class AllStocksHistoryResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    total_stocks = serializers.IntegerField()
    stocks = StockHistoryDataSerializer(many=True)

class ErrorResponseSerializer(serializers.Serializer):
    error = serializers.CharField()