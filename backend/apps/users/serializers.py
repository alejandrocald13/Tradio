# users/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from apps.users.models import Profile, ProfileState
from apps.users.utils import assign_unique_referral_code

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["username", "email", "password", "name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        name = validated_data.pop("name")
        user = User.objects.create_user(**validated_data)
        profile = Profile.objects.create(user=user, name=name)
        assign_unique_referral_code(profile, length=6)
        return user

class ProfileStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileState
        fields = ["id", "name", "description"]

class ProfileSerializer(serializers.ModelSerializer):
    # Lectura: estado anidado
    state = ProfileStateSerializer(read_only=True)
    # Escritura: permitir enviar state por id (opcional)
    state_id = serializers.PrimaryKeyRelatedField(
        queryset=ProfileState.objects.all(),
        source="state",
        write_only=True,
        required=False,
    )

    class Meta:
        model = Profile
        fields = ["id", "name", "referral_code", "deleted_at", "state", "state_id"]
        read_only_fields = ["deleted_at"]

class UserListSerializer(serializers.ModelSerializer):
    """
    Para listados (admin). Incluye perfil en solo lectura.
    """
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "is_active",
            "is_staff",
            "date_joined",
            "profile",
        ]


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Para detalle / edición (owner o admin).
    Permite actualizar campos del perfil anidado.
    """
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ["id", "username", "email", "is_active", "profile"]
        read_only_fields = ["id", "is_active"]  # is_active se cambia por endpoints enable/disable

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)

        user = super().update(instance, validated_data)

        # Actualizar perfil anidado si lo enviaron
        if profile_data:
            prof = getattr(user, "profile", None)
            if prof:
                # Soporta name, referral_code, state (via state_id), etc.
                for attr, value in profile_data.items():
                    setattr(prof, attr, value)
                prof.save()

        return user