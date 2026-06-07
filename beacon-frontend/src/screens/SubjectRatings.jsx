import { useState } from "react";
import Layout from "../components/Layout";

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
  // Class 9–10 or undecided stream
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
  // Class 9 or 10 always gets the generic list
  if (cls <= 10) return STREAM_SUBJECTS["none"];
  // Class 11–12: use stream if known, else generic
  const key = stream && STREAM_SUBJECTS[stream] ? stream : "none";
  return STREAM_SUBJECTS[key];
}

const MOOD_LABELS = ["", "Struggling 😟", "Getting by 😐", "Comfortable 🙂", "Really good 😄", "Favourite ⭐"];

/* ─── Premium Star rating component ─────────────────────────────── */
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            aria-label={MOOD_LABELS[n]}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "2px 3px",
              transition: "transform 0.12s ease",
              transform: hovered === n ? "scale(1.35)" : active >= n ? "scale(1.1)" : "scale(1)",
            }}
          >
            <svg
              width="24" height="24" viewBox="0 0 24 24"
              fill={active >= n ? "#f59e0b" : "none"}
              stroke={active >= n ? "#f59e0b" : "#d1d5db"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: active >= n ? "drop-shadow(0 0 4px rgba(245,158,11,0.5))" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      <span style={{
        fontSize: "0.72rem",
        fontWeight: 600,
        color: active ? "#f59e0b" : "#d1d5db",
        minHeight: "1rem",
        transition: "all 0.15s",
        letterSpacing: "0.02em",
      }}>
        {active ? MOOD_LABELS[active] : "Tap to rate"}
      </span>
    </div>
  );
}

/* ─── Subject card ────────────────────────────────────────────── */
function SubjectCard({ subject, rating, onChange }) {
  const rated = rating > 0;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "1rem 1.2rem",
      borderRadius: 14,
      border: rated ? "1.5px solid #f59e0b" : "1.5px solid #e4e0db",
      background: rated
        ? "linear-gradient(135deg, #fffbeb 0%, #fff8e1 100%)"
        : "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
      boxShadow: rated
        ? "0 2px 16px rgba(245,158,11,0.12)"
        : "0 1px 4px rgba(0,0,0,0.04)",
      transition: "all 0.2s ease",
    }}>
      {/* Left: Icon + Label */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          fontSize: "1.5rem",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: rated ? "rgba(245,158,11,0.12)" : "#f3f4f6",
          borderRadius: 10,
          transition: "all 0.2s",
        }}>
          {subject.icon}
        </div>
        <span style={{
          fontWeight: 700,
          fontSize: "0.95rem",
          color: rated ? "#92400e" : "#374151",
        }}>
          {subject.label}
        </span>
      </div>

      {/* Right: Stars */}
      <StarRating value={rating} onChange={onChange} />
    </div>
  );
}

/* ─── Main screen ─────────────────────────────────────────────── */
export default function SubjectRatings({ form, setForm, onNext, onBack }) {
  const subjects = getSubjects(form.current_class, form.stream);
  const ratedCount = subjects.filter(s => (form.subjectRatings?.[s.key] || 0) > 0).length;
  const allRated = ratedCount === subjects.length;

  // Determine a friendly stream label for the heading
  const streamLabels = {
    pcm: "Science (PCM)", pcb: "Science (PCB)", pcmb: "Science (PCMB)",
    comm: "Commerce", arts: "Arts / Humanities", none: "your stream",
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
    <Layout step={3} totalSteps={9} title="How are you with your subjects?" subtitle={`Rate each of ${streamLabel} honestly — this helps us personalise your career matches.`}>

      {/* ─ Stream badge ─ */}
      {form.stream && form.stream !== "none" && cls >= 11 && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "0.35rem 0.85rem",
          borderRadius: 999,
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          background: "linear-gradient(90deg, #2C5492 0%, #7b9ef7 100%)",
          color: "#fff",
          marginBottom: "1.25rem",
          boxShadow: "0 2px 10px rgba(44,84,146,0.25)",
          alignSelf: "flex-start",
        }}>
          ✦ {streamLabels[form.stream] || form.stream} stream
        </div>
      )}

      <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

        {/* Subject cards */}
        {subjects.map((s) => (
          <SubjectCard
            key={s.key}
            subject={s}
            rating={form.subjectRatings?.[s.key] || 0}
            onChange={(val) => setRating(s.key, val)}
          />
        ))}

        {/* Progress indicator */}
        <div style={{ marginTop: 8 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            color: "#556d8f",
            marginBottom: 6,
          }}>
            <span style={{ fontWeight: 600 }}>
              {allRated ? "✅ All subjects rated!" : `${ratedCount} of ${subjects.length} rated`}
            </span>
            {!allRated && (
              <span style={{ color: "#9ca3af" }}>Rate all to continue</span>
            )}
          </div>
          <div style={{
            height: 5,
            background: "#f3f4f6",
            borderRadius: 999,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${(ratedCount / subjects.length) * 100}%`,
              background: allRated
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : "linear-gradient(90deg, #2C5492, #7b9ef7)",
              borderRadius: 999,
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>

        {/* Buttons */}
        <div className="btn-row" style={{ marginTop: 8 }}>
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
