import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.users.serializers import Auth0UserLoginSerializer, UserSerializer

from drf_spectacular.utils import extend_schema, OpenApiResponse
# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action

class Auth0LoginView(APIView):
    """
    Valida el token de Auth0.
    - Si el usuario no existe -> se crea con perfil 'pendiente' (sin cookie JWT).
    - Si existe pero el perfil no está habilitado -> no genera JWT.
    - Si el perfil está habilitado -> genera cookie JWT (1h).
    """
    def revoke_auth0_token(self, token):
            """Revoca el token de Auth0 para impedir futuros accesos."""
            try:
                resp = requests.post(
                    f"https://{settings.AUTH0_DOMAIN}/oauth/revoke",
                    data={
                        "client_id": settings.AUTH0_CLIENT_ID,
                        "client_secret": settings.AUTH0_CLIENT_SECRET,
                        "token": token,
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                )
                if resp.status_code not in (200, 204):
                    print("Error al revocar token de Auth0:", resp.text)
            except Exception as e:
                print("No se pudo revocar token de Auth0:", e)
    
    @extend_schema(
    tags=["auth"],
    summary="Autenticación con Auth0",
    description="Valida el token de Auth0, crea o actualiza al usuario y guarda el JWT en cookie HttpOnly.",
    request=Auth0UserLoginSerializer,
    responses={
        200: OpenApiResponse(
            response=UserSerializer,
            description="Inicio de sesión exitoso."
        ),
        201: OpenApiResponse(
            response=UserSerializer,
            description="Usuario creado pero pendiente de habilitación."
        ),
        403: OpenApiResponse(
            description="Perfil no autorizado o acceso restringido."
        ),
        400: OpenApiResponse(
            description="Token inválido o datos incompletos."
        ),
    },
    )

    def post(self, request):
        
        serializer = Auth0UserLoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        profile = getattr(user, "profile", None)

        auth0_token = request.data.get("auth0_token")

        if not profile:
            return Response(
                {"detail": "El usuario no tiene perfil asociado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if profile.state.name.lower() == "pendiente":
            self.revoke_auth0_token(auth0_token)
            return Response(
                {
                    "message": "Usuario creado correctamente, pero pendiente de habilitación.",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )

        if profile.state.name.lower() != "habilitado":
            self.revoke_auth0_token(auth0_token)
            return Response(
                {
                    "message": f"El perfil está '{profile.state.name}'. Acceso restringido.",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        
        if profile.profile_completed == False:
            self.revoke_auth0_token(auth0_token)
            return Response(
                {
                    "message": f"El perfil está incompleto'. Acceso restringido.",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        auth0_token = serializer.validated_data.get("auth0_token")

        response = Response(
            {
                "message": "Inicio de sesión exitoso.",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        log_action(request, user, Action.AUTH_LOGIN)

        response.set_cookie(
            key="access_token",
            value=auth0_token,
            httponly=True,
            samesite="None",
            secure=True,
            max_age=3600,
        )

        return response
