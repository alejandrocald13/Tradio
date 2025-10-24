from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

import requests
from django.conf import settings

# swagger
from drf_spectacular.utils import extend_schema, OpenApiResponse

# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

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


            response = Response({"detail": "Sesión cerrada correctamente."}, status=status.HTTP_200_OK)
            
            response.delete_cookie("access_token")
            self.revoke_auth0_token(token_str)

            log_action(request, request.user, Action.AUTH_LOGOUT)
            
            return response

        except Exception as e:
            return Response({"detail": f"Error al cerrar sesión: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)