from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.timezone import localtime
from apps.users.serializers.profile_serializers import ProfileSerializer

User = get_user_model()

class UserListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source="profile.name", read_only=True)
    birth_date = serializers.DateField(source="profile.birth_date", read_only=True)

    date = serializers.SerializerMethodField()
    enable = serializers.BooleanField(source="is_active", read_only=True)

    class Meta:
        model = User
        fields = ["id","name", "email", "birth_date", "date", "enable"]

    def get_date(self, obj):
        dt = localtime(obj.date_joined)
        return dt.strftime("%d-%m-%Y %H:%M:%S")


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
