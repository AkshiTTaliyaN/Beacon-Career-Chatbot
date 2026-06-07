import { useState } from 'react'
import { ED_CIL_THEME } from '../theme.js'

const COLORS = {
  navy: ED_CIL_THEME.primary,
  white: ED_CIL_THEME.surface,
  muted: '#556d8f',
  blue: ED_CIL_THEME.primary,
  green: '#059669',
  purple: '#7c3aed',
  lightGray: '#eef4ff'
}

const examsData = [
  // Science
  {
    full: 'Joint Entrance Examination - Main',
    short: 'JEE Main',
    stream: 'Science',
    body: 'NTA',
    eligibility: 'Class 12 (PCM)',
    leadsTo: 'NITs, IIITs, GFTIs',
    month: 'Jan & Apr',
    eligibleClasses: ['Class 11-12'] ,
    prep: 'Build strong physics, chemistry and math foundations; practice previous papers and timed tests.',
    attempts: 'Multiple attempts per year (as per NTA rules)',
    website: 'https://jeemain.nta.nic.in'
  },
  {
    full: 'Joint Entrance Examination - Advanced',
    short: 'JEE Advanced',
    stream: 'Science',
    body: 'IITs',
    eligibility: 'JEE Main qualifiers',
    leadsTo: 'IITs',
    month: 'May',
    eligibleClasses: ['Class 11-12'],
    prep: 'Topical depth in maths and physics; solve concept-level problems and timed mock tests.',
    attempts: 'Usually 2-3 attempts depending on eligibility',
    website: 'https://jeeadv.ac.in'
  },
  {
    full: 'National Eligibility cum Entrance Test - UG',
    short: 'NEET UG',
    stream: 'Science',
    body: 'NTA',
    eligibility: 'Class 12 (PCB)',
    leadsTo: 'MBBS, BDS',
    month: 'May',
    eligibleClasses: ['Class 11-12'],
    prep: 'Strong biology fundamentals and regular practice of MCQs; clear concepts early.',
    attempts: 'As per NTA rules',
    website: 'https://neet.nta.nic.in'
  },
  {
    full: 'BITS Admission Test',
    short: 'BITSAT',
    stream: 'Science',
    body: 'BITS Pilani',
    eligibility: 'Class 12 (PCM)',
    leadsTo: 'BITS Pilani admissions',
    month: 'May-Jun',
    eligibleClasses: ['Class 11-12'],
    prep: 'Practice physics, chemistry and math; speed and accuracy matter for this computer-based test.',
    attempts: 'One attempt per year',
    website: 'https://www.bits-pilani.ac.in'
  },
  {
    full: 'IISER Aptitude Test',
    short: 'IISER Aptitude Test',
    stream: 'Science',
    body: 'IISERs',
    eligibility: 'Class 12 (PCM)',
    leadsTo: 'BS/MS and research programs',
    month: 'June',
    eligibleClasses: ['Class 11-12'],
    prep: 'Focus on science fundamentals and analytical thinking; practice past aptitude papers.',
    attempts: 'One per year',
    website: 'https://www.iiseradmission.in'
  },

  // Commerce
  {
    full: 'CA Foundation / CA Exams',
    short: 'CA Foundation',
    stream: 'Commerce',
    body: 'ICAI',
    eligibility: 'Class 12 (Commerce preferred)',
    leadsTo: 'Chartered Accountancy',
    month: 'May & Nov',
    eligibleClasses: ['Class 11-12'],
    prep: 'Learn accounting basics and business mathematics; consider foundation coaching and practice.' ,
    attempts: 'Multiple attempts as per schedule',
    website: 'https://www.icai.org'
  },
  {
    full: 'Common University Entrance Test - Undergraduate',
    short: 'CUET UG',
    stream: 'Commerce',
    body: 'NTA',
    eligibility: 'Class 12 (all streams)',
    leadsTo: 'Central university admissions',
    month: 'May-Jun',
    eligibleClasses: ['Class 11-12'],
    prep: 'Build domain knowledge and general aptitude; practise mock CUET papers and time management.',
    attempts: 'As per NTA',
    website: 'https://cuet.samarth.ac.in'
  },
  {
    full: 'Common Admission Test',
    short: 'CAT',
    stream: 'Commerce',
    body: 'IIMs',
    eligibility: 'Graduates',
    leadsTo: 'MBA admissions',
    month: 'Nov',
    eligibleClasses: [],
    prep: 'Develop quantitative aptitude, verbal ability and logical reasoning with timed mocks.',
    attempts: 'Typically once a year',
    website: 'https://iimcat.ac.in'
  },

  // Arts
  {
    full: 'Common Law Admission Test',
    short: 'CLAT',
    stream: 'Arts',
    body: 'NLU Consortium',
    eligibility: 'Class 12 (all streams)',
    leadsTo: 'NLU law admissions',
    month: 'May',
    eligibleClasses: ['Class 11-12'],
    prep: 'Read comprehension, logical reasoning and basics of general knowledge; practise previous papers.',
    attempts: 'As per consortium rules',
    website: 'https://consortiumofnlus.ac.in'
  },
  {
    full: 'UPSC Civil Services Examination',
    short: 'UPSC CSE',
    stream: 'Arts',
    body: 'UPSC',
    eligibility: 'Graduates',
    leadsTo: 'IAS, IPS, IFS and other services',
    month: 'June (Prelims typically)',
    eligibleClasses: [],
    prep: 'Wide reading, current affairs and answer writing practice are essential for long-term preparation.',
    attempts: 'Limited attempts based on category',
    website: 'https://www.upsc.gov.in'
  },
  {
    full: 'National Institute of Design - Design Aptitude Test',
    short: 'NID DAT',
    stream: 'Arts',
    body: 'NID',
    eligibility: 'Class 12 (all streams)',
    leadsTo: 'Design programs',
    month: 'Jan',
    eligibleClasses: ['Class 11-12'],
    prep: 'Build a design portfolio, practice sketching and visual thinking exercises.',
    attempts: 'One per cycle',
    website: 'https://www.nid.edu'
  }
]

