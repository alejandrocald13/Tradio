from apps.users.permissions import IsUser, IsAdmin
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from rest_framework import serializers, status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated


# serializers
from apps.users.serializers import EmailTokenObtainPairSerializer

# swagger
from drf_spectacular.utils import extend_schema, OpenApiResponse

# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

    @extend_schema(
        responses={
            201: OpenApiResponse(description="Inicio de sesión correcto"),
            400: OpenApiResponse(description="Credenciales Inválidas"),
        },
        tags=["token"],
        summary="Inicio de Sesión",
    )

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        data = response.data
        access_token = data.get("access")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        
        response = Response({"message": "Inicio de sesión correcto"}, status=status.HTTP_200_OK)

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        # Save token en cookie HTTPOnly
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,      # True on production
            samesite="None",  # 
            max_age=3600,
        )


        return response

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
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=serializers.Serializer,
        responses={204: OpenApiResponse(description="Logout ok")},
        tags=["auth"],
        summary="Logout del usuario",
    )
    def post(self, request):
        try:
            token_str = request.COOKIES.get("access_token")

            if not token_str:
                return Response({"detail": "No se encontró el token en la cookie."}, status=status.HTTP_400_BAD_REQUEST)

            log_action(request, request.user, Action.AUTH_LOGOUT)

            response = Response({"detail": "Sesión cerrada correctamente."}, status=status.HTTP_200_OK)
            response.delete_cookie("access_token")

            return response

        except Exception as e:
            return Response({"detail": f"Error al cerrar sesión: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)