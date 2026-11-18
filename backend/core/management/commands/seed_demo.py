from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Profile, Herb, Medicine, Condition, Therapy
class Command(BaseCommand):
    help = "Create local demo accounts and sample Ayurvedic knowledge records."
    def handle(self,*args,**options):
        accounts=[
          ("admin","admin@ayurvedacare.local","Admin@12345","Admin","", "admin"),
          ("doctor","doctor@ayurvedacare.local","Doctor@12345","Dr. Ananya","Sharma","doctor"),
          ("patient","patient@ayurvedacare.local","Patient@12345","Priya","Nair","patient"),
        ]
        for username,email,password,first,last,role in accounts:
            u,created=User.objects.get_or_create(username=username,defaults={"email":email,"first_name":first,"last_name":last,"is_staff":role=="admin","is_superuser":role=="admin"})
            u.email=email; u.first_name=first; u.last_name=last
            if created: u.set_password(password)
            if role=="admin": u.is_staff=True; u.is_superuser=True
            u.save()
            defaults={"role":role,"verified":role in ("admin","patient")}
            if role=="doctor": defaults.update({"qualification":"BAMS","specialization":"General Ayurveda","experience_years":8,"clinic":"AyurVedaCare Clinic, Bengaluru","consultation_fee":500,"availability":"Mon–Sat, 10:00–17:00","address":"Bengaluru"})
            Profile.objects.update_or_create(user=u,defaults=defaults)
        herbs=[
          {"name":"Ashwagandha","sanskrit_name":"Ashwagandha","common_name":"Indian winter cherry","botanical_name":"Withania somnifera","description":"Educational reference entry for a traditional Ayurvedic herb.","properties":"Traditionally described in Ayurveda as a rasayana.","part_used":"Root","traditional_uses":"Traditional references discuss general wellness uses; evidence and suitability vary.","preparation":"Forms vary by traditional preparation and product.","precautions":"May interact with medicines and may not be suitable for everyone. Ask a qualified clinician."},
          {"name":"Triphala","sanskrit_name":"Triphala","common_name":"Three-fruit blend","botanical_name":"Blend of three fruits","description":"Traditional Ayurvedic formulation commonly described in reference material.","properties":"Traditional formulation; properties depend on preparation.","part_used":"Fruit","traditional_uses":"Traditional texts discuss digestive and general wellness contexts.","preparation":"Preparation varies by formulation.","precautions":"Do not self-prescribe, especially during pregnancy or with existing conditions/medicines."},
          {"name":"Brahmi","sanskrit_name":"Brahmi","common_name":"Brahmi","botanical_name":"Bacopa monnieri (commonly called Brahmi)","description":"Educational entry; common names can refer to different plants by region.","properties":"Traditional reference information only.","part_used":"Aerial parts","traditional_uses":"Traditional references discuss memory and cognition; clinical evidence varies.","preparation":"Use depends on the specific plant and formulation.","precautions":"Check identity and suitability with a qualified practitioner."}
        ]
        for x in herbs: Herb.objects.update_or_create(name=x["name"],defaults=x)
        meds=[
          {"name":"Chyawanprash","sanskrit_name":"Chyavanaprasha","formulation_type":"Herbal avaleha","ingredients":"Multi-ingredient traditional formulation; exact ingredients vary by product.","description":"Educational reference only. Commercial formulations differ.","traditional_purpose":"Traditional general-wellness preparation.","dosha_association":"Varies by formulation and tradition","precautions":"Check sugar content, allergies, interactions and suitability with a clinician.","contraindications":"Product-specific; clinician advice recommended.","doctor_only":False},
          {"name":"Triphala formulation","formulation_type":"Powder/tablet (varies)","ingredients":"Traditional three-fruit blend; product composition varies.","description":"Reference information only, not a personal recommendation.","traditional_purpose":"Traditional Ayurvedic formulation.","precautions":"May not be suitable for all users; consult a qualified practitioner.","contraindications":"Assess with practitioner, especially with medicines or pregnancy.","doctor_only":True},
          {"name":"Brahmi preparation","formulation_type":"Product-dependent","ingredients":"Ingredients depend on manufacturer and plant identity.","description":"Educational reference; verify label and source.","traditional_purpose":"Traditional use varies by preparation.","precautions":"Potential interactions and variable formulations; clinician advice recommended.","contraindications":"Product-specific.","doctor_only":True}
        ]
        for x in meds: Medicine.objects.update_or_create(name=x["name"],defaults=x)
        conditions=[
          ("Digestive discomfort","Digestive symptoms can have many causes; this page is educational, not a diagnosis.","Agni and Ama are traditional Ayurvedic concepts.","General educational information about balanced meals and routines; persistent or severe symptoms require medical assessment."),
          ("Sleep and daily routine","Sleep concerns can have medical, environmental, or lifestyle causes.","Dinacharya and routine are traditional concepts.","General education about regular sleep timing and relaxation; seek professional advice for persistent problems."),
          ("Stress and wellbeing","Wellbeing is influenced by many personal and health factors.","Traditional concepts may include balance and daily routine.","Educational information about breathing, gentle movement and routine; not a substitute for care.")
        ]
        for n,d,c,a in conditions: Condition.objects.update_or_create(name=n,defaults={"description":d,"ayurvedic_concepts":c,"educational_approach":a})
        therapies=[
          ("Abhyanga","Traditional oil massage practice; suitability depends on individual circumstances.","Avoid or seek clinical advice for acute illness, skin conditions, injury or other contraindications."),
          ("Yoga and breathing","General educational overview of gentle movement and breathing practices.","Adapt to ability; stop if pain, dizziness or shortness of breath occurs."),
          ("Dinacharya","Traditional concept of daily routine and habits.","Personalize routines; this is not a treatment plan.")
        ]
        for n,d,p in therapies: Therapy.objects.update_or_create(name=n,defaults={"description":d,"precautions":p})
        self.stdout.write(self.style.SUCCESS("Demo accounts and knowledge records are ready."))
