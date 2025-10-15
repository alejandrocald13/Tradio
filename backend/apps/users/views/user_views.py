from rest_framework import viewsets, mixins
from django.contrib.auth import get_user_model
from rest_framework.decorators import action

# swagger
from drf_spectacular.utils import extend_schema, OpenApiResponse, extend_schema_view

# permissions
from apps.users.permissions import IsUser, IsAdmin

# serializers
from apps.users.serializers import UserListSerializer, UserDetailSerializer


# models
from apps.users.models import ProfileState

# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action



User = get_user_model()

@extend_schema_view(
    list=extend_schema(tags=["users"], summary="Listar usuarios (admin)"),
    retrieve=extend_schema(tags=["users"], summary="Detalle de usuario"),
    update=extend_schema(tags=["users"], summary="Actualizar usuario"),
    partial_update=extend_schema(tags=["users"], summary="Actualizar parcialmente usuario"),
)
            
class UserViewSet(viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin):
    queryset = User.objects.all().order_by("-date_joined")

    def get_permissions(self):
        if self.action == "list":
            return [IsAdmin()]
        elif self.action in ("retrieve", "update", "partial_update"):
            return [IsUser()]
        elif self.action in ("enable", "disable"):
            return [IsAdmin()]
        return [IsUser()]

    def get_serializer_class(self):
        return UserListSerializer if self.action == "list" else UserDetailSerializer
    
    def get_queryset(self):
        """
        Override the default queryset:
        - For list: return only normal users (non-staff and non-superuser)
        - For other actions: return all users
        """
        qs = super().get_queryset()
        if self.action == "list":
            qs = qs.filter(is_staff=False, is_superuser=False)
        return qs

    def list(self, request, *args, **kwargs):
        log_action(request, request.user if request.user.is_authenticated else None, Action.SEARCH_BY_FILTER)
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        assert_owner_or_admin(request, obj)
        log_action(request, request.user, Action.PORTFOLIO_VIEWED)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        assert_owner_or_admin(request, obj)
        resp = super().update(request, *args, **kwargs)
        log_action(request, request.user, Action.PROFILE_UPDATED)
        return resp

    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        assert_owner_or_admin(request, obj)
        resp = super().partial_update(request, *args, **kwargs)
        log_action(request, request.user, Action.PROFILE_UPDATED)
        return resp

    def _get_state(self, name: str) -> ProfileState:
        # Busca por nombre EXACTO según tu tabla: "pendiente", "habilitado", "deshabilitado"
        return ProfileState.objects.get(name=name)

    @action(detail=True, methods=["post"])
    @extend_schema(
        responses={200: OpenApiResponse(description="Usuario habilitado (profile.state = 'habilitado')")},
        tags=["users"],
        summary="Habilitar usuario (admin)",
    )
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
    
    @action(detail=True, methods=["post"])
    @extend_schema(
        responses={200: OpenApiResponse(description="Usuario deshabilitado (profile.state = 'deshabilitado')")},
        tags=["users"],
        summary="Deshabilitar usuario (admin)",
    )

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