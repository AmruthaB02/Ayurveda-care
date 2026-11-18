import React,{useEffect,useState} from 'react';
import {Link,NavLink,Route,Routes,useNavigate} from 'react-router-dom';
import {Leaf,Menu,HeartPulse,CalendarDays,BookOpen,Stethoscope,LogIn,LogOut,UserRound,ShieldCheck,Sparkles,Search,ArrowRight,Activity,Clock,ClipboardList} from 'lucide-react';
import {api,saveSession,clearSession,currentUser} from './api';

const herbFallback=[
 {id:'h1',name:'Ashwagandha',botanical_name:'Withania somnifera',description:'Traditional reference entry for an Ayurvedic herb.',traditional_uses:'Traditional wellness references; suitability varies.',precautions:'Ask a qualified practitioner about suitability and interactions.'},
 {id:'h2',name:'Triphala',botanical_name:'Traditional three-fruit blend',description:'A traditional formulation used in Ayurvedic reference material.',traditional_uses:'Traditional digestive and general-wellness contexts.',precautions:'Do not self-prescribe; seek clinician advice.'},
 {id:'h3',name:'Brahmi',botanical_name:'Bacopa monnieri (common name can vary)',description:'Educational information about a traditionally referenced plant.',traditional_uses:'Traditional cognition-related references; evidence varies.',precautions:'Confirm plant identity and suitability with a practitioner.'}
];
const medFallback=[
 {id:'m1',name:'Chyawanprash',formulation_type:'Herbal avaleha',description:'Multi-ingredient traditional preparation; products vary.',traditional_purpose:'Traditional general-wellness reference.',precautions:'Check ingredients, sugar content, allergies and interactions.'},
 {id:'m2',name:'Triphala formulation',formulation_type:'Powder/tablet varies',description:'Traditional formulation reference.',traditional_purpose:'Educational content only.',precautions:'Consult a qualified practitioner before use.'}
];



const knowledgeImages = {
  herbs: {
    Ashwagandha: "/images/herbs/ashwagandha.jpg",
    Brahmi: "/images/herbs/bramhi.jpg",
    Giloy: "/images/herbs/giloy.jpg",
    Haridra: "/images/herbs/haridra.jpeg",
    Neem: "/images/herbs/neem.jpg",
    Shatavari: "/images/herbs/shatavari.jpg",
    Triphala: "/images/herbs/triphala.jpg",
    Tulsi: "/images/herbs/tulsi.jpg",
    "Vasa / Vasaka": "/images/herbs/vasa.jpg",
    Yashtimadhu: "/images/herbs/yashtimadhu.jpg",
  },

  medicines: {
    Arjuna: "/images/medicine/arjuna.jpg",
    "Avipattikar Churna": "/images/medicine/avipattikar_Churna.jpg",
    "Brahmi Vati": "/images/medicine/brahmi_vati.jpg",
    "Brahmi preparation": "/images/medicine/brahmi_vati.jpg",
    Chyawanprash: "/images/medicine/chyawanprash.jpg",
    Dashamoola: "/images/medicine/dashamoola.jpg",
    Shatavari: "/images/medicine/shatavari_medicine.jpg",
    "Sitopaladi Churna": "/images/medicine/sitopaladi_churna.jpg",
    "Trikatu Churna": "/images/medicine/trikatu_churna.jpg",
    "Triphala formulation": "/images/medicine/trikatu_churna.jpg",
  },

  conditions: {
    "Digestive discomfort": "/images/conditions/digestive_discomfort.jpg",
    "General immunity and wellness": "/images/conditions/general_immunity_and_wellness.jpeg",
    "Hair and scalp health": "/images/conditions/hair_and_scalp_health.jpg",
    "Healthy ageing": "/images/conditions/healthy_ageing.jpg",
    "Joint health and mobility": "/images/conditions/joint_health_and_mobility.jpg",
    "Respiratory wellness": "/images/conditions/respiratory_wellness.jpg",
    "Seasonal health and routine": "/images/conditions/seasonal_health_and_routine.jpg",
    "Skin health": "/images/conditions/skin_health.jpg",
    "Sleep and daily routine": "/images/conditions/sleep_and_daily_routine.jpg",
    "Stress and wellbeing": "/images/conditions/stress_and_wellbeing.jpg",
    "Women's health and wellbeing": "/images/conditions/women's_health_and_wellbeing.jpg",
  },

  therapies: {
    Abhyanga: "/images/therapies/abhyanga.jpg",
    Dinacharya: "/images/therapies/dinacharya.jpg",
    Gandusha: "/images/therapies/gandusha.jpg",
    Nasya: "/images/therapies/nasya.jpg",
    "Netra Tarpana": "/images/therapies/netra_tarpana.jpg",
    Padabhyanga: "/images/therapies/padabhyanga.jpg",
    Shirodhara: "/images/therapies/shirodhara.jpg",
    Swedana: "/images/therapies/swedana.jpg",
    Udvartana: "/images/therapies/udvartana.jpg",
    "Yoga and breathing": "/images/therapies/yoga_and_breathing.jpg",
  },
};

