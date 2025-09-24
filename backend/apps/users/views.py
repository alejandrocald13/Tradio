# users/views.py
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.serializers import RegisterSerializer
from apps.users.utils import log_action
from apps.users.actions import Action

from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action

from apps.users.permissions import IsUser, IsAdmin, IsOwnerOrAdmin
from apps.users.utils_perms import assert_owner_or_admin
from apps.users.serializers import UserListSerializer, UserDetailSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # security logs
            log_action(request, user, Action.AUTH_REGISTER_REQUESTED)
            return Response(
                {"id": user.id, "username": user.username, "email": user.email},
                status=status.HTTP_201_CREATED,
            )
        # unknown user
        log_action(request, None, Action.AUTH_REGISTER_REQUESTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoggedTokenObtainPairView(TokenObtainPairView):
    """
    Login JWT: mismo comportamiento que SimpleJWT pero con logging.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Dejamos a la superclase validar credenciales
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
    """
    Enviar en el cuerpo: {"refresh": "<REFRESH_TOKEN>"}.
    """
    permission_classes = [IsUser]

    def post(self, request):
        refresh = request.data.get("refresh")
        if refresh:
            try:
                token = RefreshToken(refresh)
            except Exception:
                pass
        log_action(request, request.user, Action.AUTH_LOGOUT)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class MeView(APIView):
    permission_classes = [IsUser]

    def get(self, request):
        """Devuelve el usuario autenticado + profile."""
        data = UserDetailSerializer(request.user).data
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request):
        """
        Actualiza datos del usuario autenticado.
        Admite cambios en:
        - email (User)
        - profile.name, profile.referral_code
        - profile.state_id (FK de ProfileState)  <-- write-only
        """
        serializer = UserDetailSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_action(request, request.user, Action.PROFILE_UPDATED)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin):
    """
    Reglas:
    - list: solo admin
    - retrieve/update/partial_update: owner o admin
    - enable/disable: solo admin
    """
    queryset = User.objects.all().order_by("-date_joined")

    def get_permissions(self):
        if self.action == "list":
            return [IsAdmin()]
        elif self.action in ("retrieve", "update", "partial_update"):
            return [IsUser()]  # objeto se valida abajo con assert_owner_or_admin
        elif self.action in ("enable", "disable"):
            return [IsAdmin()]
        return [IsUser()]

    def get_serializer_class(self):
        return UserListSerializer if self.action == "list" else UserDetailSerializer

    # --- LIST (solo admin) ---
    def list(self, request, *args, **kwargs):
        log_action(request, request.user if request.user.is_authenticated else None, Action.SEARCH_BY_FILTER)
        return super().list(request, *args, **kwargs)

    # --- RETRIEVE (owner/admin) ---
    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        assert_owner_or_admin(request, obj)  # <- chequeo sin mixin
        log_action(request, request.user, Action.PORTFOLIO_VIEWED)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    # --- UPDATE/PATCH (owner/admin) ---
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

    # --- ENABLE/DISABLE (solo admin) ---
    @action(detail=True, methods=["post"])
    def enable(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save(update_fields=["is_active"])
        log_action(request, request.user, Action.ADMIN_USER_ENABLED)
        return Response({"status": "enabled"})

    @action(detail=True, methods=["post"])
    def disable(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save(update_fields=["is_active"])
        log_action(request, request.user, Action.ADMIN_USER_DISABLED)
        return Response({"status": "disabled"})
