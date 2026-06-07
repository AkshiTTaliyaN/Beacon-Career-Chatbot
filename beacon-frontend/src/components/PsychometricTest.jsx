import React, { useState } from 'react'
import { ED_CIL_THEME } from '../theme.js'

const COLORS = {
  navy: ED_CIL_THEME.primary,
  white: ED_CIL_THEME.surface,
  muted: 'rgba(16,40,73,0.7)',
  lightMuted: 'rgba(16,40,73,0.4)'
}

// RIASEC questions (2-3 per type)
const QUESTIONS = [
  { id: 1, text: 'Building or fixing things with your hands', type: 'R' },
  { id: 2, text: 'Working with machines or tools', type: 'R' },
  { id: 3, text: 'Solving complex problems and puzzles', type: 'I' },
  { id: 4, text: 'Researching and learning new information', type: 'I' },
  { id: 5, text: 'Exploring scientific concepts', type: 'I' },
  { id: 6, text: 'Creating art, music, or design', type: 'A' },
  { id: 7, text: 'Expressing yourself through writing or performance', type: 'A' },
  { id: 8, text: 'Helping others and solving people problems', type: 'S' },
  { id: 9, text: 'Teaching or mentoring others', type: 'S' },
  { id: 10, text: 'Working in teams and building relationships', type: 'S' },
  { id: 11, text: 'Leading a group or making decisions', type: 'E' },
  { id: 12, text: 'Starting a business or managing projects', type: 'E' },
  { id: 13, text: 'Organizing and planning details', type: 'C' },
  { id: 14, text: 'Following procedures and rules', type: 'C' },
  { id: 15, text: 'Working with numbers and data', type: 'C' },
]

const RESULT_TYPES = {
  R: { name: 'Realistic', desc: 'You are practical, hands-on, and enjoy working with tools and technology. You prefer concrete tasks and solving real-world problems.', careers: ['Engineer', 'Mechanic', 'Electrician', 'Carpenter', 'Pilot'] },
  I: { name: 'Investigative', desc: 'You are analytical, curious, and enjoy research. You like solving puzzles and understanding how things work.', careers: ['Scientist', 'Researcher', 'Mathematician', 'Software Developer', 'Doctor'] },
  A: { name: 'Artistic', desc: 'You are creative, expressive, and enjoy making things that are beautiful or meaningful. You think outside the box.', careers: ['Designer', 'Artist', 'Musician', 'Architect', 'Animator'] },
  S: { name: 'Social', desc: 'You are empathetic, enjoy helping others, and excel in team environments. People skills are your strength.', careers: ['Teacher', 'Counsellor', 'Nurse', 'Social Worker', 'HR Manager'] },
  E: { name: 'Enterprising', desc: 'You are ambitious, persuasive, and natural at leading. You enjoy challenges and influencing others.', careers: ['Manager', 'Entrepreneur', 'Politician', 'Salesperson', 'Executive'] },
  C: { name: 'Conventional', desc: 'You are detail-oriented, organized, and like structure. You excel at systems and following processes.', careers: ['Accountant', 'Administrator', 'Data Analyst', 'Auditor', 'Banker'] },
}

function ScaleInput({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            border: value === n ? 'none' : `2px solid ${COLORS.lightMuted}`,
            background: value === n ? COLORS.navy : COLORS.white,
            color: value === n ? COLORS.white : COLORS.navy,
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {n}
        </button>
      ))}
      <div style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: COLORS.lightMuted, display: 'flex', alignItems: 'center' }}>
        {value === 1 && 'Not interested'}
        {value === 2 && 'Somewhat'}
        {value === 3 && 'Neutral'}
        {value === 4 && 'Interested'}
        {value === 5 && 'Very interested'}
      </div>
    </div>
  )
}

