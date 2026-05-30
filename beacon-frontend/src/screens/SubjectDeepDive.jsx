import { useState } from "react";
import Layout from "../components/Layout";

const COLORS = { muted: "#6b7280" };

/* ─── Sub-topic options keyed by subject key ─────────────────── */
const OPTIONS = {
  // Science
  mathematics:      ["Calculus & Differential Equations", "Statistics & Probability", "Algebra & Matrices", "Geometry & Coordinate Maths", "Discrete Mathematics"],
  physics:          ["Mechanics & Motion", "Electricity & Magnetism", "Thermodynamics", "Optics & Waves", "Modern Physics & Quantum"],
  chemistry:        ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Biochemistry & Biomolecules", "Electrochemistry"],
  biology:          ["Genetics & Evolution", "Ecology & Environment", "Human Physiology", "Microbiology", "Plant Biology & Botany"],
  computerScience:  ["Programming & Data Structures", "Networking & Hardware", "AI & Machine Learning", "Cybersecurity", "Web Development"],

  // Commerce
  accountancy:      ["Financial Accounting", "Partnership & Company Accounts", "Cash Flow Statements", "Auditing & Taxation", "Computerised Accounting"],
  businessStudies:  ["Principles of Management", "Business Environment", "Marketing Management", "Financial Markets", "Entrepreneurship"],
  economics:        ["Microeconomics (Demand & Supply)", "Macroeconomics (GDP, Inflation)", "Indian Economic Development", "Statistical Methods", "International Trade & Finance"],

  // Arts / Humanities
  history:          ["Ancient & Medieval India", "Modern Indian History", "World History (French, Russian Revolutions)", "Art & Cultural History", "Colonial India & Freedom Movement"],
  geography:        ["Physical Geography & Landforms", "Human & Cultural Geography", "Map Work & GIS", "Resources & Sustainable Development", "Climate & Climatology"],
  politicalScience: ["Indian Constitution & Governance", "International Relations", "Political Theory & Ideologies", "Public Policy & Administration", "Electoral Politics"],

  // Common / Class 9-10
  science:          ["Physics Concepts", "Chemistry Concepts", "Biology & Life Sciences", "Environmental Science", "Science & Technology in India"],
  socialScience:    ["History & Civics", "Geography & Economic Development", "Democratic Politics", "Disaster Management", "Economics Basics"],
  englishLiterature:["Fiction & Novel Analysis", "Poetry & Drama", "Writing & Grammar", "Mass Communication & Media", "Creative Writing"],
  hindi:            ["Hindi Grammar (Vyakaran)", "Hindi Literature (Sahitya)", "Writing & Comprehension", "Poetry (Kavita)", "Applied Hindi"],
};

/* ─── The same stream->subjects map as SubjectRatings ────────── */
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

  // Only show subjects that have OPTIONS defined and the user rated >= 3,
  // but auto-unlock at least the highest-rated subject even if all < 3
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
      if (!form.subjectInterests?.[k]) {
        nextErrors[k] = `Please pick an area within ${getLabel(k)}`;
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
      title="What excites you most?"
      subtitle="Pick the area that interests you within your strongest subjects — this sharpens your career recommendations."
    >
      {/* Contextual tip */}
      {visibleKeys.length === 0 && (
        <div style={{
          padding: "0.85rem 1.1rem",
          borderRadius: 12,
          background: "#fffbeb",
          border: "1px solid #fde68a",
          fontSize: "0.88rem",
          color: "#92400e",
          marginBottom: "1rem",
          fontWeight: 500,
        }}>
          💡 Rate your subjects higher in the previous step to unlock subject-area selection here.
        </div>
      )}

      <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

        {/* Unlocked subject cards */}
        {visibleKeys.map(key => {
          const opts = OPTIONS[key] || [];
          const selected = form.subjectInterests?.[key] || "";
          const rating = ratings[key] || 0;

          return (
            <div key={key} style={{
              borderRadius: 14,
              border: selected ? "1.5px solid #2d5be3" : "1.5px solid #e4e0db",
              background: selected
                ? "linear-gradient(135deg, #eef1fd 0%, #f7f8ff 100%)"
                : "#ffffff",
              boxShadow: selected
                ? "0 2px 14px rgba(45,91,227,0.10)"
                : "0 1px 4px rgba(0,0,0,0.04)",
              overflow: "hidden",
              transition: "all 0.2s ease",
            }}>
              {/* Card header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.8rem 1.1rem 0.6rem",
                borderBottom: "1px solid",
                borderColor: selected ? "rgba(45,91,227,0.12)" : "#f0f0f0",
              }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>
                  {streamIcon} {getLabel(key)}
                </span>
                {/* Star dots showing rating */}
                <div style={{ display: "flex", gap: 3 }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{
                      width: 7, height: 7,
                      borderRadius: "50%",
                      background: n <= rating ? "#f59e0b" : "#e5e7eb",
                    }} />
                  ))}
                </div>
              </div>

              {/* Dropdown area */}
              <div style={{ padding: "0.7rem 1.1rem 0.9rem" }}>
                <label style={{ fontSize: "0.82rem", color: COLORS.muted, fontWeight: 600, marginBottom: 6, display: "block" }}>
                  Which area within this subject interests you most?
                </label>
                <select
                  value={selected}
                  onChange={e => update(key, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.85rem",
                    borderRadius: 8,
                    border: errors[key] ? "1.5px solid #ef4444" : "1.5px solid #e4e0db",
                    fontSize: "0.92rem",
                    fontFamily: "inherit",
                    background: "#fff",
                    color: selected ? "#1e293b" : COLORS.muted,
                    cursor: "pointer",
                    appearance: "auto",
                  }}
                >
                  <option value="">Select an area…</option>
                  {opts.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {errors[key] && (
                  <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#ef4444" }}>
                    {errors[key]}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Locked subjects (rated low) */}
        {lockedKeys.length > 0 && (
          <div style={{ marginTop: 4 }}>
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600, marginBottom: 8 }}>
              Not unlocked (rated lower):
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {lockedKeys.map(key => (
                <div key={key} style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 999,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  fontSize: "0.82rem",
                  color: "#9ca3af",
                  fontWeight: 500,
                }}>
                  {getLabel(key)} · {ratings[key] || 0}★
                </div>
              ))}
            </div>
          </div>
        )}

        {/* If nothing to show */}
        {visibleKeys.length === 0 && ratedKeys.length === 0 && (
          <p style={{ color: COLORS.muted, fontSize: "0.9rem", textAlign: "center", padding: "1rem" }}>
            Go back and rate your subjects first.
          </p>
        )}

        <div className="btn-row" style={{ marginTop: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
          <button type="submit" className="btn btn-primary">Continue →</button>
        </div>
      </form>
    </Layout>
  );
}
