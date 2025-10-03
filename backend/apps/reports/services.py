from django.template.loader import render_to_string
from weasyprint import HTML
import os, uuid

def generate_report_pdf(user, from_date, to_date, data):
    
    html_string = render_to_string("reports/report.html", {
        "user": user,
        "from_date": from_date,
        "to_date": to_date,
        "compras": data.get("compras", 0),
        "ventas": data.get("ventas", 0),
        "saldo": data.get("saldo", 0),
    })

    filename = f"report_{user.id}_{uuid.uuid4()}.pdf"
    filepath = os.path.join("media", "reports", filename)

    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    HTML(string=html_string).write_pdf(filepath)

    return filepath
