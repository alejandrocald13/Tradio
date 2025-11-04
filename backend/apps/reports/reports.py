from apps.transactions_all.models import PurchaseTransaction, SaleTransaction
from datetime import datetime, timedelta, timezone

def get_financial_report_data(user, from_date, to_date):

    if isinstance(from_date, str):
        from_date = datetime.strptime(from_date, "%Y-%m-%d")
    if isinstance(to_date, str):
        to_date = datetime.strptime(to_date, "%Y-%m-%d")

    to_date = to_date + timedelta(days=1)

    if not timezone.is_aware(from_date):
        from_date = timezone.make_aware(from_date)
    if not timezone.is_aware(to_date):
        to_date = timezone.make_aware(to_date)

    compras_qs = PurchaseTransaction.objects.filter(
        user=user,
        date__range=(from_date, to_date)
    )

    ventas_qs = SaleTransaction.objects.filter(
        user=user,
        date__range=(from_date, to_date)
    )

    compras = [
        {
            "fecha": c.date.strftime("%Y-%m-%d"),
            "name_stock": c.stock.name,
            "cantidad_comprada": float(c.quantity),
            "precio_comprado": float(c.unit_price),
            "subtotal": float(c.quantity * c.unit_price),
        }
        for c in compras_qs
    ]

    ventas = [
        {
            "fecha": v.date.strftime("%Y-%m-%d"),
            "name_stock": v.stock.name,
            "cantidad_vendida": float(v.quantity),
            "precio_vendido": float(v.unit_price),
            "subtotal": float(v.quantity * v.unit_price),
        }
        for v in ventas_qs
    ]

    total_compras = sum(item["subtotal"] for item in compras)
    total_ventas = sum(item["subtotal"] for item in ventas)

    saldo = total_ventas - total_compras

    return {
        "compras": compras,
        "ventas": ventas,
        "compras_total": total_compras,
        "ventas_total": total_ventas,
        "saldo": saldo,
    }