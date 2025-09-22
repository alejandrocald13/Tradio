# users/migrations/0005_seed_useractions.py
from django.db import migrations

ACTIONS = {
    # Auth / sesión
    "auth.register_requested":      "Registro solicitado (queda pendiente de aprobación).",
    "auth.user_approved":           "Usuario aprobado por administrador.",
    "auth.user_rejected":           "Usuario rechazado por administrador.",
    "auth.login":                   "Inicio de sesión exitoso.",
    "auth.login_failed":            "Intento de inicio de sesión fallido.",
    "auth.logout":                  "Cierre de sesión.",
    "auth.token_refreshed":         "Refresh de token JWT.",
    "auth.password_change":         "Cambio de contraseña.",
    "auth.password_reset_requested":"Solicitud de restablecer contraseña.",
    "auth.password_reset_done":     "Restablecimiento de contraseña completado.",
    "auth.email_verified":          "Correo verificado.",

    # Perfil
    "profile.updated":              "Perfil actualizado.",
    "profile.soft_deleted":         "Perfil marcado como eliminado.",
    "profile.restored":             "Perfil restaurado.",

    # Administración
    "admin.user_enabled":           "Admin habilita usuario.",
    "admin.user_disabled":          "Admin deshabilita usuario.",
    "admin.role_changed":           "Admin cambia rol/permisos.",
    "admin.stock_created":          "Admin crea acción bursátil.",
    "admin.stock_updated":          "Admin actualiza acción bursátil.",
    "admin.stock_deleted":          "Admin elimina acción bursátil.",

    # Búsquedas / vistas
    "search.by_name":               "Búsqueda de acciones por nombre.",
    "search.by_category":           "Búsqueda de acciones por categoría.",
    "search.by_filter":             "Búsqueda de acciones por filtro adicional.",
    "stock.viewed":                 "Detalle de acción visto.",
    "portfolio.viewed":             "Portafolio consultado.",
    "transactions.viewed":          "Historial de transacciones consultado.",

    # Trading / órdenes
    "trading.buy_submitted":        "Orden de compra enviada.",
    "trading.buy_executed":         "Orden de compra ejecutada.",
    "trading.buy_cancelled":        "Orden de compra cancelada.",
    "trading.sell_submitted":       "Orden de venta enviada.",
    "trading.sell_executed":        "Orden de venta ejecutada.",
    "trading.sell_cancelled":       "Orden de venta cancelada.",

    # Fondos
    "funds.deposit_requested":      "Depósito solicitado (simulado).",
    "funds.deposit_confirmed":      "Depósito confirmado (simulado).",
    "funds.withdrawal_requested":   "Retiro solicitado (simulado).",
    "funds.withdrawal_confirmed":   "Retiro confirmado (simulado).",
    "funds.fee_charged":            "Comisión cobrada por recarga/retiro.",

    # Reportes / correos
    "reports.requested":            "Reporte bajo demanda solicitado.",
    "reports.generated":            "Reporte generado.",
    "reports.email_sent":           "Reporte enviado por correo.",
    "email.movement_sent":          "Correo de movimiento financiero enviado.",

    # Referidos
    "referral.code_applied":        "Código de referido aplicado.",
    "referral.reward_granted":      "Recompensa de referido otorgada.",
}

def seed_user_actions(apps, schema_editor):
    UserAction = apps.get_model("users", "UserAction")
    for name, description in ACTIONS.items():
        UserAction.objects.get_or_create(
            name=name,
            defaults={"description": description[:200]},
        )

def unseed_user_actions(apps, schema_editor):
    UserAction = apps.get_model("users", "UserAction")
    UserAction.objects.filter(name__in=ACTIONS.keys()).delete()

class Migration(migrations.Migration):
    dependencies = [
        ("users", "0004_alter_profile_state"),  # ajusta al número de tu última migración
    ]
    operations = [
        migrations.RunPython(seed_user_actions, reverse_code=unseed_user_actions),
    ]
