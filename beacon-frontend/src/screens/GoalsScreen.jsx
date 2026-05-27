import { useState } from "react";
import Layout from "../components/Layout";
import RadioCards from "../components/RadioCards";
import {
  TARGET_SECTORS,
  RELOCATION_PREFS,
  COST_CONSTRAINTS,
} from "../constants/formOptions";
import { validateGoals, buildProfilePayload } from "../utils/validation";
import { saveProfile } from "../api/client";

export default function GoalsScreen({ form, setForm, onSuccess, onBack }) {
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateGoals(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      const payload = buildProfilePayload(form);
      await saveProfile(payload);
      onSuccess();
    } catch (err) {
      setSubmitError(err.message || "Could not save profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout
      step={7}
      totalSteps={9}
      title="Your goals"
      subtitle="Where you want to go — we use this to shape career paths."
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <span className="field-label">Target sector *</span>
          <RadioCards
            name="target_sector"
            options={TARGET_SECTORS}
            value={form.target_sector}
            onChange={(v) => update("target_sector", v)}
            error={errors.target_sector}
          />
        </div>

        <div className="field">
          <span className="field-label">Relocation preference *</span>
          <RadioCards
            name="relocation_pref"
            options={RELOCATION_PREFS}
            value={form.relocation_pref}
            onChange={(v) => update("relocation_pref", v)}
            error={errors.relocation_pref}
          />
        </div>

        <div className="field">
          <span className="field-label">Cost / fees constraint *</span>
          <RadioCards
            name="cost_constraint"
            options={COST_CONSTRAINTS}
            value={form.cost_constraint}
            onChange={(v) => update("cost_constraint", v)}
            error={errors.cost_constraint}
          />
        </div>

        <label className="field">
          <span className="field-label">
            Additional notes <span className="optional">(optional)</span>
          </span>
          <textarea
            rows={3}
            placeholder="Anything else we should know"
            value={form.additional_notes}
            onChange={(e) => update("additional_notes", e.target.value)}
          />
        </label>

        {submitError && <p className="field-error">{submitError}</p>}

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack} disabled={loading}>
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting…" : "Submit profile"}
          </button>
        </div>
      </form>
    </Layout>
  );
}
