from datetime import datetime
from rest_framework.exceptions import ValidationError

def validate_dates(from_str: str, to_str: str, max_days: int = 90):
    """
    Valida que las fechas sean correctas.
    - from_str y to_str en formato YYYY-MM-DD.
    - from <= to.
    - Rango no mayor a max_days.
    Devuelve objetos datetime.date si son válidas.
    """
    if not from_str or not to_str:
        raise ValidationError("Los parámetros 'from' y 'to' son obligatorios.")

    try:
        from_date = datetime.strptime(from_str, "%Y-%m-%d").date()
        to_date = datetime.strptime(to_str, "%Y-%m-%d").date()
    except ValueError:
        raise ValidationError("Formato de fecha inválido. Usa YYYY-MM-DD.")

    if from_date > to_date:
        raise ValidationError("La fecha 'from' no puede ser mayor que 'to'.")

    if (to_date - from_date).days > max_days:
        raise ValidationError(f"El rango de fechas no debe exceder {max_days} días.")

    return from_date, to_date