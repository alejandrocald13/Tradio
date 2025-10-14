from rest_framework import serializers
from apps.users.models import Profile, ProfileState

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
        fields = ["birth_date", "name", "state", "state_id"]
        read_only_fields = ["deleted_at"]


class UserNameSerializer(serializers.ModelSerializer):

    """
    Para obtener el nombre del usuario.
    """
    name = serializers.CharField(read_only=True)

    class Meta:
        model = Profile
        fields = ["name"]

