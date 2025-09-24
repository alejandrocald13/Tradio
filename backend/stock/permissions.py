from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    - GET, HEAD, OPTIONS --> cualquier usuario (autenticado o no).
    - POST, PUT, PATCH, DELETE --> solo admin (is_staff).
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return request.user.is_authenticated and request.user.is_staff
    