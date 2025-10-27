import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.template.loader import render_to_string

def send_email(to, subject, template_name, context):
    html_content = render_to_string(template_name, context)

    message = Mail(
        from_email=os.environ.get("FROM_EMAIL", "no-reply@example.com"),
        to_emails=to,
        subject=subject,
        html_content=html_content
    )

    try:
        sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))
        response = sg.send(message)
        print("SENDGRID STATUS:", response.status_code)
        return 200 <= response.status_code < 300
    except Exception as e:
        print("SENDGRID ERROR:", e)
        return False
