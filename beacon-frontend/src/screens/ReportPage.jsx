import { useEffect, useState, useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell,
  ResponsiveContainer,
} from 'recharts';
import { getCareerBannerImage } from '../utils/bannerImage';

import { API as BEACON_API } from '../config';


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

/* ── Simple progress bar (used in Score Breakdown cards) ─────────── */
function ScoreBar({ label, value, color }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#102849', fontWeight: 700, fontSize: '0.95rem' }}>{label}</span>
        <span style={{ color: '#374151', fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ background: '#e6eef9', borderRadius: 8, height: 12, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color || '#2C5492',
            borderRadius: 8,
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}

/* ── Section heading helper ──────────────────────────────────────── */
function SectionHeading({ title, subtitle }) {
  const NAVY = '#2C5492';
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ color: NAVY, margin: '0 0 6px 0', fontSize: '1.35rem', fontWeight: 800 }}>{title}</h2>
      {subtitle && <p style={{ margin: 0, color: '#556d8f', fontSize: '0.9rem' }}>{subtitle}</p>}
    </div>
  );
}

/* ── Custom radar tooltip ─────────────────────────────────────────── */
function RadarTooltipContent({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', fontSize: 13 }}>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700, marginBottom: 2 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

/* ── Custom radar ticks to prevent overlaps ───────────────────────── */
function ReportRadarTick({ x, y, cx, cy, payload }) {
  const dx = x - cx;
  const dy = y - cy;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  // Push outwards by 14px
  const offset = 14;
  const newX = len > 0 ? x + (dx / len) * offset : x;
  const newY = len > 0 ? y + (dy / len) * offset : y;
  
  // Align text anchor based on position relative to center
  let textAnchor = 'middle';
  if (dx > 20) textAnchor = 'start';
  else if (dx < -20) textAnchor = 'end';
  
  // Adjust dy to avoid vertical overlap
  let adjustedDy = 4;
  if (dy < -20) adjustedDy = -4; // above the dot
  else if (dy > 20) adjustedDy = 12; // below the dot

  return (
    <g transform={`translate(${newX},${newY})`}>
      <text
        textAnchor={textAnchor}
        dy={adjustedDy}
        style={{
          fill: '#2C5492', // NAVY
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {payload.value}
      </text>
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
export default function ReportPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const NAVY = '#2C5492';

  // ── 1. Read URL params ───────────────────────────────────────────
  const freshTest = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('scores_written') === '1';
  }, []);

  const urlScores = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const scores = {};
    ['R', 'I', 'A', 'S', 'E', 'C'].forEach(k => {
      const v = params.get(k);
      if (v !== null) scores[k] = Number(v);
    });
    return scores;
  }, []);
  const hasUrlScores = useMemo(() => Object.keys(urlScores).length === 6, [urlScores]);

  // ── 2. Load profile & scores ─────────────────────────────────────
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
          if (hasUrlScores) setScores(urlScores);
          else if (data.riasec_scores) setScores(data.riasec_scores);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    load();
  }, [hasUrlScores, urlScores]);

  // ── 3. Fetch banner image (only for fresh test results) ──────────
  useEffect(() => {
    if (!freshTest) return;
    getCareerBannerImage({ query: 'career,success,india,student', width: 900, height: 220 })
      .then(url => setBannerImage(url))
      .catch(() => {});
  }, [freshTest]);

  // ── Build radar data (RIASEC + WorkStyle overlay) ────────────────
  const radarData = useMemo(() => transformRadarData(scores, profile?.work_style), [scores, profile?.work_style]);

  // ── Build subject bar data ────────────────────────────────────────
  const subjectData = useMemo(() => transformSubjectData(profile?.subject_ratings), [profile?.subject_ratings]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <p style={{ color: '#556d8f' }}>Loading your report…</p>
      </div>
    );
  }

  // ── Derive personality info ──────────────────────────────────────
  let sortedScores = [];
  let primaryName = 'Investigative', secondaryName = 'Realistic';

  if (scores && Object.keys(scores).length >= 2) {
    sortedScores = Object.entries(scores)
      .map(([code, val]) => ({ code, name: RIASEC_FULL[code] || code, value: Number(val) }))
      .sort((a, b) => b.value - a.value);
    const primaryCode   = sortedScores[0]?.code || 'I';
    const secondaryCode = sortedScores[1]?.code || 'R';
    primaryName   = RIASEC_FULL[primaryCode]   || primaryCode;
    secondaryName = RIASEC_FULL[secondaryCode] || secondaryCode;
  }

  const studentName  = profile?.name || localStorage.getItem('userName') || 'Student';
  const streamDisplay = {
    pcm: 'PCM', pcb: 'PCB', pcmb: 'PCM/PCB', comm: 'Commerce', arts: 'Arts', none: 'Not decided',
  }[profile?.stream || ''] || '';

  const hasScores    = sortedScores.length >= 2;
  const primaryColor = RIASEC_COLORS[primaryName] || NAVY;

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

      <div style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>

        {!hasScores ? (
          /* ── No scores state ──────────────────────────────────────── */
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧪</div>
            <h2 style={{ color: NAVY, marginBottom: 12 }}>No test results yet</h2>
            <p style={{ color: '#374151', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
              Take the psychometric test to generate your personalised RIASEC report.
              It takes 10–15 minutes and your results are saved to your profile.
            </p>
            <button
              onClick={() => {
                const token = getToken();
                const origin = window.location.origin;
                const url = token
                  ? `http://localhost:3001?beacon_token=${encodeURIComponent(token)}&origin=${encodeURIComponent(origin)}`
                  : `http://localhost:3001?origin=${encodeURIComponent(origin)}`;
                window.open(url, '_blank');
              }}
              style={{ background: NAVY, color: '#fff', border: 'none', padding: '0.9rem 2rem', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              Take the Psychometric Test →
            </button>
          </div>
        ) : (
          <>
            {/* ── Fresh-test congratulatory banner ─────────────────────── */}
            {freshTest && (
              <>
                {/* GIF banner — powered by bannerImage.js (change PROVIDER there to switch source) */}
                {bannerImage && (
                  <div style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    marginBottom: 20,
                    boxShadow: '0 6px 32px rgba(44,84,146,0.18)',
                  }}>
                    {/* Dark container — objectFit:contain so GIFs aren't cropped */}
                    <div style={{
                      background: '#0f172a',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 260,
                      position: 'relative',
                    }}>
                      <img
                        src={bannerImage}
                        alt="Congratulations GIF"
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                        onError={e => {
                          const wrap = e.target.closest('[data-gif-wrap]');
                          if (wrap) wrap.style.display = 'none';
                        }}
                      />
                      {/* Bottom fade blending into the text strip */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
                        background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 100%)',
                        pointerEvents: 'none',
                      }} />
                    </div>
                    {/* Text strip below GIF so the animation is never obscured */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1e3a5f 0%, #2C5492 100%)',
                      padding: '0.85rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                      <span style={{ fontSize: 24 }}>🎉</span>
                      <div style={{ color: '#fff' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                          You actually did it, {studentName.split(' ')[0]}!
                        </div>
                        <div style={{ opacity: 0.8, fontSize: '0.85rem', marginTop: 2 }}>
                          Your RIASEC personality report is ready below — scroll down to explore.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: 12,
                  padding: '1rem 1.5rem',
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>Test complete! Your RIASEC scores have been saved.</div>
                      <div style={{ opacity: 0.85, fontSize: '0.85rem', marginTop: 2 }}>Scroll down to see your personality profile, then view your personalised career matches.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { window.history.pushState({}, '', '/recommendations'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                    style={{
                      background: '#fff',
                      color: '#059669',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    View career matches →
                  </button>
                </div>
              </>
            )}

            {/* ── Personality Overview ─────────────────────────────────── */}
            <section style={{ marginBottom: 32 }}>
              <SectionHeading title="Personality Overview" />
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 160px' }}>
                  <div style={{ background: primaryColor + '18', color: primaryColor, padding: '1.2rem', borderRadius: 12, textAlign: 'center', fontWeight: 800, fontSize: '1.3rem', border: `2px solid ${primaryColor}30` }}>
                    {primaryName}
                  </div>
                  <div style={{ marginTop: 10, color: '#374151', fontSize: '0.9rem' }}>
                    Secondary: <strong style={{ color: NAVY }}>{secondaryName}</strong>
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#556d8f' }}>
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
                        <ScoreBar
                          key={item.code}
                          label={item.name}
                          value={item.value}
                          color={RIASEC_COLORS[item.name] || NAVY}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />

            {/* ── RIASEC + WorkStyle Radar ──────────────────────────────── */}
            {radarData && radarData.length > 0 && (
              <>
                <section style={{ marginBottom: 32 }}>
                  <SectionHeading
                    title="Personality vs Work Style Alignment"
                    subtitle="The blue area shows your RIASEC test scores. The teal area shows how you rated each work activity during onboarding. Closer overlap = stronger alignment."
                  />
                  <div style={{ background: '#f7f9fb', borderRadius: 16, padding: '1.5rem 1rem' }}>
                    <ResponsiveContainer width="100%" height={340}>
                      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                        <PolarGrid gridType="polygon" stroke="#cbd5e1" />
                        <PolarAngleAxis
                          dataKey="dimension"
                          tick={<ReportRadarTick />}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                          tickCount={5}
                        />
                        <Radar
                          name="RIASEC Score"
                          dataKey="riasec"
                          stroke="#2C5492"
                          fill="#2C5492"
                          fillOpacity={0.22}
                          strokeWidth={2}
                          dot={{ fill: '#2C5492', r: 4 }}
                        />
                        <Radar
                          name="Work Style"
                          dataKey="workStyle"
                          stroke="#14b8a6"
                          fill="#14b8a6"
                          fillOpacity={0.22}
                          strokeWidth={2}
                          dot={{ fill: '#14b8a6', r: 4 }}
                        />
                        <Legend
                          formatter={v => <span style={{ color: '#374151', fontWeight: 600, fontSize: 13 }}>{v}</span>}
                        />
                        <Tooltip content={<RadarTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />
              </>
            )}

            {/* ── Subject Strength Bar Chart ────────────────────────────── */}
            {subjectData && subjectData.length > 0 && (
              <>
                <section style={{ marginBottom: 32 }}>
                  <SectionHeading
                    title="Subject Strength Profile"
                    subtitle="Your self-rated comfort level with each subject — 1 (struggling) to 5 (favourite)."
                  />
                  <div style={{ background: '#f7f9fb', borderRadius: 16, padding: '1.5rem 1rem' }}>
                    <ResponsiveContainer width="100%" height={Math.max(200, subjectData.length * 52)}>
                      <BarChart
                        data={subjectData}
                        layout="vertical"
                        margin={{ top: 4, right: 40, left: 10, bottom: 4 }}
                      >
                        <XAxis
                          type="number"
                          domain={[0, 5]}
                          ticks={[1, 2, 3, 4, 5]}
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                          tickFormatter={v => ['', '😟', '😐', '🙂', '😄', '⭐'][v] || v}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="subject"
                          width={130}
                          tick={{ fill: NAVY, fontWeight: 700, fontSize: 13 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(val) => [`${val}/5 — ${['','Struggling','Getting by','Comfortable','Really good','Favourite'][val] || val}`, 'Rating']}
                          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                        />
                        <Bar dataKey="rating" radius={[0, 8, 8, 0]} maxBarSize={28}>
                          {subjectData.map((entry, i) => (
                            <Cell
                              key={i}
                              fill={entry.rating >= 4 ? '#f59e0b' : entry.rating === 3 ? '#2C5492' : '#94a3b8'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12, fontSize: 12, color: '#556d8f' }}>
                      <span><span style={{ color: '#f59e0b', fontWeight: 800 }}>■</span> Strong (4–5)</span>
                      <span><span style={{ color: '#2C5492', fontWeight: 800 }}>■</span> Average (3)</span>
                      <span><span style={{ color: '#94a3b8', fontWeight: 800 }}>■</span> Needs work (1–2)</span>
                    </div>
                  </div>
                </section>
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />
              </>
            )}

            {/* ── Next steps nudge ─────────────────────────────────────── */}
            <section style={{ marginBottom: 32 }}>
              <div style={{ background: primaryColor + '0d', border: `1px solid ${primaryColor}30`, borderRadius: 12, padding: '1.5rem 2rem' }}>
                <h3 style={{ color: NAVY, margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 800 }}>
                  ✨ See your personalised career matches
                </h3>
                <p style={{ color: '#374151', margin: '0 0 16px 0', lineHeight: 1.6 }}>
                  Your RIASEC scores have been saved to your profile. Head back to the dashboard to see
                  your top 5 career recommendations — matched using your personality, subjects, and goals.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { window.history.pushState({}, '', '/recommendations'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                    style={{ background: NAVY, color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 9, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
                  >
                    View career matches →
                  </button>
                  <button
                    onClick={() => { window.history.pushState({}, '', '/dashboard'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                    style={{ background: 'transparent', color: NAVY, border: `1.5px solid ${NAVY}`, padding: '0.75rem 1.5rem', borderRadius: 9, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />

            {/* ── Full score breakdown cards ────────────────────────────── */}
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
                    boxShadow: '0 2px 8px rgba(44,84,146,0.08)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: NAVY, fontSize: '1rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#556d8f', marginTop: 2 }}>{item.code}</div>
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: RIASEC_COLORS[item.name] || '#556d8f' }}>
                        {item.value}%
                      </div>
                    </div>
                    <div style={{ marginTop: 10, background: '#f1f5f9', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${item.value}%`, height: '100%', background: RIASEC_COLORS[item.name] || NAVY, borderRadius: 6 }} />
                    </div>
                    {i === 0 && <div style={{ marginTop: 8, fontSize: '0.78rem', color: primaryColor, fontWeight: 600 }}>Primary type</div>}
                    {i === 1 && <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#556d8f', fontWeight: 600 }}>Secondary type</div>}
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

/* ── Data-transform helpers ───────────────────────────────────────── */

/** Build the 6-axis radar dataset from RIASEC scores + work_style sliders */
function transformRadarData(scores, workStyle) {
  if (!scores) return null;

  const axes = [
    { key: 'Realistic',     wsKey: 'building'    },
    { key: 'Investigative', wsKey: 'researching' },
    { key: 'Artistic',      wsKey: 'creative'    },
    { key: 'Social',        wsKey: 'helping'     },
    { key: 'Enterprising',  wsKey: 'leading'     },
    { key: 'Conventional',  wsKey: 'structured'  },
  ];

  const codeToName = { R:'Realistic', I:'Investigative', A:'Artistic', S:'Social', E:'Enterprising', C:'Conventional' };

  // Build a name→score map from scores object (keys may be codes OR names)
  const scoreByName = {};
  Object.entries(scores).forEach(([k, v]) => {
    const name = codeToName[k] || k;
    scoreByName[name] = Number(v);
  });

  return axes.map(({ key, wsKey }) => {
    const riasecVal   = scoreByName[key] ?? 0;
    // WorkStyle is 1–5; normalise to 0–100
    const wsRaw       = workStyle?.[wsKey];
    const workStyleVal = wsRaw != null ? Math.round((Number(wsRaw) / 5) * 100) : null;

    const row = { dimension: key, riasec: riasecVal };
    if (workStyleVal !== null) row.workStyle = workStyleVal;
    return row;
  });
}

/** Build subject bar chart data from subject_ratings object */
function transformSubjectData(subjectRatings) {
  if (!subjectRatings || Object.keys(subjectRatings).length === 0) return null;

  const LABELS = {
    mathematics:       'Mathematics',
    physics:           'Physics',
    chemistry:         'Chemistry',
    biology:           'Biology',
    computerScience:   'Computer Science',
    englishLiterature: 'English & Lit.',
    accountancy:       'Accountancy',
    businessStudies:   'Business Studies',
    economics:         'Economics',
    history:           'History',
    geography:         'Geography',
    politicalScience:  'Political Science',
    science:           'Science',
    socialScience:     'Social Science',
    hindi:             'Hindi',
  };

  return Object.entries(subjectRatings)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a) // highest rated first
    .map(([key, val]) => ({
      subject: LABELS[key] || key,
      rating:  Number(val),
    }));
}
