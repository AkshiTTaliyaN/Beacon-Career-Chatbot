import React from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * A beautiful futuristic button to toggle between English-only
 * and bilingual English-Khmer mode.
 */
export default function LanguageToggle({ style = {}, className = "", ...props }) {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      className={className}
      {...props}
      onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
      style={{
        background: 'transparent',
        border: '1px solid rgba(0,212,255,0.4)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '700',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 12px',
        borderRadius: '8px',
        color: 'var(--ft-neon-cyan, #00d4ff)',
        boxShadow: '0 0 8px rgba(0,212,255,0.15)',
        textShadow: '0 0 4px rgba(0,212,255,0.4)',
        transition: 'all 0.3s ease',
        fontFamily: 'Inter, sans-serif',
        zIndex: 50,
        ...style,
      }}
      aria-label="Toggle Language"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 12px var(--ft-neon-cyan, #00d4ff)';
        e.currentTarget.style.borderColor = 'var(--ft-neon-cyan, #00d4ff)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 8px rgba(0,212,255,0.15)';
        e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {language === 'km' ? '🇰🇭 Khmer Active' : '🇬🇧 English Only'}
    </button>
  );
}
