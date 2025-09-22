from users.models import SecurityLog, UserAction

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