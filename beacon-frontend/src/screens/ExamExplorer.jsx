import React, { useState, useEffect } from 'react';
import '../styles/futuristic.css';
import ManzilHeader from '../components/ManzilHeader';

export default function ExamExplorer() {
  const [stream, setStream] = useState('All');
  const [klass, setKlass] = useState('All');
  const [selected, setSelected] = useState(null);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('beacon-theme');
    return saved !== 'light';
  });

  useEffect(() => {
    const saved = localStorage.getItem('beacon-theme');
    if (saved === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, []);

  const handleThemeToggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('beacon-theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('beacon-theme', 'light');
    }
  };

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
  ];

  const visible = examsData.filter(e => {
    const streamOk = stream === 'All' ? true : e.stream === stream;
    const classOk = klass === 'All' ? true : (e.eligibleClasses || []).includes(klass);
    return streamOk && classOk;
  });

  return (
    <div className="ft-dashboard-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ─── Navbar ─── */}
      <ManzilHeader
        title="Exam Explorer"
        right={(
          <>
            <button type="button" className="manzil-header-btn" onClick={() => { window.history.pushState({}, '', '/dashboard'); window.dispatchEvent(new PopStateEvent('popstate')); }}>
              ← Dashboard
            </button>
            <button
              type="button"
              onClick={handleThemeToggle}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.15rem', padding: 4 }}
              aria-label="Toggle Theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </>
        )}
      />

      {/* ─── Main Content ─── */}
      <main className="ft-section" style={{ flex: 1, marginTop: '2rem', paddingBottom: '3rem' }}>
        {/* Stream Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          {['All', 'Science', 'Commerce', 'Arts'].map(s => (
            <button
              key={s}
              onClick={() => setStream(s)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: stream === s ? 'var(--ft-neon-cyan)' : 'var(--ft-glass-bg)',
                color: stream === s ? '#080c24' : 'var(--ft-text-primary)',
                boxShadow: stream === s ? 'var(--ft-glow-cyan)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Class Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {['All', 'Class 9', 'Class 10', 'Class 11-12'].map(k => (
            <button
              key={k}
              onClick={() => setKlass(k)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
                background: klass === k ? 'var(--ft-neon-cyan)' : 'var(--ft-glass-bg)',
                color: klass === k ? '#080c24' : 'var(--ft-text-primary)',
                boxShadow: klass === k ? 'var(--ft-glow-cyan)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Exams Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {visible.map((e, i) => (
            <article
              key={i}
              onClick={() => setSelected(e)}
              className="ft-glass-card ft-animate-in"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 800, color: 'var(--ft-text-primary)', fontSize: '1.05rem', lineHeight: 1.35 }}>
                    {e.full} <span style={{ fontWeight: 600, color: 'var(--ft-text-secondary)', fontSize: 13 }}>({e.short})</span>
                  </div>
                  <span className={`ft-tag ft-tag--${e.stream === 'Science' ? 'cyan' : e.stream === 'Commerce' ? 'green' : 'purple'}`}>
                    {e.stream}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ft-text-secondary)', fontWeight: 700, marginBottom: 10 }}>
                  {e.body} &nbsp;•&nbsp; {e.eligibility}
                </div>
                <div style={{ color: 'var(--ft-text-muted)', fontSize: '0.87rem', lineHeight: 1.4 }}>
                  Leads to: <strong>{e.leadsTo}</strong> &nbsp;•&nbsp; Timeline: <strong>{e.month}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* ─── Detail Modal ─── */}
      {selected && (
        <div role="dialog" aria-modal style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,6,23,0.7)', zIndex: 60 }} onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="ft-glass-card ft-glow-cyan" style={{ width: 760, maxWidth: '95%', background: 'var(--ft-bg-secondary)', border: '1px solid var(--ft-glass-border)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ margin: 0, color: 'var(--ft-text-primary)', fontSize: '1.5rem', fontWeight: 800 }}>
                {selected.full} <span style={{ fontSize: 14, color: 'var(--ft-text-secondary)', fontWeight: 600 }}>({selected.short})</span>
              </h2>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'transparent', fontSize: 24, color: 'var(--ft-text-primary)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginBottom: 16, color: 'var(--ft-text-secondary)', fontSize: '0.92rem', fontWeight: 600 }}>
              <strong>Conducting Body:</strong> {selected.body} &nbsp;•&nbsp; <strong>Eligibility:</strong> {selected.eligibility}
            </div>
            <div style={{ color: 'var(--ft-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              <p style={{ marginTop: 0 }}><strong>Preparation Strategy:</strong> {selected.prep}</p>
              <p style={{ marginTop: 10 }}><strong>Number of Attempts:</strong> {selected.attempts}</p>
              <p style={{ marginTop: 10 }}>
                <strong>Official Website:</strong>{' '}
                <a href={selected.website} target="_blank" rel="noreferrer" style={{ color: 'var(--ft-neon-cyan)', textDecoration: 'underline' }}>
                  {selected.website}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
