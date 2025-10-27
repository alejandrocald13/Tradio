from rest_framework.views import APIView
from rest_framework.response import Response
from .tasks import send_email_task
from django.utils import timezone

class TestEmailView(APIView):
    def post(self, request):
        user = {
            "first_name": "Antonio",
            "username": "chat",
            "email": "p22021a29@gmail.com"
        }

        context = {
            "user": user,
            "dashboard_url": "http://localhost:3000/dashboard",
            "now": timezone.now()
        }

        send_email_task.delay(
            to=user["email"],
            subject="Tradio | Tu cuenta fue aprobada",
            template_name="emails/bienvenida.html",
            context=context
        )

        return Response({"status": "queued"})
