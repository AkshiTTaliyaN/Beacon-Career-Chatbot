import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import RadioCards from "../components/RadioCards";
import AnimatedQuestionCard from "../components/onboarding/AnimatedQuestionCard";
import { STREAM_ICONS } from "../constants/optionIcons";
import {
  CLASSES,
  BOARDS,
  STREAMS,
  INDIAN_STATES,
} from "../constants/formOptions";
import { STATE_CITIES } from "../constants/IndianCities";
import { validateBasicInfo, validateName } from "../utils/validation";

export default function BasicInfoScreen({ form, setForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const cls = Number(form.current_class);
  const showStream = cls >= 10;

  const cityOptions = form.state ? (STATE_CITIES[form.state] || []) : [];

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleStateChange(newState) {
    const citiesForNewState = STATE_CITIES[newState] || [];
    setForm((prev) => ({
      ...prev,
      state: newState,
      city: citiesForNewState.includes(prev.city) ? prev.city : "",
    }));
  }

  function handleNext(e) {
    e.preventDefault();
    const nameErrors = validateName(form);
    const basicErrors = validateBasicInfo(form);
    const allErrors = { ...nameErrors, ...basicErrors };
    setErrors(allErrors);
    if (Object.keys(allErrors).length === 0) onNext();
  }

  return (
    <Layout
      step={2}
      totalSteps={9}
      title="Nice to meet you"
      subtitle="A few quick details so we can tailor everything to your stage and location."
    >
      <form onSubmit={handleNext} className="form onboard-form">

        <AnimatedQuestionCard question="👋 What should we call you?" delay={0}>
          <label className="field">
            <input
              type="text"
              autoComplete="given-name"
              placeholder="e.g. Aryan Sharma"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </label>
        </AnimatedQuestionCard>

        <AnimatedQuestionCard question="🎓 Which class are you in right now?" delay={0.05}>
          <fieldset className="fieldset">
            <div className="pill-row">
              {CLASSES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`pill ${Number(form.current_class) === c ? "selected" : ""}`}
                  onClick={() => {
                    update("current_class", String(c));
                    if (c < 10) update("stream", "none");
                  }}
                >
                  Class {c}
                </button>
              ))}
            </div>
            {errors.current_class && (
              <p className="field-error">{errors.current_class}</p>
            )}
          </fieldset>
        </AnimatedQuestionCard>

        <AnimatedQuestionCard question="📋 Which board are you studying under?" delay={0.1}>
          <label className="field">
            <select
              value={form.board}
              onChange={(e) => update("board", e.target.value)}
            >
              <option value="">Choose your board</option>
              {BOARDS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            {errors.board && <p className="field-error">{errors.board}</p>}
          </label>
        </AnimatedQuestionCard>

        {showStream && (
          <AnimatedQuestionCard
            question="🔬 What's your stream — or what are you leaning towards?"
            delay={0.15}
          >
            <RadioCards
              name="stream"
              options={STREAMS}
              value={form.stream}
              onChange={(v) => update("stream", v)}
              error={errors.stream}
              columns={2}
              iconMap={STREAM_ICONS}
            />
          </AnimatedQuestionCard>
        )}

        <AnimatedQuestionCard question="📍 Where do you live?" delay={0.2}>
          <label className="field">
            <select
              value={form.state}
              onChange={(e) => handleStateChange(e.target.value)}
            >
              <option value="">State</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && <p className="field-error">{errors.state}</p>}
          </label>
          <label className="field" style={{ marginTop: "0.75rem" }}>
            {cityOptions.length > 0 ? (
              <select
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                disabled={!form.state}
              >
                <option value="">City</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder={form.state ? "Type your city" : "Pick a state first"}
                value={form.city}
                disabled={!form.state}
                onChange={(e) => update("city", e.target.value)}
              />
            )}
            {errors.city && <p className="field-error">{errors.city}</p>}
          </label>
        </AnimatedQuestionCard>

        <AnimatedQuestionCard
          question={
            <>
              🏫 What&apos;s your school called?{" "}
              <span className="optional">(optional)</span>
            </>
          }
          delay={0.25}
        >
          <label className="field">
            <input
              type="text"
              placeholder="e.g. Delhi Public School"
              value={form.school_name}
              onChange={(e) => update("school_name", e.target.value)}
            />
          </label>
        </AnimatedQuestionCard>

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Continue →
          </button>
        </div>
      </form>
    </Layout>
  );
}
