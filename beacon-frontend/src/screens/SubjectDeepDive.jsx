import { useState } from "react";
import Layout from "../components/Layout";

const COLORS = { navy: '#07143a', white: '#fff', muted: '#6b7280' };

const OPTIONS = {
  physics: ['Mechanics','Electricity and Magnetism','Modern Physics','Optics','Thermodynamics'],
  mathematics: ['Calculus','Statistics and Probability','Algebra','Geometry','Discrete Mathematics'],
  biology: ['Genetics','Ecology','Human Physiology','Microbiology','Botany'],
  chemistry: ['Organic Chemistry','Inorganic Chemistry','Physical Chemistry','Biochemistry'],
  computerScience: ['Programming','Hardware and Networking','AI and Machine Learning','Cybersecurity','Web Development'],
};

export default function SubjectDeepDive({ form, setForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  function update(key, value) {
    setForm((prev) => ({ ...prev, subjectInterests: { ...(prev.subjectInterests || {}), [key]: value } }));
  }

  function handleNext(e) {
    e.preventDefault();
    const nextErrors = {};
    Object.keys(OPTIONS).forEach((k) => {
      const ratingKey = k === 'mathematics' ? 'mathematics' : k;
      const rating = form.subjectRatings?.[ratingKey] || 0;
      if (rating >= 3) {
        if (!form.subjectInterests?.[k]) nextErrors[k] = 'Please choose an area for ' + k;
      }
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onNext();
  }

  return (
    <Layout step={4} totalSteps={9} title="Tell us more about what interests you" subtitle="Pick the area within your strongest subjects that excites you most.">
      <form onSubmit={handleNext} className="form">
        {Object.entries(OPTIONS).map(([key, opts]) => {
          const rating = form.subjectRatings?.[key] || form.subjectRatings?.[key] || 0;
          const unlocked = rating >= 3;
          return (
            <label key={key} className="field" style={{ opacity: unlocked ? 1 : 0.5 }}>
              <span className="field-label">{key === 'computerScience' ? 'Computer Science' : key.charAt(0).toUpperCase() + key.slice(1)} {unlocked ? '' : '(Rate higher to unlock)'}</span>
              {unlocked ? (
                <select value={form.subjectInterests?.[key] || ''} onChange={(e) => update(key, e.target.value)}>
                  <option value="">Select area</option>
                  {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <div style={{ padding: '0.6rem 0.8rem', borderRadius: 8, background: '#f3f4f6', color: COLORS.muted }}>Rate higher to unlock</div>
              )}
              {errors[key] && <p className="field-error">{errors[key]}</p>}
            </label>
          );
        })}

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
          <button type="submit" className="btn btn-primary">Continue</button>
        </div>
      </form>
    </Layout>
  );
}
