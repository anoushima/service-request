from django.urls import path
from .views import (
    MyTokenObtainPairView,
    ServiceRequestCreateView,
    ServiceRequestListView,
    AgentServiceRequestListView,
    AgentServiceRequestUpdateView,
    AdminServiceRequestListView,
    AdminServiceRequestUpdateView,
    AgentListView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Auth
    path("login/",         MyTokenObtainPairView.as_view(),  name="login"),
    path("token/refresh/", TokenRefreshView.as_view(),        name="refresh"),

    # Customer
    path("requests/",        ServiceRequestListView.as_view(),   name="request-list"),
    path("requests/create/", ServiceRequestCreateView.as_view(), name="request-create"),

    # Agent
    path("agent/requests/",          AgentServiceRequestListView.as_view(),   name="agent-request-list"),
    path("agent/requests/<int:pk>/", AgentServiceRequestUpdateView.as_view(), name="agent-request-update"),

    # Admin
    path("admin/requests/",          AdminServiceRequestListView.as_view(),   name="admin-request-list"),
    path("admin/requests/<int:pk>/", AdminServiceRequestUpdateView.as_view(), name="admin-request-update"),
    path("admin/agents/",            AgentListView.as_view(),                 name="admin-agent-list"),
]