from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = [("patient","Patient"),("doctor","Doctor"),("admin","Admin")]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="patient")
    phone = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=255, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=30, blank=True)
    allergies = models.TextField(blank=True)
    qualification = models.CharField(max_length=150, blank=True)
    license_number = models.CharField(max_length=100, blank=True)
    specialization = models.CharField(max_length=150, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    clinic = models.CharField(max_length=255, blank=True)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    verified = models.BooleanField(default=False)
    availability = models.CharField(max_length=255, default="Mon–Sat, 10:00–17:00")
    def __str__(self): return f"{self.user.username} ({self.role})"

class Herb(models.Model):
    name = models.CharField(max_length=120, unique=True)
    sanskrit_name = models.CharField(max_length=120, blank=True)
    common_name = models.CharField(max_length=120, blank=True)
    botanical_name = models.CharField(max_length=180, blank=True)
    description = models.TextField(blank=True)
    properties = models.TextField(blank=True)
    part_used = models.CharField(max_length=120, blank=True)
    traditional_uses = models.TextField(blank=True)
    preparation = models.TextField(blank=True)
    precautions = models.TextField(blank=True)
    def __str__(self): return self.name

class Medicine(models.Model):
    name = models.CharField(max_length=150, unique=True)
    sanskrit_name = models.CharField(max_length=150, blank=True)
    formulation_type = models.CharField(max_length=100, blank=True)
    ingredients = models.TextField(blank=True)
    description = models.TextField(blank=True)
    traditional_purpose = models.TextField(blank=True)
    dosha_association = models.CharField(max_length=150, blank=True)
    preparation_method = models.TextField(blank=True)
    manufacturer_reference = models.CharField(max_length=180, blank=True)
    precautions = models.TextField(blank=True)
    contraindications = models.TextField(blank=True)
    doctor_only = models.BooleanField(default=False)
    def __str__(self): return self.name

class Condition(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    ayurvedic_concepts = models.TextField(blank=True)
    educational_approach = models.TextField(blank=True)
    def __str__(self): return self.name

class Therapy(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    precautions = models.TextField(blank=True)
    def __str__(self): return self.name

class Appointment(models.Model):
    STATUS = [("pending","Pending"),("confirmed","Confirmed"),("completed","Completed"),("cancelled","Cancelled")]
    TYPE = [("online","Online"),("clinic","Clinic visit")]
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="patient_appointments")
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="doctor_appointments")
    date = models.DateField()
    time = models.TimeField()
    appointment_type = models.CharField(max_length=20, choices=TYPE, default="online")
    status = models.CharField(max_length=20, choices=STATUS, default="confirmed")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"APT-{self.pk or 'new'}"

class Consultation(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name="consultation")
    chief_complaints = models.TextField(blank=True)
    history = models.TextField(blank=True)
    clinical_assessment = models.TextField(blank=True)
    ayurvedic_assessment = models.TextField(blank=True)
    diagnosis = models.TextField(blank=True)
    treatment_plan = models.TextField(blank=True)
    diet = models.TextField(blank=True)
    lifestyle = models.TextField(blank=True)
    therapy = models.TextField(blank=True)
    duration = models.CharField(max_length=100, blank=True)
    follow_up_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now=True)

class Prescription(models.Model):
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name="prescriptions")
    medicine = models.ForeignKey(Medicine, on_delete=models.SET_NULL, null=True, blank=True)
    medicine_name = models.CharField(max_length=150, blank=True)
    form = models.CharField(max_length=100, blank=True)
    instructions = models.TextField()
    duration = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Feedback(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="feedback_given")
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="feedback_received")
    rating = models.PositiveSmallIntegerField()
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