function getKnowledgeImage(name, category) {
  return knowledgeImages[category]?.[name] || "";
}

const fallbackImages = {
  herbs: "photo-1471193945509-9ad0617afabf",
  medicines: "photo-1608571423902-eed4a5ad8108",
  conditions: "photo-1506126613408-eca07ce68773",
  therapies: "photo-1540555700478-4be289fbecef",
};

function user(){return currentUser()}
function role(){return user()?.role||''}
function Button({children,variant='primary',...props}){return <button className={`btn ${variant}`} {...props}>{children}</button>}
function Header(){
 const [open,setOpen]=useState(false), navigate=useNavigate(),u=user();
 const links=[['Home','/'],['Ayurveda','/knowledge'],['Medicines','/medicines'],['Herbs','/herbs'],['Conditions','/conditions'],['Doctors','/doctors']];
 return <header className="header"><div className="nav-wrap"><Link className="brand" to="/"><span className="brand-icon"><Leaf size={22}/></span><span>AyurVeda<span className="brand-accent">Care</span><small>TRADITIONAL WISDOM · MODERN CARE</small></span></Link>
 <button className="menu-toggle" onClick={()=>setOpen(!open)}><Menu/></button><nav className={open?'nav open':'nav'}>{links.map(([n,p])=><NavLink key={p} to={p} onClick={()=>setOpen(false)}>{n}</NavLink>)}
 {u?<><NavLink to="/dashboard">Dashboard</NavLink><button className="nav-login" onClick={()=>{clearSession();location.href='/'}}><LogOut size={15}/> Logout</button></>:<Link className="nav-login" to="/login"><LogIn size={16}/> Login</Link>}</nav></div></header>
}
function Footer(){return <footer className="footer"><div className="footer-inner"><div className="brand footer-brand"><span className="brand-icon"><Leaf size={21}/></span><span>AyurVeda<span className="brand-accent">Care</span><small>Knowledge. Care. Continuity.</small></span></div><p>Traditional knowledge, organized for modern access.</p><small>Educational content only. Diagnosis and prescriptions must come from qualified practitioners.</small><div className="copyright">© 2026 AyurVedaCare · Built for learning and demonstration</div></div></footer>}
function Layout({children}){return <><Header/>{children}<Footer/></>}

