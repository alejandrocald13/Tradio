from celery import shared_task
from django.template.loader import render_to_string
from django.contrib.auth.models import User
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail,
    Attachment,
    FileContent,
    FileName,
    FileType,
    Disposition,
)
import os


@shared_task(bind=True, name="apps.common.tasks.send_email_task")
def send_email_task(self, user_id, subject, template_name, context, pdf_base64=None):
    """
    Envía un correo con SendGrid usando un template HTML.
    Si se pasa pdf_base64, se adjunta como archivo PDF.
    """

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return {"status": "skipped", "reason": "user deleted"}

    html_content = render_to_string(template_name, context)

    message = Mail(
        from_email=os.environ.get("FROM_EMAIL"),
        to_emails=user.email,
        subject=subject,
        html_content=html_content,
    )

    if pdf_base64:

        attachment = Attachment(
            FileContent(pdf_base64),
            FileName(f"T_{context['report']['from']}_{context['report']['to']}.pdf"),
            FileType("application/pdf"),
            Disposition("attachment"),
        )
        message.attachment = attachment

    try:
        sg = SendGridAPIClient(os.environ["SENDGRID_API_KEY"])
        response = sg.send(message)
        return {
            "status": "sent",
            "from": os.environ.get("FROM_EMAIL"),
            "to": user.email,
            "subject": subject,
            "code": response.status_code,
        }

    except Exception as e:
        self.retry(exc=e, countdown=10, max_retries=3)
        return {"status": "error", "error": str(e)}
