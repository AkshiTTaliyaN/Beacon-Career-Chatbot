import { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection.jsx'
import PsychometricTest from '../components/PsychometricTest.jsx'
import RiasecGate from './RiasecGate.jsx'
import CareerMindMap from '../components/CareerMindMap.jsx'
import { GlassCard, RadialGauge, KPICard, SectionHeader, RIASEC_THEME } from '../components/FuturisticCharts.jsx'
import { getSmartRecommendations, getMyProfile } from '../api/client.js'
import ManzilLogo from '../assets/manzil-logo.png'
import '../styles/futuristic.css'
import { APTITUDE_URL } from '../config.js'
import ManzilHeader from '../components/ManzilHeader'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell,
  ResponsiveContainer,
} from 'recharts';

/* ─── Radar Tooltip ───────────────────────────────────────────────── */
function RadarTooltipContent({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const isDark = !document.body.classList.contains('light-theme');
  return (
    <div style={{
      background: isDark ? 'rgba(13,19,51,0.95)' : '#ffffff',
      border: isDark ? '1px solid rgba(0,212,255,0.2)' : '1px solid rgba(44, 84, 146, 0.12)',
      borderRadius: 10,
      padding: '10px 16px',
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,212,255,0.1)' : '0 8px 24px rgba(0,0,0,0.08)',
      backdropFilter: 'blur(12px)',
      fontSize: 13,
    }}>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
          {p.name}: <span style={{ color: isDark ? 'rgba(255,255,255,0.95)' : '#0f172a' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Custom Radar Axis Tick ──────────────────────────────────────── */
function FuturisticRadarTick({ x, y, cx, cy, payload }) {
  const theme = RIASEC_THEME[payload.value] || {};
  const isDark = !document.body.classList.contains('light-theme');
  
  // Calculate vector from center to coordinate
  const dx = x - cx;
  const dy = y - cy;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  // Push outwards by 18px
  const offset = 18;
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
  
  // Clean color for light theme readability
  const textColor = isDark 
    ? (theme.color || 'rgba(255,255,255,0.75)') 
    : (theme.color || '#0f172a');
  
  // Glow filter only for dark theme
  const textShadow = isDark ? `drop-shadow(0 0 4px ${theme.color || 'transparent'})` : 'none';

  return (
    <g transform={`translate(${newX},${newY})`}>
      <text
        textAnchor={textAnchor}
        dy={adjustedDy}
        style={{
          fill: textColor,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'Inter, system-ui, sans-serif',
          filter: textShadow,
        }}
      >
        {theme.icon || ''} {payload.value}
      </text>
    </g>
  );
}

/* ─── Data Transform Helpers ──────────────────────────────────────── */
function computeRadarData(scores, workStyle) {
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

  const scoreByName = {};
  Object.entries(scores).forEach(([k, v]) => {
    const name = codeToName[k] || k;
    scoreByName[name] = Number(v);
  });

  return axes.map(({ key, wsKey }) => {
    const riasecVal   = scoreByName[key] ?? 0;
    const wsRaw       = workStyle?.[wsKey];
    const workStyleVal = wsRaw != null ? Math.round((Number(wsRaw) / 5) * 100) : null;

    const row = { dimension: key, riasec: riasecVal };
    if (workStyleVal !== null) row.workStyle = workStyleVal;
    return row;
  });
}

function computeSubjectData(subjectRatings) {
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
    .sort(([, a], [, b]) => b - a)
    .map(([key, val]) => ({
      subject: LABELS[key] || key,
      rating:  Number(val),
    }));
}

/* ─── KPI Data Helpers ────────────────────────────────────────────── */
function getTopCareerMatch(recs) {
  if (!recs || recs.length === 0) return null;
  return recs[0];
}

function getDominantRIASEC(scores) {
  if (!scores) return null;
  const codeToName = { R:'Realistic', I:'Investigative', A:'Artistic', S:'Social', E:'Enterprising', C:'Conventional' };
  let maxKey = null, maxVal = 0;
  Object.entries(scores).forEach(([k, v]) => {
    if (Number(v) > maxVal) { maxVal = Number(v); maxKey = k; }
  });
  return maxKey ? { code: maxKey, name: codeToName[maxKey], score: maxVal } : null;
}

function getProfileCompletion(profile) {
  if (!profile) return 0;
  const fields = ['name', 'current_class', 'board', 'stream', 'city', 'riasec_scores', 'subject_ratings', 'work_style', 'career_priorities', 'target_sector'];
  const filled = fields.filter(f => {
    const v = profile[f];
    return v !== null && v !== undefined && v !== '' && (typeof v !== 'object' || Object.keys(v).length > 0);
  });
  return Math.round((filled.length / fields.length) * 100);
}


export default function Dashboard({ userName }) {
  const urlParams = new URLSearchParams(window.location.search)
  const [freshTest] = useState(urlParams.get('scores_written') === '1')
  const hasProfileToken = Boolean(localStorage.getItem('beacon_token'))

  const name = userName || window.localStorage.getItem('userName') || ''
  const isReturning = window.localStorage.getItem('beaconReturning') === '1'
  const isDark = !document.body.classList.contains('light-theme');

  useEffect(() => {
    const saved = localStorage.getItem('beacon-theme');
    if (saved === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, []);

  // ── Career Recommendations state ───────────────────────────────────────────────────
  const [recs, setRecs] = useState(null)          // null=loading, []=empty
  const [recsGated, setRecsGated] = useState(false)   // show gate screen
  const [recsError, setRecsError] = useState(null)
  const [expandedCards, setExpandedCards] = useState({})
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(hasProfileToken)
  const [profileError, setProfileError] = useState(null)

  useEffect(() => {
    getSmartRecommendations()
      .then(data => setRecs(data.recommendations || []))
      .catch(err => {
        if (err.code === 'riasec_required') setRecsGated(true)
        else setRecsError('Could not load recommendations — try refreshing.')
      })

    // Fetch profile
    const token = localStorage.getItem('beacon_token')
    if (token) {
      getMyProfile()
        .then(data => setProfile(data))
        .catch(() => setProfileError('Could not load your profile analytics. Please refresh and try again.'))
        .finally(() => setProfileLoading(false))
    }

    if (freshTest) {
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [freshTest])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const observeFadeUps = () => {
      document.querySelectorAll('.ft-animate-in:not(.visible)').forEach((el) => observer.observe(el))
    }

    const mutationObserver = new MutationObserver(observeFadeUps)
    observeFadeUps()
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  const firstName = name ? name.trim().split(' ')[0] : ''
  const radarData = computeRadarData(profile?.riasec_scores, profile?.work_style)
  const subjectData = computeSubjectData(profile?.subject_ratings)
  const hasProfileAnalytics = Boolean(radarData || subjectData)

  // KPI computations
  const topCareer = getTopCareerMatch(recs)
  const dominantRIASEC = getDominantRIASEC(profile?.riasec_scores)
  const profileCompletion = getProfileCompletion(profile)
  const subjectCount = subjectData ? subjectData.length : 0

  let heading, heroSubtitle
  if (isReturning && firstName) {
    heading = `Welcome back, ${firstName}! 👋`
    heroSubtitle = 'Ready to continue your career journey? Pick up where you left off.'
  } else if (firstName) {
    heading = `Hello, ${firstName}! 🎉`
    heroSubtitle = "Your profile is set up — let's find the perfect career path for you."
  } else {
    heading = 'Your career journey starts here'
    heroSubtitle = 'Explore careers, take the psychometric test, or chat with our AI counsellor'
  }

  return (
    <div className="ft-dashboard-bg">
      <ManzilHeader
        title="Manzil"
        showDefaultNav={false}
        right={(
          <nav className="manzil-header-nav" aria-label="Primary">
            <button type="button" className="manzil-header-link" onClick={() => { window.history.pushState({}, '', '/careers'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Career Library</button>
            <button type="button" className="manzil-header-link" onClick={() => { window.history.pushState({}, '', '/exams'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Exam Explorer</button>
            {profile?.riasec_scores && (
              <button type="button" className="manzil-header-link" onClick={() => { window.history.pushState({}, '', '/report'); window.dispatchEvent(new PopStateEvent('popstate')) }}>My Report</button>
            )}

            <div style={{
              width: 36, height: 36, borderRadius: 999,
              background: '#eaf1fb',
              border: '1px solid #dce4f5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#2c5492', fontWeight: 700, fontSize: 14,
            }} title={name || 'Profile'}>{(name && name[0]) || 'P'}</div>
          </nav>
        )}
      />

      {/* ─── Fresh Test Banner ─── */}
      {freshTest && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,255,136,0.15) 0%, rgba(0,212,255,0.1) 100%)',
          borderBottom: '1px solid rgba(0,255,136,0.2)',
          padding: '0.9rem 2rem',
          color: '#00ff88',
          textAlign: 'center',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.92rem',
          position: 'relative',
          zIndex: 35,
          textShadow: '0 0 20px rgba(0,255,136,0.3)',
        }}>
          <span>🎉</span>
          <span><strong>Aptitude test completed successfully!</strong> Your career matches and profile analytics have been updated below.</span>
        </div>
      )}

      {/* ─── Hero Section ─── */}
      <div className="dashboard-hero-wrapper">
        <HeroSection
          lightMode
          logoSrc={ManzilLogo}
          logoAlt="Manzil Logo"
          logoStyle={{
            height: 180,
            maxWidth: 420,
            borderRadius: 0,
            boxShadow: 'none',
            marginBottom: 24,
          }}
          title={heading}
          titleColor="#0f1f3d"
          subtitle={heroSubtitle}
          subtitleColor="#5f6b8d"
          primaryText={'Chat with AI'}
          secondaryText={'Take Psychometric Test'}
          primaryButtonStyle={{
            backgroundColor: '#0f1f3d',
            color: '#ffffff',
            borderColor: '#0f1f3d',
          }}
          secondaryButtonStyle={{
            backgroundColor: 'transparent',
            color: '#0f1f3d',
            borderColor: '#0f1f3d',
          }}
          onPrimary={() => { window.history.pushState({}, '', '/chat'); window.dispatchEvent(new PopStateEvent('popstate')) }}
          onSecondary={() => {
            const token = localStorage.getItem('beacon_token');
            const origin = window.location.origin;
            const url = token
              ? `${APTITUDE_URL}?beacon_token=${encodeURIComponent(token)}&origin=${encodeURIComponent(origin)}`
              : `${APTITUDE_URL}?origin=${encodeURIComponent(origin)}`;
            window.open(url, '_blank');
          }}
        />
        <div className="dashboard-hero-bottom-wash" aria-hidden="true" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          KPI SUMMARY CARDS — Power BI-style top metrics row
          ═══════════════════════════════════════════════════════════════════ */}
      {(recs && recs.length > 0 || hasProfileAnalytics) && (
        <section className="ft-animate-in ft-section" style={{ paddingTop: '3rem', paddingBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {topCareer && (
              <KPICard
                icon="🎯"
                label="Top Career Match"
                value={topCareer.title || 'N/A'}
                color="cyan"
                subtitle={topCareer.salary || ''}
                isText
              />
            )}
            {dominantRIASEC && (
              <KPICard
                icon={RIASEC_THEME[dominantRIASEC.name]?.icon || '🧠'}
                label="Dominant Type"
                value={dominantRIASEC.score}
                suffix="%"
                color="magenta"
                subtitle={dominantRIASEC.name}
              />
            )}
            <KPICard
              icon="📋"
              label="Profile Completion"
              value={profileCompletion}
              suffix="%"
              color="green"
              subtitle={profileCompletion >= 80 ? 'Looking great!' : 'Complete your profile'}
            />
            {subjectCount > 0 && (
              <KPICard
                icon="📚"
                label="Subjects Analyzed"
                value={subjectCount}
                color="purple"
                subtitle="Self-rated subjects"
              />
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CHAT WITH AI COUNSELLOR
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="ft-animate-in ft-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <SectionHeader
          title="Chat with our AI Counsellor"
          subtitle="Get personalised career guidance based on your stream, interests, and goals."
          accentColor="cyan"
        />

        <GlassCard elevated style={{ maxWidth: 620, margin: '0 auto 2rem', padding: '2rem' }}>
          {/* User message */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.1))',
              border: '1px solid rgba(0,212,255,0.2)',
              color: 'var(--ft-text-primary)',
              padding: '0.75rem 1.1rem',
              borderRadius: '14px 14px 2px 14px',
              maxWidth: '80%',
              fontSize: '0.92rem',
              lineHeight: 1.5,
            }}>
              I took PCM and love solving problems. What careers suit me?
            </div>
          </div>

          {/* AI response */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <div style={{
              background: 'var(--ft-bg-tertiary)',
              border: '1px solid var(--ft-border-subtle)',
              color: 'var(--ft-text-primary)',
              padding: '0.75rem 1.1rem',
              borderRadius: '14px 14px 14px 2px',
              maxWidth: '80%',
              fontSize: '0.92rem',
              lineHeight: 1.6,
            }}>
              Great question! With PCM, careers like Software Engineering, Data Science, and Mechanical Engineering are excellent fits.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              background: 'var(--ft-bg-tertiary)',
              border: '1px solid var(--ft-border-subtle)',
              color: 'var(--ft-text-primary)',
              padding: '0.75rem 1.1rem',
              borderRadius: '14px 14px 14px 2px',
              maxWidth: '80%',
              fontSize: '0.92rem',
              lineHeight: 1.6,
            }}>
              I'd recommend exploring these through our Career Library, and take the psychometric test to align them with your interests!
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#00d4ff',
                    animation: 'ft-pulse-glow 1.2s infinite ease-in-out',
                    animationDelay: `${i * 0.15}s`,
                    opacity: 0.7,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <div style={{ textAlign: 'center' }}>
          <button
            className="ft-button-primary"
            onClick={() => { window.history.pushState({}, '', '/chat'); window.dispatchEvent(new PopStateEvent('popstate')) }}
          >
            Start Chatting
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CAREER RECOMMENDATIONS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="ft-animate-in ft-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <SectionHeader
          title="Your Career Matches"
          subtitle="Ranked using your RIASEC personality, subjects, work style, and goals."
          accentColor="magenta"
        />

        {/* Loading skeleton */}
        {!recsGated && !recsError && recs === null && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.25rem' }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} className="ft-glass-card" style={{
                height: 150,
                animation: 'ft-shimmer 1.6s infinite',
                backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 75%)',
                backgroundSize: '400% 100%',
              }} />
            ))}
          </div>
        )}

        {/* Gate screen */}
        {recsGated && <RiasecGate />}

        {/* Error */}
        {recsError && (
          <p style={{ color: 'var(--ft-text-secondary)', fontSize: '0.95rem' }}>{recsError}</p>
        )}

        {/* Career cards */}
        {recs && recs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '1.25rem' }}>
            {recs.map((career, i) => {
              const rankColors = ['#00d4ff', '#8b5cf6', '#ff006e', '#00ff88', '#f59e0b'];
              const accent = rankColors[i % rankColors.length];
              return (
                 <GlassCard key={i} style={{ borderLeft: `3px solid ${accent}`, position: 'relative', overflow: 'hidden' }}>
                  {/* Subtle glow overlay at top */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 60,
                    background: `linear-gradient(180deg, ${accent}08, transparent)`,
                    pointerEvents: 'none',
                  }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, position: 'relative' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: `${accent}20`,
                      border: `1px solid ${accent}40`,
                      color: accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1rem', flexShrink: 0,
                      boxShadow: `0 0 16px ${accent}20`,
                    }}>{career.rank}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: 'var(--ft-text-primary)', fontSize: '1.05rem' }}>{career.title}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                        <span className="ft-tag ft-tag--cyan">{career.stream}</span>
                        <span className="ft-tag ft-tag--green">{career.salary}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: '12px 0 0', color: 'var(--ft-text-secondary)', fontSize: '0.87rem', lineHeight: 1.65, position: 'relative' }}>
                    {career.reason}
                  </p>
                  <div style={{ marginTop: 16, display: 'flex', gap: 10, position: 'relative', zIndex: 2 }}>
                    <button
                      className="ft-button-secondary"
                      style={{ padding: '8px 12px', fontSize: '0.82rem', flex: 1, cursor: 'pointer' }}
                      onClick={() => setExpandedCards(prev => ({ ...prev, [i]: !prev[i] }))}
                    >
                      {expandedCards[i] ? 'Hide Info ▲' : 'About Career ▼'}
                    </button>
                    <button
                      className="ft-button-primary"
                      style={{ padding: '8px 12px', fontSize: '0.82rem', flex: 1.2, cursor: 'pointer' }}
                      onClick={() => {
                        window.history.pushState({}, '', `/expert?career=${encodeURIComponent(career.title)}`);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                    >
                      Consult Advisor →
                    </button>
                  </div>
                  {expandedCards[i] && (
                    <div style={{ 
                      marginTop: 16, 
                      padding: 12, 
                      borderRadius: 8, 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1.5px solid var(--ft-glass-border)',
                      fontSize: '0.8rem',
                      animation: 'ft-fade-in 0.3s ease'
                    }}>
                      <div style={{ marginBottom: 8, color: 'var(--ft-text-primary)', lineHeight: 1.45 }}>
                        <strong>About the Role:</strong> {career.description || career.reason}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8, marginTop: 8 }}>
                        <div>
                          <span style={{ color: 'var(--ft-text-secondary)', opacity: 0.6, fontSize: '0.7rem', display: 'block' }}>Personality Type</span>
                          <span style={{ color: 'var(--ft-neon-cyan)', fontWeight: 700 }}>
                            {career.riasec_primary ? `${career.riasec_primary} / ${career.riasec_secondary}` : 'Standard'}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--ft-text-secondary)', opacity: 0.6, fontSize: '0.7rem', display: 'block' }}>Sector Type</span>
                          <span style={{ color: '#00ff88', fontWeight: 700, textTransform: 'capitalize' }}>{career.sector || 'Private/Public'}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--ft-text-secondary)', opacity: 0.6, fontSize: '0.7rem', display: 'block' }}>Relocation Required</span>
                          <span style={{ color: '#f59e0b', fontWeight: 700 }}>{career.requires_relocation ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--ft-text-secondary)', opacity: 0.6, fontSize: '0.7rem', display: 'block' }}>Education Cost</span>
                          <span style={{ color: 'var(--ft-neon-purple)', fontWeight: 700, textTransform: 'capitalize' }}>{career.cost_level || 'Medium'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PROFILE ANALYTICS — Radar + Subject Charts + RIASEC Gauges
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="ft-animate-in ft-section" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
          <SectionHeader
            title="Your Profile Analysis & Strengths"
            subtitle="A comprehensive overview of your personality type, work styles, and subject ratings."
            accentColor="purple"
          />
          {profile?.riasec_scores && (
            <button
              className="ft-button-secondary"
              onClick={() => { window.history.pushState({}, '', '/report'); window.dispatchEvent(new PopStateEvent('popstate')); }}
              style={{ marginTop: 8 }}
            >
              View Full Report →
            </button>
          )}
        </div>

        {profileLoading && (
          <div className="ft-glass-card" style={{
            height: 280,
            animation: 'ft-shimmer 1.6s infinite',
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 75%)',
            backgroundSize: '400% 100%',
          }} />
        )}

        {profileError && (
          <div className="ft-glass-card" style={{ borderLeft: '3px solid #ff006e' }}>
            <p style={{ color: '#ff006e', margin: 0 }}>{profileError}</p>
          </div>
        )}

        {!profileLoading && !profileError && !hasProfileAnalytics && (
          <GlassCard style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h3 style={{ color: 'var(--ft-text-primary)', margin: '0 0 10px', fontSize: '1.15rem' }}>Your analytics will appear here</h3>
            <p style={{ color: 'var(--ft-text-muted)', margin: 0, lineHeight: 1.6, maxWidth: 500, marginInline: 'auto' }}>
              Complete the psychometric test to add your RIASEC personality scores. Your onboarding subject and work-style insights will be shown alongside them.
            </p>
          </GlassCard>
        )}

        {/* ── Charts Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>

          {/* ── Holographic Radar Chart ── */}
          {radarData && (
            <GlassCard elevated className="ft-animate-in ft-delay-1">
              <h3 style={{ color: 'var(--ft-text-primary)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px 0' }}>
                ✦ Personality & Work Style Alignment
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--ft-text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Overlay of your RIASEC psychometric scores and self-rated work styles.
              </p>
              <div style={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                    <defs>
                      <linearGradient id="radarCyanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="radarMagentaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff006e" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#ff006e" stopOpacity={0.03} />
                      </linearGradient>
                      <filter id="glowCyan">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                      <filter id="glowMagenta">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <PolarGrid gridType="polygon" stroke={isDark ? "rgba(0,212,255,0.12)" : "rgba(15,23,42,0.12)"} />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={<FuturisticRadarTick />}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.45)', fontSize: 10 }}
                      tickCount={5}
                      axisLine={false}
                    />
                    <Radar
                      name="RIASEC Score"
                      dataKey="riasec"
                      stroke="#00d4ff"
                      fill="url(#radarCyanGrad)"
                      strokeWidth={2.5}
                      dot={{ fill: '#00d4ff', r: 4, filter: 'url(#glowCyan)' }}
                      style={{ filter: 'url(#glowCyan)' }}
                    />
                    <Radar
                      name="Work Style"
                      dataKey="workStyle"
                      stroke="#ff006e"
                      fill="url(#radarMagentaGrad)"
                      strokeWidth={2}
                      dot={{ fill: '#ff006e', r: 3, filter: 'url(#glowMagenta)' }}
                      style={{ filter: 'url(#glowMagenta)' }}
                    />
                    <Legend
                      formatter={v => <span style={{ color: 'var(--ft-text-secondary)', fontWeight: 600, fontSize: 12 }}>{v}</span>}
                      iconType="circle"
                    />
                    <Tooltip content={<RadarTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          )}

          {/* ── Neon Subject Bar Chart ── */}
          {subjectData && (
            <GlassCard elevated className="ft-animate-in ft-delay-2" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ color: 'var(--ft-text-primary)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px 0' }}>
                ✦ Subject Strength Profile
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--ft-text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Self-rated performance across subjects, from 1 (struggling) to 5 (favourite).
              </p>
              <div style={{ flex: 1, minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={Math.max(220, subjectData.length * 48)}>
                  <BarChart
                    data={subjectData}
                    layout="vertical"
                    margin={{ top: 4, right: 30, left: 10, bottom: 4 }}
                  >
                    <defs>
                      <linearGradient id="barCyanGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="barPurpleGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      </linearGradient>
                      <filter id="barGlow">
                        <feGaussianBlur stdDeviation="2" />
                        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <XAxis
                      type="number"
                      domain={[0, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.5)', fontSize: 11 }}
                      tickFormatter={v => ['', '1', '2', '3', '4', '5'][v] || v}
                      axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)' }}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="subject"
                      width={120}
                      tick={{ fill: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.8)', fontWeight: 600, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const v = payload[0].value;
                        const labels = ['','Struggling','Getting by','Comfortable','Really good','Favourite'];
                        const localIsDark = !document.body.classList.contains('light-theme');
                        return (
                          <div style={{
                            background: localIsDark ? 'rgba(13,19,51,0.95)' : '#ffffff',
                            border: localIsDark ? '1px solid rgba(0,212,255,0.2)' : '1px solid rgba(44, 84, 146, 0.12)',
                            borderRadius: 10, padding: '10px 16px',
                            boxShadow: localIsDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 20px rgba(0,0,0,0.08)',
                            color: localIsDark ? 'rgba(255,255,255,0.9)' : '#0f172a', fontSize: 13,
                          }}>
                            <div style={{ fontWeight: 700 }}>{payload[0].payload.subject}</div>
                            <div style={{ color: '#00d4ff', marginTop: 4 }}>{v}/5 — {labels[v] || v}</div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="rating" radius={[0, 8, 8, 0]} maxBarSize={22}>
                      {subjectData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.rating >= 4 ? 'url(#barCyanGrad)' : entry.rating === 3 ? 'url(#barPurpleGrad)' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)')}
                          style={{ filter: entry.rating >= 4 ? 'url(#barGlow)' : undefined }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 14, fontSize: 11 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: '#00d4ff', boxShadow: '0 0 8px rgba(0,212,255,0.4)' }} />
                    <span style={{ color: 'var(--ft-text-secondary)' }}>Strong (4–5)</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: '#8b5cf6', boxShadow: '0 0 8px rgba(139,92,246,0.3)' }} />
                    <span style={{ color: 'var(--ft-text-secondary)' }}>Average (3)</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--ft-border-light)' }} />
                    <span style={{ color: 'var(--ft-text-secondary)' }}>Needs work (1–2)</span>
                  </span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* ── RIASEC Radial Gauge Cluster ── */}
        {radarData && (
          <div className="ft-animate-in ft-delay-3" style={{ marginTop: '2rem' }}>
            <h3 style={{ color: 'var(--ft-text-primary)', fontSize: '1rem', fontWeight: 700, margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 3, height: 20, background: 'linear-gradient(180deg, #00d4ff, #8b5cf6)', borderRadius: 2 }} />
              RIASEC Score Breakdown
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {radarData.map((item) => {
                const theme = RIASEC_THEME[item.dimension] || {};
                return (
                  <GlassCard key={item.dimension} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 0.75rem' }}>
                    <RadialGauge
                      value={item.riasec}
                      max={100}
                      label={theme.icon || ''}
                      sublabel={item.dimension}
                      color={theme.color || '#00d4ff'}
                      size={110}
                      strokeWidth={8}
                    />
                  </GlassCard>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CAREER MIND MAP
          ═══════════════════════════════════════════════════════════════════ */}
      {recs && recs.length > 0 && (
        <section className="ft-animate-in ft-section" style={{ paddingBottom: '4rem' }}>
          <SectionHeader
            title="Your Career Galaxy"
            subtitle="Your top career matches orbit as planets — hover to pause, click a planet to explore your personalised fit."
            accentColor="amber"
          />
          <CareerMindMap recs={recs} />
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          EXPLORE CAREERS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="ft-animate-in ft-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <SectionHeader
          title="Explore Careers"
          subtitle="Browse careers across Science, Commerce, and Arts — find what suits you."
          accentColor="cyan"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { name: 'Software Engineer', stream: 'PCM', exam: 'JEE Main', salary: '₹7-30 LPA', accent: '#00d4ff' },
            { name: 'Doctor (MBBS)', stream: 'PCB', exam: 'NEET', salary: '₹6-25 LPA', accent: '#00ff88' },
            { name: 'IAS Officer', stream: 'Arts/Any', exam: 'UPSC', salary: '₹8-20 LPA', accent: '#f59e0b' }
          ].map((career, i) => (
            <GlassCard
              key={i}
              className="ft-animate-in"
              style={{
                borderTop: `2px solid ${career.accent}`,
                cursor: 'pointer',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <h3 style={{ color: 'var(--ft-text-primary)', margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 800 }}>
                {career.name}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="ft-tag ft-tag--cyan">{career.stream}</span>
                <span className="ft-tag ft-tag--purple">{career.exam}</span>
              </div>
              <div style={{ color: '#00ff88', fontSize: '0.95rem', fontWeight: 700 }}>
                {career.salary}
              </div>
              <div style={{ marginTop: '1rem', color: '#00d4ff', fontWeight: 700, opacity: 0.8, fontSize: '0.9rem' }}>
                Explore →
              </div>
            </GlassCard>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            className="ft-button-primary"
            onClick={() => { window.history.pushState({}, '', '/careers'); window.dispatchEvent(new PopStateEvent('popstate')) }}
          >
            View All Careers
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ENTRANCE EXAMS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="ft-animate-in ft-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <SectionHeader
          title="Find Your Entrance Exam"
          subtitle="Every major entrance exam in one place — eligibility, dates, and what it leads to."
          accentColor="green"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { name: 'JEE Main', stream: 'PCM', month: 'January & April', leads: 'NITs & IIITs', accent: '#00d4ff' },
            { name: 'NEET', stream: 'PCB', month: 'May', leads: 'MBBS & BDS', accent: '#00ff88' },
            { name: 'CUET', stream: 'All Streams', month: 'May-June', leads: 'Central Universities', accent: '#f59e0b' }
          ].map((exam, i) => (
            <GlassCard
              key={i}
              className="ft-animate-in"
              style={{
                borderTop: `2px solid ${exam.accent}`,
                cursor: 'pointer',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <h3 style={{ color: 'var(--ft-text-primary)', margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 800 }}>
                {exam.name}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="ft-tag ft-tag--cyan">{exam.stream}</span>
                <span className="ft-tag ft-tag--amber">{exam.month}</span>
              </div>
              <div style={{ color: 'var(--ft-text-secondary)', fontSize: '0.92rem', fontWeight: 600 }}>
                Leads to: <span style={{ color: 'var(--ft-text-primary)' }}>{exam.leads}</span>
              </div>
              <div style={{ marginTop: '1rem', color: '#00d4ff', fontWeight: 700, opacity: 0.8, fontSize: '0.9rem' }}>
                Explore →
              </div>
            </GlassCard>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            className="ft-button-primary"
            onClick={() => { window.history.pushState({}, '', '/exams'); window.dispatchEvent(new PopStateEvent('popstate')) }}
          >
            View All Exams
          </button>
        </div>
      </section>

      {/* ─── Psychometric Test Section ─── */}
      <PsychometricTest hasResults={Boolean(profile?.riasec_scores)} />

      {/* ═══════════════════════════════════════════════════════════════════
          WHY MANZIL
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="ft-animate-in ft-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <SectionHeader
          title="Why Manzil"
          subtitle=""
          accentColor="cyan"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'AI-powered guidance', desc: 'Personalised to your stream and goals', icon: '🤖', accent: '#00d4ff' },
            { title: 'Covers all major exams', desc: 'From JEE and NEET to CUET and UPSC', icon: '📝', accent: '#00ff88' },
            { title: 'Free psychometric test', desc: 'Get a detailed personality report', icon: '🧠', accent: '#8b5cf6' },
            { title: 'Available 24/7', desc: 'No counsellor booking — instant guidance', icon: '⚡', accent: '#f59e0b' }
          ].map((point, i) => (
            <GlassCard
              key={i}
              className="ft-animate-in"
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', transitionDelay: `${i * 0.08}s` }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: `${point.accent}15`,
                border: `1px solid ${point.accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: `0 0 20px ${point.accent}15`,
              }}>
                {point.icon}
              </div>
              <h3 style={{ color: 'var(--ft-text-primary)', margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                {point.title}
              </h3>
              <p style={{ color: 'var(--ft-text-muted)', margin: 0, fontSize: '0.92rem' }}>
                {point.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: '#102849',
        borderTop: '1px solid #23406d',
        color: '#ffffff',
        padding: '2.5rem 1.5rem',
}}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 260px' }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.3)' }}>Manzil</div>
            <div style={{
              marginTop: 10,
              color: 'rgba(255,255,255,0.82)',
              fontSize: '0.9rem',
              lineHeight: 1.5
              }}>Helping students find their path.</div>
          </div>

          <div style={{ display: 'flex', gap: 48, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 800, marginBottom: 10, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#00d4ff' }}>Platform</div>
              <div style={{ display: 'grid', gap: 8 }}>
                <a onClick={() => { window.history.pushState({}, '', '/dashboard'); window.dispatchEvent(new PopStateEvent('popstate')) }} className="ft-nav-link" style={{ fontSize: '0.9rem' }}>Home</a>
                <a onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }} className="ft-nav-link" style={{ fontSize: '0.9rem' }}>How it Works</a>
                <a onClick={() => { window.history.pushState({}, '', '/careers'); window.dispatchEvent(new PopStateEvent('popstate')) }} className="ft-nav-link" style={{ fontSize: '0.9rem' }}>Career Library</a>
                <a onClick={() => { window.history.pushState({}, '', '/exams'); window.dispatchEvent(new PopStateEvent('popstate')) }} className="ft-nav-link" style={{ fontSize: '0.9rem' }}>Exam Explorer</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, marginBottom: 10, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#00d4ff' }}>Resources</div>
              <div style={{ display: 'grid', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem('beacon_token');
                    const origin = window.location.origin;
                    const url = token
                      ? `${APTITUDE_URL}?beacon_token=${encodeURIComponent(token)}&origin=${encodeURIComponent(origin)}`
                      : `${APTITUDE_URL}?origin=${encodeURIComponent(origin)}`;
                    window.open(url, '_blank');
                  }}
                  className="ft-nav-link"
                  style={{ background: 'transparent', border: 'none', padding: 0, font: 'inherit', textAlign: 'left', fontSize: '0.9rem' }}
                >
                  Psychometric Test
                </button>
                <a onClick={() => { window.history.pushState({}, '', '/chat'); window.dispatchEvent(new PopStateEvent('popstate')) }} className="ft-nav-link" style={{ fontSize: '0.9rem' }}>Chat with AI</a>
                <a onClick={() => { window.history.pushState({}, '', '/report'); window.dispatchEvent(new PopStateEvent('popstate')) }} className="ft-nav-link" style={{ fontSize: '0.9rem' }}>Download Report</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, marginBottom: 10, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#00d4ff' }}>About</div>
              <div style={{ display: 'grid', gap: 8 }}>
                <a href="#" className="ft-nav-link" style={{ fontSize: '0.9rem' }}>About Us</a>
                <a href="#" className="ft-nav-link" style={{ fontSize: '0.9rem' }}>Privacy Policy</a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="ft-nav-link" style={{ fontSize: '0.9rem' }}>GitHub</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 24,
          paddingTop: 16,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.72)',
          fontSize: '0.82rem',
        }}>
          2026 Manzil. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
