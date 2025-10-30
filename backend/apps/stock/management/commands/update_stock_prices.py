from django.core.management.base import BaseCommand
from apps.stock.models import Stock 
import requests
import os
from datetime import datetime

class Command(BaseCommand):
    help = 'Actualiza los precios de todas las acciones desde Finnhub'

    def handle(self, *args, **kwargs):
        API_KEY = os.getenv('FINNHUB_API_KEY')
        
        if not API_KEY:
            self.stdout.write(self.style.ERROR('FINNHUB_API_KEY no configurada'))
            return

        activos = Stock.objects.filter(is_active=True)
        self.stdout.write(f'Actualizando {activos.count()} acciones...')
        self.stdout.write(f'{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
        
        updated = 0
        errors = 0

        for stock in activos:
            symbol = stock.symbol
            url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}"
            
            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                data = response.json()
                new_price = data.get('c')

                if new_price and new_price > 0:
                    old_price = float(stock.current_price) if stock.current_price else 0
                    stock.current_price = new_price
                    stock.save()
                    updated += 1
                    
                    if old_price > 0:
                        change = ((new_price - old_price) / old_price) * 100
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'{symbol}: ${old_price:.2f} → ${new_price:.2f} ({change:+.2f}%)'
                            )
                        )
                    else:
                        self.stdout.write(
                            self.style.SUCCESS(f'{symbol}: ${new_price:.2f}')
                        )
                else:
                    errors += 1
                    self.stdout.write(
                        self.style.WARNING(f'{symbol}: No se retornó precio válido')
                    )

            except requests.exceptions.RequestException as e:
                errors += 1
                self.stdout.write(
                    self.style.ERROR(f'{symbol}: Error de conexión - {str(e)}')
                )
            except Exception as e:
                errors += 1
                self.stdout.write(
                    self.style.ERROR(f'{symbol}: {str(e)}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nActualización completada: {updated} exitosas, {errors} errores'
            )
        )