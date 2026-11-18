from django.contrib import admin
from .models import Profile, Herb, Medicine, Condition, Therapy, Appointment, Consultation, Prescription, Feedback
admin.site.register([Profile,Herb,Medicine,Condition,Therapy,Appointment,Consultation,Prescription,Feedback])
