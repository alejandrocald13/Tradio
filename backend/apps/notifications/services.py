import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email_sendgrip(to, subject, html_template):
    message = Mail(
        from_email=os.environ.get('FROM_EMAIL', 'no-reply@example.com'),
        to_emails=to,
        subject=subject,
        html_content=html_template)
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)