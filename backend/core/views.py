from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Profile, Herb, Medicine, Condition, Therapy, Appointment, Consultation, Prescription, Feedback
from .serializers import (RegisterSerializer, UserSerializer, ProfileSerializer, HerbSerializer, MedicineSerializer,
                          ConditionSerializer, TherapySerializer, AppointmentSerializer, ConsultationSerializer,
                          PrescriptionSerializer, FeedbackSerializer)
from .permissions import role

@api_view(["GET"])
@permission_classes([AllowAny])
def health(request): return Response({"status":"ok","service":"AyurVedaCare API"})

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    s = RegisterSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    user = s.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token":token.key,"user":UserSerializer(user).data,"message":"Registration successful. Doctor accounts need admin verification."}, status=201)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username","")
    password = request.data.get("password","")
    user = authenticate(username=username, password=password)
    if not user:
        # permit email login
        found = User.objects.filter(email__iexact=username).first()
        if found: user = authenticate(username=found.username, password=password)
    if not user: return Response({"detail":"Invalid username/email or password."}, status=400)
    if not hasattr(user,"profile") and user.is_staff:
        Profile.objects.get_or_create(user=user, defaults={"role":"admin","verified":True})
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token":token.key,"user":UserSerializer(user).data})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    if not hasattr(request.user,"profile"):
        Profile.objects.get_or_create(user=request.user, defaults={"role":"admin" if request.user.is_staff else "patient","verified":True})
    return Response({"user":UserSerializer(request.user).data,"profile":ProfileSerializer(request.user.profile).data})

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        if not hasattr(self.request.user,"profile"):
            Profile.objects.get_or_create(user=self.request.user, defaults={"role":"admin" if self.request.user.is_staff else "patient","verified":True})
        return self.request.user.profile

class KnowledgeViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    search_fields = ["name","description"]
    def get_queryset(self):
        qs = self.model.objects.all().order_by("name")
        q = self.request.query_params.get("search")
        if q:
            query = Q()
            for field in self.search_fields: query |= Q(**{f"{field}__icontains":q})
            qs = qs.filter(query)
        return qs
    def get_permissions(self):
        if self.request.method not in ("GET","HEAD","OPTIONS"):
            return [IsAuthenticated()]
        return [AllowAny()]
    def perform_create(self, serializer):
        if not (self.request.user.is_staff or role(self.request.user)=="admin"):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only administrators can add knowledge records.")
        serializer.save()
    def perform_update(self, serializer):
        if not (self.request.user.is_staff or role(self.request.user)=="admin"):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only administrators can edit knowledge records.")
        serializer.save()
    def perform_destroy(self, instance):
        if not (self.request.user.is_staff or role(self.request.user)=="admin"):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only administrators can delete knowledge records.")
        instance.delete()

class HerbViewSet(KnowledgeViewSet): queryset=Herb.objects.all(); serializer_class=HerbSerializer; model=Herb; search_fields=["name","botanical_name","traditional_uses","description"]
class MedicineViewSet(KnowledgeViewSet): queryset=Medicine.objects.all(); serializer_class=MedicineSerializer; model=Medicine; search_fields=["name","ingredients","description","traditional_purpose"]
class ConditionViewSet(KnowledgeViewSet): queryset=Condition.objects.all(); serializer_class=ConditionSerializer; model=Condition; search_fields=["name","description","ayurvedic_concepts"]
class TherapyViewSet(KnowledgeViewSet): queryset=Therapy.objects.all(); serializer_class=TherapySerializer; model=Therapy; search_fields=["name","description"]

@api_view(["GET"])
@permission_classes([AllowAny])
def doctors(request):
    qs = Profile.objects.filter(role="doctor", verified=True).select_related("user")
    q = request.query_params.get("search","")
    specialization = request.query_params.get("specialization","")
    location = request.query_params.get("location","")
    if q: qs=qs.filter(Q(user__first_name__icontains=q)|Q(user__last_name__icontains=q)|Q(specialization__icontains=q)|Q(clinic__icontains=q))
    if specialization: qs=qs.filter(specialization__icontains=specialization)
    if location: qs=qs.filter(Q(address__icontains=location)|Q(clinic__icontains=location))
    data=[]
    for p in qs:
        data.append({"id":p.user.id,"name":p.user.get_full_name(),"email":p.user.email,"specialization":p.specialization,
                     "qualification":p.qualification,"experience_years":p.experience_years,"clinic":p.clinic,"address":p.address,
                     "consultation_fee":str(p.consultation_fee),"availability":p.availability})
    return Response(data)

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class=AppointmentSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        u=self.request.user
        if u.is_staff or role(u)=="admin": qs=Appointment.objects.all()
        elif role(u)=="doctor": qs=Appointment.objects.filter(doctor=u)
        else: qs=Appointment.objects.filter(patient=u)
        return qs.select_related("patient","doctor","doctor__profile").order_by("-date","-time")
    def perform_update(self, serializer):
        instance=self.get_object()
        if role(self.request.user)=="doctor" and instance.doctor_id != self.request.user.id: 
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied()
        if role(self.request.user)=="patient" and instance.patient_id != self.request.user.id:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied()
        serializer.save()
    def create(self, request, *args, **kwargs):
        if role(request.user)!="patient":
            return Response({"detail":"Only patients can book appointments."},status=403)
        return super().create(request,*args,**kwargs)
    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        obj=self.get_object()
        if request.user.id not in (obj.patient_id,obj.doctor_id) and not request.user.is_staff and role(request.user)!="admin":
            return Response({"detail":"Not allowed."},status=403)
        obj.status="cancelled"; obj.save()
        return Response({"status":"cancelled"})

