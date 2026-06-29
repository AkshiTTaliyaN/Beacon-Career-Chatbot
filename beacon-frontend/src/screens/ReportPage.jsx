import { useEffect, useState, useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell,
  ResponsiveContainer,
} from 'recharts';
import ManzilHeader from '../components/ManzilHeader';
import { getCareerBannerImage } from '../utils/bannerImage';
import { GlassCard } from '../components/FuturisticCharts';
import {
  Download,
  Briefcase,
  GraduationCap,
  Target,
  Users,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  BookOpen,
  TrendingUp,
  Heart,
  FileText,
  Sparkles,
  Brain,
} from "lucide-react";
import LanguageToggle from '../components/LanguageToggle.jsx';

import { API as BEACON_API, APTITUDE_URL } from '../config';


const RIASEC_COLORS = {
  Investigative: '#3b82f6',
  Realistic: '#ef4444',
  Conventional: '#22c55e',
  Enterprising: '#f97316',
  Artistic: '#8b5cf6',
  Social: '#14b8a6',
};

const RIASEC_FULL = {
  R: 'Realistic', I: 'Investigative', A: 'Artistic',
  S: 'Social', E: 'Enterprising', C: 'Conventional',
};

const PERSONALITY_DESCS = {
  Investigative: 'Investigative individuals are analytical, curious, and enjoy research and problem solving. You prefer working with ideas and data rather than routine tasks, and you are motivated by understanding how systems work.',
  Realistic: 'Realistic individuals are practical, hands-on, and mechanically inclined. You enjoy working with tools, machines, and physical systems and prefer concrete tasks over abstract ones.',
  Artistic: 'Artistic individuals are creative, expressive, and imaginative. You thrive when given freedom to communicate ideas through design, writing, music, or performance.',
  Social: 'Social individuals are empathetic, collaborative, and people-oriented. You are motivated by helping, teaching, and connecting with others.',
  Enterprising: 'Enterprising individuals are ambitious, persuasive, and natural leaders. You are drawn to challenges involving influence, initiative, and building things.',
  Conventional: 'Conventional individuals are detail-oriented, organised, and methodical. You thrive in structured environments where accuracy and systems matter.',
};



const TRAITS = {
  Investigative: ["Deeply analytical and logical", "Naturally curious about how things work", "Prefers working independently on complex problems", "Drawn to research, data, and evidence", "Thinks carefully before acting", "Values knowledge and intellectual challenge"],
  Realistic: ["Practical and results-oriented", "Prefers hands-on work over theory", "Mechanically and spatially aware", "Reliable and straightforward", "Comfortable working with tools and systems", "Values concrete, tangible outcomes"],
  Artistic: ["Highly imaginative and original", "Expresses ideas through creative mediums", "Thrives with freedom and minimal structure", "Emotionally perceptive and sensitive", "Drawn to aesthetics, design, and storytelling", "Values self-expression and creativity"],
  Social: ["Empathetic and people-oriented", "Natural communicator and listener", "Motivated by helping and supporting others", "Works well in teams and collaborative settings", "Values relationships and human connection", "Finds meaning in making a difference"],
  Enterprising: ["Ambitious and goal-driven", "Natural leader and persuader", "Comfortable taking initiative and risks", "Energised by competition and challenge", "Strong communicator and negotiator", "Values achievement, influence, and growth"],
  Conventional: ["Detail-oriented and precise", "Thrives in structured, organised environments", "Reliable, consistent, and methodical", "Strong with numbers, data, and systems", "Follows through on commitments", "Values accuracy, order, and efficiency"],
};

const STRENGTHS = {
  Investigative: ["Deep focus and concentration", "Strong problem-solving ability", "Independent thinking and self-direction"],
  Realistic: ["Practical execution and follow-through", "Technical and mechanical aptitude", "Dependability and consistency"],
  Artistic: ["Original thinking and creative vision", "Strong aesthetic sensibility", "Ability to communicate ideas vividly"],
  Social: ["Emotional intelligence and empathy", "Strong interpersonal communication", "Natural ability to motivate and support others"],
  Enterprising: ["Leadership and decisiveness", "Persuasion and influencing ability", "High drive and resilience under pressure"],
  Conventional: ["Precision and attention to detail", "Strong organisational ability", "Consistency and reliability in execution"],
};

const CHALLENGES = {
  Investigative: ["Can overthink decisions", "May struggle with routine or repetitive tasks"],
  Realistic: ["May find abstract or theoretical tasks frustrating", "Can be resistant to change or new ideas"],
  Artistic: ["Unstructured environments can lead to inconsistency", "May find highly rigid or rule-bound work draining"],
  Social: ["Can take on too much for others at personal cost", "May avoid necessary conflict or difficult decisions"],
  Enterprising: ["Risk of moving too fast without enough analysis", "Can struggle with patience in slow-moving environments"],
  Conventional: ["May resist ambiguity or open-ended tasks", "Can find highly creative or unstructured roles uncomfortable"],
};

const WORK_ENV = {
  Investigative: "You thrive in environments that reward curiosity and independent thinking — research labs, tech companies, universities, or data-driven organisations. You need intellectual challenge, freedom to explore ideas, and colleagues who value depth over speed.",
  Realistic: "You perform best in structured, practical environments — engineering firms, workshops, construction, manufacturing, or field-based roles. You need clear outcomes, hands-on work, and environments where you can see the results of your effort.",
  Artistic: "You flourish in creative, flexible environments — design studios, media companies, startups, or cultural organisations. You need autonomy, creative freedom, and space to experiment without excessive bureaucracy.",
  Social: "You do best in people-centred environments — schools, hospitals, NGOs, counselling centres, or community organisations. You need meaningful human interaction, collaborative teams, and a sense that your work is making a real difference.",
  Enterprising: "You are energised by fast-paced, goal-oriented environments — startups, sales organisations, consulting firms, or leadership roles in any sector. You need challenge, autonomy, and the ability to influence decisions.",
  Conventional: "You excel in structured, well-organised environments — banks, accounting firms, government offices, or large corporations with clear processes. You need clear expectations, defined roles, and environments where precision is valued.",
};

