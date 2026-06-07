
import { ED_CIL_THEME } from '../theme.js'

export default function RiasecGate() {
  function openTest() {
    const token = localStorage.getItem('beacon_token');
    const url = token
      ? `http://localhost:3001?beacon_token=${encodeURIComponent(token)}`
      : 'http://localhost:3001';
    window.open(url, '_blank');
  }

  return (
    <div style={{
      background: `linear-gradient(135deg, ${ED_CIL_THEME.primary} 0%, ${ED_CIL_THEME.secondary} 100%)`,
      borderRadius: 16,
      padding: '2.5rem',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 200, height: 200,
        background: 'rgba(37,99,235,0.2)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -30, left: -20,
        width: 140, height: 140,
        background: 'rgba(124,58,237,0.15)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, marginBottom: 20,
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          🧠
        </div>

        {/* Heading */}
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.3 }}>
          Get your personalised career matches
        </h3>

        {/* Description */}
        <p style={{ margin: '0 0 8px 0', opacity: 0.85, lineHeight: 1.7, maxWidth: 540, fontSize: '0.95rem' }}>
          Complete the free 60-question psychometric test based on the globally validated RIASEC model.
          It takes 10–15 minutes and your results are saved to your profile automatically.
        </p>
        <p style={{ margin: '0 0 28px 0', opacity: 0.7, fontSize: '0.88rem', lineHeight: 1.6 }}>
          Your scores are then combined with your subject strengths, work preferences, and career goals
          to rank careers specifically for you — not a generic list.
        </p>

        {/* Features row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { icon: '⏱', text: '10–15 minutes' },
            { icon: '🆓', text: 'Completely free' },
            { icon: '💾', text: 'Scores saved to your profile' },
            { icon: '🌍', text: 'Globally validated framework' },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '0.5rem 0.8rem',
              fontSize: '0.85rem', fontWeight: 600,
            }}>
              <span>{icon}</span> <span>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button
            id="take-psychometric-test-btn"
            onClick={openTest}
            style={{
              background: ED_CIL_THEME.primary,
              color: '#fff',
              border: 'none',
              padding: '0.9rem 2rem',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(44,84,146,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 6px 28px rgba(44,84,146,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(44,84,146,0.35)';
            }}
          >
            Take the Psychometric Test →
          </button>
          <span style={{ opacity: 0.55, fontSize: '0.83rem' }}>
            Already taken it? Refresh this page to see your results.
          </span>
        </div>
      </div>
    </div>
  );
}
