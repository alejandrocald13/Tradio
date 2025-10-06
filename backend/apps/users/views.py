# users/views.py
from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from apps.users.models import ProfileState, Profile

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.serializers import RegisterSerializer

# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action

from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action

from apps.users.permissions import IsUser, IsAdmin
from apps.users.utils_perms import assert_owner_or_admin
from apps.users.serializers import UserListSerializer, UserDetailSerializer, UserNameSerializer, EmailTokenObtainPairSerializer

User = get_user_model()
from drf_spectacular.utils import extend_schema, OpenApiResponse, extend_schema_view
from rest_framework import serializers

from rest_framework_simplejwt.tokens import AccessToken

class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @extend_schema(
        request=RegisterSerializer,
        responses={
            201: OpenApiResponse(description="Usuario creado correctamente"),
            400: OpenApiResponse(description="Errores de validación"),
        },
        tags=["auth"],
        summary="Registro de usuario",
    )

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            log_action(request, user, Action.AUTH_REGISTER_REQUESTED)

            # send_email(pending_authorization.html) al usuario recién registrado

            # send_email(admin_new_user.html) a todos los admins


            return Response(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "message": "Usuario registrado exitosamente",
                },
                status=status.HTTP_201_CREATED,
            )

        log_action(request, None, Action.AUTH_REGISTER_REQUESTED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoggedTokenObtainPairView(TokenObtainPairView):
    """
    Login JWT: mismo comportamiento que SimpleJWT pero con logging.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = getattr(serializer, "user", None)
        except Exception:
            user = None

        if 200 <= response.status_code < 400:
            log_action(request, user, Action.AUTH_LOGIN)
        else:
            log_action(request, user if user and user.is_authenticated else None, Action.AUTH_LOGIN_FAILED)

        return response


class LoggedTokenRefreshView(TokenRefreshView):
    """
    Refresh JWT: marcamos evento de token refrescado si es exitoso.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if 200 <= response.status_code < 400:
            user = request.user if getattr(request.user, "is_authenticated", False) else None
            log_action(request, user, Action.AUTH_TOKEN_REFRESHED)
        return response

class LogoutView(APIView):
    permission_classes = [IsUser]

    @extend_schema(
        request=serializers.Serializer,
        responses={204: OpenApiResponse(description="Logout ok")},
        tags=["auth"],
        summary="Logout del usuario",
    )
    def post(self, request):
        token_str = request.auth

        try:
            token = AccessToken(token_str)
            token.blacklist()
            log_action(request, request.user, Action.AUTH_LOGOUT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)

class MeView(APIView):
    permission_classes = [IsUser]

    @extend_schema(
        responses=UserDetailSerializer,
        tags=["users"],
        summary="Ver perfil propio",
    )
    def get(self, request):
        data = UserDetailSerializer(request.user).data
        return Response(data, status=status.HTTP_200_OK)

    @extend_schema(
        request=UserDetailSerializer,
        responses=UserDetailSerializer,
        tags=["users"],
        summary="Actualizar perfil propio",
        description="Admite cambios en email (User) y campos de profile (p. ej. name, birth_date, state_id).",
    )

    def patch(self, request):
        serializer = UserDetailSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_action(request, request.user, Action.PROFILE_UPDATED)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserViewGetName(APIView):
    permission_classes = [IsUser]

    @extend_schema(
        responses={
            200: UserNameSerializer,
            401: OpenApiResponse(description="No autenticado"),
            403: OpenApiResponse(description="No tienes permisos"),
            404: OpenApiResponse(description="Perfil no encontrado"),
        },
        summary="Obtener nombre de perfil actual",
    )

    def get(self, request):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response(
                {"detail": "Perfil no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserNameSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    
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