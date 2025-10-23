from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


# swagger
from drf_spectacular.utils import extend_schema, OpenApiResponse

# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action

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