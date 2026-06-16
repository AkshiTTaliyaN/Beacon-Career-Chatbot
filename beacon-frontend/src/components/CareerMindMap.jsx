import { useState, useEffect, useRef } from 'react';

/* ── Orbit & Planet constants ──────────────────────────────────────── */
// Minimal blue palette — 5 tones
const RANK_COLORS  = ['#60a5fa', '#3b82f6', '#6366f1', '#0ea5e9', '#818cf8'];
const RANK_GLOWS   = [
  'rgba(96,165,250,0.5)',  'rgba(59,130,246,0.5)',  'rgba(99,102,241,0.5)',
  'rgba(14,165,233,0.5)',  'rgba(129,140,248,0.5)',
];
const ORBIT_RADII  = [88, 128, 163, 195, 226];
const ORBIT_SPEEDS = [0.009, 0.007, 0.005, 0.004, 0.003];
const PLANET_SIZES = [19, 17, 15, 13, 12];

/* All streams map to blue tones */
const STREAM_COLORS = {
  PCM:           '#3b82f6',
  PCB:           '#0ea5e9',
  'PCM/PCB':     '#60a5fa',
  Commerce:      '#6366f1',
  Arts:          '#818cf8',
  'All Streams': '#3b82f6',
};

function getPlanetColor(career, idx) {
  return STREAM_COLORS[career.stream] || RANK_COLORS[idx] || '#3b82f6';
}

/* SVG viewport */
const SVG_W = 520, SVG_H = 520, CX = 260, CY = 260;

/* Stable golden-ratio star field (no Math.random → stable across renders) */
const STARS = Array.from({ length: 70 }, (_, i) => {
  const t = i * 2.399963;
  const r = Math.sqrt((i + 1) / 95);
  return {
    x:  ((Math.cos(t) * r) * 0.5 + 0.5) * 100,
    y:  ((Math.sin(t) * r) * 0.5 + 0.5) * 100,
    rx: 0.3 + (i % 4) * 0.38,
    op: 0.1  + (i % 7) * 0.09,
    dur: `${2.2 + (i % 5) * 0.9}s`,
    del: `${(i % 8) * 0.65}s`,
  };
});

/* Split a career title into at most two label lines (≤11 chars each) */
function splitLabel(title = '') {
  const words = title.split(' ');
  let line1 = '', line2 = '';
  for (const w of words) {
    if ((line1 + ' ' + w).trim().length <= 11) {
      line1 = (line1 + ' ' + w).trim();
    } else {
      line2 = (line2 + ' ' + w).trim();
    }
  }
  return [line1, line2];
}

/* Pull up to 3 readable sentences from the reason field */
function extractReasons(reason = '', max = 3) {
  return reason
    .split(/[.;—]+/)
    .map(s => s.trim())
    .filter(s => s.length > 8 && s.length < 140)
    .slice(0, max);
}