class ConsultationViewSet(viewsets.ModelViewSet):
    serializer_class=ConsultationSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        u=self.request.user
        qs=Consultation.objects.select_related("appointment","appointment__patient","appointment__doctor").prefetch_related("prescriptions")
        if u.is_staff or role(u)=="admin": return qs
        if role(u)=="doctor": return qs.filter(appointment__doctor=u)
        return qs.filter(appointment__patient=u)
    def create(self, request, *args, **kwargs):
        if role(request.user)!="doctor": return Response({"detail":"Only doctors can create consultation records."},status=403)
        appt=Appointment.objects.filter(pk=request.data.get("appointment"),doctor=request.user,status__in=["confirmed","completed"]).first()
        if not appt: return Response({"detail":"Appointment not found or not assigned to you."},status=400)
        instance=Consultation.objects.filter(appointment=appt).first()
        if instance:
            serializer=self.get_serializer(instance,data=request.data,partial=True); serializer.is_valid(raise_exception=True); serializer.save()
        else:
            serializer=self.get_serializer(data=request.data); serializer.is_valid(raise_exception=True); serializer.save(appointment=appt)
        appt.status="completed"; appt.save()
        return Response(self.get_serializer(serializer.instance).data,status=200 if instance else 201)
    def perform_update(self, serializer):
        if role(self.request.user)!="doctor" and not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only the treating doctor can update a consultation.")
        serializer.save()

class PrescriptionViewSet(viewsets.ModelViewSet):
    serializer_class=PrescriptionSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        qs=Prescription.objects.select_related("consultation__appointment")
        u=self.request.user
        if u.is_staff or role(u)=="admin": return qs
        if role(u)=="doctor": return qs.filter(consultation__appointment__doctor=u)
        return qs.filter(consultation__appointment__patient=u)
    def create(self,request,*args,**kwargs):
        if role(request.user)!="doctor": return Response({"detail":"Only doctors can issue prescriptions."},status=403)
        consultation=Consultation.objects.filter(pk=request.data.get("consultation"),appointment__doctor=request.user).first()
        if not consultation: return Response({"detail":"Consultation not found or not yours."},status=400)
        medicine_id=request.data.get("medicine")
        if medicine_id:
            med=Medicine.objects.filter(pk=medicine_id).first()
            if med and med.doctor_only is False:
                # educational entries can still be prescribed, but prescription is always clinician-authored
                pass
        return super().create(request,*args,**kwargs)

class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class=FeedbackSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        u=self.request.user
        if u.is_staff or role(u)=="admin": return Feedback.objects.all()
        if role(u)=="doctor": return Feedback.objects.filter(doctor=u)
        return Feedback.objects.filter(patient=u)
    def create(self,request,*args,**kwargs):
        if role(request.user)!="patient": return Response({"detail":"Only patients can submit feedback."},status=403)
        appt=Appointment.objects.filter(patient=request.user,doctor_id=request.data.get("doctor"),status="completed").exists()
        if not appt: return Response({"detail":"Feedback is available after a completed consultation."},status=400)
        serializer=self.get_serializer(data=request.data); serializer.is_valid(raise_exception=True); serializer.save(patient=request.user)
        return Response(serializer.data,status=201)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    u=request.user; r=role(u)
    if u.is_staff or r=="admin":
        return Response({"role":"admin","patients":Profile.objects.filter(role="patient").count(),
          "doctors":Profile.objects.filter(role="doctor").count(),"verified_doctors":Profile.objects.filter(role="doctor",verified=True).count(),
          "appointments":Appointment.objects.count(),"today_appointments":Appointment.objects.filter(date=__import__("datetime").date.today()).count(),
          "pending_appointments":Appointment.objects.filter(status="pending").count(),"completed_consultations":Consultation.objects.count(),
          "medicines":Medicine.objects.count(),"herbs":Herb.objects.count(),"feedback":Feedback.objects.count()})
    if r=="doctor":
        return Response({"role":"doctor","appointments":Appointment.objects.filter(doctor=u).count(),
          "today_appointments":Appointment.objects.filter(doctor=u,date=__import__("datetime").date.today()).count(),
          "completed_consultations":Consultation.objects.filter(appointment__doctor=u).count(),
          "pending_appointments":Appointment.objects.filter(doctor=u,status="confirmed").count()})
    return Response({"role":"patient","appointments":Appointment.objects.filter(patient=u).count(),
      "upcoming_appointments":Appointment.objects.filter(patient=u,status__in=["pending","confirmed"],date__gte=__import__("datetime").date.today()).count(),
      "prescriptions":Prescription.objects.filter(consultation__appointment__patient=u).count(),
      "consultations":Consultation.objects.filter(appointment__patient=u).count()})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_doctor(request, user_id):
    if not (request.user.is_staff or role(request.user)=="admin"): return Response({"detail":"Admin only."},status=403)
    p=Profile.objects.filter(user_id=user_id,role="doctor").first()
    if not p: return Response({"detail":"Doctor not found."},status=404)
    p.verified=bool(request.data.get("verified",True)); p.save()
    return Response({"user_id":user_id,"verified":p.verified})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_users(request):
    if not (request.user.is_staff or role(request.user)=="admin"): return Response({"detail":"Admin only."},status=403)
    return Response([{"id":p.user_id,"name":p.user.get_full_name(),"email":p.user.email,"role":p.role,
        "verified":p.verified,"specialization":p.specialization} for p in Profile.objects.select_related("user").all().order_by("role")])