const PARENT_NOTES = {
  Investigative: "Your child is a deep thinker — naturally curious, analytical, and motivated by understanding how things work. They will do best in careers that reward intellectual depth and independent problem solving. Support them by encouraging questions, providing access to books, research articles, and projects. Avoid pushing them toward fast-paced sales or routine clerical roles — they will likely feel unfulfilled. Careers in science, research, technology, and medicine align with their natural strengths.",
  Realistic: "Your child is practical and hands-on — they learn best by doing, not by reading or theorising. They thrive when working with tools, systems, and tangible outcomes. Support them with workshops, technical hobbies, or mechanical projects. Engineering, technical fields, and applied sciences suit their personality. Avoid pressuring them into highly abstract or people-heavy roles unless they show genuine interest.",
  Artistic: "Your child is creative and expressive — they need freedom to imagine, design, and create. Rigid structures and rule-bound environments will drain them. Support them by encouraging creative outlets and respecting their need for self-expression. Careers in design, media, architecture, and creative technology suit them well. The creative economy is growing rapidly — this is a legitimate, financially viable path.",
  Social: "Your child is empathetic and people-oriented — they are energised by helping others and building relationships. They will find meaning in careers that involve teaching, healing, counselling, or community work. Support them by valuing emotional intelligence as a real skill. Careers in education, healthcare, psychology, and social work suit them deeply. They may need encouragement to also pursue their own goals, not just others'.",
  Enterprising: "Your child is ambitious and naturally driven to lead. They thrive in challenging, fast-paced environments where they can take initiative and influence others. Support them by encouraging leadership roles, public speaking, and business thinking. Careers in business, law, entrepreneurship, and management suit them. They may take risks — guide them, but resist the urge to over-control their decisions.",
  Conventional: "Your child is precise, organised, and methodical — they excel at structure, accuracy, and consistency. They thrive in stable, well-defined environments. Support them by valuing their reliability and attention to detail. Careers in finance, accounting, administration, and data management align with their strengths. There are strong, secure career paths in these areas — your child is well-suited to them.",
};

const ACTION_PLAN = {
  Investigative: [
    { phase: "Class 11 (Now)", actions: ["Strengthen mathematics and analytical subjects", "Start learning Python or basic programming", "Read scientific articles and journals weekly", "Join science Olympiads or research clubs"] },
    { phase: "Class 12", actions: ["Begin JEE/NEET/IISER prep alongside boards", "Build small data or research projects", "Apply for summer research programs (KVPI, IISER, IIT internships)", "Strengthen English for international applications"] },
    { phase: "After Class 12", actions: ["Pursue B.Tech, BSc Research, or MBBS based on stream", "Engage in research from year one of college", "Consider international research opportunities", "Build a profile of papers, projects, or internships"] },
  ],
  Realistic: [
    { phase: "Class 11 (Now)", actions: ["Focus on physics, mathematics, and applied subjects", "Take up hands-on hobbies (electronics, mechanics, building)", "Visit workshops, factories, or engineering exhibitions", "Try AutoCAD or basic CAD software"] },
    { phase: "Class 12", actions: ["Start JEE preparation seriously", "Build small physical or technical projects", "Visit IITs/NITs on open day if possible", "Develop strong drawing and spatial reasoning"] },
    { phase: "After Class 12", actions: ["Pursue B.Tech, Diploma, or applied engineering", "Take internships at engineering firms", "Build a portfolio of completed technical projects", "Consider specialisations like robotics, automotive, or aerospace"] },
  ],
  Artistic: [
    { phase: "Class 11 (Now)", actions: ["Build a portfolio of your creative work", "Learn one design tool (Figma, Photoshop, or Canva)", "Take art, music, writing, or photography classes", "Follow creative professionals on social media for inspiration"] },
    { phase: "Class 12", actions: ["Prepare for NID, NIFT, or other design entrance exams", "Build a strong, organised digital portfolio", "Attempt small creative freelance projects", "Read design and creative industry publications"] },
    { phase: "After Class 12", actions: ["Pursue B.Des, BFA, or Mass Communication degrees", "Build a professional online portfolio (Behance, Dribbble)", "Take internships at creative studios or media houses", "Develop a strong personal brand and online presence"] },
  ],
  Social: [
    { phase: "Class 11 (Now)", actions: ["Volunteer with a local NGO or community group", "Develop public speaking and communication skills", "Read introductory psychology or sociology books", "Join debate, MUN, or peer counselling activities"] },
    { phase: "Class 12", actions: ["Prepare for CUET if pursuing humanities", "Begin shadowing teachers, doctors, or counsellors", "Maintain a journal of your volunteering experiences", "Apply for leadership roles in school"] },
    { phase: "After Class 12", actions: ["Pursue Psychology, Education, Social Work, or Medicine", "Complete internships in counselling or NGO settings", "Build a track record of impact in community work", "Consider higher studies in clinical or counselling psychology"] },
  ],
  Enterprising: [
    { phase: "Class 11 (Now)", actions: ["Read business case studies and entrepreneur biographies", "Take leadership roles in school clubs or events", "Develop public speaking and presentation skills", "Start a small project — selling, organising, or building"] },
    { phase: "Class 12", actions: ["Prepare for IPM, CLAT, or commerce entrance exams", "Build a strong CV with leadership experience", "Start a small entrepreneurial side project", "Develop financial literacy and business reading"] },
    { phase: "After Class 12", actions: ["Pursue BBA, B.Com, LLB, or related fields", "Join entrepreneurship cells and business clubs", "Take internships at startups or consulting firms", "Build your network early through LinkedIn and events"] },
  ],
  Conventional: [
    { phase: "Class 11 (Now)", actions: ["Strengthen mathematics, accounting, and economics", "Master MS Excel and basic spreadsheet skills", "Develop strong organisational and time-management habits", "Read business newspapers (Mint, Economic Times)"] },
    { phase: "Class 12", actions: ["Prepare for CA Foundation or commerce entrance exams", "Build accuracy in numerical and analytical work", "Develop typing speed and digital literacy", "Maintain strong academic discipline"] },
    { phase: "After Class 12", actions: ["Pursue B.Com, CA, CFA, or BBA in Finance", "Take internships at audit firms or banks", "Build certifications in finance and data analysis", "Aim for stable, professional career tracks early"] },
  ],
};

