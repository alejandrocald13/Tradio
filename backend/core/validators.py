from decimal import Decimal
from django.core.exceptions import ValidationError

def validate_positive_value(value):
    if value <= 0:
        raise ValidationError('Value must be positive')

def validate_sufficient_funds(balance, required):
    if balance < required:
        raise ValidationError('Insufficient funds')