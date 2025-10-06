from datetime import datetime
from apps.transactions.models import Transaction

def get_financial_report_data(user, from_date, to_date):
    compras_qs = Transaction.objects.filter(
        user=user,
        created_at__range=(from_date, to_date),
        type="BUY"
    )

    ventas_qs = Transaction.objects.filter(
        user=user,
        created_at__range=(from_date, to_date),
        type="SELL"
    )

    compras = [
        {
            "fecha": t.created_at.strftime("%Y-%m-%d"),
            "name_stock": t.stock,
            "cantidad_comprada": t.quantity,
            "precio_comprado": float(t.price),
            "subtotal": float(t.total),
        }
        for t in compras_qs
    ]

    ventas = [
        {
            "fecha": t.created_at.strftime("%Y-%m-%d"),
            "name_stock": t.stock,
            "cantidad_vendida": t.quantity,
            "precio_vendido": float(t.price),
            "subtotal": float(t.total),
        }
        for t in ventas_qs
    ]

    total_compras = sum(c["subtotal"] for c in compras)
    total_ventas = sum(v["subtotal"] for v in ventas)
    saldo = total_ventas - total_compras
    
    return {
        "compras": compras,
        "compras_total": total_compras,
        "ventas_total": total_ventas,
        "saldo": saldo,
    }