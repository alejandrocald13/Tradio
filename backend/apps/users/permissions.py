# users/permissions.py
from rest_framework.permissions import BasePermission

class IsUser(BasePermission):
    """Usuario autenticado."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

class IsAdmin(BasePermission):
    """Admin: is_staff o superuser."""
    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and (u.is_staff or u.is_superuser))

class IsOwner(BasePermission):
    """
    Es dueño del recurso:
    - Si el objeto es User, el dueño es el mismo objeto.
    - Si el objeto tiene atributo .user (ej. Profile), usamos eso.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        owner = getattr(obj, "user", None) or obj
        return owner == user

class IsOwnerOrAdmin(BasePermission):
    """Owner o Admin."""
    def has_object_permission(self, request, view, obj):
        return IsOwner().has_object_permission(request, view, obj) or IsAdmin().has_permission(request, view)
