import { useState, useEffect } from "react";
import QUESTIONS from "../data/questions";
import APTITUDE_QUESTIONS from "../data/aptitude_questions";
import { HOBBY_CATEGORIES } from "../data/hobbies";
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

// Aptitude skill colours — reuse the blue theme
const APTITUDE_COLORS = {
  english:  "#2C5492",
  patterns: "#3B63A3",
  logical:  "#4A72B4",
  maths:    "#5C84C2",
  visual:   "#7197CF",
  detail:   "#8AACDD",
};

const APTITUDE_SCALE = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Usually" },
  { value: 5, label: "Always" },
];

const RIASEC_SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

// ---------------------------------------------------------------------------
// APTITUDE SECTION METADATA
// ---------------------------------------------------------------------------
const APTITUDE_SKILL_INFO = {
  english: {
    label: "English & Language Skills",
    about: "This section looks at how comfortable you are with reading, writing, and understanding language.",
    tip: "Answer based on your everyday experience with English — not just your exam scores.",
  },
  patterns: {
    label: "Finding Patterns & Sequences",
    about: "This section explores how quickly you notice repeating rules or structures in numbers, letters, and puzzles.",
    tip: "Think about how you approach number series or pattern-based puzzles.",
  },
  logical: {
    label: "Logical Thinking",
    about: "This section looks at how naturally you break problems into steps and evaluate arguments.",
    tip: "Reflect on how you approach decisions — do you reason through them or go with instinct?",
  },
  maths: {
    label: "Maths & Numbers",
    about: "This section explores your comfort with numerical calculations, ratios, and quantitative problem solving.",
    tip: "Be honest — this is about day-to-day comfort with numbers, not just exam performance.",
  },
  visual: {
    label: "Visualising & Drawing",
    about: "This section looks at how easily you picture objects in space, read maps, and sketch from memory.",
    tip: "Think about how naturally you visualise things — rotating shapes, reading diagrams, etc.",
  },
  detail: {
    label: "Attention to Detail",
    about: "This section explores how carefully you notice small errors, follow instructions, and check your work.",
    tip: "Think about whether you naturally catch mistakes others miss.",
  },
};

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------
export default function TestPage({ onSubmit, onBack, profileData }) {
  // step: "details" | "questions" | "hobbies" | "aptitude"
  const [step, setStep] = useState("details");

  const [details, setDetails] = useState({
    name: profileData?.name || "",
    class_level: profileData?.class_level || "",
    stream: profileData?.stream || "",
  });

  useEffect(() => {
    if (profileData?.name) {
      setDetails({
        name: profileData.name,
        class_level: profileData.class_level,
        stream: profileData.stream,
      });
    }
  }, [profileData]);

  // Section 1 — RIASEC
  const [answers, setAnswers] = useState(Array(60).fill(0));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(0);

  // Section 2 — Hobbies
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  // Section 3 — Aptitude
  const [aptitudeAnswers, setAptitudeAnswers] = useState(Array(18).fill(0));
  const [aptitudeCurrent, setAptitudeCurrent] = useState(0);
  const [aptitudeSelected, setAptitudeSelected] = useState(0);

  // ── RIASEC helpers ────────────────────────────────────────────────────────
  const progress = (current / 60) * 100;
  const q = QUESTIONS[current];
  const currentCat = q.category;
  const sectionStart = ["R", "I", "A", "S", "E", "C"].indexOf(currentCat) * 10;
  const qInSection = current - sectionStart + 1;
  const info = CATEGORY_INFO[currentCat];

  // ── Aptitude helpers ──────────────────────────────────────────────────────
  const aq = APTITUDE_QUESTIONS[aptitudeCurrent];
  const aptitudeProgress = (aptitudeCurrent / 18) * 100;
  const aptitudeSkillStart = Math.floor(aptitudeCurrent / 3) * 3;
  const qInAptitudeSkill = aptitudeCurrent - aptitudeSkillStart + 1;
  const aptitudeSkillInfo = APTITUDE_SKILL_INFO[aq?.skill];
  const aptitudeColor = APTITUDE_COLORS[aq?.skill] || "#2C5492";

  // ── Handlers: Details ─────────────────────────────────────────────────────
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!details.name.trim() || !details.class_level || !details.stream) {
      alert("Please fill in all fields.");
      return;
    }
    setStep("questions");
  };

  // ── Handlers: RIASEC questions ────────────────────────────────────────────
  const handleNext = () => {
    if (selected === 0) { alert("Please select an option before continuing."); return; }
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    if (current < 59) {
      setCurrent(current + 1);
      setSelected(newAnswers[current + 1] || 0);
    } else {
      // RIASEC done — move to hobbies
      setStep("hobbies");
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

  // ── Handlers: Hobbies ─────────────────────────────────────────────────────
  const toggleHobby = (hobby) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  const handleHobbiesNext = () => {
    if (selectedHobbies.length === 0) {
      alert("Please select at least one hobby or interest before continuing.");
      return;
    }
    setStep("aptitude");
  };

  // ── Handlers: Aptitude ────────────────────────────────────────────────────
  const handleAptitudeNext = () => {
    if (aptitudeSelected === 0) { alert("Please select an option before continuing."); return; }
    const newAnswers = [...aptitudeAnswers];
    newAnswers[aptitudeCurrent] = aptitudeSelected;
    setAptitudeAnswers(newAnswers);
    if (aptitudeCurrent < 17) {
      setAptitudeCurrent(aptitudeCurrent + 1);
      setAptitudeSelected(newAnswers[aptitudeCurrent + 1] || 0);
    } else {
      // All three sections done — submit
      onSubmit({
        name: details.name.trim(),
        class_level: details.class_level,
        stream: details.stream,
        riasec_answers: answers,
        hobbies: selectedHobbies,
        aptitude_answers: newAnswers,
      });
    }
  };

  const handleAptitudePrev = () => {
    if (aptitudeCurrent > 0) {
      const newAnswers = [...aptitudeAnswers];
      newAnswers[aptitudeCurrent] = aptitudeSelected;
      setAptitudeAnswers(newAnswers);
      setAptitudeCurrent(aptitudeCurrent - 1);
      setAptitudeSelected(newAnswers[aptitudeCurrent - 1] || 0);
    } else {
      // Go back to hobbies
      setStep("hobbies");
    }
  };

  // ── RENDER: Details ───────────────────────────────────────────────────────
  if (step === "details") {
    return (
      <div className="test-page">
        <header className="cc-header">
          <span className="cc-logo">Beacon</span>
          <button className="btn-outline" onClick={onBack}>← Back</button>
        </header>
        <div className="details-container">
          <div className="intro-card">
            <div className="intro-badge">Psychometric + Aptitude Assessment</div>
            <h1>Career Aptitude Test</h1>
            <p>This test combines three assessments — your <strong>personality type (RIASEC)</strong>, your <strong>interests and hobbies</strong>, and your <strong>self-rated aptitude</strong> — to give you a well-rounded career recommendation.</p>
            <p>Be honest — there are no right or wrong answers. Choose what genuinely reflects you.</p>
            <div className="intro-stats">
              <div><strong>3</strong><span>Sections</span></div>
              <div><strong>78</strong><span>Questions</span></div>
              <div><strong>15–20 min</strong><span>Estimated time</span></div>
              <div><strong>Instant</strong><span>Results</span></div>
            </div>
          </div>
          <form className="details-form" onSubmit={handleDetailsSubmit}>
            <h2>{profileData?.name ? "Confirm your details" : "Enter your details"}</h2>
            <p className="form-sub" style={profileData?.name ? { color: "#10b981", fontWeight: 600 } : {}}>
              {profileData?.name
                ? details.stream
                  ? "✓ Your details are pre-filled from your Beacon profile."
                  : "✓ Name pre-filled from your Beacon profile. Please select your stream below."
                : "Your details appear on your personalised report. They are not stored anywhere."}
            </p>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. Aryan Sharma" value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Current Class</label>
                <select value={details.class_level}
                  onChange={(e) => setDetails({ ...details, class_level: e.target.value })} required>
                  <option value="">Select class</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
              <div className="form-group">
                <label>Stream (or Intended)</label>
                <select value={details.stream}
                  onChange={(e) => setDetails({ ...details, stream: e.target.value })} required>
                  <option value="">Select stream</option>
                  <option value="PCM">PCM (Physics, Chemistry, Maths)</option>
                  <option value="PCB">PCB (Physics, Chemistry, Biology)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Humanities">Humanities / Arts</option>
                  <option value="none">Not Decided / General</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary btn-large"
              style={{ width: "100%", marginTop: "12px" }}>
              Begin Test →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── RENDER: RIASEC Questions ──────────────────────────────────────────────
  if (step === "questions") {
    return (
      <div className="test-page">
        <header className="cc-header">
          <span className="cc-logo">Beacon</span>
          <div className="cc-header-center">
            <h1>Section 1 of 3 — Personality</h1>
            <p>{details.name} • {details.class_level} • {details.stream}</p>
          </div>
          <span className="q-counter-header">Question {current + 1} of 60</span>
        </header>

        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="test-layout">
          {/* Left sidebar */}
          <aside className="test-sidebar">
            <p className="sidebar-title">Your progress</p>
            {["R", "I", "A", "S", "E", "C"].map((cat, i) => {
              const start = i * 10;
              const answered = answers.slice(start, start + 10).filter((a) => a > 0).length;
              const isActive = cat === currentCat;
              const isDone = answered === 10;
              return (
                <div key={cat} className={`sidebar-cat ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                  <div className="sidebar-cat-header">
                    <span className="sidebar-code" style={{ color: CATEGORY_INFO[cat].color }}>{cat}</span>
                    <span className="sidebar-name">{CATEGORY_LABELS[cat]}</span>
                    <span className="sidebar-count">{answered}/10</span>
                  </div>
                  <div className="sidebar-bar">
                    <div className="sidebar-bar-fill"
                      style={{ width: `${(answered / 10) * 100}%`, background: CATEGORY_INFO[cat].color }} />
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Centre question */}
          <main className="test-main">
            <div className="section-motto">
              <span className="section-badge" style={{ background: info.color + "18", color: info.color }}>
                {CATEGORY_LABELS[currentCat]} — Question {qInSection} of 10
              </span>
              <p>{CATEGORY_MOTTOS[currentCat]}</p>
            </div>

            <div className="question-card">
              <p className="q-number">Question {current + 1} of 60</p>
              <h2 className="q-text">{q.text}</h2>

              <div className="scale-legend">
                1 = Strongly Disagree &nbsp;·&nbsp; 3 = Neutral &nbsp;·&nbsp; 5 = Strongly Agree
              </div>

              <div className="scale-options">
                {RIASEC_SCALE.map((opt) => (
                  <button key={opt.value}
                    className={`scale-btn ${selected === opt.value ? "selected" : ""}`}
                    onClick={() => setSelected(opt.value)}
                    style={selected === opt.value ? { background: info.color, borderColor: info.color } : {}}>
                    <span className="scale-num">{opt.value}</span>
                    <span className="scale-label">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="q-nav">
                <button className="btn-ghost" onClick={handlePrev} disabled={current === 0}>← Previous</button>
                <button className="btn-primary" onClick={handleNext} style={{ background: info.color }}>
                  {current === 59 ? "Next Section →" : "Next →"}
                </button>
              </div>
            </div>
          </main>

          {/* Right info panel */}
          <aside className="info-panel">
            <div className="info-panel-header" style={{ borderColor: info.color }}>
              <span className="info-code" style={{ color: info.color }}>{currentCat}</span>
              <div>
                <p className="info-type-name">{CATEGORY_LABELS[currentCat]}</p>
                <p className="info-tagline" style={{ color: info.color }}>{info.tagline}</p>
              </div>
            </div>
            <p className="info-about">{info.about}</p>
            <div className="info-block">
              <p className="info-block-title">Careers this leads to</p>
              <ul className="info-careers">
                {info.careers.map((c, i) => (
                  <li key={i} style={{ "--dot-color": info.color }}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="info-tip" style={{ borderColor: info.color, background: info.color + "10" }}>
              <p className="info-tip-label" style={{ color: info.color }}>💡 Answering tip</p>
              <p className="info-tip-text">{info.tip}</p>
            </div>
            <div className="info-progress-note">
              <p>Question <strong>{qInSection}</strong> of <strong>10</strong> in this section</p>
              <div className="mini-dots">
                {Array.from({ length: 10 }).map((_, j) => {
                  const absIdx = sectionStart + j;
                  const ans = answers[absIdx];
                  const isCur = absIdx === current;
                  return (
                    <div key={j}
                      className={`mini-dot ${ans > 0 ? "filled" : ""} ${isCur ? "current" : ""}`}
                      style={ans > 0 || isCur ? { background: info.color } : {}} />
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ── RENDER: Hobbies ───────────────────────────────────────────────────────
  if (step === "hobbies") {
    return (
      <div className="test-page">
        <header className="cc-header">
          <span className="cc-logo">Beacon</span>
          <div className="cc-header-center">
            <h1>Section 2 of 3 — Interests</h1>
            <p>{details.name} • {details.class_level} • {details.stream}</p>
          </div>
          <span className="q-counter-header">{selectedHobbies.length} selected</span>
        </header>

        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: "66%" }} />
        </div>

        <div className="hobbies-container">
          <div className="hobbies-intro">
            <div className="section-badge" style={{ background: "#2C549218", color: "#2C5492", display: "inline-block", marginBottom: "12px" }}>
              Section 2 of 3
            </div>
            <h2>What are your hobbies and interests?</h2>
            <p>Select all that apply. These help us understand what you genuinely enjoy outside of academics — and surface career options that match your real interests, not just your personality type.</p>
          </div>

          {HOBBY_CATEGORIES.map((group) => (
            <div key={group.category} className="hobby-group">
              <h3 className="hobby-group-title">{group.category}</h3>
              <div className="hobby-chips">
                {group.hobbies.map((hobby) => {
                  const isSelected = selectedHobbies.includes(hobby);
                  return (
                    <button key={hobby}
                      className={`hobby-chip ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleHobby(hobby)}>
                      {isSelected && <span className="hobby-check">✓</span>}
                      {hobby}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="hobbies-footer">
            <p className="hobbies-selected-count">
              {selectedHobbies.length === 0
                ? "No hobbies selected yet"
                : `${selectedHobbies.length} interest${selectedHobbies.length > 1 ? "s" : ""} selected`}
            </p>
            <div className="q-nav">
              <button className="btn-ghost" onClick={() => setStep("questions")}>← Back to Section 1</button>
              <button className="btn-primary" onClick={handleHobbiesNext}
                style={{ background: "#2C5492" }}>
                Next Section →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: Aptitude ──────────────────────────────────────────────────────
  if (step === "aptitude") {
    return (
      <div className="test-page">
        <header className="cc-header">
          <span className="cc-logo">Beacon</span>
          <div className="cc-header-center">
            <h1>Section 3 of 3 — Aptitude</h1>
            <p>{details.name} • {details.class_level} • {details.stream}</p>
          </div>
          <span className="q-counter-header">Question {aptitudeCurrent + 1} of 18</span>
        </header>

        <div className="progress-bar-wrap">
          <div className="progress-bar-fill"
            style={{ width: `${66 + (aptitudeProgress / 3)}%` }} />
        </div>

        <div className="test-layout">
          {/* Left sidebar — aptitude skill progress */}
          <aside className="test-sidebar">
            <p className="sidebar-title">Skill areas</p>
            {Object.entries(APTITUDE_SKILL_INFO).map(([skill, info], i) => {
              const start = i * 3;
              const answered = aptitudeAnswers.slice(start, start + 3).filter((a) => a > 0).length;
              const isActive = aq?.skill === skill;
              const isDone = answered === 3;
              return (
                <div key={skill} className={`sidebar-cat ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                  <div className="sidebar-cat-header">
                    <span className="sidebar-name">{info.label}</span>
                    <span className="sidebar-count">{answered}/3</span>
                  </div>
                  <div className="sidebar-bar">
                    <div className="sidebar-bar-fill"
                      style={{ width: `${(answered / 3) * 100}%`, background: APTITUDE_COLORS[skill] }} />
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Centre question */}
          <main className="test-main">
            <div className="section-motto">
              <span className="section-badge"
                style={{ background: aptitudeColor + "18", color: aptitudeColor }}>
                {aptitudeSkillInfo?.label} — Question {qInAptitudeSkill} of 3
              </span>
              <p>{aptitudeSkillInfo?.about}</p>
            </div>

            <div className="question-card">
              <p className="q-number">Question {aptitudeCurrent + 1} of 18</p>
              <h2 className="q-text">{aq?.text}</h2>

              <div className="scale-legend">
                1 = Never &nbsp;·&nbsp; 3 = Sometimes &nbsp;·&nbsp; 5 = Always
              </div>

              <div className="scale-options">
                {APTITUDE_SCALE.map((opt) => (
                  <button key={opt.value}
                    className={`scale-btn ${aptitudeSelected === opt.value ? "selected" : ""}`}
                    onClick={() => setAptitudeSelected(opt.value)}
                    style={aptitudeSelected === opt.value
                      ? { background: aptitudeColor, borderColor: aptitudeColor } : {}}>
                    <span className="scale-num">{opt.value}</span>
                    <span className="scale-label">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="q-nav">
                <button className="btn-ghost" onClick={handleAptitudePrev}>← Previous</button>
                <button className="btn-primary" onClick={handleAptitudeNext}
                  style={{ background: aptitudeColor }}>
                  {aptitudeCurrent === 17 ? "Submit Test ✓" : "Next →"}
                </button>
              </div>
            </div>
          </main>

          {/* Right info panel */}
          <aside className="info-panel">
            <div className="info-panel-header" style={{ borderColor: aptitudeColor }}>
              <div>
                <p className="info-type-name">{aptitudeSkillInfo?.label}</p>
                <p className="info-tagline" style={{ color: aptitudeColor }}>Self-Assessment</p>
              </div>
            </div>
            <p className="info-about">{aptitudeSkillInfo?.about}</p>
            <div className="info-tip"
              style={{ borderColor: aptitudeColor, background: aptitudeColor + "10" }}>
              <p className="info-tip-label" style={{ color: aptitudeColor }}>💡 Answering tip</p>
              <p className="info-tip-text">{aptitudeSkillInfo?.tip}</p>
            </div>
            <div className="info-progress-note">
              <p>Question <strong>{qInAptitudeSkill}</strong> of <strong>3</strong> in this skill area</p>
              <div className="mini-dots">
                {Array.from({ length: 3 }).map((_, j) => {
                  const absIdx = aptitudeSkillStart + j;
                  const ans = aptitudeAnswers[absIdx];
                  const isCur = absIdx === aptitudeCurrent;
                  return (
                    <div key={j}
                      className={`mini-dot ${ans > 0 ? "filled" : ""} ${isCur ? "current" : ""}`}
                      style={ans > 0 || isCur ? { background: aptitudeColor } : {}} />
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }
}