from django.urls import path
from apps.reports.views import ReportesEstadoView

urlpatterns = [
    path("state/", ReportesEstadoView.as_view(), name="reportes-estado"),
]
