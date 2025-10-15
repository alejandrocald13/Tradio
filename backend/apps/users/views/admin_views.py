from rest_framework import status
from rest_framework.views import APIView
from apps.users.permissions import IsAdmin
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse
from apps.users.models import Profile, ProfileState

# serializers
from apps.users.serializers import CreateSuperUserSerializer, SuperUserListSerializer

User = get_user_model()

class DeleteSuperUser(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, id):
        if request.user.id == id:
            return Response(
                {"detail": "No puedes eliminar tu propia cuenta."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        user.is_staff = False
        user.is_superuser = False
        user.is_active = False
        user.save(update_fields=["is_staff", "is_superuser", "is_active"])

        try:
            inactive_state = ProfileState.objects.get(name__iexact="inactive")
        except ProfileState.DoesNotExist:
            inactive_state = ProfileState.objects.create(
                name="inactive", description="Cuenta deshabilitada o eliminada"
            )

        profile = user.profile
        profile.state = inactive_state
        profile.soft_delete()
        profile.save(update_fields=["state", "deleted_at"])

        return Response(
            {"detail": f"Superusuario '{user.username}' eliminado correctamente."},
            status=status.HTTP_200_OK
        )
        
class SuperUserView(APIView):
    permission_classes = [IsAdmin]

    @extend_schema(
        request=CreateSuperUserSerializer,
        responses={
            201: OpenApiResponse(description="Superuser created successfully"),
            400: OpenApiResponse(description="Invalid data")
        },
        summary="Create a Superuser (Admin only)"
    )
    def post(self, request):
        serializer = CreateSuperUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            try:
                active_state = ProfileState.objects.get(name__iexact="active")
            except ProfileState.DoesNotExist:
                active_state = ProfileState.objects.create(
                    name="active", description="Estado asignado a usuarios habilitados"
                )

            user.profile.state = active_state
            user.profile.save(update_fields=["state"])

            return Response(
                {"detail": "Superusuario creado correctamente y activado.",
                "user": user},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @extend_schema(
        request=SuperUserListSerializer,
        responses={
            200: OpenApiResponse(description="Superusers displayed correctly"),
        },
        summary="Show a Superusers (Admin only)"
    )    
    def get(self, request):
        users = User.objects.filter(is_superuser=True)
        serializer = SuperUserListSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SearchSuperUserView(APIView):
    permission_classes = [IsAdmin]
    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=SuperUserListSerializer(many=True),
                description="List of superusers that match the given profile name.",
            ),
            400: OpenApiResponse(description="Missing or invalid 'name' field."),
            404: OpenApiResponse(description="No superusers found with that profile name."),
        },
        summary="Search Superusers by Profile Name (Admin only)",
    )

    def post(self, request):
        name = request.data.get("name")

        if not name:
            return Response(
                {"detail": "Missing or invalid 'name' field."},
                status=status.HTTP_400_BAD_REQUEST
            )

        profiles = Profile.objects.filter(
            name__icontains=name,
            user__is_superuser=True
        ).select_related("user")

        if not profiles.exists():
            return Response(
                {"detail": "No superusers found with that profile name."},
                status=status.HTTP_404_NOT_FOUND
            )

        users = [p.user for p in profiles]
        serializer = SuperUserListSerializer(users, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class SearchUserView(APIView):
    permission_classes = [IsAdmin]
    
    @extend_schema(
        responses={
            200: OpenApiResponse(
                response=SuperUserListSerializer(many=True),
                description="List of users that match the given profile name.",
            ),
            400: OpenApiResponse(description="Missing or invalid 'name' field."),
            404: OpenApiResponse(description="No users found with that profile name."),
        },
        summary="Search Users by Profile Name (Admin only)",
    )

    def post(self, request):
        name = request.data.get("name")

        if not name:
            return Response(
                {"detail": "Missing or invalid 'name' field."},
                status=status.HTTP_400_BAD_REQUEST
            )

        profiles = Profile.objects.filter(
            name__icontains=name,
            user__is_superuser=False
        ).select_related("user")

        if not profiles.exists():
            return Response(
                {"detail": "No users found with that profile name."},
                status=status.HTTP_404_NOT_FOUND
            )

        users = [p.user for p in profiles]
        serializer = SuperUserListSerializer(users, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)