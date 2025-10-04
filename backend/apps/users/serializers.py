# users/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

from django.contrib.auth import get_user_model
from django.utils.text import slugify
from rest_framework import serializers
from apps.users.models import Profile, ProfileState
from apps.users.utils import assign_unique_referral_code
from django.utils.timezone import localtime

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    age = serializers.IntegerField(write_only=True)
    address = serializers.CharField(write_only=True)
    cellphone = serializers.CharField(write_only=True)
    dpi = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "name", "age", "address", "cellphone", "dpi"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_dpi(self, value):
        """Evita registrar un perfil con un DPI duplicado."""
        if Profile.objects.filter(dpi=value).exists():
        
            raise serializers.ValidationError("Ya existe un usuario con este DPI.")
        
        return value


    def create(self, validated_data):
        name = validated_data.pop("name")
        age = validated_data.pop("age")
        address = validated_data.pop("address")
        cellphone = validated_data.pop("cellphone")
        dpi = validated_data.pop("dpi")

        base_username = slugify(name.replace(" ", "")) or "user"
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            **validated_data,
        )

        profile = Profile.objects.create(
            user=user,
            name=name,
            age=age,
            address=address,
            cellphone=cellphone,
            dpi=dpi,
        )

        assign_unique_referral_code(profile, length=6)

        return user
    
class ProfileStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileState
        fields = ["name"]

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
        fields = ["age", "name", "state", "state_id"]
        read_only_fields = ["deleted_at"]


class UserListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source="profile.name", read_only=True)
    age = serializers.IntegerField(source="profile.age", read_only=True)

    date = serializers.SerializerMethodField()
    enable = serializers.BooleanField(source="is_active", read_only=True)

    class Meta:
        model = User
        fields = ["id","name", "email", "age", "date", "enable"]

    def get_date(self, obj):
        dt = localtime(obj.date_joined)  # usa tu TZ si USE_TZ=True
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

class UserNameSerializer(serializers.ModelSerializer):

    """
    Para obtener el nombre del usuario.
    """
    name = serializers.CharField(read_only=True)

    class Meta:
        model = Profile
        fields = ["name"]

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(request=self.context.get("request"), email=email, password=password)

            if not user:
                raise serializers.ValidationError("Credenciales inválidas, verifica tu correo y contraseña.")
        else:
            raise serializers.ValidationError("Debes proporcionar correo y contraseña.")

        data = super().validate(attrs)

        return data