from django.contrib.auth.models import User
from rest_framework import serializers
from django.utils.text import slugify
from apps.users.models import Profile, ProfileState
import requests
from django.conf import settings

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "id",
            "auth0_id",
            "name",
            "referral_code",
            "birth_date",
            "address",
            "cellphone",
            "dpi",
            "state",
        ]

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "profile"]

class Auth0UserLoginSerializer(serializers.Serializer):
    """
    Verifica el token de Auth0 (mediante /userinfo).
    Si el usuario no existe -> lo crea con perfil pendiente.
    Si existe -> valida que el perfil esté habilitado.
    """

    auth0_token = serializers.CharField()

    def validate(self, attrs):
        token = attrs.get("auth0_token")

        resp = requests.get(
            f"https://{settings.AUTH0_DOMAIN}/userinfo",
            headers={"Authorization": f"Bearer {token}"}
        )

        if resp.status_code != 200:
            raise serializers.ValidationError("Token de Auth0 inválido o expirado.")

        user_info = resp.json()
        attrs["auth0_id"] = user_info.get("sub")
        attrs["email"] = user_info.get("email")
        attrs["name"] = user_info.get("name") or user_info.get("nickname", "Usuario")

        if not attrs["auth0_id"] or not attrs["email"]:
            raise serializers.ValidationError("Datos incompletos desde Auth0.")

        return attrs

    def create(self, validated_data):
        auth0_id = validated_data["auth0_id"]
        email = validated_data["email"]
        name = validated_data["name"]

        profile = Profile.objects.filter(auth0_id=auth0_id).first()
        if profile:
            return profile.user

        base_username = slugify(name.replace(" ", "")) or "user"
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            is_active=False,
        )

        pendiente_state = ProfileState.objects.get(name="pendiente")

        Profile.objects.create(
            user=user,
            auth0_id=auth0_id,
            name=name,
            dpi="",
            address="",
            cellphone="",
            birth_date=None,
            state=pendiente_state,
        )

        return user
