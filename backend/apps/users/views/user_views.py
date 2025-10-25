from rest_framework import viewsets, mixins
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction

# swagger
from drf_spectacular.utils import extend_schema, OpenApiResponse

# permissions
from apps.users.permissions import IsUser, IsAdmin

# serializers
from apps.users.serializers import UserListSerializer

# models
from apps.users.models import ProfileState

# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action


User = get_user_model()


class UserViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserListSerializer

    def get_permissions(self):
        if self.action == "list":
            return [IsAdmin()]
        elif self.action in ("enable", "disable"):
            return [IsAdmin()]
        return [IsUser()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list":
            qs = qs.filter(is_staff=False, is_superuser=False, profile__profile_completed=True)
        return qs

    @extend_schema(
        tags=["users"],
        summary="Listar usuarios (solo administradores)",
        description="Retorna la lista de usuarios que **no son staff ni superusuarios**.",
        responses={200: UserListSerializer},
    )
    def list(self, request, *args, **kwargs):
        log_action(request, request.user if request.user.is_authenticated else None, Action.SEARCH_BY_FILTER)
        return super().list(request, *args, **kwargs)

    def _get_state(self, name: str) -> ProfileState:
        return ProfileState.objects.get(name=name)

    @extend_schema(
        tags=["users"],
        summary="Habilitar usuario (admin)",
        description="Activa la cuenta del usuario y cambia el estado del perfil a **'habilitado'**.",
        responses={
            200: OpenApiResponse(description="Usuario habilitado correctamente"),
            404: OpenApiResponse(description="Usuario no encontrado"),
        },
    )
    @action(detail=True, methods=["post"])
    def enable(self, request, pk=None):
        user = self.get_object()
        with transaction.atomic():
            user.is_active = True
            user.save(update_fields=["is_active"])
            prof = getattr(user, "profile", None)
            if prof:
                prof.state = self._get_state("habilitado")
                prof.save(update_fields=["state"])
        log_action(request, request.user, Action.ADMIN_USER_ENABLED)
        return Response({"status": "enabled"})

    @extend_schema(
        tags=["users"],
        summary="Deshabilitar usuario (admin)",
        description="Desactiva la cuenta del usuario y cambia el estado del perfil a **'deshabilitado'**.",
        responses={
            200: OpenApiResponse(description="Usuario deshabilitado correctamente"),
            404: OpenApiResponse(description="Usuario no encontrado"),
        },
    )
    @action(detail=True, methods=["post"])
    def disable(self, request, pk=None):
        user = self.get_object()
        with transaction.atomic():
            user.is_active = False
            user.save(update_fields=["is_active"])
            prof = getattr(user, "profile", None)
            if prof:
                prof.state = self._get_state("deshabilitado")
                prof.save(update_fields=["state"])
        log_action(request, request.user, Action.ADMIN_USER_DISABLED)
        return Response({"status": "disabled"})
