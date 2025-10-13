from rest_framework.views import APIView
from apps.users.permissions import IsUser
from rest_framework.response import Response
from rest_framework import status


# models
from apps.users.models import Profile

# swagger
from drf_spectacular.utils import extend_schema, OpenApiResponse

# serializers
from apps.users.serializers import UserDetailSerializer
from apps.users.serializers import UserNameSerializer

# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action

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