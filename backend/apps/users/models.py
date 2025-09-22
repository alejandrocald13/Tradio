# users/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    name = models.CharField(max_length=150)
    referral_code = models.CharField(max_length=50, blank=True, null=True, unique=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"

    @property
    def is_deleted(self):
        return self.deleted_at is not None

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save(update_fields=["deleted_at"])


class UserAction(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=200, blank=True)
    
    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class SecurityLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        related_name="security_logs",
    )
    action = models.ForeignKey(
        UserAction,
        on_delete=models.PROTECT,
        related_name="security_logs",
    )
    ip = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True) # Mozilla/5.0 (Windows NT 10.0; Win64; x64)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        u = self.user.username if self.user else "usuario eliminado"
        return f"[{self.timestamp}] {u} - {self.action} ({self.ip})"