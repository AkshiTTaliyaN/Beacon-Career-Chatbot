import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

const OPTIONS = {
  mathematics:      ["Calculus & Differential Equations", "Statistics & Probability", "Algebra & Matrices", "Geometry & Coordinate Maths", "Discrete Mathematics"],
  physics:          ["Mechanics & Motion", "Electricity & Magnetism", "Thermodynamics", "Optics & Waves", "Modern Physics & Quantum"],
  chemistry:        ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Biochemistry & Biomolecules", "Electrochemistry"],
  biology:          ["Genetics & Evolution", "Ecology & Environment", "Human Physiology", "Microbiology", "Plant Biology & Botany"],
  computerScience:  ["Programming & Data Structures", "Networking & Hardware", "AI & Machine Learning", "Cybersecurity", "Web Development"],
  accountancy:      ["Financial Accounting", "Partnership & Company Accounts", "Cash Flow Statements", "Auditing & Taxation", "Computerised Accounting"],
  businessStudies:  ["Principles of Management", "Business Environment", "Marketing Management", "Financial Markets", "Entrepreneurship"],
  economics:        ["Microeconomics (Demand & Supply)", "Macroeconomics (GDP, Inflation)", "Economic Development", "Statistical Methods", "International Trade & Finance"],
  history:          ["Ancient & Medieval History", "Modern History", "World History (French, Russian Revolutions)", "Art & Cultural History", "History & Freedom Movements"],
  geography:        ["Physical Geography & Landforms", "Human & Cultural Geography", "Map Work & GIS", "Resources & Sustainable Development", "Climate & Climatology"],
  politicalScience: ["Constitution & Governance", "International Relations", "Political Theory & Ideologies", "Public Policy & Administration", "Electoral Politics"],
  science:          ["Physics Concepts", "Chemistry Concepts", "Biology & Life Sciences", "Environmental Science", "Science & Technology"],
  socialScience:    ["History & Civics", "Geography & Economic Development", "Democratic Politics", "Disaster Management", "Economics Basics"],
  englishLiterature:["Fiction & Novel Analysis", "Poetry & Drama", "Writing & Grammar", "Mass Communication & Media", "Creative Writing"],
  hindi:            ["Hindi Grammar (Vyakaran)", "Hindi Literature (Sahitya)", "Writing & Comprehension", "Poetry (Kavita)", "Applied Hindi"],
};

const STREAM_SUBJECT_KEYS = {
  pcm:  ["mathematics", "physics", "chemistry", "computerScience", "englishLiterature"],
  pcb:  ["physics", "chemistry", "biology", "computerScience", "englishLiterature"],
  pcmb: ["mathematics", "physics", "chemistry", "biology", "englishLiterature"],
  comm: ["accountancy", "businessStudies", "economics", "mathematics", "englishLiterature"],
  arts: ["history", "geography", "politicalScience", "economics", "englishLiterature"],
  none: ["mathematics", "science", "socialScience", "englishLiterature", "computerScience", "hindi"],
};

function getSubjectKeys(currentClass, stream) {
  const cls = Number(currentClass);
  if (cls <= 10) return STREAM_SUBJECT_KEYS["none"];
  return STREAM_SUBJECT_KEYS[stream] || STREAM_SUBJECT_KEYS["none"];
}

