import { ED_CIL_THEME } from '../theme.js'
import { APTITUDE_URL } from '../config.js'
import BilingualText from './BilingualText.jsx'


const COLORS = {
  navy: ED_CIL_THEME.primary,
  white: ED_CIL_THEME.surface,
}

/**
 * Dashboard banner that links out to the full psychometric test
 * (the aptitude app). The test itself, scoring, and the report all
 * live in aptitude-frontend / aptitude-backend.
 */
export default function PsychometricTest({ hasResults = false }) {
  return (
    <section style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ background: COLORS.navy, borderRadius: 12, padding: '2rem', color: COLORS.white }}>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>
          {hasResults ? (
            <BilingualText text="Your Personality Report is Ready" />
          ) : (
            <BilingualText text="Find what career suits you" />
          )}
        </h2>
        <p style={{ marginTop: '0.75rem', fontSize: '1rem', opacity: 0.95 }}>
          {hasResults ? (
            <BilingualText text="You have already completed the psychometric test. Review your detailed RIASEC personality analysis, subject profile, and recommended careers." />
          ) : (
            <BilingualText text="Answer 78 questions and discover your personality type and matching careers, completely free, no login needed" />
          )}
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {hasResults && (
            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, '', '/report');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: 10,
                border: 'none',
                background: COLORS.white,
                color: COLORS.navy,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <BilingualText text="View Full Report →" />
            </button>
          )}
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
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: 10,
              border: hasResults ? '1.5px solid #fff' : 'none',
              background: hasResults ? 'transparent' : COLORS.white,
              color: hasResults ? '#fff' : COLORS.navy,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {hasResults ? (
              <BilingualText text="Retake the Test" />
            ) : (
              <BilingualText text="Take the Test" />
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