const ADMISSION_PROCESS = {
  PCM: { timeline: "Class 12 final year — apply Oct–Mar; exams Jan–June; counselling June–Aug.", docs: "Class 10 & 12 marksheets, JEE scorecard, ID proof, photos, category certificate (if applicable).", cutoffs: "JEE Main: 90+ percentile for NITs, 95+ for IIITs. JEE Advanced: rank under 10,000 for IITs." },
  PCB: { timeline: "Class 12 final year — apply Dec–Feb; NEET in May; counselling July–Sep.", docs: "Class 10 & 12 marksheets, NEET scorecard, ID proof, photos, category certificate (if applicable).", cutoffs: "NEET: 600+ for government MBBS in most states, 720 for AIIMS Delhi." },
  Commerce: { timeline: "Class 12 final year — CUET in May, CA Foundation in May/Nov, IPMAT in May.", docs: "Class 10 & 12 marksheets, entrance exam scorecard, ID proof, photos.", cutoffs: "CUET: 95+ percentile for top DU colleges. CA Foundation: 50% aggregate, 40% per subject." },
  Humanities: { timeline: "Class 12 final year — CUET in May, CLAT in Dec, NID/NIFT in Jan.", docs: "Class 10 & 12 marksheets, entrance exam scorecard, portfolio (for design), ID proof.", cutoffs: "CUET: 95+ percentile for top humanities colleges. CLAT: rank under 500 for NLU Bangalore." },
};

function getExams(stream, primaryCode) {
  const examMap = {
    PCM: [
      { name: "JEE Main", desc: "NITs and IIITs for engineering" },
      { name: "JEE Advanced", desc: "IITs" },
      { name: "BITSAT", desc: "BITS Pilani" },
      { name: "IISER Aptitude Test", desc: "Research-focused BSc / MSc programs" },
    ],
    PCB: [
      { name: "NEET UG", desc: "MBBS, BDS, BAMS" },
      { name: "AIIMS", desc: "Top medical institutions" },
      { name: "JIPMER", desc: "Government medical college, Puducherry" },
      { name: "IISER Aptitude Test", desc: "Research-focused BSc / MSc programs" },
    ],
    Commerce: [
      { name: "CA Foundation", desc: "Chartered Accountancy pathway" },
      { name: "CLAT", desc: "Law colleges for commerce+law combo" },
      { name: "CUET", desc: "Central Universities for BCom, BBA" },
      { name: "IPM (IIM)", desc: "Integrated MBA program at IIMs" },
    ],
    Humanities: [
      { name: "CLAT", desc: "National Law Schools" },
      { name: "CUET", desc: "Central Universities for BA programs" },
      { name: "NID DAT", desc: "National Institute of Design" },
      { name: "NIFT Entrance", desc: "Fashion and design colleges" },
    ],
  };
  let normalizedStream = "PCM";
  const lower = (stream || "").toLowerCase();
  if (lower.includes("pcb")) normalizedStream = "PCB";
  else if (lower.includes("pcm")) normalizedStream = "PCM";
  else if (lower.includes("comm") || lower.includes("commerce")) normalizedStream = "Commerce";
  else if (lower.includes("arts") || lower.includes("humanities") || lower.includes("liberal")) normalizedStream = "Humanities";

  return examMap[normalizedStream] || examMap["PCM"];
}

