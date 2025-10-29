from celery import shared_task
from django.template.loader import render_to_string
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

@shared_task(bind=True, name="apps.common.tasks.send_email_task")
def send_email_task(self, to_email, subject, template_name, context):
    html_content = render_to_string(template_name, context)

    message = Mail(
        from_email=os.environ.get('FROM_EMAIL', 'no-reply@example.com'),
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )

    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    response = sg.send(message)
    return {
        "status_code": response.status_code,
        "to": to_email,
        "subject": subject,
    }