/* ── Detail Side Panel ─────────────────────────────────────────────── */
function DetailPanel({ career, color, glow, onClose }) {
  const isDark = !document.body.classList.contains('light-theme');
  const reasons = extractReasons(career.reason);
  const rankEmoji = career.rank === 1 ? '🥇' : career.rank === 2 ? '🥈' : career.rank === 3 ? '🥉' : '⭐';

  return (
    <>
      {/* dimmed backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(3px)',
          animation: 'mmFadeIn 0.22s ease',
        }}
      />

      {/* panel */}
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
        width: 'min(430px, 93vw)',
        background: isDark ? 'rgba(7,11,35,0.97)' : 'rgba(252,253,255,0.98)',
        borderLeft: `2px solid ${color}45`,
        boxShadow: `-10px 0 60px ${glow}, -2px 0 12px rgba(0,0,0,0.35)`,
        backdropFilter: 'blur(28px)',
        display: 'flex', flexDirection: 'column',
        animation: 'mmSlideIn 0.32s cubic-bezier(0.22,1,0.36,1)',
        overflowY: 'auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {/* top colour bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}00)`, flexShrink: 0 }} />

        <div style={{ padding: '1.8rem 1.8rem 2.2rem', position: 'relative' }}>

          {/* close button */}
          <button
            onClick={onClose}
            aria-label="Close panel"
            style={{
              position: 'absolute', top: 16, right: 16,
              background: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)',
              border: 'none', borderRadius: 8,
              width: 34, height: 34, cursor: 'pointer',
              color: isDark ? 'rgba(255,255,255,0.65)' : '#475569',
              fontSize: 19, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.18s',
            }}
          >×</button>

          {/* rank badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${color}18`, border: `1px solid ${color}40`,
            borderRadius: 20, padding: '4px 13px', marginBottom: '1rem',
          }}>
            <span style={{ fontSize: 15 }}>{rankEmoji}</span>
            <span style={{ color, fontWeight: 800, fontSize: 12, letterSpacing: '0.03em' }}>
              Rank #{career.rank} Match
            </span>
          </div>

          {/* title */}
          <h2 style={{
            margin: '0 0 0.45rem',
            fontSize: 'clamp(1.35rem, 4vw, 1.65rem)',
            fontWeight: 900, lineHeight: 1.18,
            color: isDark ? '#fff' : '#0f172a',
          }}>
            {career.title}
          </h2>

          {/* stream tag */}
          {career.stream && (
            <span style={{
              display: 'inline-block', marginBottom: '1.3rem',
              background: `${color}15`, border: `1px solid ${color}35`,
              borderRadius: 6, padding: '3px 11px',
              fontSize: 11.5, fontWeight: 700, color,
              letterSpacing: '0.04em',
            }}>
              {career.stream}
            </span>
          )}

          {/* salary card */}
          {career.salary && (
            <div style={{
              background: isDark ? 'rgba(0,255,136,0.07)' : 'rgba(0,180,100,0.07)',
              border: '1px solid rgba(0,255,136,0.22)',
              borderRadius: 13, padding: '0.85rem 1.1rem', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: 11,
            }}>
              <span style={{ fontSize: 22 }}>💰</span>
              <div>
                <div style={{
                  fontSize: 10.5, fontWeight: 800,
                  color: 'rgba(0,255,136,0.65)',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  marginBottom: 2,
                }}>Average Salary</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#00ff88' }}>
                  {career.salary}
                </div>
              </div>
            </div>
          )}

          {/* why you */}
          {reasons.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{
                margin: '0 0 0.8rem',
                fontSize: 11.5, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.09em',
                color: isDark ? 'rgba(255,255,255,0.38)' : '#94a3b8',
              }}>✨ Why you?</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {reasons.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 10, padding: '0.68rem 0.9rem',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: 7,
                      background: color, boxShadow: `0 0 6px ${color}`,
                    }} />
                    <span style={{
                      fontSize: 13.5, lineHeight: 1.58,
                      color: isDark ? 'rgba(255,255,255,0.72)' : '#334155',
                    }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => {
              window.history.pushState({}, '', '/careers');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            style={{
              width: '100%', padding: '0.92rem',
              background: `linear-gradient(135deg, ${color}, ${color}99)`,
              border: 'none', borderRadius: 12,
              color: '#fff', fontWeight: 800, fontSize: 15,
              cursor: 'pointer', letterSpacing: '0.02em',
              boxShadow: `0 4px 24px ${glow}`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 34px ${glow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = `0 4px 24px ${glow}`;
            }}
          >
            Explore this Career →
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── Main export ────────────────────────────────────────────────────── */
export default function CareerMindMap({ recs }) {
  /* angle state drives planet positions */
  const [angles, setAngles] = useState(() =>
    Array.from({ length: 5 }, (_, i) => (i * Math.PI * 2) / 5)
  );

  /* separate "user paused" vs "hover paused" so the button works correctly */
  const [userPaused, setUserPaused]   = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const isPaused = userPaused || hoverPaused;

  const [hoveredIdx,  setHoveredIdx]  = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const rafRef = useRef(null);

  const isDark = !document.body.classList.contains('light-theme');

  /* animation loop */
  useEffect(() => {
    if (isPaused) return;
    const tick = () => {
      setAngles(prev => prev.map((a, i) => a + ORBIT_SPEEDS[i]));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused]);

  if (!recs || recs.length === 0) return null;

  const orbitPlanets = recs.slice(0, 5);
  const extraCareers = recs.slice(5);
  const selectedCareer = selectedIdx !== null ? orbitPlanets[selectedIdx] : null;
  const selColor       = selectedIdx !== null ? getPlanetColor(orbitPlanets[selectedIdx], selectedIdx) : '#00d4ff';
  const selGlow        = selectedIdx !== null ? RANK_GLOWS[selectedIdx] : 'rgba(0,212,255,0.4)';

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* keyframes injected once */}
      <style>{`
        @keyframes mmFadeIn   { from{opacity:0}     to{opacity:1} }
        @keyframes mmSlideIn  { from{transform:translateX(105%)} to{transform:translateX(0)} }
        @keyframes mmSunPulse {
          0%,100%{ opacity:0.85; }
          50%    { opacity:1;    }
        }
        @keyframes mmOrbitGlow {
          0%,100%{ opacity:0.04; }
          50%    { opacity:0.09; }
        }
        @keyframes mmTwinkle  {
          0%,100%{ opacity:var(--sop); }
          50%    { opacity:calc(var(--sop)*0.25); }
        }
        .mm-planet { cursor:pointer; }
        .mm-planet:hover circle.mm-body { filter:brightness(1.25); }
      `}</style>

      {/* pause toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.85rem' }}>
        <button
          onClick={() => setUserPaused(p => !p)}
          style={{
            background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
            border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
            borderRadius: 10, padding: '7px 16px',
            color: isDark ? 'rgba(255,255,255,0.78)' : '#334155',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
            transition: 'all 0.18s',
          }}
        >
          {userPaused ? '▶  Resume Orbits' : '⏸  Pause Orbits'}
        </button>
      </div>

      {/* galaxy canvas — full width, fixed height */}
      <div style={{
        borderRadius: 20, overflow: 'hidden',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        background: isDark
          ? 'radial-gradient(ellipse at 50% 50%, rgba(15,23,55,1) 0%, rgba(4,7,22,1) 100%)'
          : 'radial-gradient(ellipse at 50% 50%, #eef2ff 0%, #dde6fb 100%)',
      }}>
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block' }}
          aria-label="Career Galaxy — interactive solar system of your top career matches"
        >
          <defs>
            {/* sun gradient */}
            <radialGradient id="mm-sun" cx="35%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#e0eeff" />
              <stop offset="40%"  stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </radialGradient>

            {/* per-planet gradients */}
            {orbitPlanets.map((career, i) => {
              const c = getPlanetColor(career, i);
              return (
                <radialGradient key={i} id={`mm-pg-${i}`} cx="33%" cy="33%" r="67%">
                  <stop offset="0%"   stopColor="#fff" stopOpacity={0.38} />
                  <stop offset="40%"  stopColor={c} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.65} />
                </radialGradient>
              );
            })}

            {/* sun glow filter */}
            <filter id="mm-sun-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── star field ── */}
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={`${s.x}%`} cy={`${s.y}%`}
              r={s.rx}
              fill={isDark ? '#ffffff' : '#8899cc'}
              opacity={s.op}
              style={{
                '--sop': s.op,
                animation: `mmTwinkle ${s.dur} ${s.del} ease-in-out infinite`,
              }}
            />
          ))}

          {/* ── orbit rings (decorative) ── */}
          {orbitPlanets.map((_, i) => (
            <circle
              key={`ring-${i}`}
              cx={CX} cy={CY} r={ORBIT_RADII[i]}
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.045)' : 'rgba(80,100,180,0.08)'}
              strokeWidth={1}
              strokeDasharray="4 7"
              style={{ animation: 'mmOrbitGlow 4s ease-in-out infinite', animationDelay: `${i * 0.7}s` }}
            />
          ))}

          {/* ── sun glow halos ── */}
          <circle cx={CX} cy={CY} r={55}
            fill={isDark ? 'rgba(59,130,246,0.07)' : 'rgba(59,130,246,0.12)'}
            style={{ animation: 'mmSunPulse 3.5s ease-in-out infinite' }}
          />
          <circle cx={CX} cy={CY} r={42}
            fill={isDark ? 'rgba(99,102,241,0.09)' : 'rgba(99,102,241,0.14)'}
            style={{ animation: 'mmSunPulse 3.5s ease-in-out 0.4s infinite' }}
          />
          <circle cx={CX} cy={CY} r={30}
            fill={isDark ? 'rgba(96,165,250,0.12)' : 'rgba(96,165,250,0.18)'}
            style={{ animation: 'mmSunPulse 3.5s ease-in-out 0.8s infinite' }}
          />

          {/* ── sun ── */}
          <circle
            cx={CX} cy={CY} r={15}
            fill="url(#mm-sun)"
            filter="url(#mm-sun-glow)"
            style={{ animation: 'mmSunPulse 3.5s ease-in-out 1.2s infinite' }}
          />
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle"
            fontSize={6} fontWeight={900} fill="rgba(255,255,255,0.95)"
            fontFamily="Inter, system-ui, sans-serif" style={{ pointerEvents: 'none', letterSpacing: '0.05em' }}>
            ★
          </text>

          {/* ── planets ── */}
          {orbitPlanets.map((career, i) => {
            const color   = getPlanetColor(career, i);
            const glow    = RANK_GLOWS[i];
            const pr      = PLANET_SIZES[i];
            const px      = CX + Math.cos(angles[i]) * ORBIT_RADII[i];
            const py      = CY + Math.sin(angles[i]) * ORBIT_RADII[i];
            const isHov   = hoveredIdx  === i;
            const isSel   = selectedIdx === i;
            const [l1,l2] = splitLabel(career.title);

            return (
              <g
                key={`planet-${i}`}
                className="mm-planet"
                role="button"
                aria-label={`${career.title} — Rank ${career.rank}`}
                onClick={() => {
                  setSelectedIdx(isSel ? null : i);
                  setUserPaused(true);
                }}
                onMouseEnter={() => { setHoveredIdx(i); setHoverPaused(true); }}
                onMouseLeave={() => { setHoveredIdx(null); setHoverPaused(false); }}
              >
                {/* selection / hover halo */}
                {(isHov || isSel) && (
                  <circle
                    cx={px} cy={py} r={pr + 12}
                    fill={`${color}14`}
                    stroke={color}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                )}

                {/* outer soft glow */}
                <circle cx={px} cy={py} r={pr + 7} fill={`${color}20`} />

                {/* planet body */}
                <circle
                  className="mm-body"
                  cx={px} cy={py} r={pr}
                  fill={`url(#mm-pg-${i})`}
                  stroke={color}
                  strokeWidth={isSel ? 2.5 : 1.5}
                  style={{ filter: isHov ? `drop-shadow(0 0 8px ${color})` : `drop-shadow(0 2px 6px ${color}60)`, transition: 'filter 0.2s' }}
                />

                {/* rank label inside planet */}
                <text
                  x={px} y={py + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={pr > 19 ? 11 : 9} fontWeight={900}
                  fill="rgba(255,255,255,0.96)"
                  fontFamily="Inter, system-ui, sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  #{career.rank}
                </text>

                {/* career name below planet */}
                <text
                  x={px} y={py + pr + 14}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={10} fontWeight={700}
                  fill={isDark ? 'rgba(255,255,255,0.82)' : '#334155'}
                  fontFamily="Inter, system-ui, sans-serif"
                  style={{ pointerEvents: 'none' }}
                >{l1}</text>
                {l2 && (
                  <text
                    x={px} y={py + pr + 26}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={10} fontWeight={700}
                    fill={isDark ? 'rgba(255,255,255,0.82)' : '#334155'}
                    fontFamily="Inter, system-ui, sans-serif"
                    style={{ pointerEvents: 'none' }}
                  >{l2}</text>
                )}

                {/* salary tooltip (only on hover) */}
                {isHov && career.salary && (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect
                      x={px - 48} y={py - pr - 38}
                      width={96} height={26}
                      rx={7}
                      fill={color}
                      style={{ filter: `drop-shadow(0 4px 12px ${glow})` }}
                    />
                    {/* small triangle pointer */}
                    <polygon
                      points={`${px - 6},${py - pr - 12}  ${px + 6},${py - pr - 12}  ${px},${py - pr - 4}`}
                      fill={color}
                    />
                    <text
                      x={px} y={py - pr - 24}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={10.5} fontWeight={800} fill="#fff"
                      fontFamily="Inter, system-ui, sans-serif"
                    >{career.salary}</text>
                  </g>
                )}

                {/* "tap to explore" hint on hover */}
                {isHov && (
                  <text
                    x={px} y={py + pr + (l2 ? 40 : 28)}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={9} fontWeight={700}
                    fill={color}
                    fontFamily="Inter, system-ui, sans-serif"
                    style={{ pointerEvents: 'none', opacity: 0.85 }}
                  >tap to explore</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* hint bar */}
      <p style={{
        textAlign: 'center', margin: '0.65rem 0 0',
        fontSize: 11.5, fontWeight: 600, letterSpacing: '0.035em',
        color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.3)',
      }}>
        Hover a planet to pause its orbit · Click to explore · ⏸ freezes all
      </p>

      {/* extra careers below (rank 6+) */}
      {extraCareers.length > 0 && (
        <div style={{ marginTop: '1.6rem' }}>
          <p style={{
            fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: '0.7rem',
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          }}>
            Also a strong match
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '0.7rem',
          }}>
            {extraCareers.map((career, i) => {
              const color = getPlanetColor(career, 5 + i);
              return (
                <div
                  key={i}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
                    borderRadius: 12, padding: '0.85rem 1rem',
                    cursor: 'default', transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${color}45`;
                    e.currentTarget.style.background   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.055)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
                    e.currentTarget.style.background   = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 4 }}>
                    #{career.rank}
                  </div>
                  <div style={{
                    fontSize: 13.5, fontWeight: 700, lineHeight: 1.3,
                    color: isDark ? '#fff' : '#0f172a', marginBottom: 5,
                  }}>
                    {career.title}
                  </div>
                  {career.salary && (
                    <div style={{ fontSize: 12, color: '#00ff88', fontWeight: 700 }}>
                      {career.salary}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* slide-in detail panel */}
      {selectedCareer && (
        <DetailPanel
          career={selectedCareer}
          color={selColor}
          glow={selGlow}
          onClose={() => { setSelectedIdx(null); setUserPaused(false); }}
        />
      )}
    </div>
  );
}
