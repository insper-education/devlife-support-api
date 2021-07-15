from rest_framework.permissions import IsAdminUser


class IsAdminOrSelf(IsAdminUser):
    """
    Allow access to admin users or the users themselves.
    """
    def has_object_permission(self, request, view, obj):
        if request.user:
            if request.user.is_staff:
                return True
            elif type(obj) == type(request.user) and obj == request.user:
                return True
        return False
