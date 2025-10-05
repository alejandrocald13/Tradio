from django.urls import path
from apps.reports.views import ReportesEstadoView

urlpatterns = [
    path("reports/", ReportesEstadoView.as_view(), name="reportes-estado"),
]
