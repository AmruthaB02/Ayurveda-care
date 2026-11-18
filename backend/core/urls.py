from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
router=DefaultRouter()
router.register("herbs",views.HerbViewSet,basename="herb")
router.register("medicines",views.MedicineViewSet,basename="medicine")
router.register("conditions",views.ConditionViewSet,basename="condition")
router.register("therapies",views.TherapyViewSet,basename="therapy")
router.register("appointments",views.AppointmentViewSet,basename="appointment")
router.register("consultations",views.ConsultationViewSet,basename="consultation")
router.register("prescriptions",views.PrescriptionViewSet,basename="prescription")
router.register("feedback",views.FeedbackViewSet,basename="feedback")
urlpatterns=[
 path("",views.health),path("auth/register/",views.register),path("auth/login/",views.login),
 path("auth/me/",views.me),path("profile/",views.ProfileView.as_view()),path("doctors/",views.doctors),
 path("dashboard/",views.dashboard),path("admin/users/",views.admin_users),
 path("admin/doctors/<int:user_id>/verify/",views.verify_doctor),path("",include(router.urls))
]
