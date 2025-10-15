from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


# serializers
from apps.users.serializers import RegisterSerializer

# swagger
from drf_spectacular.utils import extend_schema, OpenApiResponse, extend_schema_view

# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action

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
