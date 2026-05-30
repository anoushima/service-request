from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, permissions
from .serializers import MyTokenObtainPairSerializer, ServiceRequestSerializer, AgentSerializer
from .models import ServiceRequest, User
from .permissions import IsAdminUser, IsAgentUser


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ── Customer ──────────────────────────────────────────────────────────────────

class ServiceRequestCreateView(generics.CreateAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class ServiceRequestListView(generics.ListAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ServiceRequest.objects.filter(customer=self.request.user).order_by('-created_at')


# ── Agent ─────────────────────────────────────────────────────────────────────

class AgentServiceRequestListView(generics.ListAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAgentUser]

    def get_queryset(self):
        return ServiceRequest.objects.filter(assigned_agent=self.request.user).order_by('-created_at')


class AgentServiceRequestUpdateView(generics.UpdateAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAgentUser]

    def get_queryset(self):
        return ServiceRequest.objects.filter(assigned_agent=self.request.user)

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)


# ── Admin ─────────────────────────────────────────────────────────────────────

class AdminServiceRequestListView(generics.ListAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAdminUser]
    queryset = ServiceRequest.objects.all().order_by('-created_at')


class AdminServiceRequestUpdateView(generics.UpdateAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAdminUser]
    queryset = ServiceRequest.objects.all()

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)


class AgentListView(generics.ListAPIView):
    serializer_class = AgentSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.filter(role='AGENT')