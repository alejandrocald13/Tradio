import jwt
from jwt.algorithms import RSAAlgorithm

from django.contrib.auth.models import User
from rest_framework import serializers
from django.utils.text import slugify
from apps.users.models import Profile, ProfileState
import requests
from django.conf import settings

from apps.users.utils import assign_unique_referral_code

# no-repudio
from apps.users.utils import log_action
from apps.users.actions import Action

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

        try:
            jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
            jwks = requests.get(jwks_url, timeout=5).json()

            unverified_header = jwt.get_unverified_header(token)
            rsa_key = next(
                (
                    RSAAlgorithm.from_jwk(key)
                    for key in jwks["keys"]
                    if key["kid"] == unverified_header["kid"]
                ),
                None,
            )

            if rsa_key is None:
                raise serializers.ValidationError("No se encontró la clave pública de Auth0.")

            payload = jwt.decode(
                token,
                key=rsa_key,
                algorithms=["RS256"],
                issuer=f"https://{settings.AUTH0_DOMAIN}/",
                options={"verify_aud": False},
            )

            attrs["auth0_id"] = payload.get("sub")
            attrs["email"] = payload.get("email")
            attrs["name"] = payload.get("name") or "Usuario"

            if not attrs["auth0_id"]:
                raise serializers.ValidationError("El token no contiene un ID de usuario válido.")

            return attrs

        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError("El token ha expirado.")
        except jwt.InvalidTokenError as e:
            raise serializers.ValidationError(f"Token inválido: {str(e)}")

    def create(self, validated_data):
        request = self.context.get("request")

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

        profile = Profile.objects.create(
            user=user,
            auth0_id=auth0_id,
            name=name,
            dpi="",
            address="",
            cellphone="",
            birth_date=None,
            state=pendiente_state,
        )

        assign_unique_referral_code(profile, length=6)

        if request:
            log_action(request, user, Action.AUTH_REGISTER_REQUESTED)


        return user