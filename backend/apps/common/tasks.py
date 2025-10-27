from celery import shared_task
from django.template.loader import render_to_string
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

@shared_task
def send_email_task(to, subject, template_name, context):
    html_content = render_to_string(template_name, context)

    message = Mail(
        from_email=os.environ.get('FROM_EMAIL', 'no-reply@tradio.com'),
        to_emails=to,
        subject=subject,
        html_content=html_content
    )

    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print("EMAIL SENT:", response.status_code)
        return 200 <= response.status_code < 300
    except Exception as e:
        print("EMAIL ERROR:", e)
        return False
