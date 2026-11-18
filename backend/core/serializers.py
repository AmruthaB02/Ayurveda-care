from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Herb, Medicine, Condition, Therapy, Appointment, Consultation, Prescription, Feedback

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="profile.role", read_only=True)
    class Meta:
        model = User
        fields = ["id","username","first_name","last_name","email","role"]

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=["patient","doctor"])
    phone = serializers.CharField(required=False, allow_blank=True)
    qualification = serializers.CharField(required=False, allow_blank=True)
    license_number = serializers.CharField(required=False, allow_blank=True)
    specialization = serializers.CharField(required=False, allow_blank=True)
    experience_years = serializers.IntegerField(required=False, min_value=0, default=0)
    clinic = serializers.CharField(required=False, allow_blank=True)
    consultation_fee = serializers.DecimalField(required=False, max_digits=8, decimal_places=2, default=0)
    def validate_username(self, value):
        if User.objects.filter(username=value).exists(): raise serializers.ValidationError("Username already exists.")
        return value
    def validate_email(self, value):
        if User.objects.filter(email=value).exists(): raise serializers.ValidationError("Email already exists.")
        return value
    def create(self, validated_data):
        role = validated_data.pop("role")
        name = validated_data.pop("name")
        parts = name.split(" ", 1)
        password = validated_data.pop("password")
        user = User.objects.create_user(
            username=validated_data.pop("username"), email=validated_data.pop("email"),
            password=password, first_name=parts[0], last_name=parts[1] if len(parts)>1 else ""
        )
        Profile.objects.create(user=user, role=role, verified=(role=="patient"), **validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source="user.get_full_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    class Meta:
        model = Profile
        fields = ["user_id","name","email","role","phone","address","date_of_birth","gender","allergies",
                  "qualification","license_number","specialization","experience_years","clinic","consultation_fee","verified","availability"]
        read_only_fields = ["role","verified"]

class HerbSerializer(serializers.ModelSerializer):
    class Meta: model = Herb; fields = "__all__"
class MedicineSerializer(serializers.ModelSerializer):
    class Meta: model = Medicine; fields = "__all__"
class ConditionSerializer(serializers.ModelSerializer):
    class Meta: model = Condition; fields = "__all__"
class TherapySerializer(serializers.ModelSerializer):
    class Meta: model = Therapy; fields = "__all__"

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.get_full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.get_full_name", read_only=True)
    doctor_specialization = serializers.CharField(source="doctor.profile.specialization", read_only=True)
    appointment_id = serializers.SerializerMethodField()
    class Meta:
        model = Appointment
        fields = ["id","appointment_id","patient","patient_name","doctor","doctor_name","doctor_specialization","date","time","appointment_type","status","created_at"]
        read_only_fields = ["patient","status"]
    def get_appointment_id(self, obj): return f"APT-{obj.pk:05d}"
    def validate(self, attrs):
        request = self.context["request"]
        doctor = attrs.get("doctor")
        if not doctor or not hasattr(doctor, "profile") or doctor.profile.role != "doctor" or not doctor.profile.verified:
            raise serializers.ValidationError("Choose a verified doctor.")
        if attrs.get("date") and attrs.get("date").isoformat() < __import__("datetime").date.today().isoformat():
            raise serializers.ValidationError("Appointment date cannot be in the past.")
        if Appointment.objects.filter(doctor=doctor, date=attrs.get("date"), time=attrs.get("time")).exclude(status="cancelled").exists():
            raise serializers.ValidationError("This time slot is already booked. Choose another slot.")
        return attrs
    def create(self, validated_data):
        validated_data["patient"] = self.context["request"].user
        return super().create(validated_data)

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta: model = Prescription; fields = "__all__"
class ConsultationSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    appointment_id = serializers.CharField(source="appointment.id", read_only=True)
    patient_name = serializers.CharField(source="appointment.patient.get_full_name", read_only=True)
    doctor_name = serializers.CharField(source="appointment.doctor.get_full_name", read_only=True)
    class Meta:
        model = Consultation
        fields = ["id","appointment","appointment_id","patient_name","doctor_name","chief_complaints","history","clinical_assessment",
                  "ayurvedic_assessment","diagnosis","treatment_plan","diet","lifestyle","therapy","duration","follow_up_date","created_at","prescriptions"]
        read_only_fields = ["appointment"]
class FeedbackSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.get_full_name", read_only=True)
    class Meta: model = Feedback; fields = ["id","patient","patient_name","doctor","rating","comments","created_at"]; read_only_fields = ["patient"]
    def validate_rating(self, v):
        if not 1 <= v <= 5: raise serializers.ValidationError("Rating must be between 1 and 5.")
        return v
