import { useState } from "react";
import Layout from "../components/Layout";
import RadioCards from "../components/RadioCards";
import {
  CLASSES,
  BOARDS,
  STREAMS,
  INDIAN_STATES,
} from "../constants/formOptions";
import { validateBasicInfo } from "../utils/validation";

export default function BasicInfoScreen({ form, setForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const cls = Number(form.current_class);
  const showStream = cls >= 10;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext(e) {
    e.preventDefault();
    const nextErrors = validateBasicInfo(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onNext();
  }

  return (
    <Layout
      step={2}
      totalSteps={6}
      title="Basic information"
      subtitle="Tell us about your class and location."
    >
      <form onSubmit={handleNext} className="form">
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
          {errors.current_class && <p className="field-error">{errors.current_class}</p>}
        </fieldset>

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

        <label className="field">
          <span className="field-label">City *</span>
          <input
            type="text"
            placeholder="Your city"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
          {errors.city && <p className="field-error">{errors.city}</p>}
        </label>

        <label className="field">
          <span className="field-label">State *</span>
          <select value={form.state} onChange={(e) => update("state", e.target.value)}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && <p className="field-error">{errors.state}</p>}
        </label>

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
