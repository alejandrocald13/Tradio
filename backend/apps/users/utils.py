# users/utils.py
import secrets
from apps.users.models import SecurityLog, UserAction
from django.db import transaction, IntegrityError
from apps.users.models import Profile

ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # sin 0/O/1/I para evitar confusión

def generate_referral_code(length: int = 6) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))

def assign_unique_referral_code(profile: Profile, length: int = 6, max_attempts: int = 10) -> None:
    """
    Genera y asigna un referral_code único.
    """
    for _ in range(max_attempts):
        profile.referral_code = generate_referral_code(length)
        try:
            with transaction.atomic():
                profile.save(update_fields=["referral_code"])
            return
        except IntegrityError:
            continue
    raise RuntimeError("No fue posible generar un referral_code único después de varios intentos")

def log_action(request, user, action_name: str):
    """
    - request: HttpRequest (IP y user_agent)
    - user: User None
    - action_name: search base on Actions.py
    """

    ip = request.META.get("HTTP_X_FORWARDED_FOR")
    if ip:
        ip = ip.split(",")[0].strip()
    else:
        ip = request.META.get("REMOTE_ADDR")

    user_agent = request.META.get("HTTP_USER_AGENT", "")

    action = UserAction.objects.get(name=action_name)

    SecurityLog.objects.create(
        user=user,
        action=action,
        ip=ip,
        user_agent=user_agent,
    )


# Implementation Usage :)

# from users.actions import Action
# from users.utils import log_action

# # Ejemplo en una vista
# class LoginView(APIView):
#     def post(self, request):
#         # ... auth ...
#         if ok:
#             log_action(request, user, Action.AUTH_LOGIN)
#         else:
#             log_action(request, None, Action.AUTH_LOGIN_FAILED)