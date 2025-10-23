import jwt
import requests
from django.conf import settings
from rest_framework import authentication, exceptions

class Auth0JWTAuthentication(authentication.BaseAuthentication):
    """
    Valida el token de Auth0 almacenado en la cookie 'access_token'.
    """

    def authenticate(self, request):
        token = request.COOKIES.get("access_token")
        if not token:
            return None

        try:
            jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
            jwks = requests.get(jwks_url, timeout=5).json()

            unverified_header = jwt.get_unverified_header(token)
            rsa_key = next(
                (
                    {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"],
                    }
                    for key in jwks["keys"]
                    if key["kid"] == unverified_header["kid"]
                ),
                None,
            )

            if not rsa_key:
                raise exceptions.AuthenticationFailed("No se encontró la clave pública de Auth0.")

            payload = jwt.decode(
                token,
                key=jwt.algorithms.RSAAlgorithm.from_jwk(rsa_key),
                algorithms=["RS256"],
                issuer=f"https://{settings.AUTH0_DOMAIN}/",
                options={"verify_aud": False},
            )

            auth0_id = payload.get("sub")
            if not auth0_id:
                raise exceptions.AuthenticationFailed("Token sin Auth0 ID.")

            from apps.users.models import Profile

            profile = Profile.objects.filter(auth0_id=auth0_id).first()
            if not profile:
                raise exceptions.AuthenticationFailed("Usuario no registrado en el sistema.")

            return (profile.user, token)

        except Exception as e:
            raise exceptions.AuthenticationFailed(f"Token inválido o expirado: {e}")