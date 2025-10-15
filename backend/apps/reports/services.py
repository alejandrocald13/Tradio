from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
import uuid

def generate_report_pdf(user, from_date, to_date, data):

    html_string = render_to_string("reports/report.html", {
        "user": user,
        "from_date": from_date,
        "to_date": to_date,
        "compras": data.get("compras", []),
        "ventas": data.get("ventas", []),
        "compras_total": data.get("compras_total", 0),
        "ventas_total": data.get("ventas_total", 0),
        "saldo": data.get("saldo", 0),
    })


    pdf_content = HTML(string=html_string).write_pdf()

    filename = f"TReport_{from_date}_{to_date}.pdf"
    response = HttpResponse(pdf_content, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response