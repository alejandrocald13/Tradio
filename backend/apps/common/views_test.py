from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime

from .tasks import send_email_task


class TestEmailView(APIView):
    def post(self, request):
        fake_user = {
            "first_name": "Antonio",
            "username": "chat",
            "email": "p22021a29@gmail.com",
        }

        support_email = "soporte@tradio.com"

        # 1) bienvenida.html
        ctx_bienvenida = {
            "user": fake_user,
            "dashboard_url": "http://localhost:3000/landing",
            "now": timezone.now(),
            "support_email": support_email,
        }
        send_email_task.delay(
            fake_user["email"],
            "Tradio | Tu cuenta fue aprobada",
            "emails/bienvenida.html",
            ctx_bienvenida,
        )

        # 2) pending_authorization.html
        ctx_pending = {
            "user": fake_user,
            "support_email": support_email,
            "submitted_at": timezone.now(),
        }
        send_email_task.delay(
            fake_user["email"],
            "Tradio | Estamos revisando tu cuenta",
            "emails/pending_authorization.html",
            ctx_pending,
        )

        # 3) admin_new_user.html
        ctx_admin_new_user = {
            "user": fake_user,
            "dashboard_url": "http://localhost:3000/admin/review-users",
            "created_at": timezone.now(),
        }
        send_email_task.delay(
            fake_user["email"],
            "Tradio | Nuevo usuario pendiente de aprobación",
            "emails/admin_new_user.html",
            ctx_admin_new_user,
        )

        # 4) trade_confirm.html
        fake_trade = {
            "type": "buy",
            "symbol": "AAPL",
            "qty": 10,
            "price": "172.30",
            "fee": "1.25",
            "total": "1723.25",
            "executed_at": "2025-10-26 13:45 UTC",
            "id": "TX-ABC123",
        }
        ctx_trade = {
            "user": fake_user,
            "trade": fake_trade,
            "trade_detail_url": "http://localhost:3000/transactions",
            "support_email": support_email,
        }
        send_email_task.delay(
            fake_user["email"],
            f"Tradio | Confirmación de {fake_trade['type'].title()} – {fake_trade['symbol']}",
            "emails/trade_confirm.html",
            ctx_trade,
        )

        # 5) wallet_movement.html
        fake_movement = {
            "type": "topup",
            "amount": "250.00",
            "reference": "TRF-ABC123",
            "balance_after": "1025.00",
            "created_at": "2025-10-26 14:11 UTC",
        }
        ctx_wallet = {
            "user": fake_user,
            "movement": fake_movement,
            "wallet_url": "http://localhost:3000/wallet",
            "support_email": support_email,
        }
        send_email_task.delay(
            fake_user["email"],
            f"Tradio | {fake_movement['type'].title()} de wallet Q{fake_movement['amount']}",
            "emails/wallet_movement.html",
            ctx_wallet,
        )

        # 6) report_ready.html
        ctx_report = {
            "user": fake_user,
            "report_url": "http://localhost:8000/media/reports/report.pdf",
            "period_from": "2025-09-01",
            "period_to": "2025-10-01",
            "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
            "support_email": support_email,
        }
        send_email_task.delay(
            fake_user["email"],
            "Tradio | Tu reporte está listo",
            "emails/report_ready.html",
            ctx_report,
        )

        return Response({"status": "queued_all"})
