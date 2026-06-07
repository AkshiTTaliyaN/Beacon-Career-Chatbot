import { useState } from "react";
import Layout from "../components/Layout";
import RadioCards from "../components/RadioCards";
import {
  PERFORMANCE_BANDS,
  SUBJECTS,
  INCOME_BRACKETS,
  OCCUPATIONS,
  STUDY_HOURS,
  COACHING_STATUS,
  CAREER_CLARITY,
  LEARNING_STYLES,
} from "../constants/formOptions";
import { validateAcademics } from "../utils/validation";

export default function AcademicsScreen({ form, setForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /** Toggle a subject in the enjoyed_subjects multi-select array (max 4) */
  const MAX_ENJOYED = 4;
  function toggleEnjoyedSubject(subject) {
    setForm((prev) => {
      const current = prev.enjoyed_subjects || [];
      if (current.includes(subject)) {
        return { ...prev, enjoyed_subjects: current.filter((s) => s !== subject) };
      }
      if (current.length >= MAX_ENJOYED) return prev; // silently ignore beyond cap
      return { ...prev, enjoyed_subjects: [...current, subject] };
    });
  }

  function handleNext(e) {
    e.preventDefault();
    const nextErrors = validateAcademics(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onNext();
  }

  return (
    <Layout
      step={6}
      totalSteps={9}
      title="Academics & background"
      subtitle="Help us understand how you study and where you're headed. Family fields are optional."
    >
      <form onSubmit={handleNext} className="form">

        {/* ── Performance band ── */}
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

        {/* ── Strongest subject ── */}
        <label className="field">
          <span className="field-label">Strongest subject *</span>
          <select
            value={form.strongest_subject}
            onChange={(e) => update("strongest_subject", e.target.value)}
          >
            <option value="">Select subject</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.strongest_subject && (
            <p className="field-error">{errors.strongest_subject}</p>
          )}
        </label>

        {/* ── Weakest subject ── */}
        <label className="field">
          <span className="field-label">Weakest subject *</span>
          <select
            value={form.weakest_subject}
            onChange={(e) => update("weakest_subject", e.target.value)}
          >
            <option value="">Select subject</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.weakest_subject && (
            <p className="field-error">{errors.weakest_subject}</p>
          )}
        </label>

        <fieldset className="fieldset">
          <legend className="field-label">
            Subjects you genuinely enjoy{" "}
            <span className="optional">(choose up to {MAX_ENJOYED})</span>
          </legend>
          {/* Count indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.4rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: (form.enjoyed_subjects || []).length >= MAX_ENJOYED ? "#2C5492" : "#556d8f", fontWeight: 600 }}>
              {(form.enjoyed_subjects || []).length} / {MAX_ENJOYED} selected
            </span>
            {(form.enjoyed_subjects || []).length >= MAX_ENJOYED && (
              <span style={{ fontSize: "0.76rem", color: "#2C5492", fontWeight: 600, background: "#e8eeff", padding: "2px 8px", borderRadius: 999 }}>
                ✓ Limit reached
              </span>
            )}
          </div>
          <div className="pill-row">
            {SUBJECTS.map((s) => {
              const isSelected = (form.enjoyed_subjects || []).includes(s);
              const atLimit = (form.enjoyed_subjects || []).length >= MAX_ENJOYED;
              return (
                <button
                  key={s}
                  type="button"
                  className={`pill ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleEnjoyedSubject(s)}
                  disabled={!isSelected && atLimit}
                  style={{ opacity: !isSelected && atLimit ? 0.38 : 1, cursor: !isSelected && atLimit ? "not-allowed" : "pointer" }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* ── A: Study hours per day ── */}
        <div className="field">
          <span className="field-label">
            How many hours do you study outside school per day? *
          </span>
          <RadioCards
            name="study_hours"
            options={STUDY_HOURS}
            value={form.study_hours}
            onChange={(v) => update("study_hours", v)}
            error={errors.study_hours}
          />
        </div>

        {/* ── A: Coaching / study setup ── */}
        <div className="field">
          <span className="field-label">How are you currently studying? *</span>
          <RadioCards
            name="coaching_status"
            options={COACHING_STATUS}
            value={form.coaching_status}
            onChange={(v) => update("coaching_status", v)}
            error={errors.coaching_status}
          />
        </div>

        {/* ── A: Career clarity ── */}
        <div className="field">
          <span className="field-label">
            How clear are you about what career you want? *
          </span>
          <RadioCards
            name="career_clarity"
            options={CAREER_CLARITY}
            value={form.career_clarity}
            onChange={(v) => update("career_clarity", v)}
            error={errors.career_clarity}
          />
        </div>

        {/* ── A: Learning style ── */}
        <div className="field">
          <span className="field-label">How do you learn best? *</span>
          <RadioCards
            name="learning_style"
            options={LEARNING_STYLES}
            value={form.learning_style}
            onChange={(v) => update("learning_style", v)}
            error={errors.learning_style}
          />
        </div>

        {/* ── A: Extracurricular (free text, optional) ── */}
        <label className="field">
          <span className="field-label">
            Extracurricular activities or hobbies{" "}
            <span className="optional">(optional)</span>
          </span>
          <textarea
            rows={2}
            placeholder="e.g. robotics club, painting, cricket, coding projects"
            value={form.extracurricular}
            onChange={(e) => update("extracurricular", e.target.value)}
          />
          <p className="field-hint">
            These help us understand your interests beyond academics.
          </p>
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
              <option key={b.value} value={b.value}>{b.label}</option>
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
              <option key={o} value={o}>{o}</option>
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
              <option key={o} value={o}>{o}</option>
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