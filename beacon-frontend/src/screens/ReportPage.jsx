import React, { useEffect, useState } from 'react';


const BEACON_API = 'http://localhost:8000';

const RIASEC_COLORS = {
  Investigative: '#3b82f6',
  Realistic: '#ef4444',
  Conventional: '#22c55e',
  Enterprising: '#f97316',
  Artistic: '#8b5cf6',
  Social: '#14b8a6',
};

const RIASEC_FULL = {
  R: 'Realistic', I: 'Investigative', A: 'Artistic',
  S: 'Social', E: 'Enterprising', C: 'Conventional',
};

const PERSONALITY_DESCS = {
  Investigative: 'Investigative individuals are analytical, curious, and enjoy research and problem solving. You prefer working with ideas and data rather than routine tasks, and you are motivated by understanding how systems work.',
  Realistic: 'Realistic individuals are practical, hands-on, and mechanically inclined. You enjoy working with tools, machines, and physical systems and prefer concrete tasks over abstract ones.',
  Artistic: 'Artistic individuals are creative, expressive, and imaginative. You thrive when given freedom to communicate ideas through design, writing, music, or performance.',
  Social: 'Social individuals are empathetic, collaborative, and people-oriented. You are motivated by helping, teaching, and connecting with others.',
  Enterprising: 'Enterprising individuals are ambitious, persuasive, and natural leaders. You are drawn to challenges involving influence, initiative, and building things.',
  Conventional: 'Conventional individuals are detail-oriented, organised, and methodical. You thrive in structured environments where accuracy and systems matter.',
};

function getToken() {
  return localStorage.getItem('beacon_token');
}

