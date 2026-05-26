import React from 'react'

const COLORS = {
  navy: '#07143a',
  white: '#ffffff',
  muted: 'rgba(7,20,58,0.65)'
}

const styles = {
  wrap: { maxWidth: 1100, margin: '1.5rem auto', padding: '0 1rem', background: '#F8FAFF', borderRadius: 16 },
  row: { display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'stretch' },
  step: { flex: 1, background: COLORS.white, borderRadius: 12, padding: '1rem', border: '1px solid rgba(7,20,58,0.04)', boxShadow: '0 6px 18px rgba(7,20,58,0.04)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' },
  number: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1e3a6e 0%, #2563eb 100%)', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', color: COLORS.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 },
  icon: { width: 28, height: 28, marginLeft: 'auto', opacity: 0.9 },
  title: { fontSize: '0.98rem', fontWeight: 700, color: COLORS.navy },
  desc: { marginTop: '0.4rem', color: COLORS.muted, fontSize: '0.95rem' }
}

function Icon({ name }) {
  switch (name) {
    case 'test':
      return (
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke={COLORS.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="14" height="14" rx="2" />
          <path d="M7 8h6" />
        </svg>
      )
    case 'report':
      return (
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke={COLORS.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 2v4" />
          <path d="M9 2h6a2 2 0 0 1 2 2v14l-4-2-4 2V4a2 2 0 0 1 2-2z" />
        </svg>
      )
    case 'chat':
      return (
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke={COLORS.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'download':
      return (
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke={COLORS.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )
    default:
      return null
  }
}

export default function HowItWorks() {
  const steps = [
    { num: 1, icon: 'test', title: 'Take the free psychometric test', desc: 'Quick, research-backed questionnaire tailored for Class 8–12.' },
    { num: 2, icon: 'report', title: 'Get your personality report', desc: 'Receive a clear report highlighting strengths and suitable career clusters.' },
    { num: 3, icon: 'chat', title: 'Chat with the AI counsellor', desc: 'Discuss results and next steps with an AI-guided conversation.' },
    { num: 4, icon: 'download', title: 'Download your career PDF', desc: 'Save a professional PDF summary you can share with parents or mentors.' },
  ]

  return (
    <section style={styles.wrap} aria-label="How it works">
      <div style={styles.row}>
        {steps.map((s) => (
          <div key={s.num} style={styles.step}>
            <div style={styles.number}>{s.num}</div>
            <div style={{ flex: 1 }}>
              <div style={styles.title}>{s.title}</div>
              <div style={{ marginTop: 6, color: COLORS.muted, fontSize: '0.95rem' }}>{s.desc}</div>
            </div>
            <Icon name={s.icon} />
          </div>
        ))}
      </div>
    </section>
  )
}
