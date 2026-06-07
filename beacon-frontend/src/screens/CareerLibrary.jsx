import React, { useState } from 'react'
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

const careersData = [
  // Science (5)
  { name: 'Software Engineer', stream: 'Science', exam: 'JEE/Main or College-specific', salary: '₹5-25 LPA', description: 'Design and build software systems and applications.' , details: 'Typically requires strong programming skills, internships, and project experience. Degree: B.Tech/B.E. or BSc Comp. Tip: Start coding small projects and learn problem solving.'},
  { name: 'Data Scientist', stream: 'Science', exam: 'JEE/College tests', salary: '₹6-30 LPA', description: 'Analyse data to build models and insights.' , details: 'Requires math, statistics and programming. Degree: B.Tech/BS + Masters. Tip: Learn Python and practice data projects.'},
  { name: 'Doctor MBBS', stream: 'Science', exam: 'NEET', salary: '₹6-30 LPA', description: 'Medical doctor treating patients and diagnosing illnesses.' , details: 'Long study path with MBBS and specialization. Tip: Focus on biology and practical exposure via volunteering.'},
  { name: 'Biotech Researcher', stream: 'Science', exam: 'University entrance / JNU / IISER tests', salary: '₹4-18 LPA', description: 'Work on biological innovations and experiments.' , details: 'Often requires BSc/MSc/PhD; lab skills and research projects help. Tip: Do school science fairs and basic lab courses.'},
  { name: 'Mechanical Engineer', stream: 'Science', exam: 'JEE Main/Advanced', salary: '₹4-12 LPA', description: 'Design and analyse mechanical systems and machines.' , details: 'Strong fundamentals in physics and mechanics required. Tip: Build model projects and learn CAD basics.'},

  // Commerce (5)
  { name: 'Chartered Accountant', stream: 'Commerce', exam: 'CA Foundation/Intermediate/Final', salary: '₹6-30 LPA', description: 'Manage accounts, audits, and financial compliance.' , details: 'Highly qualified with professional exams; articleship provides experience. Tip: Master basics of accounting and business maths.'},
  { name: 'Investment Banker', stream: 'Commerce', exam: 'College entrance / MBA entrances', salary: '₹8-50 LPA', description: 'Advise on deals, raise capital, and manage transactions.' , details: 'Often follows finance degrees and internships; networking is critical. Tip: Learn basic finance and Excel modelling.'},
  { name: 'Business Analyst', stream: 'Commerce', exam: 'College entrance tests', salary: '₹4-20 LPA', description: 'Bridge business needs and technical teams with analysis.' , details: 'Requires domain understanding and analytical skills. Tip: Practice case studies and Excel/SQL basics.'},
  { name: 'HR Manager', stream: 'Commerce', exam: 'College admissions / MBA entrances', salary: '₹3-12 LPA', description: 'Manage recruitment, training, and employee relations.' , details: 'People skills and organizational knowledge matter. Tip: Join school leadership and learn communication skills.'},
  { name: 'Actuary', stream: 'Commerce', exam: 'Actuarial exams / entrance', salary: '₹8-35 LPA', description: 'Assess financial risk using mathematics and statistics.' , details: 'Requires passing professional actuarial exams and strong math skills. Tip: Strengthen math and probability early.'},

  // Arts (5)
  { name: 'IAS Officer', stream: 'Arts', exam: 'UPSC Civil Services', salary: '₹6-20 LPA (varies)', description: 'Public service role involved in administration and policy.' , details: 'Competitive exam and wide reading required. Tip: Read newspapers and practise essay writing.'},
  { name: 'Lawyer', stream: 'Arts', exam: 'CLAT / AILET / College entry', salary: '₹4-30 LPA', description: 'Advise and represent clients in legal matters.' , details: 'Law degrees (LLB) and internships help; advocacy skills matter. Tip: Join debate and read judgments.'},
  { name: 'Psychologist', stream: 'Arts', exam: 'College entrance / NET for higher studies', salary: '₹3-12 LPA', description: 'Study behaviour and provide counselling.' , details: 'Requires psychology degrees; clinical practice may need higher studies. Tip: Volunteer in counselling or peer support groups.'},
  { name: 'Journalist', stream: 'Arts', exam: 'College entrance / entrance tests', salary: '₹2-15 LPA', description: 'Report news, investigate stories, and write articles.' , details: 'Practice writing, internships and a curious mindset help. Tip: Start a school newsletter and practise clear writing.'},
  { name: 'UX Designer', stream: 'Arts', exam: 'Design school entries / portfolio', salary: '₹3-15 LPA', description: 'Design intuitive user experiences and interfaces.' , details: 'Build a portfolio and learn design tools. Tip: Study design basics and create small UI projects.'},
]

export default function CareerLibrary() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = careersData.filter(c => filter === 'All' ? true : c.stream === filter)

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, Roboto, sans-serif', minHeight: '100vh', background: COLORS.white }}>
      <header style={{ background: COLORS.navy, color: COLORS.white, padding: '2.25rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Career Library</h1>
          <p style={{ marginTop: 8, opacity: 0.9 }}>Browse 80+ careers across all streams — find what suits you.</p>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {['All','Science','Commerce','Arts'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.6rem 0.9rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700,
                background: filter === f ? COLORS.navy : COLORS.lightGray, color: filter === f ? COLORS.white : COLORS.navy
              }}
            >{f}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {filtered.map((c, idx) => (
            <article key={idx} onClick={() => setSelected(c)} style={{ cursor: 'pointer', borderRadius: 12, padding: 16, background: '#fff', boxShadow: '0 6px 18px rgba(44,84,146,0.10)', border: '1px solid rgba(44,84,146,0.12)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 800, color: COLORS.navy }}>{c.name}</div>
                <div style={{ fontWeight: 800, padding: '4px 8px', borderRadius: 8, fontSize: 12, color: '#fff', background: c.stream === 'Science' ? COLORS.blue : c.stream === 'Commerce' ? COLORS.green : COLORS.purple }}>{c.stream}</div>
              </div>
              <div style={{ marginTop: 8, color: COLORS.muted, fontWeight: 700 }}>{c.exam} • {c.salary}</div>
              <p style={{ marginTop: 10, color: COLORS.muted }}>{c.description}</p>
            </article>
          ))}
        </div>
      </main>

      {selected && (
        <div role="dialog" aria-modal style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.5)', zIndex: 60 }} onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 760, maxWidth: '95%', background: '#fff', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: COLORS.navy }}>{selected.name}</h2>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginTop: 10, color: COLORS.muted }}>{selected.exam} • {selected.salary} • <strong>{selected.stream}</strong></div>
            <div style={{ marginTop: 14, color: COLORS.muted }}>
              <p style={{ marginTop: 0 }}>{selected.details}</p>
              <p style={{ marginTop: 8 }}>Career path: Typically starts with undergraduate study, internships, and progressive specialization — followed by higher studies or professional certifications depending on the field.</p>
              <p style={{ marginTop: 8 }}><strong>Tip:</strong> For students in Class 8–12: {selected.description} Start small: work on simple projects, read related books, and join clubs to explore interest.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
