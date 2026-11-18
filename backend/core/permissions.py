from rest_framework.permissions import BasePermission
def role(user):
    return getattr(getattr(user, "profile", None), "role", "")
class IsRole(BasePermission):
    allowed = ()
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or role(request.user) in self.allowed))
class IsDoctor(IsRole): allowed = ("doctor",)
class IsPatient(IsRole): allowed = ("patient",)
class IsAdmin(IsRole): allowed = ("admin",)
