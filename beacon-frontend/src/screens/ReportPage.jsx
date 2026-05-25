import React from 'react'

const COLORS = {
  navy: '#07143a',
  white: '#ffffff',
  muted: '#374151',
  accent: '#2563EB',
  lightGray: '#f7f9fb'
}

// Default hardcoded report (used when no route/localStorage data available)
const DEFAULT_REPORT = {
  studentName: 'Aryan Sharma',
  class: 'Class 11',
  stream: 'PCM',
  date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
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

const CAREERS = [
  {
    name: 'Data Scientist',
    why: 'Your analytical nature and love for problem solving makes this a strong fit. You will enjoy finding patterns in data and building models.',
    stream: 'PCM',
    salary: '₹8 - 25 LPA'
  },
  {
    name: 'Research Scientist',
    why: 'Your curiosity and investigative personality aligns perfectly with research work in labs or institutions.',
    stream: 'PCM/PCB',
    salary: '₹6 - 18 LPA'
  },
  {
    name: 'Software Engineer',
    why: 'Investigative types excel at debugging, system design, and building logical solutions to complex problems.',
    stream: 'PCM',
    salary: '₹7 - 30 LPA'
  }
]

const EXAMS = [
  { exam: 'JEE Main', leadsTo: 'NITs and IIITs for engineering' },
  { exam: 'JEE Advanced', leadsTo: 'IITs' },
  { exam: 'IISER Aptitude Test', leadsTo: 'Research-focused BSc / MSc programs' },
  { exam: 'BITSAT', leadsTo: 'BITS Pilani' }
]

const SKILLS = [
  { title: 'Python programming', tip: 'Start with an NPTEL or Coursera beginner course and build small projects.' },
  { title: 'Mathematics', tip: 'Strengthen calculus and statistics; focus on Class 12 topics and problem solving.' },
  { title: 'Logical reasoning', tip: 'Practice previous year JEE problems and timed reasoning tests.' },
  { title: 'Data analysis basics', tip: 'Try Google Sheets or Excel projects with real datasets.' },
  { title: 'Scientific reading', tip: 'Read one article per week on ArXiv, ScienceDaily, or popular science outlets.' }
]

function Bar({ label, value, color }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ color: COLORS.navy, fontWeight: 700 }}>{label}</div>
        <div style={{ color: COLORS.muted }}>{pct}%</div>
      </div>
      <div style={{ background: '#e6eef9', borderRadius: 6, height: 14, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color || COLORS.accent, borderRadius: 6 }} />
      </div>
    </div>
  )
}