function Bar({ label, value, color }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#07143a', fontWeight: 700, fontSize: '0.95rem' }}>{label}</span>
        <span style={{ color: '#374151', fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ background: '#e6eef9', borderRadius: 8, height: 12, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color || '#2563EB',
            borderRadius: 8,
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function ReportPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(null);  // from URL or profile

  // ── 1. Read URL params (from aptitude redirect, now legacy) ──────────────
  const urlParams = new URLSearchParams(window.location.search);
  const urlScores = {};
  ['R', 'I', 'A', 'S', 'E', 'C'].forEach(k => {
    const v = urlParams.get(k);
    if (v !== null) urlScores[k] = Number(v);
  });
  const hasUrlScores = Object.keys(urlScores).length === 6;

  // ── 2. On mount: load profile & set scores ───────────────────────────────
  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch(`${BEACON_API}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          // Priority: URL params > profile scores
          if (hasUrlScores) {
            setScores(urlScores);
          } else if (data.riasec_scores) {
            setScores(data.riasec_scores);
          }
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  // ── UI helpers ────────────────────────────────────────────────────────────
  const NAVY = '#07143a';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <p style={{ color: '#6b7280' }}>Loading your report…</p>
      </div>
    );
  }

  // Derive personality info from scores
  let sortedScores = [];
  let primaryCode = 'I', secondaryCode = 'R';
  let primaryName = 'Investigative', secondaryName = 'Realistic';

  if (scores && Object.keys(scores).length >= 2) {
    sortedScores = Object.entries(scores)
      .map(([code, val]) => ({ code, name: RIASEC_FULL[code] || code, value: Number(val) }))
      .sort((a, b) => b.value - a.value);
    primaryCode = sortedScores[0]?.code || 'I';
    secondaryCode = sortedScores[1]?.code || 'R';
    primaryName = RIASEC_FULL[primaryCode] || primaryCode;
    secondaryName = RIASEC_FULL[secondaryCode] || secondaryCode;
  }

  const studentName = profile?.name || localStorage.getItem('userName') || 'Student';
  const streamDisplay = {
    pcm: 'PCM', pcb: 'PCB', pcmb: 'PCM/PCB', comm: 'Commerce', arts: 'Arts', none: 'Not decided',
  }[profile?.stream || ''] || '';

  const hasScores = sortedScores.length >= 2;
  const primaryColor = RIASEC_COLORS[primaryName] || '#2563EB';

  return (
    <div style={{ background: '#fff', color: '#111827', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, Roboto, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: NAVY, color: '#fff' }}>
        <div style={{ fontWeight: 800, fontSize: 18, cursor: 'pointer' }}
          onClick={() => { window.history.pushState({}, '', '/dashboard'); window.dispatchEvent(new PopStateEvent('popstate')); }}>
          Beacon
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Beacon Personality &amp; Career Report</div>
          <div style={{ marginTop: 6, opacity: 0.9 }}>
            {studentName}{streamDisplay ? ` • ${streamDisplay}` : ''}
          </div>
          <div style={{ marginTop: 4, fontSize: 13, opacity: 0.75 }}>
            {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div>
          <button
            onClick={() => window.print()}
            style={{ background: '#fff', color: NAVY, border: 'none', padding: '0.5rem 0.9rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
          >
            ⬇ Download PDF
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>

        {!hasScores ? (
          /* ── No scores state ────────────────────────────────────────────── */
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧪</div>
            <h2 style={{ color: NAVY, marginBottom: 12 }}>No test results yet</h2>
            <p style={{ color: '#374151', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
              Take the psychometric test to generate your personalised RIASEC report.
              It takes 10–15 minutes and your results are saved to your profile.
            </p>
            <button
              onClick={() => window.open('http://localhost:3001', '_blank')}
              style={{ background: NAVY, color: '#fff', border: 'none', padding: '0.9rem 2rem', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              Take the Psychometric Test →
            </button>
          </div>
        ) : (
          <>
            {/* ── Personality Overview ────────────────────────────────────── */}
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ color: NAVY, margin: '0 0 16px 0', fontSize: '1.4rem', fontWeight: 800 }}>Personality Overview</h2>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 160px' }}>
                  <div style={{ background: primaryColor + '18', color: primaryColor, padding: '1.2rem', borderRadius: 12, textAlign: 'center', fontWeight: 800, fontSize: '1.3rem', border: `2px solid ${primaryColor}30` }}>
                    {primaryName}
                  </div>
                  <div style={{ marginTop: 10, color: '#374151', fontSize: '0.9rem' }}>
                    Secondary: <strong style={{ color: NAVY }}>{secondaryName}</strong>
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#6b7280' }}>
                    Holland Code: <strong style={{ color: NAVY }}>{sortedScores.slice(0, 3).map(s => s.code).join('')}</strong>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <p style={{ marginTop: 0, color: '#374151', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {PERSONALITY_DESCS[primaryName] || ''}
                  </p>
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ margin: '0 0 12px 0', color: NAVY, fontSize: '0.95rem' }}>RIASEC Scores</h4>
                    <div style={{ background: '#f7f9fb', padding: 16, borderRadius: 10 }}>
                      {sortedScores.map(item => (
                        <Bar
                          key={item.code}
                          label={item.name}
                          value={item.value}
                          color={RIASEC_COLORS[item.name] || '#2563EB'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />

            {/* ── Next steps nudge ────────────────────────────────────────── */}
            <section style={{ marginBottom: 32 }}>
              <div style={{ background: primaryColor + '0d', border: `1px solid ${primaryColor}30`, borderRadius: 12, padding: '1.5rem 2rem' }}>
                <h3 style={{ color: NAVY, margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 800 }}>
                  ✨ See your personalised career matches
                </h3>
                <p style={{ color: '#374151', margin: '0 0 16px 0', lineHeight: 1.6 }}>
                  Your RIASEC scores have been saved to your profile. Head back to the dashboard to see
                  your top 5 career recommendations — matched using your personality, subjects, and goals.
                </p>
                <button
                  onClick={() => { window.history.pushState({}, '', '/dashboard'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                  style={{ background: NAVY, color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 9, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  Go to Dashboard →
                </button>
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />

            {/* ── Detailed scores table ─────────────────────────────────── */}
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ color: NAVY, margin: '0 0 16px 0', fontSize: '1.4rem', fontWeight: 800 }}>Your Full Score Breakdown</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                {sortedScores.map((item, i) => (
                  <div key={item.code} style={{
                    background: '#fff',
                    border: `1px solid ${i === 0 ? item.color || primaryColor : '#e5e7eb'}`,
                    borderTop: `3px solid ${RIASEC_COLORS[item.name] || '#94a3b8'}`,
                    borderRadius: 10,
                    padding: '1rem 1.2rem',
                    boxShadow: '0 2px 8px rgba(7,20,58,0.05)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: NAVY, fontSize: '1rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>{item.code}</div>
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: RIASEC_COLORS[item.name] || '#6b7280' }}>
                        {item.value}%
                      </div>
                    </div>
                    <div style={{ marginTop: 10, background: '#f1f5f9', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${item.value}%`, height: '100%', background: RIASEC_COLORS[item.name] || '#6b7280', borderRadius: 6 }} />
                    </div>
                    {i === 0 && <div style={{ marginTop: 8, fontSize: '0.78rem', color: primaryColor, fontWeight: 600 }}>Primary type</div>}
                    {i === 1 && <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#6b7280', fontWeight: 600 }}>Secondary type</div>}
                  </div>
                ))}
              </div>
            </section>

            <footer style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '1rem 0 4rem 0' }}>
              Beacon © 2026 — This report is based on the globally validated RIASEC psychometric model.
              For personalised counselling contact our team.
            </footer>
          </>
        )}
      </div>

      <style>{`@media print { button { display:none } }`}</style>
    </div>
  );
}
