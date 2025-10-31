from datetime import datetime
from django.utils.timezone import now
from apps.common.tasks import send_email_task

def send_welcome_email(user, dashboard_url=None, support_email=None):
    prof = getattr(user, "profile", None)

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "now": now(),
        "support_email": support_email or "soporte@tradio.com",
    }

    subject = "Tradio | Tu cuenta fue aprobada"
    template = "emails/bienvenida.html"
    send_email_task.delay(user.email, subject, template, context)


def send_pending_authorization_email(user, support_email=None):

    prof = getattr(user, "profile", None)

    auth_method = "Local"
    if getattr(user, "auth0_id", "").startswith("google|"):
        auth_method = "Google"
    elif getattr(user, "auth0_id", "").startswith("facebook|"):
        auth_method = "Facebook"

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "authentic_method": auth_method,
        "support_email": support_email or "soporte@tradio.com",
        "submitted_at": now(),
    }

    subject = "Tradio | Estamos revisando tu cuenta"
    template = "emails/pending_authorization.html"
    send_email_task.delay(user.email, subject, template, context)


def send_admin_new_user_email(admin_email, user, dashboard_url=None):
    prof = getattr(user, "profile", None)

    auth_method = "Local"
    if getattr(user, "auth0_id", "").startswith("google|"):
        auth_method = "Google"
    elif getattr(user, "auth0_id", "").startswith("facebook|"):
        auth_method = "Facebook"

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "authentic_method": auth_method,
        "created_at": getattr(user, "date_joined", now()),
    }

    subject = "Tradio | Nuevo usuario pendiente de aprobación"
    template = "emails/admin_new_user.html"
    send_email_task.delay(admin_email, subject, template, context)


def send_trade_confirmation_email(user, trade, trade_detail_url=None, support_email=None):
    prof = getattr(user, "profile", None)

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "trade": trade,
        "support_email": support_email or "soporte@tradio.com",
    }

    subject = f"Tradio | Confirmación de {trade.get('type','').title()} – {trade.get('symbol','')}"
    template = "emails/trade_confirm.html"
    send_email_task.delay(user.email, subject, template, context)


def send_wallet_movement_email(user, movement, wallet_url=None, support_email=None):
    prof = getattr(user, "profile", None)

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "movement": movement,
        "support_email": support_email or "soporte@tradio.com",
    }

    subject = f"Tradio | {movement.get('type','').title()} de wallet ${movement.get('amount','')}"
    template = "emails/wallet_movement.html"
    send_email_task.delay(user.email, subject, template, context)


def send_report_ready_email(user, period_from, period_to, support_email=None, pdf_base64=None):
    prof = getattr(user, "profile", None)

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "report": {
            "from": period_from,
            "to": period_to,
        },
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        "support_email": support_email or "soporte@tradio.com",
    }

    subject = "Tradio | Tu reporte está listo"
    template = "emails/report_ready.html"

    send_email_task.delay(user.id, subject, template, context, pdf_base64)
