from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.users.views import (
    RegisterView, LogoutView, MeView, UserViewSet, UserViewGetName, DeleteSuperUser, SuperUserView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    # users endpoints
    
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/logout",   LogoutView.as_view(),   name="auth-logout"),

    path("auth/me",       MeView.as_view(),       name="auth-me"),
    path("users/getname", UserViewGetName.as_view(), name="get-user-name"),

    # superusers endpoints
    path("superusers/", SuperUserView.as_view(), name="get-super-users"),

    path("superusers/<int:id>/delete", DeleteSuperUser.as_view(), name="disable-super-users"),

]
urlpatterns += router.urls
