import { useState } from "react";
import Layout from "../components/Layout";
import RadioCards from "../components/RadioCards";
import {
  PERFORMANCE_BANDS,
  SUBJECTS,
  INCOME_BRACKETS,
  OCCUPATIONS,
} from "../constants/formOptions";
import { validateAcademics } from "../utils/validation";

export default function AcademicsScreen({ form, setForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext(e) {
    e.preventDefault();
    const nextErrors = validateAcademics(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onNext();
  }

  return (
    <Layout
      step={3}
      totalSteps={6}
      title="Academics & family"
      subtitle="Performance and family context help us tailor guidance. Family fields are optional."
    >
      <form onSubmit={handleNext} className="form">
        <div className="field">
          <span className="field-label">Overall performance band *</span>
          <RadioCards
            name="performance_band"
            options={PERFORMANCE_BANDS}
            value={form.performance_band}
            onChange={(v) => update("performance_band", v)}
            error={errors.performance_band}
          />
        </div>

        <label className="field">
          <span className="field-label">Strongest subject *</span>
          <select
            value={form.strongest_subject}
            onChange={(e) => update("strongest_subject", e.target.value)}
          >
            <option value="">Select subject</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.strongest_subject && (
            <p className="field-error">{errors.strongest_subject}</p>
          )}
        </label>

        <label className="field">
          <span className="field-label">Weakest subject *</span>
          <select
            value={form.weakest_subject}
            onChange={(e) => update("weakest_subject", e.target.value)}
          >
            <option value="">Select subject</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.weakest_subject && (
            <p className="field-error">{errors.weakest_subject}</p>
          )}
        </label>

        <hr className="divider" />
        <p className="section-note">Family context — all optional</p>

        <label className="field">
          <span className="field-label">
            Family income bracket <span className="optional">(optional)</span>
          </span>
          <select
            value={form.income_bracket}
            onChange={(e) => update("income_bracket", e.target.value)}
          >
            <option value="">Prefer not to say</option>
            {INCOME_BRACKETS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">
            Father&apos;s occupation <span className="optional">(optional)</span>
          </span>
          <select
            value={form.father_occupation}
            onChange={(e) => update("father_occupation", e.target.value)}
          >
            <option value="">Select</option>
            {OCCUPATIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">
            Mother&apos;s occupation <span className="optional">(optional)</span>
          </span>
          <select
            value={form.mother_occupation}
            onChange={(e) => update("mother_occupation", e.target.value)}
          >
            <option value="">Select</option>
            {OCCUPATIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">
            Relative influence on career <span className="optional">(optional)</span>
          </span>
          <textarea
            rows={2}
            placeholder="e.g. uncle in engineering, cousin in civil services"
            value={form.relative_influence}
            onChange={(e) => update("relative_influence", e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">
            Parental career preference <span className="optional">(optional)</span>
          </span>
          <textarea
            rows={2}
            placeholder="What your family hopes you pursue"
            value={form.family_preference}
            onChange={(e) => update("family_preference", e.target.value)}
          />
        </label>

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </div>
      </form>
    </Layout>
  );
}
