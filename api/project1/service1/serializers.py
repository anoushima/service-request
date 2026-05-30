from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import ServiceRequest, User


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["role"] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["username"] = self.user.username
        data["role"] = self.user.role
        return data


class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ServiceRequestSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(source='customer.username', read_only=True)
    assigned_agent_username = serializers.CharField(
        source='assigned_agent.username', read_only=True, default=None
    )

    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'title', 'description', 'priority', 'status',
            'customer_username', 'assigned_agent', 'assigned_agent_username',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']