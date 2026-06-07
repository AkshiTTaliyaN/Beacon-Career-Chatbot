import { useState } from "react";
import Layout from "../components/Layout";

const NAVY = '#2C5492';

const PRIORITIES = [
  'High Salary',
  'Job Stability',
  'Creative Freedom',
  'Social Impact',
  'Intellectual Challenge',
  'Work Life Balance',
];

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
      setMsg('You can only pick 3');
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
      setMsg('Please select exactly 3 priorities');
      return;
    }
    if (!form.workPreferences?.relocation) {
      setMsg('Please indicate relocation preference');
      return;
    }
    setMsg('');
    onNext();
  }

  return (
    <Layout step={5} totalSteps={9} title="What kind of work suits you" subtitle="This tells us how you like to work and what you want from a career.">
      <form onSubmit={handleNext} className="form">
        <div className="section">
          <p className="section-title">Section A — Work style (rate 1–5)</p>
          {['building','researching','creative','helping','leading','structured'].map((k) => (
            <label key={k} className="field">
              <span className="field-label">{k === 'building' ? 'Building or fixing physical things' : k === 'researching' ? 'Researching and analysing data' : k === 'creative' ? 'Creative work like art, writing or design' : k === 'helping' ? 'Helping or teaching other people' : k === 'leading' ? 'Leading teams or convincing others' : 'Following structured processes and systems'}</span>
              <input type="range" min={1} max={5} value={form.workStyle?.[k] || 3} onChange={(e) => updateWorkStyle(k, e.target.value)} />
            </label>
          ))}
        </div>

        <hr className="divider" />

        <div className="section">
          <p className="section-title">Section B — Career priorities (pick exactly 3)</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {PRIORITIES.map((p) => {
              const sel = (form.careerPriorities || []).includes(p);
              return (
                <button key={p} type="button" onClick={() => togglePriority(p)} style={{ padding: '0.9rem', borderRadius: 8, border: sel ? `2px solid ${NAVY}` : '1px solid #e5e7eb', background: sel ? NAVY : '#fff', color: sel ? '#fff' : '#111', cursor: 'pointer' }}>{p}</button>
              );
            })}
          </div>
          {msg && <p className="field-error">{msg}</p>}
        </div>

        <hr className="divider" />

        <div className="section">
          <p className="section-title">Section C — Final questions</p>
          <label className="field">
            <span className="field-label">Do you prefer working alone or in a team?</span>
            <input type="range" min={1} max={5} value={form.workPreferences?.soloTeam || 3} onChange={(e) => setSoloTeam(e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>Solo</span><span>Team</span></div>
          </label>

          <label className="field">
            <span className="field-label">Are you open to relocating for work?</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Yes','Maybe','No'].map((opt) => (
                <button key={opt} type="button" onClick={() => setRelocation(opt)} style={{ padding: '0.45rem 0.85rem', borderRadius: 999, border: form.workPreferences?.relocation === opt ? `2px solid ${NAVY}` : '1px solid #e5e7eb', background: form.workPreferences?.relocation === opt ? NAVY : '#fff', color: form.workPreferences?.relocation === opt ? '#fff' : '#111', cursor: 'pointer' }}>{opt}</button>
              ))}
            </div>
          </label>
        </div>

        <div className="btn-row">
          <button type="button" className="btn btn-ghost" onClick={onBack}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!form.workPreferences?.relocation || (form.careerPriorities || []).length !== 3} style={{ opacity: ((!form.workPreferences?.relocation || (form.careerPriorities || []).length !== 3) ? 0.5 : 1), cursor: ((!form.workPreferences?.relocation || (form.careerPriorities || []).length !== 3) ? 'not-allowed' : 'pointer') }}>Continue</button>
        </div>
      </form>
    </Layout>
  );
}
