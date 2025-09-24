from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.users.views import (
    RegisterView, LogoutView, LoggedTokenObtainPairView, LoggedTokenRefreshView,
    MeView, UserViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/logout",   LogoutView.as_view(),   name="auth-logout"),

    path("auth/me",       MeView.as_view(),       name="auth-me"),
    
    path("token/",         LoggedTokenObtainPairView.as_view(),   name="token_obtain_pair"),
    path("token/refresh/", LoggedTokenRefreshView.as_view(),      name="token_refresh"),
]
urlpatterns += router.urls
