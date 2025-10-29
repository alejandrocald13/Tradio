from celery import shared_task
from django.template.loader import render_to_string
import os
import base64
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition

@shared_task(bind=True, name="apps.common.tasks.send_email_task")

def send_email_task(self, to_email, subject, template_name, context, attachment_path=None):
    html_content = render_to_string(template_name, context)

    message = Mail(
        from_email=os.environ.get('FROM_EMAIL', 'no-reply@example.com'),
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )

    if attachment_path and os.path.exists(attachment_path):
        with open(attachment_path, "rb") as f:
            file_data = f.read()
            encoded_file = base64.b64encode(file_data).decode()

        attached_file = Attachment(
            FileContent(encoded_file),
            FileName(os.path.basename(attachment_path)),
            FileType("application/pdf"),
            Disposition("attachment"),
        )
        message.attachment = attached_file

    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    response = sg.send(message)
    return {
        "status_code": response.status_code,
        "to": to_email,
        "subject": subject,
    }
