import { useState } from "react";
import Layout from "../components/Layout";
import RadioCards from "../components/RadioCards";
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
    // Validate name + the rest of basic info together
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
      title="Basic information"
      subtitle="Let's start with your name and where you're studying."
    >
      <form onSubmit={handleNext} className="form">

        {/* ── B: Name — first field ── */}
        <label className="field">
          <span className="field-label">Your name *</span>
          <input
            type="text"
            autoComplete="given-name"
            placeholder="e.g. Aryan Sharma"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </label>

        {/* ── Class ── */}
        <fieldset className="fieldset">
          <legend className="field-label">Current class *</legend>
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

        {/* ── Board ── */}
        <label className="field">
          <span className="field-label">Board *</span>
          <select
            value={form.board}
            onChange={(e) => update("board", e.target.value)}
          >
            <option value="">Select board</option>
            {BOARDS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          {errors.board && <p className="field-error">{errors.board}</p>}
        </label>

        {/* ── Stream (Class 10+) ── */}
        {showStream && (
          <div className="field">
            <span className="field-label">Stream *</span>
            <RadioCards
              name="stream"
              options={STREAMS}
              value={form.stream}
              onChange={(v) => update("stream", v)}
              error={errors.stream}
            />
          </div>
        )}

        {/* ── State ── */}
        <label className="field">
          <span className="field-label">State *</span>
          <select
            value={form.state}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && <p className="field-error">{errors.state}</p>}
        </label>

        {/* ── City ── */}
        <label className="field">
          <span className="field-label">City *</span>
          {cityOptions.length > 0 ? (
            <select
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              disabled={!form.state}
            >
              <option value="">Select city</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder={form.state ? "Enter your city" : "Select a state first"}
              value={form.city}
              disabled={!form.state}
              onChange={(e) => update("city", e.target.value)}
            />
          )}
          {errors.city && <p className="field-error">{errors.city}</p>}
          {!form.state && (
            <p className="field-hint">Select your state above to see cities.</p>
          )}
        </label>

        {/* ── School name (optional) ── */}
        <label className="field">
          <span className="field-label">
            School name <span className="optional">(optional)</span>
          </span>
          <input
            type="text"
            placeholder="School name"
            value={form.school_name}
            onChange={(e) => update("school_name", e.target.value)}
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