# users/utils_perms.py
from rest_framework.exceptions import PermissionDenied

def assert_owner_or_admin(request, obj):
    u = request.user
    if not u or not u.is_authenticated:
        raise PermissionDenied("Authentication Failed")
    owner = getattr(obj, "user", None) or obj
    if u == owner or u.is_staff or u.is_superuser:
        return
    raise PermissionDenied("You dont have access to this recurse.")