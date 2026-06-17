import { useState } from "react";
import Layout from "../components/Layout";
import RadioCards from "../components/RadioCards";
import AnimatedQuestionCard from "../components/onboarding/AnimatedQuestionCard";
import { SECTOR_ICONS, RELOC_ICONS, COST_ICONS } from "../constants/optionIcons";
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
      title="Almost there"
      subtitle="Last few questions about the future you're imagining."
    >
      <form onSubmit={handleSubmit} className="form onboard-form">

        <AnimatedQuestionCard question="🚀 After school, which path feels most exciting to you right now?">
          <RadioCards
            name="target_sector"
            options={TARGET_SECTORS}
            value={form.target_sector}
            onChange={(v) => update("target_sector", v)}
            error={errors.target_sector}
            columns={2}
            iconMap={SECTOR_ICONS}
          />
        </AnimatedQuestionCard>

        <AnimatedQuestionCard
          question="✈️ Would you move to another city for the right college or job?"
          delay={0.05}
        >
          <RadioCards
            name="relocation_pref"
            options={RELOCATION_PREFS}
            value={form.relocation_pref}
            onChange={(v) => update("relocation_pref", v)}
            error={errors.relocation_pref}
            columns={2}
            iconMap={RELOC_ICONS}
          />
        </AnimatedQuestionCard>

        <AnimatedQuestionCard
          question="💳 How much does college cost matter for your family when you're choosing options?"
          delay={0.1}
        >
          <RadioCards
            name="cost_constraint"
            options={COST_CONSTRAINTS}
            value={form.cost_constraint}
            onChange={(v) => update("cost_constraint", v)}
            error={errors.cost_constraint}
            iconMap={COST_ICONS}
          />
        </AnimatedQuestionCard>

        <AnimatedQuestionCard
          question={
            <>
              💬 Anything else we should know?{" "}
              <span className="optional">(optional)</span>
            </>
          }
          delay={0.15}
        >
          <label className="field">
            <textarea
              rows={3}
              placeholder="e.g. dream colleges, family expectations, careers you're curious about"
              value={form.additional_notes}
              onChange={(e) => update("additional_notes", e.target.value)}
            />
          </label>
        </AnimatedQuestionCard>

        {submitError && <p className="field-error">{submitError}</p>}

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack} disabled={loading}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving…" : "Finish — show my results →"}
          </button>
        </div>
      </form>
    </Layout>
  );
}
