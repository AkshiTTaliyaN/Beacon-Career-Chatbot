import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import AnimatedQuestionCard from "../components/onboarding/AnimatedQuestionCard";

const PRIORITIES = [
  'High Salary',
  'Job Stability',
  'Creative Freedom',
  'Social Impact',
  'Intellectual Challenge',
  'Work Life Balance',
];

const PRIORITY_DISPLAY = {
  'High Salary': '💰 High Salary',
  'Job Stability': '🛡️ Job Stability',
  'Creative Freedom': '🎨 Creative Freedom',
  'Social Impact': '🌍 Social Impact',
  'Intellectual Challenge': '🧩 Intellectual Challenge',
  'Work Life Balance': '⚖️ Work-Life Balance',
};

const WORK_LABELS = {
  building: '🔧 Building & fixing things — models, machines, DIY',
  researching: '🔍 Finding patterns & solving problems',
  creative: '🎨 Creating — art, writing, design, music',
  helping: '🤝 Helping & teaching people',
  leading: '📣 Leading groups & pitching ideas',
  structured: '📋 Organised work — plans, data, checklists',
};

export default function WorkStyle({ form, setForm, onNext, onBack }) {
  const [msg, setMsg] = useState('');

  function updateWorkStyle(key, value) {
    setForm((prev) => ({ ...prev, workStyle: { ...(prev.workStyle || {}), [key]: Number(value) } }));
  }

  function togglePriority(p) {
    const arr = form.careerPriorities || [];
    if (arr.includes(p)) {
      setForm((prev) => ({ ...prev, careerPriorities: arr.filter(x => x !== p) }));
      setMsg('');
      return;
    }
    if ((arr || []).length >= 3) {
      setMsg('Pick 3 max — tap one to swap.');
      return;
    }
    setForm((prev) => ({ ...prev, careerPriorities: [...arr, p] }));
    setMsg('');
  }

  function setSoloTeam(v) {
    setForm((prev) => ({ ...prev, workPreferences: { ...(prev.workPreferences || {}), soloTeam: Number(v) } }));
  }

  function setRelocation(val) {
    setForm((prev) => ({ ...prev, workPreferences: { ...(prev.workPreferences || {}), relocation: val } }));
  }

  function handleNext(e) {
    e.preventDefault();
    if ((form.careerPriorities || []).length !== 3) {
      setMsg('Pick exactly 3 priorities.');
      return;
    }
    if (!form.workPreferences?.relocation) {
      setMsg('Let us know about relocating.');
      return;
    }
    setMsg('');
    onNext();
  }

  return (
    <Layout
      step={5}
      totalSteps={9}
      title="What kind of work fits you?"
      subtitle="Slide to rate how much you'd enjoy each type — 1 = not my thing, 5 = love it."
    >
      <form onSubmit={handleNext} className="form onboard-form">

        <AnimatedQuestionCard question="How much would you enjoy each of these?">
          {['building','researching','creative','helping','leading','structured'].map((k, i) => (
            <label
              key={k}
              className="field slider-field"
            >
              <span className="field-label" style={{ fontSize: "0.9rem" }}>{WORK_LABELS[k]}</span>
              <input type="range" min={1} max={5} value={form.workStyle?.[k] || 3} onChange={(e) => updateWorkStyle(k, e.target.value)} />
              <div className="slider-labels"><span>1</span><span>5</span></div>
            </label>
          ))}
        </AnimatedQuestionCard>

        <AnimatedQuestionCard question="🏆 Pick your top 3 career priorities" delay={0.05}>
          <div className="priority-grid">
            {PRIORITIES.map((p, i) => {
              const sel = (form.careerPriorities || []).includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePriority(p)}
                  className={`priority-chip${sel ? " selected" : ""}`}
                >
                  {PRIORITY_DISPLAY[p] || p}
                </button>
              );
            })}
          </div>
          {msg && <p className="field-error">{msg}</p>}
        </AnimatedQuestionCard>

        <AnimatedQuestionCard question="Do you prefer working solo or with a team?" delay={0.1}>
          <label className="field slider-field">
            <input type="range" min={1} max={5} value={form.workPreferences?.soloTeam || 3} onChange={(e) => setSoloTeam(e.target.value)} />
            <div className="slider-labels"><span>Mostly solo</span><span>Mostly team</span></div>
          </label>

          <label className="field" style={{ marginTop: "1rem" }}>
            <span className="question-heading" style={{ marginBottom: "0.75rem" }}>
              ✈️ Would you move to another city for college or work?
            </span>
            <div className="reloc-pills">
              {['Yes','Maybe','No'].map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRelocation(opt)}
                  className={`reloc-pill${form.workPreferences?.relocation === opt ? " selected" : ""}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </label>
        </AnimatedQuestionCard>

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!form.workPreferences?.relocation || (form.careerPriorities || []).length !== 3}
            style={{
              opacity: ((!form.workPreferences?.relocation || (form.careerPriorities || []).length !== 3) ? 0.5 : 1),
              cursor: ((!form.workPreferences?.relocation || (form.careerPriorities || []).length !== 3) ? 'not-allowed' : 'pointer'),
            }}
          >
            Continue →
          </button>
        </div>
      </form>
    </Layout>
  );
}
