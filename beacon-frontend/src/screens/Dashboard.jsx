import { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import PsychometricTest from '../components/PsychometricTest.jsx'

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
    background: COLORS.navy,
    color: COLORS.white,
    position: 'sticky',
    top: 0,
    zIndex: 40
  },
  logo: { fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' },
  navLinks: { display: 'flex', gap: '1rem', alignItems: 'center' },
  link: { color: COLORS.white, textDecoration: 'none', fontWeight: 600, opacity: 0.95 },
  profile: { width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontWeight: 700 },

  hero: { background: COLORS.navy, color: COLORS.white, padding: '3.25rem 1rem', textAlign: 'center' },
  heroInner: { maxWidth: 980, margin: '0 auto' },
  heroTitle: { fontSize: '2.1rem', fontWeight: 800, margin: 0, lineHeight: 1.05 },
  heroSubtitle: { marginTop: '0.6rem', color: 'rgba(255,255,255,0.9)', fontSize: '1rem' },
  heroCtas: { marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: { background: COLORS.white, color: COLORS.navy, border: 'none', padding: '0.75rem 1.05rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer' },
  secondaryBtn: { background: 'transparent', color: COLORS.white, border: '1px solid rgba(255,255,255,0.12)', padding: '0.6rem 0.95rem', borderRadius: 10, fontWeight: 600, cursor: 'pointer' },

  content: { maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' },
  cardsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' },
  card: { borderRadius: 12, padding: '1.25rem', boxShadow: '0 6px 18px rgba(7,20,58,0.06)', background: COLORS.white, border: `1px solid rgba(7,20,58,0.04)` },
  cardTitle: { fontSize: '1.05rem', fontWeight: 700, color: COLORS.navy },
  cardDesc: { marginTop: '0.5rem', color: COLORS.muted, fontSize: '0.95rem' },
  cardBtn: { marginTop: '0.9rem', padding: '0.55rem 0.9rem', borderRadius: 8, border: 'none', background: COLORS.navy, color: COLORS.white, fontWeight: 700, cursor: 'pointer' },

  '@media': {
    narrowCards: { gridTemplateColumns: '1fr', }
  }
}

export default function Dashboard({ userName }) {
  const [name, setName] = useState(userName || '')

  useEffect(() => {
    if (!userName) {
      const stored = window.localStorage.getItem('userName')
      if (stored) setName(stored)
    }
  }, [userName])

  const isReturning = Boolean(name && name.trim())

  const heading = isReturning ? `Welcome back, ${name}` : 'Your career journey starts here'

  return (
    <div style={styles.root}>
      <header style={styles.navbar}>
        <div style={styles.logo}>CareerCompass</div>
        <nav style={styles.navLinks} aria-label="Primary">
          <a onClick={() => { window.history.pushState({}, '', '/careers'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ ...styles.link, cursor: 'pointer' }}>Career Library</a>
          <a onClick={() => { window.history.pushState({}, '', '/exams'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ ...styles.link, cursor: 'pointer' }}>Exam Explorer</a>
          <div style={styles.profile} title={name || 'Profile'}>{(name && name[0]) || 'P'}</div>
        </nav>
      </header>

      <HeroSection
        title={heading}
        subtitle={'Explore careers, take the psychometric test, or chat with our AI counsellor'}
        primaryText={'Chat with AI'}
        onPrimary={() => (window.location.hash = '#chat')}
        secondaryText={'Take Psychometric Test'}
        onSecondary={() => (window.location.hash = '#test')}
      />

      <HowItWorks />


      {/* Stats bar — Section 2 */}
      <section style={{ background: COLORS.navy, color: COLORS.white, padding: '1.25rem 1rem', marginTop: 8 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>80+</div>
            <div style={{ opacity: 0.9 }}>Careers Covered</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>20+</div>
            <div style={{ opacity: 0.9 }}>Entrance Exams</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>3</div>
            <div style={{ opacity: 0.9 }}>Streams</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>100%</div>
            <div style={{ opacity: 0.9 }}>Free</div>
          </div>
        </div>
      </section>

      {/* Why CareerCompass — Section 3 */}
      <section style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{ color: COLORS.navy, margin: '0 0 0.75rem 0' }}>Why CareerCompass</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            'Built specifically for Indian students Class 8 to 12',
            'Covers Science, Commerce and Arts equally',
            'AI chatbot available 24/7',
            'Psychometric test with detailed report',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 6px 18px rgba(7,20,58,0.04)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.navy, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>✓</div>
              <div style={{ color: COLORS.muted, fontWeight: 700 }}>{t}</div>
            </div>
          ))}
        </div>
      </section>

      <PsychometricTest />

      <main style={styles.content}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: COLORS.navy, fontSize: '1.15rem' }}>Explore</h2>
          <p style={{ marginTop: '0.4rem', color: COLORS.muted }}>Quick access to our most used features</p>
        </div>

        <div style={styles.cardsRow}>
          <article style={styles.card}>
            <div style={styles.cardTitle}>AI Chatbot</div>
            <div style={styles.cardDesc}>Ask career questions, get direction, and simulate counselling conversations with our AI.</div>
            <button style={styles.cardBtn} onClick={() => window.location.hash = '#chat'}>Open Chat</button>
          </article>

            <article style={styles.card}>
            <div style={styles.cardTitle}>Career Library</div>
            <div style={styles.cardDesc}>Browse careers, required qualifications, typical paths, and college suggestions.</div>
            <button style={styles.cardBtn} onClick={() => { window.history.pushState({}, '', '/careers'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Browse Library</button>
          </article>

            <article style={styles.card}>
            <div style={styles.cardTitle}>Exam Explorer</div>
            <div style={styles.cardDesc}>Find exams, eligibility, important dates, and preparation tips across India.</div>
            <button style={styles.cardBtn} onClick={() => { window.history.pushState({}, '', '/exams'); window.dispatchEvent(new PopStateEvent('popstate')) }}>Explore Exams</button>
          </article>
        </div>
      </main>
      {/* Footer — Section 4 */}
      <footer style={{ background: COLORS.lightNavy || COLORS.navy, color: '#fff', padding: '2rem 1rem', marginTop: 24 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 20, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 260px' }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>CareerCompass</div>
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
                <a onClick={() => { window.history.pushState({}, '', '/#test'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ color: '#fff', opacity: 0.95, cursor: 'pointer' }}>Psychometric Test</a>
                <a onClick={() => { window.history.pushState({}, '', '/#chat'); window.dispatchEvent(new PopStateEvent('popstate')) }} style={{ color: '#fff', opacity: 0.95, cursor: 'pointer' }}>Chat with AI</a>
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
          2026 CareerCompass.
        </div>
      </footer>
    </div>
  )
}
