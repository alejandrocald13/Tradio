from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.timezone import localtime, now
from apps.users.serializers.profile_serializers import ProfileSerializer

User = get_user_model()

class UserListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source="profile.name", read_only=True)

    age = serializers.SerializerMethodField(read_only=True)
    date = serializers.SerializerMethodField()
    
    enable = serializers.BooleanField(source="is_active", read_only=True)

    class Meta:
        model = User
        fields = ["id","name", "email", "age", "date", "enable"]

    def get_date(self, obj):
        dt = localtime(obj.date_joined)
        return dt.strftime("%d-%m-%Y")
    
    def get_age(self, obj):
        birth_date = getattr(obj.profile, "birth_date", None)
        if not birth_date:
            return None

        today = now().date()
        age = today.year - birth_date.year - (
            (today.month, today.day) < (birth_date.month, birth_date.day)
        )
        return age
    
class UserDetailSerializer(serializers.ModelSerializer):
    """
    Para detalle / edición (owner o admin).
    Permite actualizar campos del perfil anidado.
    """

    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ["id", "is_active", "is_superuser", "profile"]
        read_only_fields = ["id", "is_active", "is_superuser", "email"]

    def validate(self, attrs):
        if "email" in attrs:
            raise serializers.ValidationError({"email": "No está permitido modificar el email."})
        if "username" in attrs:
            raise serializers.ValidationError({"username": "No está permitido modificar el username."})
        return attrs
    

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)

        user = super().update(instance, validated_data)

        if profile_data:
            prof = getattr(user, "profile", None)
            if prof:
                ProfileSerializer().update(prof, profile_data)
        
        return user