function getSkills(primaryCode, secondaryCode) {
  const skillMap = {
    I: [
      { name: "Python programming", desc: "Start with NPTEL or Coursera beginner course and build small projects." },
      { name: "Mathematics", desc: "Strengthen calculus and statistics; focus on Class 12 topics and problem solving." },
      { name: "Logical reasoning", desc: "Practice previous year JEE problems and timed reasoning tests." },
      { name: "Data analysis basics", desc: "Try Google Sheets or Excel projects with real datasets." },
      { name: "Scientific reading", desc: "Read one article per week on ArXiv, ScienceDaily, or popular science outlets." },
    ],
    R: [
      { name: "CAD / Technical drawing", desc: "Learn AutoCAD basics or use free tools like TinkerCAD." },
      { name: "Basic electronics", desc: "Explore Arduino or Raspberry Pi for hands-on projects." },
      { name: "Physics applications", desc: "Focus on mechanics, electricity, and real-world problem sets." },
      { name: "Workshop skills", desc: "Join a maker space or school lab to build physical projects." },
      { name: "Mathematics", desc: "Build strong algebra and trigonometry foundations." },
    ],
    A: [
      { name: "Design tools", desc: "Start with Canva, then move to Figma or Adobe XD for UI/UX." },
      { name: "Creative writing", desc: "Write short stories or opinion pieces to develop voice and clarity." },
      { name: "Digital art", desc: "Explore Procreate or Krita for digital illustration fundamentals." },
      { name: "Photography basics", desc: "Study composition, lighting, and editing using free tools." },
      { name: "Portfolio building", desc: "Maintain a digital portfolio of your best creative work." },
    ],
    S: [
      { name: "Communication skills", desc: "Join a debate club or practise public speaking regularly." },
      { name: "Psychology basics", desc: "Read introductory texts on human behaviour and motivation." },
      { name: "Volunteering", desc: "Engage in community service to build empathy and leadership." },
      { name: "Active listening", desc: "Practise reflective listening in conversations and group settings." },
      { name: "Education tools", desc: "Explore tutoring peers to develop teaching skills early." },
    ],
    E: [
      { name: "Business basics", desc: "Read case studies on startups and entrepreneurs." },
      { name: "Public speaking", desc: "Join MUN, debate, or school council to build leadership." },
      { name: "Negotiation skills", desc: "Practise decision-making through business simulations and games." },
      { name: "Financial literacy", desc: "Learn personal finance basics: budgeting, savings, and investing." },
      { name: "Networking", desc: "Connect with mentors and professionals on LinkedIn." },
    ],
    C: [
      { name: "MS Excel / Spreadsheets", desc: "Master formulas, pivot tables, and data organisation." },
      { name: "Accounting basics", desc: "Study debit/credit, balance sheets, and financial statements." },
      { name: "Typing and organisation", desc: "Build fast, accurate typing and strong file management habits." },
      { name: "Data entry tools", desc: "Learn database fundamentals using Airtable or Google Sheets." },
      { name: "Attention to detail", desc: "Practise proofreading documents and spotting errors in data." },
    ],
  };
  const primary = primaryCode || "I";
  const secondary = secondaryCode || "R";
  const skills = [...(skillMap[primary] || skillMap["I"])].slice(0, 3);
  const secondarySkills = skillMap[secondary] || [];
  if (secondarySkills.length > 0) {
    skills.push(secondarySkills[0]);
    if (secondarySkills.length > 3) {
      skills.push(secondarySkills[3]);
    }
  }
  return skills.slice(0, 5);
}

function getClosingNote(primaryName) {
  const notes = {
    Investigative: "Your Investigative personality means you thrive when given complex problems to solve. The careers ahead of you are intellectually rich and financially rewarding. Start building your analytical skills now — learn Python, strengthen your mathematics, and practise real-world data projects. With steady focus and curiosity, the right path will become clear. Share this report with your parents and teachers to plan the next steps together.",
    Realistic: "Your Realistic nature means you are built to create, build, and solve with your hands and mind. Careers in engineering and technology reward exactly the kind of focused, practical thinking you bring. Start with hands-on projects, build your technical foundation, and explore workshops or labs near you. Share this report with your parents and teachers to plan together.",
    Artistic: "Your Artistic personality is a genuine strength in today's creative economy. Design, media, and content careers are growing fast. Start building a portfolio now — even small projects matter. Share this report with your teachers and parents so they understand the exciting paths available to you.",
    Social: "Your Social personality is your superpower. People-focused careers in education, counselling, healthcare, and social work are both meaningful and in demand. Start practising communication and leadership skills today. Share this report with your parents and teachers to explore the best pathway for you.",
    Enterprising: "Your Enterprising nature means you are made to lead, influence, and build. Business and law careers reward the ambition and drive you naturally have. Start practising leadership and financial thinking today. Share this report with your parents and teachers to map out your journey.",
    Conventional: "Your Conventional strength means you excel at organisation, accuracy, and structured thinking. Finance, accounting, and administrative careers value exactly these qualities. Start building your spreadsheet and numeracy skills today. Share this report with your parents and teachers to plan your path forward.",
  };
  return notes[primaryName] || "Your personality profile points toward a strong and rewarding career path. Share this report with your parents and teachers to plan the next steps together.";
}

function getToken() {
  return localStorage.getItem('beacon_token');
}

/* ── Simple progress bar (used in Score Breakdown cards) ─────────── */
function ScoreBar({ label, value, color }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700, fontSize: '0.95rem' }}>{label}</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color || '#00d4ff',
            borderRadius: 8,
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}

/* ── Section heading helper ──────────────────────────────────────── */
function SectionHeading({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ color: '#00d4ff', margin: '0 0 6px 0', fontSize: '1.4rem', fontWeight: 800 }}>{title}</h2>
      {subtitle && <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.92rem', lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
  );
}

