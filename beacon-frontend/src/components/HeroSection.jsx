import React from 'react'
import '../styles/futuristic.css'
import { APTITUDE_URL } from '../config.js'
import BilingualText from './BilingualText.jsx'


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
    <section
      aria-label="Manzil hero"
      style={{
        background: 'linear-gradient(180deg, #0d1333 0%, #111842 40%, #161d55 100%)',
        position: 'relative',
        overflow: 'hidden',
        color: 'rgba(255,255,255,0.95)',
        padding: '7rem 1rem 6rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* ── Decorative background grid + orbs ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,212,255,0.03) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(0,212,255,0.03) 0px, transparent 1px, transparent 60px)',
      }} />
      {/* Orb top-right */}
      <div style={{
        position: 'absolute', top: -80, right: -60, width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'ft-float 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      {/* Orb bottom-left */}
      <div style={{
        position: 'absolute', bottom: -60, left: -40, width: 250, height: 250,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'ft-float 8s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* ── Content ── */}
      <div style={{
        maxWidth: 980, width: '100%', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>
        {logoSrc && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, width: '100%' }}>
            <img
              src={logoSrc}
              alt={logoAlt}
              style={{
                height: 'clamp(140px, 12vw, 200px)',
                width: 'auto',
                maxWidth: 340,
                objectFit: 'contain',
                borderRadius: 16,
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        )}

        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          lineHeight: 1.1,
          fontWeight: 800,
          margin: 0,
          letterSpacing: '-0.02em',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}>
          <BilingualText text={title} />
        </h1>
        <p style={{
          marginTop: '0.85rem',
          color: 'rgba(255,255,255,0.65)',
          fontSize: '1.08rem',
          lineHeight: 1.5,
          maxWidth: 580,
        }}>
          <BilingualText text={subtitle} />
        </p>

        <div style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.85rem',
          flexWrap: 'wrap',
        }}>
          {primaryText && (
            <button
              type="button"
              className="ft-button-primary"
              onClick={onPrimary || (() => window.open(APTITUDE_URL, '_blank'))}
              style={{ fontSize: '1rem', padding: '0.95rem 1.8rem' }}
            >
              {primaryText}
            </button>
          )}
          {secondaryText && (
            <button
              type="button"
              className="ft-button-secondary"
              onClick={onSecondary || (() => window.open(APTITUDE_URL, '_blank'))}
              style={{ fontSize: '1rem', padding: '0.95rem 1.8rem' }}
            >
              {secondaryText}
            </button>
          )}
        </div>

        {children}
      </div>
    </section>
  )
}
