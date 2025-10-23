import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.users.serializers import Auth0UserLoginSerializer, UserSerializer

class Auth0LoginView(APIView):
    """
    Valida el token de Auth0.
    - Si el usuario no existe -> se crea con perfil 'pendiente' (sin cookie JWT).
    - Si existe pero el perfil no está habilitado -> no genera JWT.
    - Si el perfil está habilitado -> genera cookie JWT (1h).
    """

    def post(self, request):
        serializer = Auth0UserLoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        profile = getattr(user, "profile", None)

        if not profile:
            return Response(
                {"detail": "El usuario no tiene perfil asociado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if profile.state.name.lower() == "pendiente":
            return Response(
                {
                    "message": "Usuario creado correctamente, pero pendiente de habilitación.",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )

        if profile.state.name.lower() != "habilitado":
            return Response(
                {
                    "message": f"El perfil está '{profile.state.name}'. Acceso restringido.",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        payload = {
            "user_id": user.id,
            "email": user.email,
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        response = Response(
            {
                "message": "Inicio de sesión exitoso.",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            samesite="None",
            secure=False,
            max_age=3600,
        )

        return response
