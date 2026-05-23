import React from 'react'

const COLORS = {
  navy: '#07143a',
  white: '#ffffff',
  muted: 'rgba(255,255,255,0.85)',
  badgeBg: 'rgba(255,255,255,0.06)'
}

const styles = {
  hero: {
    background: COLORS.navy,
    color: COLORS.white,
    padding: '4.5rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    maxWidth: 980,
    width: '100%',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.25rem',
    lineHeight: 1.05,
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.01em'
  },
  subtitle: {
    marginTop: '0.75rem',
    color: COLORS.muted,
    fontSize: '1.05rem'
  },
  ctaWrap: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'center'
  },
  cta: {
    background: COLORS.white,
    color: COLORS.navy,
    border: 'none',
    padding: '0.9rem 1.3rem',
    fontSize: '1rem',
    fontWeight: 700,
    borderRadius: 10,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(7,20,58,0.35)'
  },
  badges: {
    display: 'flex',
    gap: '0.6rem',
    justifyContent: 'center',
    marginTop: '1.35rem',
    padding: 0,
    listStyle: 'none'
  },
  badge: {
    background: COLORS.badgeBg,
    color: COLORS.white,
    padding: '0.45rem 0.85rem',
    borderRadius: 999,
    fontSize: '0.9rem',
    fontWeight: 600
  }
}

export default function HeroSection({
  title = 'Career guidance simplified for students',
  subtitle = 'Free, quick guidance for Indian students in Classes 8–12',
  primaryText = 'Start Free Test',
  onPrimary = null,
  secondaryText = null,
  onSecondary = null,
  children = null,
}) {
  return (
    <section style={styles.hero} aria-label="CareerCompass hero">
      <div style={styles.container}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>

        <div style={styles.ctaWrap}>
          <button
            type="button"
            style={styles.cta}
            onClick={onPrimary || (() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))}
          >
            {primaryText}
          </button>
          {secondaryText ? (
            <button
              type="button"
              style={{ ...styles.cta, background: 'transparent', color: COLORS.white, border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'none' }}
              onClick={onSecondary}
            >
              {secondaryText}
            </button>
          ) : null}
        </div>

        <ul style={styles.badges} aria-hidden={false}>
          <li style={styles.badge}>Free Forever</li>
          <li style={styles.badge}>No Login Needed</li>
          <li style={styles.badge}>All Streams Covered</li>
        </ul>
        {children}
      </div>
    </section>
  )
}
