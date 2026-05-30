from django.urls import path
from .views import MyTokenObtainPairView, ServiceRequestCreateView, ServiceRequestListView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("login/",            MyTokenObtainPairView.as_view(),    name="login"),
    path("token/refresh/",    TokenRefreshView.as_view(),          name="refresh"),
    path("requests/",         ServiceRequestListView.as_view(),    name="request-list"),
    path("requests/create/",  ServiceRequestCreateView.as_view(),  name="request-create"),
]