/* ── Custom radar tooltip ─────────────────────────────────────────── */
function RadarTooltipContent({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: '#080c24', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', fontSize: 13 }}>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700, marginBottom: 2 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

/* ── Custom radar ticks to prevent overlaps ───────────────────────── */
function ReportRadarTick({ x, y, cx, cy, payload }) {
  const dx = x - cx;
  const dy = y - cy;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  // Push outwards by 14px
  const offset = 14;
  const newX = len > 0 ? x + (dx / len) * offset : x;
  const newY = len > 0 ? y + (dy / len) * offset : y;
  
  // Align text anchor based on position relative to center
  let textAnchor = 'middle';
  if (dx > 20) textAnchor = 'start';
  else if (dx < -20) textAnchor = 'end';
  
  // Adjust dy to avoid vertical overlap
  let adjustedDy = 4;
  if (dy < -20) adjustedDy = -4; // above the dot
  else if (dy > 20) adjustedDy = 12; // below the dot

  return (
    <g transform={`translate(${newX},${newY})`}>
      <text
        textAnchor={textAnchor}
        dy={adjustedDy}
        style={{
          fill: '#00d4ff',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {payload.value}
      </text>
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
export default function ReportPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const NAVY = '#2C5492';

  // ── 1. Read URL params ───────────────────────────────────────────
  const freshTest = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('scores_written') === '1';
  }, []);

  const urlScores = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const scores = {};
    ['R', 'I', 'A', 'S', 'E', 'C'].forEach(k => {
      const v = params.get(k);
      if (v !== null) scores[k] = Number(v);
    });
    return scores;
  }, []);
  const hasUrlScores = useMemo(() => Object.keys(urlScores).length === 6, [urlScores]);

  // ── 2. Load profile & scores ─────────────────────────────────────
  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch(`${BEACON_API}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          if (hasUrlScores) setScores(urlScores);
          else if (data.riasec_scores) setScores(data.riasec_scores);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    load();
  }, [hasUrlScores, urlScores]);

  // ── 3. Fetch banner image (only for fresh test results) ──────────
  useEffect(() => {
    if (!freshTest) return;
    getCareerBannerImage({ query: 'career,success,student', width: 900, height: 220 })
      .then(url => setBannerImage(url))
      .catch(() => {});
  }, [freshTest]);

  // ── Build radar data (RIASEC + WorkStyle overlay) ────────────────
  const radarData = useMemo(() => transformRadarData(scores, profile?.work_style), [scores, profile?.work_style]);

  // ── Build subject bar data ────────────────────────────────────────
  const subjectData = useMemo(() => transformSubjectData(profile?.subject_ratings), [profile?.subject_ratings]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <p style={{ color: '#556d8f' }}>Loading your report…</p>
      </div>
    );
  }

  // ── Derive personality info ──────────────────────────────────────
  let sortedScores = [];
  let primaryName = 'Investigative', secondaryName = 'Realistic';

  if (scores && Object.keys(scores).length >= 2) {
    sortedScores = Object.entries(scores)
      .map(([code, val]) => ({ code, name: RIASEC_FULL[code] || code, value: Number(val) }))
      .sort((a, b) => b.value - a.value);
    const primaryCode   = sortedScores[0]?.code || 'I';
    const secondaryCode = sortedScores[1]?.code || 'R';
    primaryName   = RIASEC_FULL[primaryCode]   || primaryCode;
    secondaryName = RIASEC_FULL[secondaryCode] || secondaryCode;
  }

  const studentName  = profile?.name || localStorage.getItem('userName') || 'Student';
  const streamDisplay = {
    pcm: 'PCM', pcb: 'PCB', pcmb: 'PCM/PCB', comm: 'Commerce', arts: 'Arts', none: 'Not decided',
  }[profile?.stream || ''] || '';

  const hasScores    = sortedScores.length >= 2;
  const primaryColor = RIASEC_COLORS[primaryName] || NAVY;

  return (
    <div className="ft-dashboard-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--ft-text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>

      <ManzilHeader
        title="Career Report"
        right={(
          <>
            <LanguageToggle className="no-print" />
            <button
              type="button"
              className="manzil-header-btn"
              onClick={() => window.print()}
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
            >
              ⬇ Download PDF
            </button>
          </>
        )}
      />

      <div style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem', width: '100%' }}>

        {!hasScores ? (
          /* ── No scores state ──────────────────────────────────────── */
          <GlassCard elevated style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: 600, margin: '4rem auto' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
            <h2 style={{ color: 'var(--ft-neon-cyan)', marginBottom: 12 }}>No test results yet</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Take the psychometric test to generate your personalised RIASEC report.
              It takes 10–15 minutes and your results are saved to your profile.
            </p>
            <button
              onClick={() => {
                const token = getToken();
                const origin = window.location.origin;
                const url = token
                  ? `${APTITUDE_URL}?beacon_token=${encodeURIComponent(token)}&origin=${encodeURIComponent(origin)}`
                  : `${APTITUDE_URL}?origin=${encodeURIComponent(origin)}`;
                window.open(url, '_blank');
              }}
              className="ft-button-primary"
              style={{ padding: '0.9rem 2rem', borderRadius: 999, fontSize: '1rem', cursor: 'pointer' }}
            >
              Take the Psychometric Test →
            </button>
          </GlassCard>
        ) : (
          <>
            {/* ── Fresh-test congratulatory banner ─────────────────────── */}
            {freshTest && (
              <>
                {/* GIF banner — powered by bannerImage.js (change PROVIDER there to switch source) */}
                {bannerImage && (
                  <div style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    marginBottom: 20,
                    boxShadow: '0 6px 32px rgba(44,84,146,0.18)',
                  }}>
                    {/* Dark container — objectFit:contain so GIFs aren't cropped */}
                    <div style={{
                      background: '#0f172a',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 260,
                      position: 'relative',
                    }}>
                      <img
                        src={bannerImage}
                        alt="Congratulations GIF"
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                        onError={e => {
                          const wrap = e.target.closest('[data-gif-wrap]');
                          if (wrap) wrap.style.display = 'none';
                        }}
                      />
                      {/* Bottom fade blending into the text strip */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
                        background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 100%)',
                        pointerEvents: 'none',
                      }} />
                    </div>
                    {/* Text strip below GIF so the animation is never obscured */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1e3a5f 0%, #2C5492 100%)',
                      padding: '0.85rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                      <span style={{ fontSize: 24 }}>🎉</span>
                      <div style={{ color: '#fff' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                          You actually did it, {studentName.split(' ')[0]}!
                        </div>
                        <div style={{ opacity: 0.8, fontSize: '0.85rem', marginTop: 2 }}>
                          Your RIASEC personality report is ready below — scroll down to explore.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: 12,
                  padding: '1rem 1.5rem',
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>Test complete! Your RIASEC scores have been saved.</div>
                      <div style={{ opacity: 0.85, fontSize: '0.85rem', marginTop: 2 }}>Scroll down to see your personality profile, then view your personalised career matches.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { window.history.pushState({}, '', '/recommendations'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                    style={{
                      background: '#fff',
                      color: '#059669',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    View career matches →
                  </button>
                </div>
              </>
            )}

            {/* ── Personality Overview ─────────────────────────────────── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="Personality Overview" />
              <GlassCard elevated style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap', padding: '2rem' }}>
                <div style={{ flex: '0 0 170px' }}>
                  <div style={{ background: primaryColor + '20', color: '#fff', padding: '1.2rem', borderRadius: 12, textAlign: 'center', fontWeight: 800, fontSize: '1.3rem', border: `2px solid ${primaryColor}55`, textShadow: `0 0 10px ${primaryColor}aa` }}>
                    {primaryName}
                  </div>
                  <div style={{ marginTop: 14, color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.92rem' }}>
                    Secondary: <strong style={{ color: '#00d4ff' }}>{secondaryName}</strong>
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.55)' }}>
                    Holland Code: <strong style={{ color: '#00d4ff' }}>{sortedScores.slice(0, 3).map(s => s.code).join('')}</strong>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <p style={{ marginTop: 0, color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                    {PERSONALITY_DESCS[primaryName] || ''}
                  </p>
                  <div style={{ marginTop: 20 }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#00d4ff', fontSize: '1rem', fontWeight: 800 }}>RIASEC Scores</h4>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 20, borderRadius: 12 }}>
                      {sortedScores.map(item => (
                        <ScoreBar
                          key={item.code}
                          label={item.name}
                          value={item.value}
                          color={RIASEC_COLORS[item.name] || '#00d4ff'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />

            {/* ── RIASEC + WorkStyle Radar ──────────────────────────────── */}
            {radarData && radarData.length > 0 && (
              <>
                <section style={{ marginBottom: 32 }}>
                  <SectionHeading
                    title="Personality vs Work Style Alignment"
                    subtitle="The blue area shows your RIASEC test scores. The teal area shows how you rated each work activity during onboarding. Closer overlap = stronger alignment."
                  />
                  <GlassCard elevated style={{ padding: '2rem' }}>
                    <ResponsiveContainer width="100%" height={340}>
                       <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                        <PolarGrid gridType="polygon" stroke="rgba(255, 255, 255, 0.15)" />
                         <PolarAngleAxis
                           dataKey="dimension"
                           tick={<ReportRadarTick />}
                         />
                         <PolarRadiusAxis
                           angle={30}
                           domain={[0, 100]}
                           tick={{ fill: 'rgba(255, 255, 255, 0.45)', fontSize: 11 }}
                           tickCount={5}
                         />
                         <Radar
                           name="RIASEC Score"
                           dataKey="riasec"
                           stroke="#8b5cf6"
                           fill="#8b5cf6"
                           fillOpacity={0.25}
                           strokeWidth={2}
                           dot={{ fill: '#8b5cf6', r: 4 }}
                         />
                         <Radar
                           name="Work Style"
                           dataKey="workStyle"
                           stroke="#14b8a6"
                           fill="#14b8a6"
                           fillOpacity={0.25}
                           strokeWidth={2}
                           dot={{ fill: '#14b8a6', r: 4 }}
                         />
                         <Legend
                           formatter={v => <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, fontSize: 13 }}>{v}</span>}
                         />
                         <Tooltip content={<RadarTooltipContent />} />
                       </RadarChart>
                    </ResponsiveContainer>
                  </GlassCard>
                </section>
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />
              </>
            )}

            {/* ── Subject Strength Bar Chart ────────────────────────────── */}
            {subjectData && subjectData.length > 0 && (
              <>
                <section style={{ marginBottom: 32 }}>
                  <SectionHeading
                    title="Subject Strength Profile"
                    subtitle="Your self-rated comfort level with each subject — 1 (struggling) to 5 (favourite)."
                  />
                  <GlassCard elevated style={{ padding: '2rem' }}>
                    <ResponsiveContainer width="100%" height={Math.max(200, subjectData.length * 52)}>
                      <BarChart
                        data={subjectData}
                        layout="vertical"
                        margin={{ top: 4, right: 40, left: 10, bottom: 4 }}
                      >
                        <XAxis
                          type="number"
                          domain={[0, 5]}
                          ticks={[1, 2, 3, 4, 5]}
                          tick={{ fill: 'rgba(255, 255, 255, 0.45)', fontSize: 12 }}
                          tickFormatter={v => ['', '😟', '😐', '🙂', '😄', '⭐'][v] || v}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="subject"
                          width={130}
                          tick={{ fill: '#00d4ff', fontWeight: 700, fontSize: 13 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(val) => [`${val}/5 — ${['','Struggling','Getting by','Comfortable','Really good','Favourite'][val] || val}`, 'Rating']}
                          contentStyle={{ borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: '#080c24', color: '#fff', fontSize: 13 }}
                        />
                        <Bar dataKey="rating" radius={[0, 8, 8, 0]} maxBarSize={28}>
                          {subjectData.map((entry, i) => (
                            <Cell
                              key={i}
                              fill={entry.rating >= 4 ? '#f59e0b' : entry.rating === 3 ? '#00d4ff' : 'rgba(255, 255, 255, 0.15)'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12, fontSize: 12, color: 'rgba(255, 255, 255, 0.55)' }}>
                      <span><span style={{ color: '#f59e0b', fontWeight: 800 }}>■</span> Strong (4–5)</span>
                      <span><span style={{ color: '#00d4ff', fontWeight: 800 }}>■</span> Average (3)</span>
                      <span><span style={{ color: 'rgba(255, 255, 255, 0.3)', fontWeight: 800 }}>■</span> Needs work (1–2)</span>
                    </div>
                  </GlassCard>
                </section>
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />
              </>
            )}

            {/* ── Personality Traits ── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="Your Personality Traits" subtitle={`People with a ${primaryName} personality type typically show these characteristics:`} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {(TRAITS[primaryName] || []).map((trait, i) => (
                  <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 30, background: 'rgba(255,255,255,0.03)', border: '1.5px solid var(--ft-glass-border)', fontSize: '0.85rem', color: 'var(--ft-text-primary)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: primaryColor }} />
                    {trait}
                  </div>
                ))}
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

            {/* ── Strengths & Challenges ── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="Strengths & Challenges" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <GlassCard glowColor="green" style={{ padding: 20, borderTop: `3px solid ${primaryColor}` }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ft-text-primary)' }}>
                    <CheckCircle2 size={18} style={{ color: '#00ff88' }} /> Your Strengths
                  </h3>
                  <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(STRENGTHS[primaryName] || []).map((s, i) => <li key={i} style={{ color: 'var(--ft-text-secondary)', fontSize: '0.87rem' }}>{s}</li>)}
                  </ul>
                </GlassCard>
                <GlassCard glowColor="magenta" style={{ padding: 20, borderTop: `3px solid ${primaryColor}` }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ft-text-primary)' }}>
                    <AlertTriangle size={18} style={{ color: '#ff006e' }} /> Potential Challenges
                  </h3>
                  <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                    {(CHALLENGES[primaryName] || []).map((c, i) => <li key={i} style={{ color: 'var(--ft-text-secondary)', fontSize: '0.87rem' }}>{c}</li>)}
                  </ul>
                  <p style={{ margin: 0, color: 'var(--ft-text-muted)', fontSize: '0.78rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    These are natural tendencies, not fixed limitations. Awareness is the first step to growth.
                  </p>
                </GlassCard>
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

            {/* ── Ideal Work Environment ── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="Ideal Work Environment" />
              <GlassCard glowColor="cyan" style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <MapPin size={22} style={{ color: 'var(--ft-neon-cyan)', marginTop: 2, flexShrink: 0 }} />
                <p style={{ margin: 0, color: 'var(--ft-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {WORK_ENV[primaryName] || ""}
                </p>
              </GlassCard>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

            {/* ── Entrance Exams ── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="Entrance Exams to Target" subtitle={`Based on your stream (${profile?.stream?.toUpperCase() || 'Science'}) and career direction, these are the key exams to prepare for:`} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {(getExams(profile?.stream || 'pcm', sortedScores[0]?.code) || []).map((exam, i) => (
                  <GlassCard key={i} glowColor="cyan" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ft-neon-cyan)' }}>
                      <Target size={16} />
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{exam.name}</h4>
                    </div>
                    <p style={{ margin: 0, color: 'var(--ft-text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>{exam.desc}</p>
                  </GlassCard>
                ))}
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

            {/* ── Admission Process ── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="Navigating the Admission Process" subtitle={`Here is what the admission journey looks like for your stream:`} />
              <GlassCard glowColor="purple" style={{ padding: 22 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ft-text-primary)' }}>
                      <Calendar size={16} style={{ color: 'var(--ft-neon-purple)' }} /> Timeline
                    </h4>
                    <p style={{ margin: 0, color: 'var(--ft-text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                      {(ADMISSION_PROCESS[profile?.stream?.toUpperCase()] || ADMISSION_PROCESS["PCM"]).timeline}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ft-text-primary)' }}>
                      <FileText size={16} style={{ color: 'var(--ft-neon-purple)' }} /> Documents Needed
                    </h4>
                    <p style={{ margin: 0, color: 'var(--ft-text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                      {(ADMISSION_PROCESS[profile?.stream?.toUpperCase()] || ADMISSION_PROCESS["PCM"]).docs}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ft-text-primary)' }}>
                      <TrendingUp size={16} style={{ color: 'var(--ft-neon-purple)' }} /> Typical Cutoffs
                    </h4>
                    <p style={{ margin: 0, color: 'var(--ft-text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                      {(ADMISSION_PROCESS[profile?.stream?.toUpperCase()] || ADMISSION_PROCESS["PCM"]).cutoffs}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

            {/* ── Action Plan ── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="Your Personalised Action Plan" subtitle={`A step-by-step roadmap from now until college — built around your ${primaryName} personality:`} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(ACTION_PLAN[primaryName] || []).map((phase, i) => (
                  <GlassCard
                    key={i}
                    glowColor="cyan"
                    style={{ padding: 18 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 10, marginBottom: 12 }}>
                      <Compass size={18} style={{ color: primaryColor }} />
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--ft-text-primary)' }}>{phase.phase}</h4>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(phase.actions || []).map((it, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: primaryColor, marginTop: 6, flexShrink: 0 }} />
                          <span style={{ fontSize: 13.5, color: 'var(--ft-text-secondary)', lineHeight: 1.5 }}>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                ))}
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

            {/* ── Skills to Build ── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="Skills to Build Now" subtitle="Start developing these skills before Class 12 ends — they will strengthen both your applications and your confidence:" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {(getSkills(sortedScores[0]?.code, sortedScores[1]?.code) || []).map((skill, i) => (
                  <GlassCard key={i} glowColor="purple" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ft-neon-purple)' }}>
                      <BookOpen size={16} />
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{skill.name}</h4>
                    </div>
                    <p style={{ margin: 0, color: 'var(--ft-text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>{skill.desc}</p>
                  </GlassCard>
                ))}
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

            {/* ── Parent Section ── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="For Your Parents" subtitle="A clear, jargon-free note to share with your parents — to help them understand your personality type and how to support you." />
              <GlassCard glowColor="green" style={{ padding: 22, borderLeft: `4px solid ${primaryColor}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Heart size={20} style={{ color: primaryColor }} />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--ft-text-primary)' }}>
                    A note for parents of a <strong>{primaryName}</strong> child
                  </h4>
                </div>
                <p style={{ color: 'var(--ft-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  {PARENT_NOTES[primaryName] || ""}
                </p>
                <p style={{ margin: 0, color: 'var(--ft-text-muted)', fontSize: '0.78rem', fontStyle: 'italic', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: 12 }}>
                  Share this report openly with your parents. A career decision works best when student, parents, and teachers are aligned on a path that fits the child's authentic personality.
                </p>
              </GlassCard>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

            {/* ── Closing Note ── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="A Note for You" />
              <GlassCard glowColor="cyan" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: primaryColor }} />
                <p style={{ margin: '0 0 14px 0', color: 'var(--ft-text-secondary)', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  {getClosingNote(primaryName)}
                </p>
                <p style={{ margin: 0, color: 'var(--ft-text-muted)', fontSize: '0.78rem', fontStyle: 'italic' }}>
                  Remember — this report is a starting point, not a verdict. Career paths are rarely straight lines. Use this as a guide to explore, ask questions, and make informed choices. You have time.
                </p>
              </GlassCard>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

            {/* ── Full score breakdown cards ────────────────────────────── */}
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ color: '#00d4ff', margin: '0 0 16px 0', fontSize: '1.4rem', fontWeight: 800 }}>Your Full Score Breakdown</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                {sortedScores.map((item, i) => (
                  <div key={item.code} style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${i === 0 ? (item.color || primaryColor) + '77' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderTop: `3px solid ${RIASEC_COLORS[item.name] || '#94a3b8'}`,
                    borderRadius: 10,
                    padding: '1.2rem',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.05rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: 2 }}>{item.code}</div>
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: RIASEC_COLORS[item.name] || 'rgba(255, 255, 255, 0.85)' }}>
                        {item.value}%
                      </div>
                    </div>
                    <div style={{ marginTop: 12, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${item.value}%`, height: '100%', background: RIASEC_COLORS[item.name] || '#00d4ff', borderRadius: 6 }} />
                    </div>
                    {i === 0 && <div style={{ marginTop: 10, fontSize: '0.8rem', color: primaryColor, fontWeight: 700 }}>Primary type</div>}
                    {i === 1 && <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 700 }}>Secondary type</div>}
                  </div>
                ))}
              </div>
            </section>

            <footer style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 13, textAlign: 'center', padding: '1rem 0 4rem 0' }}>
              Manzil © 2026 — This report is based on the globally validated RIASEC psychometric model.
              For personalised counselling contact our team.
            </footer>
          </>
        )}
      </div>

      <style>{`
        @media print {
          body, .ft-dashboard-bg {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, button, footer, hr {
            display: none !important;
          }
          .glass-card, [style*="background"] {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #cccccc !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          h2, h3, h4, span, div, p {
            color: #000000 !important;
            text-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Data-transform helpers ───────────────────────────────────────── */

/** Build the 6-axis radar dataset from RIASEC scores + work_style sliders */
function transformRadarData(scores, workStyle) {
  if (!scores) return null;

  const axes = [
    { key: 'Realistic',     wsKey: 'building'    },
    { key: 'Investigative', wsKey: 'researching' },
    { key: 'Artistic',      wsKey: 'creative'    },
    { key: 'Social',        wsKey: 'helping'     },
    { key: 'Enterprising',  wsKey: 'leading'     },
    { key: 'Conventional',  wsKey: 'structured'  },
  ];

  const codeToName = { R:'Realistic', I:'Investigative', A:'Artistic', S:'Social', E:'Enterprising', C:'Conventional' };

  // Build a name→score map from scores object (keys may be codes OR names)
  const scoreByName = {};
  Object.entries(scores).forEach(([k, v]) => {
    const name = codeToName[k] || k;
    scoreByName[name] = Number(v);
  });

  return axes.map(({ key, wsKey }) => {
    const riasecVal   = scoreByName[key] ?? 0;
    // WorkStyle is 1–5; normalise to 0–100
    const wsRaw       = workStyle?.[wsKey];
    const workStyleVal = wsRaw != null ? Math.round((Number(wsRaw) / 5) * 100) : null;

    const row = { dimension: key, riasec: riasecVal };
    if (workStyleVal !== null) row.workStyle = workStyleVal;
    return row;
  });
}

/** Build subject bar chart data from subject_ratings object */
function transformSubjectData(subjectRatings) {
  if (!subjectRatings || Object.keys(subjectRatings).length === 0) return null;

  const LABELS = {
    mathematics:       'Mathematics',
    physics:           'Physics',
    chemistry:         'Chemistry',
    biology:           'Biology',
    computerScience:   'Computer Science',
    englishLiterature: 'English & Lit.',
    accountancy:       'Accountancy',
    businessStudies:   'Business Studies',
    economics:         'Economics',
    history:           'History',
    geography:         'Geography',
    politicalScience:  'Political Science',
    science:           'Science',
    socialScience:     'Social Science',
    hindi:             'Hindi',
  };

  return Object.entries(subjectRatings)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a) // highest rated first
    .map(([key, val]) => ({
      subject: LABELS[key] || key,
      rating:  Number(val),
    }));
}
