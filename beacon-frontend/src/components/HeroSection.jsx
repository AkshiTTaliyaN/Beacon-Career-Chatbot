import React from 'react'
import { ED_CIL_THEME } from '../theme.js'

const COLORS = {
  navy: ED_CIL_THEME.primary,
  white: ED_CIL_THEME.surface,
  muted: 'rgba(255,255,255,0.92)',
  badgeBg: 'rgba(255,255,255,0.12)'
}

const styles = {
  hero: {
    background: ED_CIL_THEME.primary,
    backgroundImage: 'radial-gradient(ellipse at top, rgba(44,84,146,0.22) 0%, transparent 70%)',
    color: COLORS.white,
    padding: '7rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    maxWidth: 980,
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 32,
    width: '100%'
  },
  logo: {
    height: 'clamp(160px, 12vw, 224px)',
    width: 'auto',
    maxWidth: 360,
    objectFit: 'contain'
  },
  title: {
    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
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
    justifyContent: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap'
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
    boxShadow: '0 6px 18px rgba(44,84,146,0.22)'
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
  logoSrc = null,
  logoAlt = 'EdCIL Logo',
  children = null,
}) {
  return (
    <section style={styles.hero} aria-label="Beacon hero">
      <div style={styles.container}>
        {logoSrc ? (
          <div style={styles.logoWrap}>
            <img src={logoSrc} alt={logoAlt} style={styles.logo} />
          </div>
        ) : null}

        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>

        <div style={styles.ctaWrap}>
          {primaryText === 'Start Free Test' ? (
            <button
              type="button"
              className="dashboard-button"
              style={styles.cta}
              onClick={() => window.open('http://localhost:3001', '_blank')}
            >
              {primaryText}
            </button>
          ) : (
            <button
              type="button"
              className="dashboard-button"
              style={styles.cta}
              onClick={onPrimary || (() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))}
            >
              {primaryText}
            </button>
          )}

          {secondaryText ? (
            secondaryText === 'Take Psychometric Test' ? (
              <button
                type="button"
                className="dashboard-button secondary"
                style={{ ...styles.cta, background: 'transparent', color: COLORS.white, border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'none' }}
                onClick={() => window.open('http://localhost:3001', '_blank')}
              >
                {secondaryText}
              </button>
            ) : (
              <button
                type="button"
                className="dashboard-button secondary"
                style={{ ...styles.cta, background: 'transparent', color: COLORS.white, border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'none' }}
                onClick={onSecondary}
              >
                {secondaryText}
              </button>
            )
          ) : null}
        </div>

        {children}
      </div>
    </section>
  )
}
