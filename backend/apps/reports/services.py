from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
import uuid

def generate_report_pdf(user, from_date, to_date, data):
    html_string = render_to_string("reports/report.html", {
        "user": user,
        "from_date": from_date,
        "to_date": to_date,
        "compras": data.get("compras", 0),
        "ventas": data.get("ventas", 0),
        "saldo": data.get("saldo", 0),
    })

    pdf_content = HTML(string=html_string).write_pdf()

    filename = f"report_{user.id}_{uuid.uuid4().hex[:8]}.pdf"
    response = HttpResponse(pdf_content, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response