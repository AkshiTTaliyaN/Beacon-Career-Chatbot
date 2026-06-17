import { useState } from "react";
import Layout from "../components/Layout";
import RadioCards from "../components/RadioCards";
import AnimatedQuestionCard from "../components/onboarding/AnimatedQuestionCard";
import {
  PERFORMANCE_ICONS,
  STUDY_HOURS_ICONS,
  COACHING_ICONS,
  CLARITY_ICONS,
  LEARNING_ICONS,
} from "../constants/optionIcons";
import {
  PERFORMANCE_BANDS,
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
      title="Your learning journey"
      subtitle="How you study, what clicks for you, and where you're headed — keep it real."
    >
      <form onSubmit={handleNext} className="form onboard-form">

        <AnimatedQuestionCard question="📊 Which range best describes your marks or grades right now?">
          <RadioCards
            name="performance_band"
            options={PERFORMANCE_BANDS}
            value={form.performance_band}
            onChange={(v) => update("performance_band", v)}
            error={errors.performance_band}
            columns={2}
            iconMap={PERFORMANCE_ICONS}
          />
        </AnimatedQuestionCard>

        <AnimatedQuestionCard
          question="⏰ On a typical day, how much time do you spend learning outside regular school hours (homework, revision, coaching, self-study, etc.)?"
          delay={0.05}
        >
          <RadioCards
            name="study_hours"
            options={STUDY_HOURS}
            value={form.study_hours}
            onChange={(v) => update("study_hours", v)}
            error={errors.study_hours}
            columns={2}
            iconMap={STUDY_HOURS_ICONS}
          />
        </AnimatedQuestionCard>

        <AnimatedQuestionCard
          question="📚 How do you usually prepare for exams?"
          delay={0.1}
        >
          <RadioCards
            name="coaching_status"
            options={COACHING_STATUS}
            value={form.coaching_status}
            onChange={(v) => update("coaching_status", v)}
            error={errors.coaching_status}
            iconMap={COACHING_ICONS}
          />
        </AnimatedQuestionCard>

        <AnimatedQuestionCard
          question="🎯 Right now, how clear do you feel about what you'd like to do after school? (It's completely okay if you're still figuring things out.)"
          delay={0.15}
        >
          <RadioCards
            name="career_clarity"
            options={CAREER_CLARITY}
            value={form.career_clarity}
            onChange={(v) => update("career_clarity", v)}
            error={errors.career_clarity}
            columns={2}
            iconMap={CLARITY_ICONS}
          />
        </AnimatedQuestionCard>

        <AnimatedQuestionCard
          question="🧠 When something new clicks for you, how does it usually happen?"
          delay={0.2}
        >
          <RadioCards
            name="learning_style"
            options={LEARNING_STYLES}
            value={form.learning_style}
            onChange={(v) => update("learning_style", v)}
            error={errors.learning_style}
            iconMap={LEARNING_ICONS}
          />
        </AnimatedQuestionCard>

        <AnimatedQuestionCard
          question={
            <>
              🎨 What do you enjoy outside school?{" "}
              <span className="optional">(optional)</span>
            </>
          }
          delay={0.25}
        >
          <label className="field">
            <textarea
              rows={2}
              placeholder="e.g. cricket, coding, painting, volunteering"
              value={form.extracurricular}
              onChange={(e) => update("extracurricular", e.target.value)}
            />
          </label>
        </AnimatedQuestionCard>

        <div className="family-section">
          <p className="family-section-label">👨‍👩‍👧 A bit about your family — all optional</p>

          <label className="field">
            <span className="field-label">💰 What's your family's approximate yearly income?</span>
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
            <span className="field-label">Father or guardian's occupation</span>
            <select
              value={form.father_occupation}
              onChange={(e) => update("father_occupation", e.target.value)}
            >
              <option value="">Choose</option>
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Mother or guardian's occupation</span>
            <select
              value={form.mother_occupation}
              onChange={(e) => update("mother_occupation", e.target.value)}
            >
              <option value="">Choose</option>
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Anyone in your family who inspired your career interests?</span>
            <textarea
              rows={2}
              placeholder="e.g. sister in medicine, uncle who's an engineer"
              value={form.relative_influence}
              onChange={(e) => update("relative_influence", e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Do your parents have any career preferences for you?</span>
            <textarea
              rows={2}
              placeholder="e.g. they'd love me to try for IIT, or they're open to anything"
              value={form.family_preference}
              onChange={(e) => update("family_preference", e.target.value)}
            />
          </label>
        </div>

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
          <button type="submit" className="btn btn-primary">Continue →</button>
        </div>
      </form>
    </Layout>
  );
}
