from apps.wallet.models import Wallet, Movement, ReferalCode

def apply_refered_code(user, code):
    try:
        referal = ReferalCode.objects.get(code=code)
    except ReferalCode.DoesNotExist:
        return False
    
    wallet = Wallet.objects.get(user=user)
    wallet.balance += referal.amount
    wallet.save()

    Movement.objects.create(
        user=user,
        numero_transferencia=f"REF-{code}",
        tipo="CODE-REFEREAL",
        monto=referal.amount,
        comision=0,
        total=referal.amount
    )
    return True
