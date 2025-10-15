from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.users.models import Profile
from datetime import date
from django.utils.text import slugify
from apps.users.utils import assign_unique_referral_code


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    birth_date = serializers.DateField(write_only=True)
    address = serializers.CharField(write_only=True)
    cellphone = serializers.CharField(write_only=True)
    dpi = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "name", "birth_date", "address", "cellphone", "dpi"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_dpi(self, value):
        """Evita registrar un perfil con un DPI duplicado."""
        if Profile.objects.filter(dpi=value).exists():
        
            raise serializers.ValidationError("Ya existe un usuario con este DPI.")
        
        return value

    def validate_email(self, value):
        
        if User.objects.filter(email__iexact=value).exists():
        
            raise serializers.ValidationError("Ya existe un usuario con este correo electrónico.")
        
        return value
    
    def validate_birth_date(self, value):
        """Evita registrar menores de edad"""
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        
        if age < 18:
            raise serializers.ValidationError("Menores de edad no están permitidos para registrarse.")
        
        return value

    def create(self, validated_data):
        name = validated_data.pop("name")
        birth_date = validated_data.pop("birth_date")
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
            birth_date=birth_date,
            address=address,
            cellphone=cellphone,
            dpi=dpi,
        )

        assign_unique_referral_code(profile, length=6)

        return user