export default function ExamExplorer() {
  const [stream, setStream] = useState('All')
  const [klass, setKlass] = useState('All')
  const [selected, setSelected] = useState(null)

  const visible = examsData.filter(e => {
    const streamOk = stream === 'All' ? true : e.stream === stream
    const classOk = klass === 'All' ? true : (e.eligibleClasses || []).includes(klass)
    return streamOk && classOk
  })

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, Roboto, sans-serif', background: '#fff' }}>
      <header style={{ background: COLORS.navy, color: '#fff', padding: '2rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Exam Explorer</h1>
          <p style={{ marginTop: 8, opacity: 0.9 }}>Find every major Indian entrance exam — filter by stream and class.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {['All','Science','Commerce','Arts'].map(s => (
            <button key={s} onClick={() => setStream(s)} style={{ padding: '0.55rem 0.8rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, background: stream===s ? COLORS.navy : COLORS.lightGray, color: stream===s ? '#fff' : COLORS.navy }}>{s}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {['All','Class 8-9','Class 10','Class 11-12'].map(k => (
            <button key={k} onClick={() => setKlass(k)} style={{ padding: '0.45rem 0.7rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, background: klass===k ? COLORS.navy : COLORS.lightGray, color: klass===k ? '#fff' : COLORS.navy }}>{k}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {visible.map((e, i) => (
            <article key={i} onClick={() => setSelected(e)} style={{ cursor: 'pointer', borderRadius: 12, padding: 16, background: '#fff', boxShadow: '0 6px 18px rgba(44,84,146,0.10)', border: '1px solid rgba(44,84,146,0.12)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, color: COLORS.navy }}>{e.full} <span style={{ fontWeight: 700, color: COLORS.muted, fontSize: 13 }}>({e.short})</span></div>
                </div>
                <div style={{ fontWeight: 800, padding: '4px 8px', borderRadius: 8, fontSize: 12, color: '#fff', background: e.stream === 'Science' ? COLORS.blue : e.stream === 'Commerce' ? COLORS.green : COLORS.purple }}>{e.stream}</div>
              </div>
              <div style={{ marginTop: 8, color: COLORS.muted, fontWeight: 700 }}>{e.body} • {e.eligibility}</div>
              <div style={{ marginTop: 10, color: COLORS.muted }}>{e.leadsTo} • <strong>{e.month}</strong></div>
            </article>
          ))}
        </div>
      </main>

      {selected && (
        <div role="dialog" aria-modal style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.5)', zIndex: 60 }} onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 760, maxWidth: '95%', background: '#fff', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: COLORS.navy }}>{selected.full} <span style={{ fontSize: 14, color: COLORS.muted }}>({selected.short})</span></h2>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginTop: 10, color: COLORS.muted }}>{selected.body} • {selected.eligibility}</div>
            <div style={{ marginTop: 14, color: COLORS.muted }}>
              <p style={{ marginTop: 0 }}>{selected.prep}</p>
              <p style={{ marginTop: 8 }}>Attempts: {selected.attempts}</p>
              <p style={{ marginTop: 8 }}>Official site: <a href={selected.website} target="_blank" rel="noreferrer" style={{ color: COLORS.blue }}>{selected.website}</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
