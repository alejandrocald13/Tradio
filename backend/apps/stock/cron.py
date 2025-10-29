from .models import Stock
import requests
import os

API_KEY = os.getenv("FINNHUB_API_KEY")

def update_prices_cron():
    activos = Stock.objects.filter(is_active=True)
    resultados = []

    for stock in activos:
        symbol = stock.symbol
        url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}"
        try:
            response = requests.get(url)
            data = response.json()
            new_price = data.get('c')

            if new_price:
                stock.current_price = new_price
                stock.save()
                resultados.append(f"{symbol}: {new_price}")
            else:
                resultados.append(f"{symbol}: no price returned")

        except Exception as e:
            resultados.append(f"{symbol}: error {e}")

    return resultados