export default function ReportPage() {
  // Read report data from localStorage if available
  let report = DEFAULT_REPORT
  try {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem('careerReport')
      if (raw) {
        const parsed = JSON.parse(raw)
        report = { ...report, ...parsed }
        // Ensure scores present
        report.scores = { ...DEFAULT_REPORT.scores, ...(parsed.scores || {}) }
      }
    }
  } catch (e) {
    // ignore
  }

  const handlePrint = () => window.print()

  return (
    <div style={{ background: COLORS.white, color: '#111827', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, Roboto, sans-serif' }}>
      {/* Top header strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: COLORS.navy, color: COLORS.white }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>Beacon</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Beacon Personality & Career Report</div>
          <div style={{ marginTop: 6 }}>{report.studentName} • {report.class} • {report.stream}</div>
          <div style={{ marginTop: 4, fontSize: 13, opacity: 0.9 }}>{report.date}</div>
        </div>
        <div>
          <button onClick={handlePrint} style={{ background: COLORS.white, color: COLORS.navy, border: 'none', padding: '0.5rem 0.9rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>⬇ Download PDF</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
        {/* Personality section */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ color: COLORS.navy, margin: '0 0 8px 0' }}>Personality Overview</h2>

          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 140px' }}>
              <div style={{ background: '#eaf4ff', color: COLORS.accent, padding: 20, borderRadius: 8, textAlign: 'center', fontWeight: 800, fontSize: 20 }}>
                {report.topType}
              </div>
              <div style={{ marginTop: 8, color: COLORS.muted }}>Secondary: <strong>{report.secondaryType}</strong></div>
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ marginTop: 0, color: COLORS.muted, lineHeight: 1.6 }}>
                Investigative individuals are analytical, curious, and enjoy research and problem solving. You prefer working with ideas and data rather than routine tasks, and you are motivated by understanding how systems work. Deep focus, logical thinking, and a love for discovery are hallmarks of this type.
              </p>

              <div style={{ marginTop: 12 }}>
                <h4 style={{ margin: '0 0 8px 0', color: COLORS.navy }}>RIASEC Scores</h4>
                <div style={{ background: COLORS.lightGray, padding: 12, borderRadius: 8 }}>
                  <Bar label="Investigative" value={report.scores.Investigative} color="#2563EB" />
                  <Bar label="Realistic" value={report.scores.Realistic} color="#DC2626" />
                  <Bar label="Conventional" value={report.scores.Conventional} color="#059669" />
                  <Bar label="Enterprising" value={report.scores.Enterprising} color="#D97706" />
                  <Bar label="Artistic" value={report.scores.Artistic} color="#7C3AED" />
                  <Bar label="Social" value={report.scores.Social} color="#047857" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top careers */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ color: COLORS.navy, margin: '0 0 8px 0' }}>Top 3 Career Matches</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {CAREERS.map((c, i) => (
              <div key={i} style={{ borderRadius: 8, padding: 16, background: '#ffffff', boxShadow: '0 6px 18px rgba(2,6,23,0.04)', borderLeft: `4px solid ${i === 0 ? '#2563EB' : i === 1 ? '#0ea5a4' : '#7c3aed'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: COLORS.navy }}>{i + 1}. {c.name}</h3>
                  <div style={{ color: COLORS.muted, fontWeight: 700 }}>{c.salary}</div>
                </div>
                <p style={{ marginTop: 8, color: COLORS.muted }}>{c.why}</p>
                <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                  <div style={{ background: '#f0f7ff', padding: '6px 10px', borderRadius: 6, fontWeight: 700, color: '#2563EB' }}>{c.stream}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Entrance exams */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ color: COLORS.navy, margin: '0 0 8px 0' }}>Entrance Exams to Target</h2>
          <ul style={{ paddingLeft: 18, color: COLORS.muted }}>
            {EXAMS.map((e, i) => (
              <li key={i} style={{ marginBottom: 8 }}><strong>{e.exam}</strong> — {e.leadsTo}</li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ color: COLORS.navy, margin: '0 0 8px 0' }}>Skills to Build Now</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {SKILLS.map((s, i) => (
              <div key={i} style={{ background: '#ffffff', borderRadius: 8, padding: 12, boxShadow: '0 6px 18px rgba(2,6,23,0.03)' }}>
                <div style={{ fontWeight: 800, color: COLORS.navy }}>{s.title}</div>
                <div style={{ marginTop: 6, color: COLORS.muted }}>{s.tip}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ color: COLORS.navy, margin: '0 0 8px 0' }}>Closing Note</h2>
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, color: COLORS.muted }}>
            Your Investigative personality means you thrive when given complex problems to solve. The careers ahead of you are intellectually rich and financially rewarding. Start building your analytical skills now — learn Python, strengthen your mathematics, and practice real-world data projects. With steady focus and curiosity, the right path will become clear. Share this report with your parents and teachers to plan the next steps together.
          </div>
        </section>

        <footer style={{ color: COLORS.muted, fontSize: 13, textAlign: 'center', padding: '1rem 0 4rem 0' }}>
          Beacon © 2026 — This report is an illustrative guide based on an assessment. For personalised counselling contact our team.
        </footer>
      </div>

      <style>{`@media print { button { display:none } .no-print { display: none } }`}</style>
    </div>
  )
}
