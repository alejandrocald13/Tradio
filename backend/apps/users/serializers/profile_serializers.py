from rest_framework import serializers
from apps.users.models import Profile, ProfileState

class ProfileStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileState
        fields = ["name"]


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ["name", "birth_date", "address", "cellphone", "dpi", "profile_completed"]
        read_only_fields = ["deleted_at"]

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.profile_completed = True

        instance.save()
        return instance


class UserNameSerializer(serializers.ModelSerializer):
    """
    Para obtener el nombre del usuario.
    """
    name = serializers.CharField(read_only=True)

    class Meta:
        model = Profile
        fields = ["name"]