function getLabel(key) {
  const LABELS = {
    mathematics: "Mathematics", physics: "Physics", chemistry: "Chemistry",
    biology: "Biology", computerScience: "Computer Science",
    accountancy: "Accountancy", businessStudies: "Business Studies",
    economics: "Economics", history: "History",
    geography: "Geography", politicalScience: "Political Science",
    science: "Science", socialScience: "Social Science",
    englishLiterature: "English & Literature", hindi: "Hindi",
  };
  return LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

const STREAM_ICONS = {
  pcm: "⚗️", pcb: "🧬", pcmb: "🔬", comm: "💼", arts: "🎭", none: "📚",
};

export default function SubjectDeepDive({ form, setForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const subjectKeys = getSubjectKeys(form.current_class, form.stream);

  const ratings = form.subjectRatings || {};
  const ratedKeys = subjectKeys.filter(k => OPTIONS[k]);

  const maxRating = Math.max(0, ...ratedKeys.map(k => ratings[k] || 0));
  const threshold = maxRating >= 3 ? 3 : maxRating > 0 ? maxRating : 1;

  const visibleKeys = ratedKeys.filter(k => (ratings[k] || 0) >= threshold);
  const lockedKeys  = ratedKeys.filter(k => (ratings[k] || 0) < threshold);

  function update(key, value) {
    setForm(prev => ({
      ...prev,
      subjectInterests: { ...(prev.subjectInterests || {}), [key]: value },
    }));
  }

  function handleNext(e) {
    e.preventDefault();
    const nextErrors = {};
    visibleKeys.forEach(k => {
      const val = form.subjectInterests?.[k];
      if (!val) {
        nextErrors[k] = `Pick a topic or choose "None of these" for ${getLabel(k)}`;
      }
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onNext();
  }

  const cls = Number(form.current_class);
  const streamIcon = cls >= 11 && form.stream ? (STREAM_ICONS[form.stream] || "📚") : "📚";

  return (
    <Layout
      step={4}
      totalSteps={9}
      title="What topics excite you?"
      subtitle="For the subjects you enjoy most, pick the areas you'd actually want to explore."
    >
      {visibleKeys.length === 0 && (
        <div
          className="tip-banner"
        >
          💡 Rate subjects 3★+ on the previous step to unlock topic picks here.
        </div>
      )}

      <form onSubmit={handleNext} className="onboard-form">
        {visibleKeys.map((key, i) => {
          const opts = OPTIONS[key] || [];
          const selected = form.subjectInterests?.[key] || "";
          const rating = ratings[key] || 0;

          return (
            <div
              key={key}
              className={`deep-dive-card${selected ? " selected" : ""}`}
            >
              <div className="deep-dive-header">
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>
                  {streamIcon} {getLabel(key)}
                </span>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: n <= rating ? "#f59e0b" : "#e5e7eb",
                    }} />
                  ))}
                </div>
              </div>
              <div className="deep-dive-body">
                <label className="question-heading" style={{ fontSize: "0.92rem", marginBottom: "0.65rem" }}>
                  ✨ In {getLabel(key)}, which topic would you most want to dive into?
                </label>
                <select
                  className={`deep-dive-select${errors[key] ? " error" : ""}`}
                  value={selected}
                  onChange={e => update(key, e.target.value)}
                  style={errors[key] ? { borderColor: "#ef4444" } : {}}
                >
                  <option value="">Choose a topic…</option>
                  <option value="none">None of these interest me</option>
                  {opts.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {errors[key] && (
                  <p className="field-error" style={{ marginTop: 4 }}>{errors[key]}</p>
                )}
              </div>
            </div>
          );
        })}

        {lockedKeys.length > 0 && (
          <div>
            <p style={{ fontSize: "0.78rem", color: "#9ca3af", fontWeight: 600, marginBottom: 8 }}>
              Rate higher to unlock:
            </p>
            <div className="locked-chips">
              {lockedKeys.map(key => (
                <span key={key} className="locked-chip">
                  {getLabel(key)} · {ratings[key] || 0}★
                </span>
              ))}
            </div>
          </div>
        )}

        {visibleKeys.length === 0 && ratedKeys.length === 0 && (
          <p style={{ color: "#556d8f", fontSize: "0.9rem", textAlign: "center", padding: "1rem" }}>
            Go back and rate your subjects first.
          </p>
        )}

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
          <button type="submit" className="btn btn-primary">Continue →</button>
        </div>
      </form>
    </Layout>
  );
}