function Home() {
  const categories = [
    {
      title: "Herbs",
      text: "Nature's healing power",
      image: "/images/herbs/tulsi.jpg",
      link: "/herbs",
      theme: "herb",
      icon: <Leaf size={27} />,
    },
    {
      title: "Medicines",
      text: "Traditional formulations for wellness",
      image: "/images/medicine/chyawanprash.jpg",
      link: "/medicines",
      theme: "medicine",
      icon: <HeartPulse size={27} />,
    },
    {
      title: "Conditions",
      text: "Common conditions and care",
      image: "/images/conditions/general_immunity_and_wellness.jpeg",
      link: "/conditions",
      theme: "condition",
      icon: <Activity size={27} />,
    },
    {
      title: "Therapies",
      text: "Traditional healing practices",
      image: "/images/therapies/abhyanga.jpg",
      link: "/knowledge",
      theme: "therapy",
      icon: <Sparkles size={27} />,
    },
  ];

  return (
    <Layout>
      <main className="ayur-home">
        {/* HERO BANNER */}
        <section className="ayur-hero">
          <div className="hero-botanical hero-botanical-left">🌿</div>
          <div className="hero-botanical hero-botanical-right">🍃</div>

          <div className="ayur-hero-inner">
            <div className="ayur-hero-copy">
              <span className="ayur-eyebrow">
                <Leaf size={16} /> ANCIENT WISDOM FOR A HEALTHIER TOMORROW
              </span>

              <h1>
                Explore the Power of
                <br />
                <em>Ayurveda.</em>
              </h1>

              <p>
                Discover traditional knowledge, connect with verified
                practitioners, and keep your care journey organized —
                all in one place.
              </p>

              <div className="ayur-hero-actions">
                <Link className="ayur-button ayur-button-primary" to="/knowledge">
                  <Leaf size={17} /> Explore Knowledge <ArrowRight size={17} />
                </Link>

                <Link className="ayur-button ayur-button-outline" to="/doctors">
                  <Stethoscope size={17} /> Find a Doctor
                </Link>
              </div>

              <div className="ayur-trust">
                <div>
                  <Leaf />
                  <span><b>Authentic</b><small>Ayurvedic knowledge</small></span>
                </div>
                <div>
                  <ShieldCheck />
                  <span><b>Verified</b><small>Practitioners</small></span>
                </div>
                <div>
                  <HeartPulse />
                  <span><b>Personalized</b><small>Care journey</small></span>
                </div>
              </div>
            </div>

            <div className="ayur-hero-visual">
              <div className="hero-image-glow" />
              <img
                className="ayur-hero-image"
                src="/images/herbs/home-bg.jpg"
                alt="Ayurvedic medicinal plant"
              />
              <img
                className="ayur-hero-small-image"
                src="/images/medicine/home-medicine.jpg"
                alt="Traditional herbal formulation"
              />

              <div className="hero-floating-card">
                <span className="floating-leaf"><Leaf size={25} /></span>
                <div>
                  <b>Rooted in Nature</b>
                  <small>Inspired by tradition</small>
                </div>
              </div>

              <div className="hero-round-stamp">
                <Leaf size={25} />
                <span>LIVE</span>
                <span>WELL</span>
                <span>NATURALLY</span>
              </div>
            </div>
          </div>
        </section>

        {/* KNOWLEDGE CATEGORIES */}
        <section className="ayur-explore">
          <div className="ayur-explore-inner">
            <div className="ayur-explore-intro">
              <span className="ayur-section-label">EXPLORE KNOWLEDGE</span>
              <h2>
                Learn. Discover.
                <br />
                <em>Heal.</em>
              </h2>
              <p>
                Browse herbs, traditional medicines, conditions and therapies
                with clear guidance and precautions.
              </p>

              <form
                className="ayur-search"
                onSubmit={(e) => {
                  e.preventDefault();
                  const value = e.currentTarget.elements.knowledgeSearch.value;
                  sessionStorage.setItem("ayurKnowledgeSearch", value);
                  window.location.href = "/knowledge";
                }}
              >
                <Search size={20} />
                <input
                  name="knowledgeSearch"
                  placeholder="Search traditional knowledge..."
                  aria-label="Search traditional knowledge"
                />
                <button type="submit" aria-label="Search">
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>

            <div className="ayur-category-grid">
              {categories.map((category) => (
                <Link
                  to={category.link}
                  className={`ayur-category-card ${category.theme}`}
                  key={category.title}
                >
                  <span className="category-icon">{category.icon}</span>

                  <div className="category-image-wrap">
                    <img
                      src={category.image}
                      alt={category.title}
                      loading="lazy"
                    />
                  </div>

                  <h3>{category.title}</h3>
                  <p>{category.text}</p>

                  <span className="category-arrow">
                    <ArrowRight size={17} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CARE JOURNEY */}
        <section className="ayur-journey">
          <div className="journey-intro">
            <span className="ayur-section-label">YOUR CARE JOURNEY</span>
            <h2>
              Simple Steps to
              <br />
              <em>Better Health.</em>
            </h2>
            <p>
              From finding a practitioner to tracking your treatment,
              we make your Ayurvedic journey easy and connected.
            </p>

            <Link
              className="ayur-button ayur-button-primary"
              to={user() ? "/dashboard" : "/register"}
            >
              Get Started <ArrowRight size={17} />
            </Link>
          </div>

          <div className="journey-timeline">
            {[
              {
                number: "01",
                title: "Explore",
                text: "Learn about herbs, medicines, conditions and therapies.",
                icon: <Leaf />,
                color: "green",
              },
              {
                number: "02",
                title: "Connect",
                text: "Find a verified practitioner and book your appointment.",
                icon: <Stethoscope />,
                color: "purple",
              },
              {
                number: "03",
                title: "Consult",
                text: "Receive a personalized assessment and treatment plan.",
                icon: <CalendarDays />,
                color: "blue",
              },
              {
                number: "04",
                title: "Continue",
                text: "Track follow-ups, prescriptions and your wellness journey.",
                icon: <HeartPulse />,
                color: "pink",
              },
            ].map((step) => (
              <div className="journey-item" key={step.number}>
                <div className={`journey-icon ${step.color}`}>
                  {step.icon}
                </div>
                <span className="journey-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SAFETY NOTE */}
        <section className="ayur-home-note">
          <ShieldCheck size={25} />
          <p>
            <b>Traditional wisdom. Thoughtful care.</b>
            <span>
              Educational content only. Always consult a qualified Ayurvedic
              practitioner for diagnosis and treatment.
            </span>
          </p>
          <Link to="/doctors">Find a practitioner <ArrowRight size={16} /></Link>
        </section>
      </main>
    </Layout>
  );
}
function PageHero({ kicker, title, subtitle, className = "" }) {
  return (
    <section className={`page-hero ${className}`}>
      <span className="section-kicker">{kicker}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
}

function Knowledge() {
  const [herbs, setHerbs] = useState(herbFallback);
  const [meds, setMeds] = useState(medFallback);
  const [conditions, setConditions] = useState([]);
  const [therapies, setTherapies] = useState([]);
  const [tab, setTab] = useState("herbs");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api("/herbs/")
      .then((x) => setHerbs(x.results || x))
      .catch(() => {});

    api("/medicines/")
      .then((x) => setMeds(x.results || x))
      .catch(() => {});

    api("/conditions/")
      .then((x) => setConditions(x.results || x))
      .catch(() => {});

    api("/therapies/")
      .then((x) => setTherapies(x.results || x))
      .catch(() => {});
  }, []);

  const data = { herbs, medicines: meds, conditions, therapies }[tab] || [];

  const filtered = data.filter((x) =>
    JSON.stringify(x).toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Layout>
      <main className="page">
        <PageHero
          kicker="THE KNOWLEDGE GARDEN"
          title={<>Explore Ayurvedic <em>knowledge.</em></>}
          subtitle="Browse educational reference information about herbs, formulations, conditions and traditional therapies. Content is for learning, not self-diagnosis or self-prescription."
        />

        <div className={`content-wrap knowledge-content ${tab}-background`}>
          <div className="search-row">
            <div className="searchbox">
              <Search />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search traditional knowledge..."
              />
            </div>

            <div className="tabs">
              {[
                ["herbs", "Herbs"],
                ["medicines", "Medicines"],
                ["conditions", "Conditions"],
                ["therapies", "Therapies"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={tab === value ? "tab active" : "tab"}
                  onClick={() => setTab(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="knowledge-grid">
            {filtered.map((x, i) => {
              return (
                <article className="knowledge-card" key={x.id || x.name}>
                  <div className="knowledge-image">
                    
<img
  src={getKnowledgeImage(x.name, tab)}
  alt={x.name || "Ayurvedic reference"}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";
  }}
/>

                    <span className="reference-tag">REFERENCE</span>
                  </div>

                  <div className="knowledge-card-body">
                    <span className="round-leaf">
                      <Leaf size={20} />
                    </span>

                    <h3>{x.name || "Traditional reference"}</h3>

                    <p className="latin">
                      {x.botanical_name ||
                        x.formulation_type ||
                        x.sanskrit_name ||
                        "Traditional reference"}
                    </p>

                    <p>
                      {x.description ||
                        x.educational_approach ||
                        x.traditional_uses ||
                        x.traditional_purpose ||
                        "Educational reference information."}
                    </p>

                    <details>
                      <summary>Read details</summary>

                      <p>
                        {x.traditional_uses ||
                          x.traditional_purpose ||
                          x.ayurvedic_concepts ||
                          x.properties ||
                          x.ingredients ||
                          x.description ||
                          "No additional details available."}
                      </p>

                      <p className="precaution">
                        <b>Precautions:</b>{" "}
                        {x.precautions ||
                          "Consult a qualified practitioner about suitability."}
                      </p>
                    </details>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              No matching records. Try another search.
            </div>
          )}

          <p className="disclaimer">
            Information is educational and should be reviewed by qualified
            Ayurvedic professionals. This website does not recommend a medicine
            or dosage for individual symptoms.
          </p>
        </div>
      </main>
    </Layout>
  );
}
function Doctors(){
 const [doctors,setDoctors]=useState([]),[search,setSearch]=useState(''),[spec,setSpec]=useState(''),[error,setError]=useState(''),[date,setDate]=useState(''),[time,setTime]=useState('10:00'),[kind,setKind]=useState('online'),[chosen,setChosen]=useState(null),[msg,setMsg]=useState('');
 useEffect(()=>{api('/doctors/').then(setDoctors).catch(e=>setError(e.message))},[]);
 const filtered=doctors.filter(d=>`${d.name} ${d.specialization} ${d.clinic} ${d.address}`.toLowerCase().includes(search.toLowerCase())&&(!spec||d.specialization?.toLowerCase().includes(spec.toLowerCase())));
 async function book(e){e.preventDefault();setMsg('');try{const a=await api('/appointments/',{method:'POST',body:JSON.stringify({doctor:chosen.id,date,time,appointment_type:kind})});setMsg(`Appointment confirmed. Your appointment ID is ${a.appointment_id}.`);setChosen(null)}catch(e){setMsg(e.message)}}
 return <Layout><main className="page doctors-page"><PageHero kicker="PRACTITIONER DIRECTORY" title={<>Meet your Ayurvedic <em>doctor.</em></>} subtitle="Search verified practitioners and book an online consultation or clinic visit. New doctor accounts appear after admin verification."/><div className="content-wrap"><div className="doctor-search"><div className="searchbox"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, specialization or location"/></div><input className="field" value={spec} onChange={e=>setSpec(e.target.value)} placeholder="Specialization (optional)"/></div>{error&&<div className="alert">{error}. Start the backend server to load doctor records.</div>}{!filtered.length?<div className="empty"><Stethoscope size={30}/><h3>No verified doctors found yet</h3><p>Use the demo doctor account or register a doctor and verify the account using the admin dashboard.</p></div>:<div className="doctor-grid">{filtered.map(d=><article className="doctor-card" key={d.id}><div className="doctor-avatar"><Stethoscope/></div><span className="verified"><ShieldCheck size={14}/> Verified practitioner</span><h3>{d.name}</h3><p className="doctor-spec">{d.specialization||'Ayurvedic practitioner'}</p><p>{d.qualification||'Qualification on file'} · {d.experience_years} years experience</p><p><b>Clinic:</b> {d.clinic||d.address||'Contact for details'}</p><div className="doctor-bottom"><span>₹{d.consultation_fee} <small>/ consultation</small></span><Button onClick={()=>{if(!user()){location.href='/login';return}setChosen(d);setMsg('')}}>Book appointment <ArrowRight size={15}/></Button></div></article>)}</div>}
 {chosen&&<div className="modal-backdrop"><form className="modal" onSubmit={book}><button type="button" className="modal-close" onClick={()=>setChosen(null)}>×</button><div className="section-kicker">BOOK APPOINTMENT</div><h2>{chosen.name}</h2><p>{chosen.specialization}</p><label>Date<input type="date" required min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)}/></label><label>Time<select value={time} onChange={e=>setTime(e.target.value)}>{['10:00','11:00','12:00','14:00','15:00','16:00'].map(t=><option key={t}>{t}</option>)}</select></label><label>Appointment type<select value={kind} onChange={e=>setKind(e.target.value)}><option value="online">Online</option><option value="clinic">Clinic visit</option></select></label>{msg&&<div className="alert">{msg}</div>}<Button type="submit" disabled={!date}>Confirm appointment</Button></form></div>}{msg&&!chosen&&<div className="success">{msg}</div>}</div></main></Layout>
}
function Auth({mode='login'}){
 const [form,setForm]=useState({username:'',name:'',email:'',password:'',role:'patient',phone:'',qualification:'',license_number:'',specialization:'',experience_years:0,clinic:'',consultation_fee:0}),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const nav=useNavigate();const set=(k,v)=>setForm(p=>({...p,[k]:v}));
 async function submit(e){e.preventDefault();setError('');setBusy(true);try{const payload=mode==='register'?form:{username:form.username,password:form.password};const data=await api(mode==='register'?'/auth/register/':'/auth/login/',{method:'POST',body:JSON.stringify(payload)});saveSession(data);nav('/dashboard')}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <Layout><main className="auth-page"><div className="auth-art"><div className="auth-art-content"><span className="eyebrow"><Leaf size={15}/> YOUR CARE JOURNEY</span><h1>Rooted in nature.<br/><em>Connected by care.</em></h1><p>Knowledge and practitioner-led care, brought together.</p><div className="auth-art-pills"><span><ShieldCheck/> Verified practitioners</span><span><HeartPulse/> Personal care history</span></div></div></div><div className="auth-panel"><div className="auth-form"><div className="section-kicker">{mode==='login'?'WELCOME BACK':'JOIN AYURVEDACARE'}</div><h2>{mode==='login'?'Sign in to your account':'Create your account'}</h2><p>{mode==='login'?'Continue to your personalized dashboard.':'Get started with a patient or doctor account.'}</p><form onSubmit={submit}>{mode==='register'&&<><label>Full name<input required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your full name"/></label><label>Email<input required type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com"/></label><label>Account type<select value={form.role} onChange={e=>set('role',e.target.value)}><option value="patient">Patient</option><option value="doctor">Ayurvedic doctor</option></select></label></>}{mode==='register'&&form.role==='doctor'&&<><label>Qualification<input required value={form.qualification} onChange={e=>set('qualification',e.target.value)} placeholder="e.g. BAMS"/></label><label>Registration / licence number<input required value={form.license_number} onChange={e=>set('license_number',e.target.value)} placeholder="Professional registration"/></label><label>Specialization<input required value={form.specialization} onChange={e=>set('specialization',e.target.value)} placeholder="e.g. General Ayurveda"/></label><label>Experience (years)<input type="number" min="0" value={form.experience_years} onChange={e=>set('experience_years',Number(e.target.value))}/></label><label>Clinic / location<input value={form.clinic} onChange={e=>set('clinic',e.target.value)} placeholder="Clinic and city"/></label></>}{mode==='register'&&<label>Phone (optional)<input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="Phone number"/></label>}<label>{mode==='login'?'Username or email':'Username'}<input required value={form.username} onChange={e=>set('username',e.target.value)} placeholder={mode==='login'?'Username or email':'Choose a username'}/></label><label>Password<input required type="password" minLength="8" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="At least 8 characters"/></label>{error&&<div className="alert">{error}</div>}<Button type="submit" disabled={busy}>{busy?'Please wait…':mode==='login'?'Sign in':'Create account'} <ArrowRight size={16}/></Button></form><div className="auth-switch">{mode==='login'?<>New here? <Link to="/register">Create an account</Link></>:<>Already registered? <Link to="/login">Sign in</Link></>}</div><div className="demo-login"><b>Demo logins</b><small>Patient: patient@ayurvedacare.local / Patient@12345</small><small>Doctor: doctor@ayurvedacare.local / Doctor@12345</small><small>Admin: admin@ayurvedacare.local / Admin@12345</small><small>Use username <b>patient</b>, <b>doctor</b>, or <b>admin</b> to sign in.</small></div></div></div></main></Layout>
}
function Dashboard(){
 const [stats,setStats]=useState({}),[appointments,setAppointments]=useState([]),[consultations,setConsultations]=useState([]),[prescriptions,setPrescriptions]=useState([]),[users,setUsers]=useState([]),[error,setError]=useState(''),[msg,setMsg]=useState('');
 const r=role(),u=user();const [consultForm,setConsultForm]=useState({appointment:'',chief_complaints:'',history:'',clinical_assessment:'',ayurvedic_assessment:'',diagnosis:'',treatment_plan:'',diet:'',lifestyle:'',therapy:'',duration:'',follow_up_date:''});
 const [presForm,setPresForm]=useState({consultation:'',medicine_name:'',form:'',instructions:'',duration:''});
 async function load(){try{const [s,a,c,p]=await Promise.all([api('/dashboard/'),api('/appointments/'),api('/consultations/'),api('/prescriptions/')]);setStats(s);setAppointments(a.results||a);setConsultations(c.results||c);setPrescriptions(p.results||p);if(r==='admin')setUsers(await api('/admin/users/'))}catch(e){setError(e.message)}}
 useEffect(()=>{load()},[]);
 async function saveConsult(e){e.preventDefault();try{await api('/consultations/',{method:'POST',body:JSON.stringify({...consultForm,appointment:Number(consultForm.appointment)})});setMsg('Consultation and treatment record saved. Appointment marked completed.');load()}catch(e){setMsg(e.message)}}
 async function savePrescription(e){e.preventDefault();try{await api('/prescriptions/',{method:'POST',body:JSON.stringify({...presForm,consultation:Number(presForm.consultation)})});setMsg('Prescription issued by practitioner.');load()}catch(e){setMsg(e.message)}}
 async function verify(id,verified){try{await api(`/admin/doctors/${id}/verify/`,{method:'POST',body:JSON.stringify({verified})});setMsg('Doctor verification updated.');load()}catch(e){setMsg(e.message)}}
 if(!u)return <Layout><main className="page"><div className="empty"><h2>Please sign in to view your dashboard</h2><Link className="btn primary" to="/login">Sign in</Link></div></main></Layout>;
 const cards=Object.entries(stats).filter(([k,v])=>k!=='role'&&typeof v==='number');
 return <Layout><main className="page dashboard-page"><div className="dash-heading"><div><div className="section-kicker">{r==='admin'?'ADMINISTRATION':r==='doctor'?'PRACTITIONER WORKSPACE':'YOUR HEALTH JOURNEY'}</div><h1>Welcome, <em>{u.first_name||u.username}.</em></h1><p>Here is an overview of your AyurVedaCare activity.</p></div><span className="role-pill"><UserRound size={15}/>{r||'user'}</span></div>{error&&<div className="alert">{error}. Make sure the backend is running and sign in again.</div>}{msg&&<div className="success">{msg}<button onClick={()=>setMsg('')}>×</button></div>}<div className="stats-grid">{cards.map(([k,v])=><div className="stat-card" key={k}><span>{k.replaceAll('_',' ')}</span><b>{v}</b></div>)}</div>
 {r==='admin'&&<section className="dash-section"><div className="dash-section-head"><div><h2>User and doctor verification</h2><p>Review registered accounts. New doctor profiles are hidden from public search until verified.</p></div></div><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{users.map(x=><tr key={x.id}><td>{x.name}</td><td>{x.email}</td><td>{x.role}</td><td>{x.role==='doctor'?(x.verified?'Verified':'Pending'):'—'}</td><td>{x.role==='doctor'&&<Button variant="soft" onClick={()=>verify(x.id,!x.verified)}>{x.verified?'Unverify':'Verify doctor'}</Button>}</td></tr>)}</tbody></table></div><p className="hint">Knowledge records are also available through Django Admin at /admin/.</p></section>}
 {r==='doctor'&&<><section className="dash-section"><div className="dash-section-head"><div><h2>Appointments</h2><p>Review your booked visits and open a consultation record for a confirmed appointment.</p></div></div><AppointmentTable items={appointments} doctor/></section><section className="dash-section"><h2>Record consultation & treatment</h2><p className="section-sub">Use this form after reviewing the patient. The doctor is responsible for clinical assessment and treatment.</p><form className="dashboard-form" onSubmit={saveConsult}><label>Appointment<select required value={consultForm.appointment} onChange={e=>setConsultForm({...consultForm,appointment:e.target.value})}><option value="">Select a confirmed appointment</option>{appointments.filter(a=>['confirmed','completed'].includes(a.status)).map(a=><option key={a.id} value={a.id}>APT-{String(a.id).padStart(5,'0')} · {a.patient_name} · {a.date}</option>)}</select></label>{[['chief_complaints','Chief complaints'],['history','Patient history'],['clinical_assessment','Clinical assessment'],['ayurvedic_assessment','Ayurvedic assessment'],['diagnosis','Diagnosis / clinical impression'],['treatment_plan','Treatment plan'],['diet','Diet guidance'],['lifestyle','Lifestyle guidance'],['therapy','Therapy'],['duration','Duration']].map(([k,l])=><label key={k}>{l}<textarea value={consultForm[k]} onChange={e=>setConsultForm({...consultForm,[k]:e.target.value})} rows="2"/></label>)}<label>Follow-up date<input type="date" value={consultForm.follow_up_date} onChange={e=>setConsultForm({...consultForm,follow_up_date:e.target.value})}/></label><Button type="submit">Save consultation</Button></form></section><section className="dash-section"><h2>Issue prescription</h2><p className="section-sub">Only the treating doctor can issue a prescription. Enter medicine and instructions based on your clinical judgment.</p><form className="dashboard-form" onSubmit={savePrescription}><label>Consultation<select required value={presForm.consultation} onChange={e=>setPresForm({...presForm,consultation:e.target.value})}><option value="">Select consultation</option>{consultations.map(c=><option key={c.id} value={c.id}>#{c.id} · {c.patient_name} · {c.diagnosis||'Consultation'}</option>)}</select></label><label>Medicine name<input required value={presForm.medicine_name} onChange={e=>setPresForm({...presForm,medicine_name:e.target.value})}/></label><label>Form<input value={presForm.form} onChange={e=>setPresForm({...presForm,form:e.target.value})} placeholder="As specified by doctor"/></label><label>Instructions<input required value={presForm.instructions} onChange={e=>setPresForm({...presForm,instructions:e.target.value})}/></label><label>Duration<input value={presForm.duration} onChange={e=>setPresForm({...presForm,duration:e.target.value})}/></label><Button type="submit">Issue prescription</Button></form></section></>}
 {r==='patient'&&<><section className="dash-section"><div className="dash-section-head"><div><h2>My appointments</h2><p>Appointment confirmation and status.</p></div><Link className="text-link" to="/doctors">Find a doctor <ArrowRight size={16}/></Link></div><AppointmentTable items={appointments}/></section><section className="dash-section"><h2>Consultation history</h2>{consultations.length?<div className="record-grid">{consultations.map(c=><article className="record-card" key={c.id}><span className="reference-tag">CONSULTATION #{c.id}</span><h3>{c.diagnosis||'Clinical consultation'}</h3><p><b>Doctor:</b> {c.doctor_name}</p><p><b>Assessment:</b> {c.clinical_assessment||c.ayurvedic_assessment||'See your consultation notes.'}</p><p><b>Treatment:</b> {c.treatment_plan||'Refer to doctor notes.'}</p>{c.follow_up_date&&<p><b>Follow-up:</b> {c.follow_up_date}</p>}{c.prescriptions?.map(p=><div className="prescription" key={p.id}><b>Prescription:</b> {p.medicine_name} · {p.instructions} · {p.duration}</div>)}</article>)}</div>:<div className="empty compact">Your consultation and treatment history will appear here after your appointment.</div>}</section><section className="dash-section"><h2>My prescriptions</h2>{prescriptions.length?<div className="record-grid">{prescriptions.map(p=><article className="record-card" key={p.id}><span className="reference-tag">PRACTITIONER-ISSUED</span><h3>{p.medicine_name||'Prescription'}</h3><p>{p.form}</p><p>{p.instructions}</p><p>{p.duration}</p></article>)}</div>:<div className="empty compact">Prescriptions issued by your doctor will appear here.</div>}</section></>}
 </main></Layout>
}
function AppointmentTable({items,doctor=false}){if(!items.length)return <div className="empty compact">No appointments yet. {doctor?'New bookings will appear here.':'Find a verified doctor to book your first appointment.'}</div>;return <div className="table-wrap"><table><thead><tr><th>Appointment ID</th><th>{doctor?'Patient':'Doctor'}</th><th>Date & time</th><th>Type</th><th>Status</th></tr></thead><tbody>{items.map(a=><tr key={a.id}><td>{a.appointment_id||`APT-${String(a.id).padStart(5,'0')}`}</td><td>{doctor?a.patient_name:a.doctor_name}<small className="cell-sub">{a.doctor_specialization}</small></td><td>{a.date}<small className="cell-sub">{a.time}</small></td><td>{a.appointment_type}</td><td><span className={`status ${a.status}`}>{a.status}</span></td></tr>)}</tbody></table></div>}
function About(){return <Layout><main className="page"><PageHero kicker="ABOUT THE PLATFORM" title={<>A bridge between tradition and <em>modern care.</em></>} subtitle="AyurVedaCare organizes traditional Ayurvedic reference information and connects patients, practitioners and administrators through a single web application."/><div className="content-wrap about-grid"><article className="knowledge-card"><h3>Our purpose</h3><p>Preserve and organize knowledge about herbs, medicines, conditions and therapies while making it easier to discover qualified practitioners and maintain consultation records.</p></article><article className="knowledge-card"><h3>Designed around trust</h3><p>Public knowledge is educational. Personalized diagnosis, treatment decisions and prescriptions belong to qualified practitioners. Doctor accounts require verification.</p></article></div></main></Layout>}
export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/knowledge" element={<Knowledge/>}/><Route path="/herbs" element={<Knowledge/>}/><Route path="/medicines" element={<Knowledge/>}/><Route path="/conditions" element={<Knowledge/>}/><Route path="/doctors" element={<Doctors/>}/><Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/about" element={<About/>}/><Route path="*" element={<Home/>}/></Routes>}
