from django.urls import path
from rest_framework.routers import DefaultRouter
from apps.users.views import (
    RegisterView, LogoutView, MeView, UserViewSet, UserViewGetName, DeleteSuperUser, SuperUserView, SearchSuperUserView, SearchUserView, Auth0LoginView
)
user_list = UserViewSet.as_view({
    'get': 'list',
})

user_enable = UserViewSet.as_view({
    'post': 'enable',
})

user_disable = UserViewSet.as_view({
    'post': 'disable',
})

urlpatterns = [
    # users endpoints
    path("auth/login/", Auth0LoginView.as_view(), name="auth0-login"),

    # path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/logout/",   LogoutView.as_view(),   name="auth-logout"),
    
    # users endpoints
    path("users/me",       MeView.as_view(),       name="auth-me"),
    path("users/getname", UserViewGetName.as_view(), name="get-user-name"),
    path("users/search", SearchUserView.as_view(), name="search-user-name"),

    path("users/", user_list, name="user-list"),
    path("users/<int:pk>/enable/", user_enable, name="user-enable"),
    path("users/<int:pk>/disable/", user_disable, name="user-disable"),

    # superusers endpoints
    # path("superusers/", SuperUserView.as_view(), name="get-super-users"),

    # path("superusers/<int:id>/delete", DeleteSuperUser.as_view(), name="disable-super-users"),

    # path("superusers/search", SearchSuperUserView.as_view(), name="search-super-users-name")
]