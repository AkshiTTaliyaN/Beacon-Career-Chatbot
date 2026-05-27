import { useState } from "react";
import Layout from "../components/Layout";

const COLORS = { navy: '#07143a', white: '#fff' };

const SUBJECTS = [
  { label: 'Mathematics', key: 'mathematics' },
  { label: 'Physics', key: 'physics' },
  { label: 'Chemistry', key: 'chemistry' },
  { label: 'Biology', key: 'biology' },
  { label: 'Computer Science', key: 'computerScience' },
  { label: 'Economics', key: 'economics' },
  { label: 'History and Political Science', key: 'historyPolitical' },
  { label: 'English and Literature', key: 'englishLiterature' },
];

function Star({ filled, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }} aria-label={filled ? 'star filled' : 'star'}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? COLORS.navy : 'none'} stroke={COLORS.navy} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.56L19.336 24 12 19.897 4.664 24l1.636-8.69L.6 9.75l7.732-1.732L12 .587z" />
      </svg>
    </button>
  );
}

export default function SubjectRatings({ form, setForm, onNext, onBack }) {
  const [touched, setTouched] = useState(false);

  function setRating(key, value) {
    setForm((prev) => ({ ...prev, subjectRatings: { ...(prev.subjectRatings || {}), [key]: value } }));
    setTouched(true);
  }

  const allRated = SUBJECTS.every(s => (form.subjectRatings?.[s.key] || 0) > 0);

  function handleNext(e) {
    e.preventDefault();
    if (!allRated) return;
    onNext();
  }

  return (
    <Layout step={3} totalSteps={9} title="Rate your subjects" subtitle="Be honest — this helps us match you to the right careers.">
      <form onSubmit={handleNext} className="form">
        {SUBJECTS.map((s) => (
          <div key={s.key} className="field" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontWeight: 700 }}>{s.label}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3,4,5].map((n) => (
                <Star key={n} filled={(form.subjectRatings?.[s.key] || 0) >= n} onClick={() => setRating(s.key, n)} />
              ))}
            </div>
          </div>
        ))}

        <div style={{ height: 12 }} />
        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!allRated} style={{ opacity: allRated ? 1 : 0.5, cursor: allRated ? 'pointer' : 'not-allowed' }}>Continue</button>
        </div>
      </form>
    </Layout>
  );
}
