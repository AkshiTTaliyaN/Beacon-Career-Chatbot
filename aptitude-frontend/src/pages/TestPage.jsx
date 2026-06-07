import { useState, useEffect } from "react";
import QUESTIONS from "../data/questions";
import { RIASEC_COLORS } from "../constants/riasecColors";
import "./TestPage.css";

const CATEGORY_LABELS = { R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" };

const CATEGORY_MOTTOS = {
  R: "This section explores how much you enjoy working with your hands and the physical world.",
  I: "This section explores your curiosity, analytical thinking, and love for research.",
  A: "This section explores your creative instincts, imagination, and expressive side.",
  S: "This section explores how much you enjoy connecting with, helping, and supporting people.",
  E: "This section explores your leadership drive, ambition, and entrepreneurial spirit.",
  C: "This section explores your comfort with structure, organisation, and precision.",
};

const CATEGORY_INFO = {
  R: {
    color: RIASEC_COLORS.R,
    tagline: "The Builder",
    about: "Realistic types are practical, hands-on people who enjoy working with tools, machines, and physical systems. They prefer concrete tasks with visible results over abstract thinking.",
    careers: ["Mechanical Engineer", "Architect", "Electrician", "Pilot", "Civil Engineer"],
    tip: "Think about activities you genuinely enjoy — not ones you think sound good.",
  },
  I: {
    color: RIASEC_COLORS.I,
    tagline: "The Thinker",
    about: "Investigative types are curious, analytical, and love solving complex problems. They are driven by a need to understand how things work and thrive in research and data-driven environments.",
    careers: ["Data Scientist", "Research Scientist", "Doctor", "Software Engineer", "Economist"],
    tip: "Answer based on your natural curiosity — not what you studied or were told to like.",
  },
  A: {
    color: RIASEC_COLORS.A,
    tagline: "The Creator",
    about: "Artistic types are imaginative, expressive, and value originality. They thrive in environments that offer creative freedom and dislike rigid structures or routine.",
    careers: ["UI/UX Designer", "Film Director", "Journalist", "Architect", "Musician"],
    tip: "Think about when you feel most free and energised — that is your Artistic side speaking.",
  },
  S: {
    color: RIASEC_COLORS.S,
    tagline: "The Helper",
    about: "Social types are empathetic, people-oriented, and motivated by helping others. They are natural communicators who find meaning in making a positive difference in people's lives.",
    careers: ["Psychologist", "Teacher", "Doctor", "Social Worker", "HR Manager"],
    tip: "Reflect on moments when helping someone felt genuinely fulfilling — not just polite.",
  },
  E: {
    color: RIASEC_COLORS.E,
    tagline: "The Leader",
    about: "Enterprising types are ambitious, persuasive, and natural leaders. They are energised by challenge, competition, and the opportunity to influence and achieve.",
    careers: ["Entrepreneur", "Lawyer", "Marketing Manager", "Politician", "Business Consultant"],
    tip: "Think about whether you naturally step up in group situations — or prefer to follow.",
  },
  C: {
    color: RIASEC_COLORS.C,
    tagline: "The Organiser",
    about: "Conventional types are detail-oriented, methodical, and thrive in structured environments. They excel at managing information, following systems, and ensuring accuracy.",
    careers: ["Chartered Accountant", "Financial Analyst", "Bank Manager", "Data Analyst", "Administrator"],
    tip: "Answer honestly about whether you find order and systems comforting or restricting.",
  },
};

const SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export default function TestPage({ onSubmit, onBack, profileData }) {
  const [step, setStep] = useState("details");
  const [details, setDetails] = useState({
    name: profileData?.name || "",
    class_level: profileData?.class_level || "",
    stream: profileData?.stream || ""
  });

  useEffect(() => {
    if (profileData && profileData.name) {
      setDetails({
        name: profileData.name,
        class_level: profileData.class_level,
        stream: profileData.stream
      });
    }
  }, [profileData]);
  const [answers, setAnswers] = useState(Array(60).fill(0));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(0);

  const progress = (current / 60) * 100;
  const q = QUESTIONS[current];
  const currentCat = q.category;
  const sectionStart = ["R","I","A","S","E","C"].indexOf(currentCat) * 10;
  const qInSection = current - sectionStart + 1;
  const info = CATEGORY_INFO[currentCat];

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!details.name.trim() || !details.class_level || !details.stream) {
      alert("Please fill in all fields.");
      return;
    }
    setStep("questions");
  };

  const handleNext = () => {
    if (selected === 0) { alert("Please select an option before continuing."); return; }
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    if (current < 59) {
      setCurrent(current + 1);
      setSelected(newAnswers[current + 1] || 0);
    } else {
      onSubmit({ name: details.name.trim(), class_level: details.class_level, stream: details.stream, answers: newAnswers });
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      const newAnswers = [...answers];
      newAnswers[current] = selected;
      setAnswers(newAnswers);
      setCurrent(current - 1);
      setSelected(newAnswers[current - 1] || 0);
    }
  };

  if (step === "details") {
    return (
      <div className="test-page">
        <header className="cc-header">
          <span className="cc-logo">Beacon</span>
          <button className="btn-outline" onClick={onBack}>← Back</button>
        </header>
        <div className="details-container">
          <div className="intro-card">
            <div className="intro-badge">RIASEC Psychometric Assessment</div>
            <h1>Career Aptitude Test</h1>
            <p>This test uses the <strong>Holland RIASEC model</strong> — one of the most widely validated career frameworks in the world. You will rate 60 statements across 6 personality dimensions.</p>
            <p>Be honest — there are no right or wrong answers. Choose what genuinely reflects you, not what sounds impressive.</p>
            <div className="intro-stats">
              <div><strong>60</strong><span>Questions</span></div>
              <div><strong>6</strong><span>Dimensions</span></div>
              <div><strong>10–15 min</strong><span>Estimated time</span></div>
              <div><strong>Instant</strong><span>Results</span></div>
            </div>
          </div>
          <form className="details-form" onSubmit={handleDetailsSubmit}>
            <h2>{profileData ? "Confirm your details" : "Enter your details"}</h2>
            <p className="form-sub" style={profileData ? {color: '#10b981', fontWeight: 600} : {}}>
              {profileData ? "✓ Your details are pre-filled from your Beacon profile." : "Your details appear on your personalised report. They are not stored anywhere."}
            </p>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. Aryan Sharma" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} disabled={!!profileData} required/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Current Class</label>
                <select value={details.class_level} onChange={e => setDetails({...details, class_level: e.target.value})} disabled={!!profileData} required>
                  <option value="">Select class</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
              <div className="form-group">
                <label>Stream (or Intended)</label>
                <select value={details.stream} onChange={e => setDetails({...details, stream: e.target.value})} disabled={!!profileData} required>
                  <option value="">Select stream</option>
                  <option value="PCM">PCM (Physics, Chemistry, Maths)</option>
                  <option value="PCB">PCB (Physics, Chemistry, Biology)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Humanities">Humanities / Arts</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary btn-large" style={{width:"100%", marginTop:"12px"}}>
              Begin Test →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="test-page">
      <header className="cc-header">
        <span className="cc-logo">Beacon</span>
        <div className="cc-header-center">
          <h1>Career Aptitude Test</h1>
          <p>{details.name} • {details.class_level} • {details.stream}</p>
        </div>
        <span className="q-counter-header">Question {current + 1} of 60</span>
      </header>

      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{width:`${progress}%`}}/>
      </div>

      <div className="test-layout">

        {/* Left sidebar — progress */}
        <aside className="test-sidebar">
          <p className="sidebar-title">Your progress</p>
          {["R","I","A","S","E","C"].map((cat, i) => {
            const start = i * 10;
            const answered = answers.slice(start, start + 10).filter(a => a > 0).length;
            const isActive = cat === currentCat;
            const isDone = answered === 10;
            return (
              <div key={cat} className={`sidebar-cat ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                <div className="sidebar-cat-header">
                  <span className="sidebar-code" style={{color: CATEGORY_INFO[cat].color}}>{cat}</span>
                  <span className="sidebar-name">{CATEGORY_LABELS[cat]}</span>
                  <span className="sidebar-count">{answered}/10</span>
                </div>
                <div className="sidebar-bar">
                  <div className="sidebar-bar-fill" style={{width:`${(answered/10)*100}%`, background: CATEGORY_INFO[cat].color}}/>
                </div>
              </div>
            );
          })}
        </aside>

        {/* Centre — question */}
        <main className="test-main">
          <div className="section-motto">
            <span className="section-badge" style={{background: info.color + "18", color: info.color}}>
              {CATEGORY_LABELS[currentCat]} — Question {qInSection} of 10
            </span>
            <p>{CATEGORY_MOTTOS[currentCat]}</p>
          </div>

          <div className="question-card">
            <p className="q-number">Question {current + 1} of 60</p>
            <h2 className="q-text">{q.text}</h2>

            <div className="scale-options">
              {SCALE.map(opt => (
                <button
                  key={opt.value}
                  className={`scale-btn ${selected === opt.value ? "selected" : ""}`}
                  onClick={() => setSelected(opt.value)}
                  style={selected === opt.value ? {background: info.color, borderColor: info.color} : {}}
                >
                  <span className="scale-num">{opt.value}</span>
                  <span className="scale-label">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="q-nav">
              <button className="btn-ghost" onClick={handlePrev} disabled={current === 0}>← Previous</button>
              <button className="btn-primary" onClick={handleNext}
                style={{background: info.color}}>
                {current === 59 ? "Submit Test ✓" : "Next →"}
              </button>
            </div>
          </div>
        </main>

        {/* Right panel — dimension info */}
        <aside className="info-panel">
          <div className="info-panel-header" style={{borderColor: info.color}}>
            <span className="info-code" style={{color: info.color}}>{currentCat}</span>
            <div>
              <p className="info-type-name">{CATEGORY_LABELS[currentCat]}</p>
              <p className="info-tagline" style={{color: info.color}}>{info.tagline}</p>
            </div>
          </div>

          <p className="info-about">{info.about}</p>

          <div className="info-block">
            <p className="info-block-title">Careers this leads to</p>
            <ul className="info-careers">
              {info.careers.map((c, i) => (
                <li key={i} style={{"--dot-color": info.color}}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="info-tip" style={{borderColor: info.color, background: info.color + "10"}}>
            <p className="info-tip-label" style={{color: info.color}}>💡 Answering tip</p>
            <p className="info-tip-text">{info.tip}</p>
          </div>

          <div className="info-progress-note">
            <p>Question <strong>{qInSection}</strong> of <strong>10</strong> in this section</p>
            <div className="mini-dots">
              {Array.from({length: 10}).map((_, j) => {
                const absIdx = sectionStart + j;
                const ans = answers[absIdx];
                const isCur = absIdx === current;
                return (
                  <div key={j} className={`mini-dot ${ans > 0 ? "filled" : ""} ${isCur ? "current" : ""}`}
                    style={ans > 0 || isCur ? {background: info.color} : {}}/>
                );
              })}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}