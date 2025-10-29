from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from apps.reports.utils import validate_dates
from apps.reports.services import generate_report_pdf
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from drf_spectacular.types import OpenApiTypes

# non-repudiation
from apps.users.utils import log_action
from apps.users.actions import Action

from apps.reports.reports import get_financial_report_data

# celery

from apps.common.email_service import send_report_ready_email
import logging

logger = logging.getLogger(__name__)

class ReportesEstadoView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["reports"],
        summary="Generar reporte en PDF",
        description="Genera un reporte financiero en formato PDF entre las fechas dadas.",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "from": {"type": "string", "format": "date", "example": "2025-01-01"},
                    "to": {"type": "string", "format": "date", "example": "2025-10-04"},
                },
                "required": ["from", "to"],
            }
        },
        responses={
            200: OpenApiResponse(
                response=OpenApiTypes.BINARY,
                description="Archivo PDF descargable."
            ),
            400: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Error de validación de fechas o datos inválidos.",
                examples=[
                    OpenApiExample(
                        name="Fechas incorrectas",
                        summary="Ejemplo de error de validación",
                    )
                ],
            ),
            401: OpenApiResponse(description="No autenticado."),
        },
    )

    def post(self, request):
        user = request.user
        from_date = request.data.get("from")
        to_date = request.data.get("to")

        validate_dates(from_date, to_date)

        pdf_data = get_financial_report_data(user, from_date, to_date)

        response, file_path = generate_report_pdf(user, from_date, to_date, pdf_data, request=request)

        try:
            send_report_ready_email(
                user,
                from_date,
                to_date,
                None,
                attachment_path=file_path,
            )
        except Exception as e:
            logger.warning(f"Error al enviar correo de reporte a {user.email}: {e}")
        
        log_action(request, user, Action.REPORTS_REQUESTED)

        return response