export default function PsychometricTest({ isEmbedded = false }) {
  const [testStarted, setTestStarted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [resultsShown, setResultsShown] = useState(false)
  const [topType, setTopType] = useState(null)

  const handleAnswerChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const handleSubmit = () => {
    // For now, persist a report object into localStorage and navigate to /report
    // Using the requested hardcoded values for the report page
    const report = {
      studentName: 'Aryan Sharma',
      class: 'Class 11',
      stream: 'PCM',
      date: new Date().toISOString(),
      topType: 'Investigative',
      secondaryType: 'Realistic',
      scores: {
        Realistic: 72,
        Investigative: 89,
        Artistic: 45,
        Social: 38,
        Enterprising: 55,
        Conventional: 61
      }
    }

    try {
      window.localStorage.setItem('careerReport', JSON.stringify(report))
    } catch (e) {
      /* ignore storage errors */
    }

    // Navigate to /report — main entry will render ReportPage
    window.history.pushState({}, '', '/report')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const allAnswered = QUESTIONS.length === Object.keys(answers).length && Object.values(answers).every((v) => v > 0)

  if (resultsShown && topType) {
    const result = RESULT_TYPES[topType]
    return (
      <section style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ background: COLORS.white, borderRadius: 12, padding: '2rem', boxShadow: '0 6px 18px rgba(44,84,146,0.06)', border: `1px solid ${ED_CIL_THEME.border}` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: COLORS.navy, marginBottom: '0.5rem' }}>{topType}</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: COLORS.navy, margin: 0 }}>{result.name} Type</h2>
            <p style={{ marginTop: '1rem', color: COLORS.muted, lineHeight: 1.6, maxWidth: 600, margin: '1rem auto' }}>{result.desc}</p>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid rgba(44,84,146,0.15)` }}>
              <h3 style={{ color: COLORS.navy, fontWeight: 700, marginBottom: '1rem' }}>Careers that match your type</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {result.careers.map((career, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', borderRadius: 8, background: 'rgba(44,84,146,0.08)', color: COLORS.navy, fontWeight: 600, textAlign: 'center' }}>
                    {career}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setTestStarted(false)
                setResultsShown(false)
                setAnswers({})
                setTopType(null)
              }}
              style={{ marginTop: '1.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, border: 'none', background: COLORS.navy, color: COLORS.white, fontWeight: 700, cursor: 'pointer' }}
            >
              Take Test Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (testStarted) {
    return (
      <section style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
        <button onClick={() => setTestStarted(false)} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', borderRadius: 8, border: 'none', background: COLORS.lightMuted, color: COLORS.white, fontWeight: 600, cursor: 'pointer' }}>
          ← Back
        </button>

        <div style={{ background: COLORS.white, borderRadius: 12, padding: '1.5rem', boxShadow: '0 6px 18px rgba(44,84,146,0.06)' }}>
          <h2 style={{ color: COLORS.navy, fontWeight: 800, marginBottom: '0.5rem' }}>Beacon Personality Test</h2>
          <p style={{ color: COLORS.muted, fontSize: '0.95rem', marginBottom: '1.5rem' }}>Answer each question on a scale of 1 (Not interested) to 5 (Very interested)</p>

          <div style={{ marginBottom: '2rem' }}>
            {QUESTIONS.map((q, idx) => (
              <div key={q.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: idx < QUESTIONS.length - 1 ? `1px solid rgba(44,84,146,0.12)` : 'none' }}>
                <div style={{ fontWeight: 600, color: COLORS.navy, marginBottom: '0.5rem' }}>
                  {idx + 1}. {q.text}
                </div>
                <ScaleInput value={answers[q.id] || 0} onChange={(v) => handleAnswerChange(q.id, v)} />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 10,
              border: 'none',
              background: allAnswered ? COLORS.navy : 'rgba(44,84,146,0.22)',
              color: COLORS.white,
              fontWeight: 700,
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              fontSize: '1rem'
            }}
          >
            {allAnswered ? 'See Your Results' : `Answer all questions (${Object.keys(answers).filter((k) => answers[k] > 0).length}/${QUESTIONS.length})`}
          </button>
        </div>
      </section>
    )
  }

  // Banner mode
  return (
    <section style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ background: COLORS.navy, borderRadius: 12, padding: '2rem', color: COLORS.white }}>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>Find what career suits you</h2>
        <p style={{ marginTop: '0.75rem', fontSize: '1rem', opacity: 0.95 }}>Answer 60 questions and discover your personality type and matching careers — completely free, no login needed</p>
        <button
          type="button"
          onClick={() => window.open('http://localhost:3001', '_blank')}
          style={{ marginTop: '1rem', padding: '0.75rem 1.25rem', borderRadius: 10, border: 'none', background: COLORS.white, color: COLORS.navy, fontWeight: 700, cursor: 'pointer' }}
        >
          Take the Test
        </button>
      </div>
    </section>
  )
}
