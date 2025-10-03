from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.reports.utils import validate_dates
from apps.reports.services import generate_report_pdf

# non-repudiation
from apps.users.utils import log_action
from apps.users.actions import Action

class ReportesEstadoView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_id = user.id

        from_date = request.data.get("from")
        to_date = request.data.get("to")

        validate_dates(from_date, to_date)

        filepath = generate_report_pdf(user_id, from_date, to_date)

        # queue pdf

        log_action(request, user, Action.REPORTS_REQUESTED)
    
        return Response({
            "user_id": user_id,
            "from": from_date,
            "to": to_date,
            "filepath": filepath,
        }, status=201)