import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import "./SubjectRatings.css";

/* ─── Stream → subject map ─────────────────────────────────────── */
const STREAM_SUBJECTS = {
  pcm: [
    { label: "Mathematics",         key: "mathematics",       icon: "📐" },
    { label: "Physics",             key: "physics",           icon: "⚛️" },
    { label: "Chemistry",           key: "chemistry",         icon: "🧪" },
    { label: "Computer Science",    key: "computerScience",   icon: "💻" },
    { label: "English & Literature",key: "englishLiterature", icon: "📖" },
  ],
  pcb: [
    { label: "Physics",             key: "physics",           icon: "⚛️" },
    { label: "Chemistry",           key: "chemistry",         icon: "🧪" },
    { label: "Biology",             key: "biology",           icon: "🧬" },
    { label: "Computer Science",    key: "computerScience",   icon: "💻" },
    { label: "English & Literature",key: "englishLiterature", icon: "📖" },
  ],
  pcmb: [
    { label: "Mathematics",         key: "mathematics",       icon: "📐" },
    { label: "Physics",             key: "physics",           icon: "⚛️" },
    { label: "Chemistry",           key: "chemistry",         icon: "🧪" },
    { label: "Biology",             key: "biology",           icon: "🧬" },
    { label: "English & Literature",key: "englishLiterature", icon: "📖" },
  ],
  comm: [
    { label: "Accountancy",         key: "accountancy",       icon: "📊" },
    { label: "Business Studies",    key: "businessStudies",   icon: "💼" },
    { label: "Economics",           key: "economics",         icon: "📈" },
    { label: "Mathematics",         key: "mathematics",       icon: "📐" },
    { label: "English & Literature",key: "englishLiterature", icon: "📖" },
  ],
  arts: [
    { label: "History",             key: "history",           icon: "🏛️" },
    { label: "Geography",           key: "geography",         icon: "🌍" },
    { label: "Political Science",   key: "politicalScience",  icon: "⚖️" },
    { label: "Economics",           key: "economics",         icon: "📈" },
    { label: "English & Literature",key: "englishLiterature", icon: "📖" },
  ],
  none: [
    { label: "Mathematics",         key: "mathematics",       icon: "📐" },
    { label: "Science",             key: "science",           icon: "🔬" },
    { label: "Social Science",      key: "socialScience",     icon: "🌐" },
    { label: "English & Literature",key: "englishLiterature", icon: "📖" },
    { label: "Computer Science",    key: "computerScience",   icon: "💻" },
    { label: "Hindi",               key: "hindi",             icon: "🇮🇳" },
  ],
};

function getSubjects(currentClass, stream) {
  const cls = Number(currentClass);
  if (cls <= 10) return STREAM_SUBJECTS["none"];
  const key = stream && STREAM_SUBJECTS[stream] ? stream : "none";
  return STREAM_SUBJECTS[key];
}

const MOOD_LABELS = ["", "Tough 😟", "Okay 😐", "Solid 🙂", "Strong 😄", "Love it ⭐"];

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="star-rating">
      <div className="star-row">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            aria-label={MOOD_LABELS[n]}
            className={`star-btn${active >= n ? " active" : ""}${hovered === n ? " hover" : ""}`}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24"
              fill={active >= n ? "#f59e0b" : "none"}
              stroke={active >= n ? "#f59e0b" : "#d1d5db"}
              strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      <span className={`star-label${active ? " active" : ""}`}>
        {active ? MOOD_LABELS[active] : "Tap to rate"}
      </span>
    </div>
  );
}

function SubjectCard({ subject, rating, onChange, index }) {
  const rated = rating > 0;
  return (
    <div
      className={`subject-card${rated ? " rated" : ""}`}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="subject-card-icon">{subject.icon}</div>
        <span className="subject-card-label">{subject.label}</span>
      </div>
      <StarRating value={rating} onChange={onChange} />
    </div>
  );
}

export default function SubjectRatings({ form, setForm, onNext, onBack }) {
  const subjects = getSubjects(form.current_class, form.stream);
  const ratedCount = subjects.filter(s => (form.subjectRatings?.[s.key] || 0) > 0).length;
  const allRated = ratedCount === subjects.length;

  const streamLabels = {
    pcm: "Science (PCM)", pcb: "Science (PCB)", pcmb: "Science (PCMB)",
    comm: "Commerce", arts: "Arts / Humanities", none: "your subjects",
  };
  const cls = Number(form.current_class);
  const streamLabel = cls <= 10
    ? "your subjects"
    : (streamLabels[form.stream] || "your stream") + " subjects";

  function setRating(key, value) {
    setForm(prev => ({
      ...prev,
      subjectRatings: { ...(prev.subjectRatings || {}), [key]: value },
    }));
  }

  function handleNext(e) {
    e.preventDefault();
    if (!allRated) return;
    onNext();
  }

  return (
    <Layout
      step={3}
      totalSteps={9}
      title="How do you feel about your subjects?"
      subtitle={`Be honest — 1 star means it's tough, 5 means you genuinely love it.`}
    >
      {form.stream && form.stream !== "none" && cls >= 11 && (
        <span
          className="stream-badge"
        >
          ✦ {streamLabels[form.stream] || form.stream}
        </span>
      )}

      <form onSubmit={handleNext} className="onboard-form">
        {subjects.map((s, i) => (
          <SubjectCard
            key={s.key}
            subject={s}
            rating={form.subjectRatings?.[s.key] || 0}
            onChange={(val) => setRating(s.key, val)}
            index={i}
          />
        ))}

        <div className="rating-progress">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#556d8f", marginBottom: 6 }}>
            <span style={{ fontWeight: 700 }}>
              {allRated ? "All rated — nice work!" : `${ratedCount} / ${subjects.length} done`}
            </span>
            {!allRated && <span style={{ color: "#9ca3af" }}>Rate all to continue</span>}
          </div>
          <div className="rating-progress-bar">
            <motion.div
              className="rating-progress-fill"
              initial={false}
              animate={{ width: `${(ratedCount / subjects.length) * 100}%` }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              style={{
                background: allRated
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : "linear-gradient(90deg, #2C5492, #7b9ef7)",
              }}
            />
          </div>
        </div>

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!allRated}
            style={{ opacity: allRated ? 1 : 0.45, cursor: allRated ? "pointer" : "not-allowed" }}
          >
            Continue →
          </button>
        </div>
      </form>
    </Layout>
  );
}
