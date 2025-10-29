import os
from celery import Celery
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

app = Celery("core")

# Le decimos a Celery que lea config que pusimos en settings.py con el prefijo CELERY_
app.config_from_object("django.conf:settings", namespace="CELERY")

# Descubre tasks.py en cada app instalada (apps.notifications, apps.wallet, etc)
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
