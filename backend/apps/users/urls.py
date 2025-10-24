from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.users.views import (
    RegisterView, LogoutView, MeView, UserViewSet, UserViewGetName, DeleteSuperUser, SuperUserView, SearchSuperUserView, SearchUserView, Auth0LoginView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    # users endpoints
    path("auth/login/", Auth0LoginView.as_view(), name="auth0-login"),

    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/logout/",   LogoutView.as_view(),   name="auth-logout"),
    path("auth/me",       MeView.as_view(),       name="auth-me"),
    
    path("users/getname", UserViewGetName.as_view(), name="get-user-name"),
    path("users/search", SearchUserView.as_view(), name="search-user-name"),


    # superusers endpoints
    path("superusers/", SuperUserView.as_view(), name="get-super-users"),

    path("superusers/<int:id>/delete", DeleteSuperUser.as_view(), name="disable-super-users"),

    path("superusers/search", SearchSuperUserView.as_view(), name="search-super-users-name")
]
urlpatterns += router.urls
