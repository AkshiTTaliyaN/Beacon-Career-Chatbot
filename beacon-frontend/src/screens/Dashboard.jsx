import { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection.jsx'
import PsychometricTest from '../components/PsychometricTest.jsx'
import RiasecGate from './RiasecGate.jsx'
import { getSmartRecommendations } from '../api/client.js'

const COLORS = {
  navy: '#07143a',
  white: '#ffffff',
  lightNavy: '#0b1b45',
  muted: 'rgba(7,20,58,0.7)'
}

const styles = {
  root: { fontFamily: 'Inter, system-ui, -apple-system, Roboto, sans-serif', background: COLORS.white, minHeight: '100vh' },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    background: 'rgba(10,25,60,0.95)',
    color: COLORS.white,
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  navbarScrolled: {
    boxShadow: '0 1px 20px rgba(0,0,0,0.15)'
  },
  logo: { fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' },
  navLinks: { display: 'flex', gap: '1rem', alignItems: 'center' },
  link: { color: COLORS.white, textDecoration: 'none', fontWeight: 600, opacity: 0.95 },
  profile: { width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontWeight: 700 },
  sectionHeading: { display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' },
  headingAccent: { width: 3, height: 32, background: COLORS.navy, borderRadius: 2 },
  sectionTitle: { color: COLORS.navy, margin: 0, fontSize: '1.85rem', fontWeight: 800 }
}

export default function Dashboard({ userName }) {
  const [name, setName] = useState(userName || '')
  const [navScrolled, setNavScrolled] = useState(false)
  const [isReturning, setIsReturning] = useState(false)

  // ── Career Recommendations state ───────────────────────────────────────────────────
  const [recs, setRecs] = useState(null)          // null=loading, []=empty
  const [recsGated, setRecsGated] = useState(false)   // show gate screen
  const [recsError, setRecsError] = useState(null)

  useEffect(() => {
    getSmartRecommendations()
      .then(data => setRecs(data.recommendations || []))
      .catch(err => {
        if (err.code === 'riasec_required') setRecsGated(true)
        else setRecsError('Could not load recommendations — try refreshing.')
      })
  }, [])

  useEffect(() => {
    if (!userName) {
      const stored = window.localStorage.getItem('userName')
      if (stored) setName(stored)
    }

    setIsReturning(window.localStorage.getItem('beaconReturning') === '1')
  }, [userName])

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 8)

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 }
    )

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))
    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const firstName = name ? name.trim().split(' ')[0] : ''

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
    <div style={styles.root}>
      <style>{`
        .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .interactive-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, border-top-color 0.25s ease; border-top: 3px solid transparent; }
        .interactive-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(30,58,138,0.12); border-color: rgba(15,23,42,0.18); border-top-color: #0f172a; }
        .dashboard-button { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .dashboard-button:hover { transform: scale(1.03); box-shadow: 0 4px 20px rgba(37,99,235,0.35); }
        .dashboard-button.secondary:hover { transform: scale(1.03); box-shadow: 0 4px 20px rgba(37,99,235,0.18); }
        .typing-dots { display: flex; gap: 6px; margin-top: 0.75rem; }
        .typing-dots span { width: 8px; height: 8px; border-radius: 50%; background: rgba(7,20,58,0.35); animation: pulse 1.2s infinite ease-in-out; opacity: 0.8; }
        .typing-dots span:nth-child(2) { animation-delay: 0.15s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes pulse { 0%, 80%, 100% { transform: scale(1); opacity: 0.6; } 40% { transform: scale(1.4); opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -400% 0; } 100% { background-position: 400% 0; } }
      `}</style>

      <header style={{ ...styles.navbar, ...(navScrolled ? styles.navbarScrolled : {}) }}>
        <div style={styles.logo}>Beacon</div>
        <nav style={styles.navLinks} aria-label="Primary">
          <a onClick={() => { window.history.pushState({}, '', '/careers'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ ...styles.link, cursor: 'pointer' }}>Career Library</a>
          <a onClick={() => { window.history.pushState({}, '', '/exams'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ ...styles.link, cursor: 'pointer' }}>Exam Explorer</a>
          <div style={styles.profile} title={name || 'Profile'}>{(name && name[0]) || 'P'}</div>
        </nav>
      </header>

      <HeroSection
        title={heading}
        subtitle={heroSubtitle}
        primaryText={'Chat with AI'}
        onPrimary={() => { window.history.pushState({}, '', '/chat'); window.dispatchEvent(new PopStateEvent('popstate')) }}
        secondaryText={'Take Psychometric Test'}
        onSecondary={() => {
          const token = localStorage.getItem('beacon_token');
          const url = token
            ? `http://localhost:3001?beacon_token=${encodeURIComponent(token)}`
            : 'http://localhost:3001';
          window.open(url, '_blank');
        }}
      />

      <section className="fade-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1rem', background: COLORS.white }}>
        <div style={styles.sectionHeading}>
          <div style={styles.headingAccent} />
          <h2 style={styles.sectionTitle}>Chat with our AI Counsellor</h2>
        </div>
        <p style={{ color: COLORS.muted, marginTop: '0.5rem', marginBottom: '2rem', fontSize: '1rem' }}>Get personalised career guidance based on your stream, interests, and goals.</p>

        <div style={{ background: '#f5f7fa', borderRadius: 12, padding: '2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <div style={{ background: COLORS.navy, color: COLORS.white, padding: '0.75rem 1rem', borderRadius: '12px 12px 0px 12px', maxWidth: '80%', wordWrap: 'break-word' }}>
              I took PCM and love solving problems. What careers suit me?
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ background: COLORS.white, color: COLORS.navy, padding: '0.75rem 1rem', borderRadius: '12px 12px 12px 0px', border: `1px solid rgba(7,20,58,0.1)`, maxWidth: '80%', wordWrap: 'break-word' }}>
              Great question! With PCM, careers like Software Engineering, Data Science, and Mechanical Engineering are excellent fits.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: COLORS.white, color: COLORS.navy, padding: '0.75rem 1rem', borderRadius: '12px 12px 12px 0px', border: `1px solid rgba(7,20,58,0.1)`, maxWidth: '80%', wordWrap: 'break-word' }}>
              I'd recommend exploring these through our Career Library, and take the psychometric test to align them with your interests!
              <div className="typing-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            className="dashboard-button"
            style={{
              background: COLORS.navy,
              color: COLORS.white,
              border: 'none',
              padding: '0.9rem 2rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(7,20,58,0.15)'
            }}
            onClick={() => { window.history.pushState({}, '', '/chat'); window.dispatchEvent(new PopStateEvent('popstate')) }}
          >
            Start Chatting
          </button>
        </div>
      </section>

      {/* ─── CAREER RECOMMENDATIONS ─── */}
      <section className="fade-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1rem' }}>
        <div style={styles.sectionHeading}>
          <div style={styles.headingAccent} />
          <h2 style={styles.sectionTitle}>Your Career Matches</h2>
        </div>
        <p style={{ color: COLORS.muted, marginTop: '0.5rem', marginBottom: '2rem', fontSize: '1rem' }}>
          Ranked using your RIASEC personality, subjects, work style, and goals.
        </p>

        {/* Loading skeleton */}
        {!recsGated && !recsError && recs === null && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.25rem' }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                background: '#f1f5f9', borderRadius: 14, padding: '1.5rem', height: 140,
                animation: 'shimmer 1.6s infinite',
                backgroundImage: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',
                backgroundSize: '400% 100%',
              }} />
            ))}
          </div>
        )}

        {/* Gate screen */}
        {recsGated && <RiasecGate />}

        {/* Error */}
        {recsError && (
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{recsError}</p>
        )}

        {/* Career cards */}
        {recs && recs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '1.25rem' }}>
            {recs.map((career, i) => (
              <div key={i} className="interactive-card" style={{
                background: '#fff',
                border: '1px solid rgba(7,20,58,0.08)',
                borderRadius: 14,
                padding: '1.5rem',
                boxShadow: '0 4px 14px rgba(7,20,58,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: COLORS.navy, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1.1rem', flexShrink: 0,
                  }}>{career.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: '1.05rem' }}>{career.title}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(7,20,58,0.07)', color: COLORS.navy, padding: '2px 8px', borderRadius: 5, fontSize: '0.78rem', fontWeight: 700 }}>
                        {career.stream}
                      </span>
                      <span style={{ background: '#f0fdf4', color: '#15803d', padding: '2px 8px', borderRadius: 5, fontSize: '0.78rem', fontWeight: 700 }}>
                        {career.salary}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{ margin: 0, color: '#374151', fontSize: '0.875rem', lineHeight: 1.65 }}>
                  {career.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="fade-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1rem', background: COLORS.white }}>
        <div style={styles.sectionHeading}>
          <div style={styles.headingAccent} />
          <h2 style={styles.sectionTitle}>Explore Careers</h2>
        </div>
        <p style={{ color: COLORS.muted, marginTop: '0.5rem', marginBottom: '2.5rem', fontSize: '1rem' }}>Browse careers across Science, Commerce, and Arts - find what suits you.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { name: 'Software Engineer', stream: 'PCM', exam: 'JEE Main', salary: 'Rs 7-30 LPA' },
            { name: 'Doctor (MBBS)', stream: 'PCB', exam: 'NEET', salary: 'Rs 6-25 LPA' },
            { name: 'IAS Officer', stream: 'Arts/Any', exam: 'UPSC', salary: 'Rs 8-20 LPA' }
          ].map((career, i) => (
            <div
              key={i}
              className="fade-up interactive-card"
              style={{
                background: COLORS.white,
                border: `1px solid rgba(7,20,58,0.08)`,
                borderRadius: 12,
                padding: '1.5rem',
                boxShadow: '0 6px 18px rgba(7,20,58,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transitionDelay: `${i * 0.1}s`
              }}
            >
              <div>
                <h3 style={{ color: COLORS.navy, margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 800 }}>
                  {career.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{
                    background: 'rgba(7,20,58,0.08)',
                    color: COLORS.navy,
                    padding: '0.3rem 0.6rem',
                    borderRadius: 6,
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    {career.stream}
                  </span>
                  <span style={{
                    background: 'rgba(7,20,58,0.08)',
                    color: COLORS.navy,
                    padding: '0.3rem 0.6rem',
                    borderRadius: 6,
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    {career.exam}
                  </span>
                </div>
                <div style={{ color: COLORS.muted, fontSize: '0.95rem', fontWeight: 600 }}>
                  {career.salary}
                </div>
              </div>
              <div style={{ marginTop: '1rem', color: COLORS.navy, fontWeight: 700, cursor: 'pointer', opacity: 0.7 }}>
                - Explore
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            className="dashboard-button"
            style={{
              background: COLORS.navy,
              color: COLORS.white,
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(7,20,58,0.15)'
            }}
            onClick={() => { window.history.pushState({}, '', '/careers'); window.dispatchEvent(new PopStateEvent('popstate')) }}
          >
            View All Careers
          </button>
        </div>
      </section>

      <section className="fade-up" style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1rem', background: '#F8FAFF' }}>
        <div style={styles.sectionHeading}>
          <div style={styles.headingAccent} />
          <h2 style={styles.sectionTitle}>Find Your Entrance Exam</h2>
        </div>
        <p style={{ color: COLORS.muted, marginTop: '0.5rem', marginBottom: '2.5rem', fontSize: '1rem' }}>Every major Indian entrance exam in one place - eligibility, dates, and what it leads to.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { name: 'JEE Main', stream: 'PCM', month: 'January & April', leads: 'NITs & IIITs' },
            { name: 'NEET', stream: 'PCB', month: 'May', leads: 'MBBS & BDS' },
            { name: 'CUET', stream: 'All Streams', month: 'May-June', leads: 'Central Universities' }
          ].map((exam, i) => (
            <div
              key={i}
              className="fade-up interactive-card"
              style={{
                background: COLORS.white,
                border: `1px solid rgba(7,20,58,0.08)`,
                borderRadius: 12,
                padding: '1.5rem',
                boxShadow: '0 6px 18px rgba(7,20,58,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transitionDelay: `${i * 0.1}s`
              }}
            >
              <div>
                <h3 style={{ color: COLORS.navy, margin: '0 0 0.75rem 0', fontSize: '1.05rem', fontWeight: 800 }}>
                  {exam.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{
                    background: 'rgba(7,20,58,0.08)',
                    color: COLORS.navy,
                    padding: '0.3rem 0.6rem',
                    borderRadius: 6,
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    {exam.stream}
                  </span>
                  <span style={{
                    background: 'rgba(7,20,58,0.08)',
                    color: COLORS.navy,
                    padding: '0.3rem 0.6rem',
                    borderRadius: 6,
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    {exam.month}
                  </span>
                </div>
                <div style={{ color: COLORS.muted, fontSize: '0.95rem', fontWeight: 600 }}>
                  Leads to: {exam.leads}
                </div>
              </div>
              <div style={{ marginTop: '1rem', color: COLORS.navy, fontWeight: 700, cursor: 'pointer', opacity: 0.7 }}>
                - Explore
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            className="dashboard-button"
            style={{
              background: COLORS.navy,
              color: COLORS.white,
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(7,20,58,0.15)'
            }}
            onClick={() => { window.history.pushState({}, '', '/exams'); window.dispatchEvent(new PopStateEvent('popstate')) }}
          >
            View All Exams
          </button>
        </div>
      </section>

      <PsychometricTest />

      <section className="fade-up" style={{ background: COLORS.white, padding: '5rem 1rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={styles.sectionHeading}>
            <div style={styles.headingAccent} />
            <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>Why Beacon</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {[
              {
                title: 'AI-powered guidance',
                desc: 'Personalised to your stream and goals'
              },
              {
                title: 'Covers all major Indian exams',
                desc: 'From JEE and NEET to CUET and UPSC'
              },
              {
                title: 'Free psychometric test',
                desc: 'Get a detailed personality report'
              },
              {
                title: 'Available 24/7',
                desc: 'No counsellor booking - instant guidance'
              }
            ].map((point, i) => (
              <div
                key={i}
                className="fade-up interactive-card"
                style={{
                  background: COLORS.white,
                  padding: '2rem',
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(7,20,58,0.08)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transitionDelay: `${i * 0.08}s`
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: COLORS.navy,
                  color: COLORS.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {i + 1}
                </div>
                <h3 style={{ color: COLORS.navy, margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                  {point.title}
                </h3>
                <p style={{ color: COLORS.muted, margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: COLORS.lightNavy || COLORS.navy, color: '#fff', padding: '2rem 1rem', marginTop: 24 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 20, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 260px' }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Beacon</div>
            <div style={{ marginTop: 8, opacity: 0.9 }}>Helping Indian students find their path.</div>
          </div>

          <div style={{ display: 'flex', gap: 40, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Platform</div>
              <div style={{ display: 'grid', gap: 6 }}>
                <a onClick={() => { window.history.pushState({}, '', '/dashboard'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ color: '#fff', opacity: 0.95, cursor: 'pointer' }}>Home</a>
                <a onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ color: '#fff', opacity: 0.95, cursor: 'pointer' }}>How it Works</a>
                <a onClick={() => { window.history.pushState({}, '', '/careers'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ color: '#fff', opacity: 0.95, cursor: 'pointer' }}>Career Library</a>
                <a onClick={() => { window.history.pushState({}, '', '/exams'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ color: '#fff', opacity: 0.95, cursor: 'pointer' }}>Exam Explorer</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Resources</div>
              <div style={{ display: 'grid', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => window.open('http://localhost:3001', '_blank')}
                  style={{ color: '#fff', opacity: 0.95, cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, font: 'inherit', textAlign: 'left' }}
                >
                  Psychometric Test
                </button>
                <a onClick={() => { window.history.pushState({}, '', '/chat'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ color: '#fff', opacity: 0.95, cursor: 'pointer' }}>Chat with AI</a>
                <a onClick={() => { window.history.pushState({}, '', '/report'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ color: '#fff', opacity: 0.95, cursor: 'pointer' }}>Download Report</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>About</div>
              <div style={{ display: 'grid', gap: 6 }}>
                <a href="#" style={{ color: '#fff', opacity: 0.95 }}>About Us</a>
                <a href="#" style={{ color: '#fff', opacity: 0.95 }}>Privacy Policy</a>
                <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#fff', opacity: 0.95 }}>GitHub</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 18, paddingTop: 12, textAlign: 'center', opacity: 0.9 }}>
          2026 Beacon. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
