from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # custom claims
        token["username"] = user.username
        token["role"] = user.role 

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data["username"] = self.user.username
        data["role"] = self.user.role

        return data