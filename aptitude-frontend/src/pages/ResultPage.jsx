import { Download, Briefcase, GraduationCap, Target, Users, Compass, AlertTriangle, CheckCircle2, Calendar, MapPin, BookOpen, TrendingUp, Heart, FileText } from "lucide-react";
import "./ResultPage.css";

const CATEGORY_COLORS = {
  Investigative: "#3b82f6", Realistic: "#ef4444", Conventional: "#22c55e",
  Enterprising: "#f97316", Artistic: "#8b5cf6", Social: "#14b8a6",
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

const AVOID_CAREERS = {
  Investigative: ["Sales representative", "Event coordinator", "Professional entertainer", "Routine data entry clerk"],
  Realistic: ["Professional counsellor", "Public relations manager", "Abstract researcher", "Fine arts professional"],
  Artistic: ["Auditor or tax accountant", "Quality control inspector", "Routine administrative officer", "Assembly line supervisor"],
  Social: ["Isolated research scientist", "Financial auditor", "Machine operator", "Independent technical analyst"],
  Enterprising: ["Routine clerical worker", "Laboratory researcher", "Detailed financial analyst", "Assembly technician"],
  Conventional: ["Professional artist", "Freelance creative", "Startup founder", "Abstract philosopher or theorist"],
};

// Feature 1 — Parent-Child Understanding section
const PARENT_NOTES = {
  Investigative: "Your child is a deep thinker — naturally curious, analytical, and motivated by understanding how things work. They will do best in careers that reward intellectual depth and independent problem solving. Support them by encouraging questions, providing access to books, research articles, and projects. Avoid pushing them toward fast-paced sales or routine clerical roles — they will likely feel unfulfilled. Careers in science, research, technology, and medicine align with their natural strengths.",
  Realistic: "Your child is practical and hands-on — they learn best by doing, not by reading or theorising. They thrive when working with tools, systems, and tangible outcomes. Support them with workshops, technical hobbies, or mechanical projects. Engineering, technical fields, and applied sciences suit their personality. Avoid pressuring them into highly abstract or people-heavy roles unless they show genuine interest.",
  Artistic: "Your child is creative and expressive — they need freedom to imagine, design, and create. Rigid structures and rule-bound environments will drain them. Support them by encouraging creative outlets and respecting their need for self-expression. Careers in design, media, architecture, and creative technology suit them well. India's creative economy is growing rapidly — this is a legitimate, financially viable path.",
  Social: "Your child is empathetic and people-oriented — they are energised by helping others and building relationships. They will find meaning in careers that involve teaching, healing, counselling, or community work. Support them by valuing emotional intelligence as a real skill. Careers in education, healthcare, psychology, and social work suit them deeply. They may need encouragement to also pursue their own goals, not just others'.",
  Enterprising: "Your child is ambitious and naturally driven to lead. They thrive in challenging, fast-paced environments where they can take initiative and influence others. Support them by encouraging leadership roles, public speaking, and business thinking. Careers in business, law, entrepreneurship, and management suit them. They may take risks — guide them, but resist the urge to over-control their decisions.",
  Conventional: "Your child is precise, organised, and methodical — they excel at structure, accuracy, and consistency. They thrive in stable, well-defined environments. Support them by valuing their reliability and attention to detail. Careers in finance, accounting, administration, and data management align with their strengths. India has strong, secure career paths in these areas — your child is well-suited to them.",
};

// Feature 2 — International salary mapping
const INTERNATIONAL_SALARY = {
  "Data Scientist": "$80,000 – $140,000 (US)",
  "Software Engineer": "$95,000 – $170,000 (US)",
  "Research Scientist": "$70,000 – $120,000 (US)",
  "Biomedical Engineer": "$70,000 – $115,000 (US)",
  "Environmental Scientist": "$60,000 – $95,000 (US)",
  "Data Analyst": "$60,000 – $100,000 (US)",
  "UX Researcher": "$85,000 – $140,000 (US)",
  "Cognitive Scientist": "$70,000 – $110,000 (US)",
  "Product Designer": "$90,000 – $150,000 (US)",
  "Psychologist": "$70,000 – $115,000 (US)",
  "Behavioural Economist": "$95,000 – $160,000 (US)",
  "Research Psychologist": "$70,000 – $110,000 (US)",
  "Mechanical Engineer": "$70,000 – $110,000 (US)",
  "Civil Engineer": "$65,000 – $105,000 (US)",
  "Physiotherapist": "$70,000 – $100,000 (US)",
  "Veterinarian": "$90,000 – $140,000 (US)",
  "Occupational Therapist": "$75,000 – $105,000 (US)",
  "Architect": "$70,000 – $120,000 (US)",
  "Industrial Designer": "$65,000 – $100,000 (US)",
  "Game Designer": "$70,000 – $130,000 (US)",
  "UI/UX Designer": "$80,000 – $130,000 (US)",
  "Graphic Designer": "$50,000 – $85,000 (US)",
  "Creative Technologist": "$90,000 – $150,000 (US)",
  "Content Strategist": "$70,000 – $115,000 (US)",
  "Journalist": "$45,000 – $85,000 (US)",
  "PR Specialist": "$55,000 – $95,000 (US)",
  "Psychotherapist": "$70,000 – $120,000 (US)",
  "Writer / Author": "$50,000 – $100,000 (US)",
  "Film Director": "$80,000 – $200,000+ (US)",
  "School Counsellor": "$55,000 – $80,000 (US)",
  "Social Worker": "$45,000 – $75,000 (US)",
  "NGO Program Manager": "$60,000 – $100,000 (US)",
  "Human Resources Manager": "$80,000 – $130,000 (US)",
  "Teacher / Educator": "$50,000 – $80,000 (US)",
  "Event Manager": "$50,000 – $90,000 (US)",
  "Clinical Psychologist": "$80,000 – $130,000 (US)",
  "Counselling Psychologist": "$60,000 – $100,000 (US)",
  "Health Educator": "$50,000 – $80,000 (US)",
  "Management Consultant": "$100,000 – $200,000+ (US)",
  "Entrepreneur": "Variable (Equity-based)",
  "Investment Banker": "$120,000 – $300,000+ (US)",
  "Marketing Manager": "$80,000 – $140,000 (US)",
  "Brand Strategist": "$85,000 – $150,000 (US)",
  "Advertising Creative Director": "$100,000 – $200,000 (US)",
  "Operations Manager": "$80,000 – $130,000 (US)",
  "Supply Chain Manager": "$80,000 – $135,000 (US)",
  "Business Development Manager": "$80,000 – $140,000 (US)",
  "Chartered Accountant": "$70,000 – $130,000 (US)",
  "Financial Analyst": "$70,000 – $120,000 (US)",
  "Tax Consultant": "$60,000 – $110,000 (US)",
  "Bank Manager": "$75,000 – $130,000 (US)",
  "Administrative Officer": "$50,000 – $85,000 (US)",
  "Office Manager": "$50,000 – $80,000 (US)",
  "Data Entry Specialist": "$35,000 – $55,000 (US)",
  "Quality Assurance Analyst": "$60,000 – $100,000 (US)",
  "Lab Technician": "$40,000 – $70,000 (US)",
  "Electrician / Electrical Engineer": "$60,000 – $110,000 (US)",
  "Content Creator": "Variable (Platform-based)",
  "Counsellor": "$50,000 – $85,000 (US)",
  "Sales Manager": "$80,000 – $140,000 (US)",
  "Administrative Manager": "$60,000 – $95,000 (US)",
  "Teacher": "$50,000 – $80,000 (US)",
};

// Feature 3 — Broader sector careers
const BROADER_CAREERS = {
  Investigative: {
    Technology: ["Software Engineer", "Data Scientist", "AI/ML Engineer", "Cybersecurity Analyst"],
    Healthcare: ["Research Doctor", "Epidemiologist", "Medical Researcher", "Biotech Scientist"],
    Science: ["Research Scientist", "Astrophysicist", "Geneticist", "Environmental Scientist"],
    Business: ["Business Analyst", "Quantitative Analyst", "Market Research Analyst", "Economist"],
  },
  Realistic: {
    Engineering: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Aerospace Engineer"],
    Technology: ["Hardware Engineer", "Robotics Engineer", "DevOps Engineer", "Network Administrator"],
    Skilled_Trades: ["Electrician", "Plumber", "Carpenter", "Construction Manager"],
    Healthcare: ["Surgeon", "Dental Surgeon", "Veterinarian", "Physiotherapist"],
  },
  Artistic: {
    Design: ["UI/UX Designer", "Graphic Designer", "Product Designer", "Interior Designer"],
    Media: ["Film Director", "Photographer", "Animator", "Content Creator"],
    Writing: ["Author", "Journalist", "Screenwriter", "Copywriter"],
    Performing_Arts: ["Musician", "Actor", "Dancer", "Performance Artist"],
  },
  Social: {
    Education: ["Teacher", "Professor", "School Principal", "Educational Counsellor"],
    Healthcare: ["Doctor", "Nurse", "Therapist", "Mental Health Counsellor"],
    Social_Services: ["Social Worker", "NGO Manager", "Community Organiser", "Diplomat"],
    Human_Resources: ["HR Manager", "Talent Acquisition", "Organisational Development", "Employee Relations"],
  },
  Enterprising: {
    Business: ["Entrepreneur", "Management Consultant", "Investment Banker", "Business Development"],
    Law: ["Lawyer", "Corporate Counsel", "Public Prosecutor", "Legal Advisor"],
    Marketing: ["Marketing Manager", "Brand Strategist", "Sales Director", "Advertising Director"],
    Politics_Public: ["Politician", "Civil Services Officer", "Public Policy Analyst", "Diplomat"],
  },
  Conventional: {
    Finance: ["Chartered Accountant", "Financial Analyst", "Tax Consultant", "Auditor"],
    Banking: ["Bank Manager", "Loan Officer", "Investment Advisor", "Treasury Analyst"],
    Administration: ["Operations Manager", "Office Administrator", "Project Coordinator", "Compliance Officer"],
    Data_Records: ["Data Analyst", "Records Manager", "Database Administrator", "Quality Control"],
  },
};

// Feature 4 — Personalised Action Plan timeline
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

// Feature 6 — Admission process guide
const ADMISSION_PROCESS = {
  PCM: { timeline: "Class 12 final year — apply Oct–Mar; exams Jan–June; counselling June–Aug.", docs: "Class 10 & 12 marksheets, JEE scorecard, ID proof, photos, category certificate (if applicable).", cutoffs: "JEE Main: 90+ percentile for NITs, 95+ for IIITs. JEE Advanced: rank under 10,000 for IITs." },
  PCB: { timeline: "Class 12 final year — apply Dec–Feb; NEET in May; counselling July–Sep.", docs: "Class 10 & 12 marksheets, NEET scorecard, ID proof, photos, category certificate (if applicable).", cutoffs: "NEET: 600+ for government MBBS in most states, 720 for AIIMS Delhi." },
  Commerce: { timeline: "Class 12 final year — CUET in May, CA Foundation in May/Nov, IPMAT in May.", docs: "Class 10 & 12 marksheets, entrance exam scorecard, ID proof, photos.", cutoffs: "CUET: 95+ percentile for top DU colleges. CA Foundation: 50% aggregate, 40% per subject." },
  Humanities: { timeline: "Class 12 final year — CUET in May, CLAT in Dec, NID/NIFT in Jan.", docs: "Class 10 & 12 marksheets, entrance exam scorecard, portfolio (for design), ID proof.", cutoffs: "CUET: 95+ percentile for top humanities colleges. CLAT: rank under 500 for NLU Bangalore." },
};

export default function ResultPage({ result, onDownloadPDF, onRetake }) {
  const primary = result.primary_type;
  const primaryCode = primary[0];
  const traits = TRAITS[primary] || [];
  const strengths = STRENGTHS[primary] || [];
  const challenges = CHALLENGES[primary] || [];
  const workEnv = WORK_ENV[primary] || "";
  const avoidCareers = AVOID_CAREERS[primary] || [];
  const parentNote = PARENT_NOTES[primary] || "";
  const broaderCareers = BROADER_CAREERS[primary] || {};
  const actionPlan = ACTION_PLAN[primary] || [];
  const admission = ADMISSION_PROCESS[result.stream] || ADMISSION_PROCESS["PCM"];

  return (
    <div className="result-page">
      <header className="cc-header">
        <span className="cc-logo">Beacon</span>
        <div className="cc-header-center">
          <h1>Beacon Personality &amp; Career Report</h1>
          <p>{result.name} • {result.class_level} • {result.stream}</p>
          <p style={{fontSize:"12px", color:"#64748b"}}>{new Date().toISOString()}</p>
        </div>
        <button className="btn-outline" onClick={onDownloadPDF}><Download size={16}/> Download PDF</button>
      </header>

      <div className="result-container">

        {/* Personality Overview */}
        <section className="result-section">
          <h2 className="section-title">Personality Overview</h2>
          <div className="overview-layout">
            <div className="overview-left">
              <span className="primary-type" style={{color: CATEGORY_COLORS[primary] || "#3b82f6"}}>{primary}</span>
              <p className="secondary-type">Secondary: <strong>{result.secondary_type}</strong></p>
              <div className="holland-code">
                <span className="hc-label">Holland Code</span>
                <span className="hc-value">{result.holland_code}</span>
              </div>
            </div>
            <div className="overview-right">
              <p className="description-text">{result.description}</p>
            </div>
          </div>

          <div className="scores-section">
            <p className="scores-title">RIASEC Scores</p>
            {result.scores.map(item => (
              <div key={item.category} className="score-row">
                <span className="score-label">{item.category}</span>
                <div className="score-bar-wrap">
                  <div className="score-bar-fill" style={{width:`${item.score}%`, background: CATEGORY_COLORS[item.category] || "#3b82f6"}}/>
                </div>
                <span className="score-pct">{item.score}%</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Traits */}
        <section className="result-section">
          <h2 className="section-title">Your Personality Traits</h2>
          <p className="section-sub">People with a <strong>{primary}</strong> personality type typically show these characteristics:</p>
          <div className="traits-grid">
            {traits.map((trait, i) => (
              <div key={i} className="trait-chip">
                <span className="trait-dot" style={{background: CATEGORY_COLORS[primary]}}/>
                {trait}
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Strengths & Challenges */}
        <section className="result-section">
          <h2 className="section-title">Strengths &amp; Challenges</h2>
          <div className="sc-layout">
            <div className="sc-card strengths-card">
              <h3><CheckCircle2 size={18}/> Your strengths</h3>
              <ul>{strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="sc-card challenges-card">
              <h3><AlertTriangle size={18}/> Potential challenges</h3>
              <ul>{challenges.map((c, i) => <li key={i}>{c}</li>)}</ul>
              <p className="challenge-note">These are natural tendencies, not fixed limitations. Awareness is the first step to growth.</p>
            </div>
          </div>
        </section>

        <hr className="divider"/>

        {/* Ideal Work Environment */}
        <section className="result-section">
          <h2 className="section-title">Your Ideal Work Environment</h2>
          <div className="work-env-card">
            <MapPin size={20} className="env-icon"/>
            <p>{workEnv}</p>
          </div>
        </section>

        <hr className="divider"/>

        {/* Top 3 Career Matches with international salary */}
        <section className="result-section">
          <h2 className="section-title">Top 3 Career Matches</h2>
          <p className="section-sub">These careers are matched to your Holland Code <strong>{result.holland_code}</strong> and stream <strong>{result.stream}</strong>. Salary ranges shown for India and the US.</p>
          {result.careers.map((career, i) => (
            <div key={i} className="career-card">
              <div className="career-header">
                <div>
                  <h3>{i + 1}. {career.title}</h3>
                  <span className="stream-tag">{career.stream}</span>
                </div>
                <div className="career-right">
                  <span className="salary">{career.salary}</span>
                  <span className="salary-label">India (annual)</span>
                  {INTERNATIONAL_SALARY[career.title] && (
                    <>
                      <span className="salary-intl">{INTERNATIONAL_SALARY[career.title]}</span>
                      <span className="salary-label">International</span>
                    </>
                  )}
                </div>
              </div>
              <p className="career-reason">{career.reason}</p>
            </div>
          ))}
        </section>

        <hr className="divider"/>

        {/* Broader Career Sectors */}
        <section className="result-section">
          <h2 className="section-title">Careers Across Other Sectors</h2>
          <p className="section-sub">Beyond your top 3, your <strong>{primary}</strong> personality also fits well in these careers across different industries:</p>
          <div className="sectors-grid">
            {Object.entries(broaderCareers).map(([sector, careers]) => (
              <div key={sector} className="sector-card">
                <h4><Briefcase size={16}/> {sector.replace(/_/g, " ")}</h4>
                <ul>
                  {careers.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Careers to avoid */}
        <section className="result-section">
          <h2 className="section-title">Careers Less Suited to You</h2>
          <p className="section-sub">Based on your personality profile, these career paths may feel draining or misaligned with how you naturally work. This does not mean you cannot do them — only that they may require more effort to sustain long-term.</p>
          <div className="avoid-grid">
            {avoidCareers.map((c, i) => (
              <div key={i} className="avoid-chip">{c}</div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Entrance Exams */}
        <section className="result-section">
          <h2 className="section-title">Entrance Exams to Target</h2>
          <p className="section-sub">Based on your stream ({result.stream}) and career direction, these are the key exams to prepare for:</p>
          <div className="exam-grid">
            {result.entrance_exams.map((exam, i) => (
              <div key={i} className="exam-card">
                <Target size={18}/>
                <h4>{exam.name}</h4>
                <p>{exam.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Admission Process Guide */}
        <section className="result-section">
          <h2 className="section-title">Navigating the Admission Process</h2>
          <p className="section-sub">Here is what the admission journey looks like for your stream ({result.stream}):</p>
          <div className="admission-card">
            <div className="admission-block">
              <h4><Calendar size={16}/> Timeline</h4>
              <p>{admission.timeline}</p>
            </div>
            <div className="admission-block">
              <h4><FileText size={16}/> Documents needed</h4>
              <p>{admission.docs}</p>
            </div>
            <div className="admission-block">
              <h4><TrendingUp size={16}/> Typical cutoffs</h4>
              <p>{admission.cutoffs}</p>
            </div>
          </div>
        </section>

        <hr className="divider"/>

        {/* Personalised Action Plan */}
        <section className="result-section">
          <h2 className="section-title">Your Personalised Action Plan</h2>
          <p className="section-sub">A step-by-step roadmap from now until college — built around your <strong>{primary}</strong> personality:</p>
          <div className="action-timeline">
            {actionPlan.map((phase, i) => (
              <div key={i} className="phase-card">
                <div className="phase-header">
                  <Compass size={18}/>
                  <h4>{phase.phase}</h4>
                </div>
                <ul>
                  {phase.actions.map((action, j) => <li key={j}>{action}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Skills to build */}
        <section className="result-section">
          <h2 className="section-title">Skills to Build Now</h2>
          <p className="section-sub">Start developing these skills before Class 12 ends — they will strengthen both your applications and your confidence:</p>
          <div className="skills-grid">
            {result.skills_to_build.map((skill, i) => (
              <div key={i} className="skill-card">
                <BookOpen size={16}/>
                <h4>{skill.name}</h4>
                <p>{skill.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider"/>

        {/* Parent-Child Understanding */}
        <section className="result-section">
          <h2 className="section-title">For Your Parents</h2>
          <p className="section-sub">A clear, jargon-free note to share with your parents — to help them understand your personality type and how to support you.</p>
          <div className="parent-card" style={{borderLeftColor: CATEGORY_COLORS[primary]}}>
            <div className="parent-card-header">
              <Heart size={20} style={{color: CATEGORY_COLORS[primary]}}/>
              <h4>A note for parents of a <strong>{primary}</strong> child</h4>
            </div>
            <p>{parentNote}</p>
            <p className="parent-footer">Share this report openly with your parents. A career decision works best when student, parents, and teachers are aligned on a path that fits the child's authentic personality.</p>
          </div>
        </section>

        <hr className="divider"/>

        {/* Closing Note */}
        <section className="result-section">
          <h2 className="section-title">A Note for You</h2>
          <div className="closing-card">
            <div className="closing-accent" style={{background: CATEGORY_COLORS[primary]}}/>
            <p className="closing-text">{result.closing_note}</p>
            <p className="closing-footer">Remember — this report is a starting point, not a verdict. Career paths are rarely straight lines. Use this as a guide to explore, ask questions, and make informed choices. You have time.</p>
          </div>
        </section>

        <div className="result-footer">
          <p>Beacon © 2026 — This report is an illustrative guide based on a psychometric assessment. For personalised counselling, contact a qualified career counsellor.</p>
          <div className="footer-actions">
            <button className="btn-primary" style={{ background: '#10b981' }} onClick={() => window.location.href = "http://localhost:5173/recommendations"}><Compass size={16}/> Return to Beacon Dashboard</button>
            <button className="btn-primary" onClick={onDownloadPDF}><Download size={16}/> Download PDF Report</button>
            <button className="btn-ghost" onClick={onRetake}>Take Test Again</button>
          </div>
        </div>

      </div>
    </div>
  );
}