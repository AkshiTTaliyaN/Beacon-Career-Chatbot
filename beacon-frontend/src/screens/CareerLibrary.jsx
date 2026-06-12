import React, { useState, useEffect } from 'react';
import '../styles/futuristic.css';

export default function CareerLibrary() {
  const [filter, setFilter] = useState('All');
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

  const careersData = [
    // Science
    { name: 'Software Engineer', stream: 'Science', exam: 'JEE/Main or College-specific', salary: '₹5-25 LPA', description: 'Design and build software systems and applications.' , details: 'Typically requires strong programming skills, internships, and project experience. Degree: B.Tech/B.E. or BSc Comp. Tip: Start coding small projects and learn problem solving.'},
    { name: 'Data Scientist', stream: 'Science', exam: 'JEE/College tests', salary: '₹6-30 LPA', description: 'Analyse data to build models and insights.' , details: 'Requires math, statistics and programming. Degree: B.Tech/BS + Masters. Tip: Learn Python and practice data projects.'},
    { name: 'Doctor MBBS', stream: 'Science', exam: 'NEET', salary: '₹6-30 LPA', description: 'Medical doctor treating patients and diagnosing illnesses.' , details: 'Long study path with MBBS and specialization. Tip: Focus on biology and practical exposure via volunteering.'},
    { name: 'Biotech Researcher', stream: 'Science', exam: 'University entrance / JNU / IISER tests', salary: '₹4-18 LPA', description: 'Work on biological innovations and experiments.' , details: 'Often requires BSc/MSc/PhD; lab skills and research projects help. Tip: Do school science fairs and basic lab courses.'},
    { name: 'Mechanical Engineer', stream: 'Science', exam: 'JEE Main/Advanced', salary: '₹4-12 LPA', description: 'Design and analyse mechanical systems and machines.' , details: 'Strong fundamentals in physics and mechanics required. Tip: Build model projects and learn CAD basics.'},
    // Commerce
    { name: 'Chartered Accountant', stream: 'Commerce', exam: 'CA Foundation/Intermediate/Final', salary: '₹6-30 LPA', description: 'Manage accounts, audits, and financial compliance.' , details: 'Highly qualified with professional exams; articleship provides experience. Tip: Master basics of accounting and business maths.'},
    { name: 'Investment Banker', stream: 'Commerce', exam: 'College entrance / MBA entrances', salary: '₹8-50 LPA', description: 'Advise on deals, raise capital, and manage transactions.' , details: 'Often follows finance degrees and internships; networking is critical. Tip: Learn basic finance and Excel modelling.'},
    { name: 'Business Analyst', stream: 'Commerce', exam: 'College entrance tests', salary: '₹4-20 LPA', description: 'Bridge business needs and technical teams with analysis.' , details: 'Requires domain understanding and analytical skills. Tip: Practice case studies and Excel/SQL basics.'},
    { name: 'HR Manager', stream: 'Commerce', exam: 'College admissions / MBA entrances', salary: '₹3-12 LPA', description: 'Manage recruitment, training, and employee relations.' , details: 'People skills and organizational knowledge matter. Tip: Join school leadership and learn communication skills.'},
    { name: 'Actuary', stream: 'Commerce', exam: 'Actuarial exams / entrance', salary: '₹8-35 LPA', description: 'Assess financial risk using mathematics and statistics.' , details: 'Requires passing professional actuarial exams and strong math skills. Tip: Strengthen math and probability early.'},
    // Arts
    { name: 'IAS Officer', stream: 'Arts', exam: 'UPSC Civil Services', salary: '₹6-20 LPA (varies)', description: 'Public service role involved in administration and policy.' , details: 'Competitive exam and wide reading required. Tip: Read newspapers and practise essay writing.'},
    { name: 'Lawyer', stream: 'Arts', exam: 'CLAT / AILET / College entry', salary: '₹4-30 LPA', description: 'Advise and represent clients in legal matters.' , details: 'Law degrees (LLB) and internships help; advocacy skills matter. Tip: Join debate and read judgments.'},
    { name: 'Psychologist', stream: 'Arts', exam: 'College entrance / NET for higher studies', salary: '₹3-12 LPA', description: 'Study behaviour and provide counselling.' , details: 'Requires psychology degrees; clinical practice may need higher studies. Tip: Volunteer in counselling or peer support groups.'},
    { name: 'Journalist', stream: 'Arts', exam: 'College entrance / entrance tests', salary: '₹2-15 LPA', description: 'Report news, investigate stories, and write articles.' , details: 'Practice writing, internships and a curious mindset help. Tip: Start a school newsletter and practise clear writing.'},
    { name: 'UX Designer', stream: 'Arts', exam: 'Design school entries / portfolio', salary: '₹3-15 LPA', description: 'Design intuitive user experiences and interfaces.' , details: 'Build a portfolio and learn design tools. Tip: Study design basics and create small UI projects.'},
  ];

  const filtered = careersData.filter(c => filter === 'All' ? true : c.stream === filter);

  return (
    <div className="ft-dashboard-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ─── Navbar ─── */}
      <header className="ft-navbar ft-navbar-scrolled" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 70 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => { window.history.pushState({}, '', '/dashboard'); window.dispatchEvent(new PopStateEvent('popstate')); }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ft-neon-cyan)',
              fontWeight: 800,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--ft-text-primary)' }}>Career Library</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleThemeToggle}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: 'var(--ft-neon-cyan)',
              filter: 'drop-shadow(0 0 4px var(--ft-neon-cyan))',
              transition: 'transform 0.3s ease',
            }}
            aria-label="Toggle Theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="ft-section" style={{ flex: 1, marginTop: '2rem', paddingBottom: '3rem' }}>
        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {['All', 'Science', 'Commerce', 'Arts'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.87rem',
                background: filter === f ? 'var(--ft-neon-cyan)' : 'var(--ft-glass-bg)',
                color: filter === f ? '#080c24' : 'var(--ft-text-primary)',
                boxShadow: filter === f ? 'var(--ft-glow-cyan)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Careers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((c, idx) => (
            <article
              key={idx}
              onClick={() => setSelected(c)}
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
                  <div style={{ fontWeight: 800, color: 'var(--ft-text-primary)', fontSize: '1.05rem' }}>{c.name}</div>
                  <span className={`ft-tag ft-tag--${c.stream === 'Science' ? 'cyan' : c.stream === 'Commerce' ? 'green' : 'purple'}`}>
                    {c.stream}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ft-text-secondary)', fontWeight: 700, marginBottom: 10 }}>
                  {c.exam} &nbsp;•&nbsp; {c.salary}
                </div>
                <p style={{ color: 'var(--ft-text-muted)', fontSize: '0.87rem', lineHeight: 1.5, margin: 0 }}>
                  {c.description}
                </p>
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
              <h2 style={{ margin: 0, color: 'var(--ft-text-primary)', fontSize: '1.6rem', fontWeight: 800 }}>{selected.name}</h2>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'transparent', fontSize: 24, color: 'var(--ft-text-primary)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginBottom: 16, color: 'var(--ft-text-secondary)', fontSize: '0.92rem', fontWeight: 600 }}>
              <strong>Exam:</strong> {selected.exam} &nbsp;•&nbsp; <strong>Salary:</strong> {selected.salary} &nbsp;•&nbsp; <strong>Stream:</strong> {selected.stream}
            </div>
            <div style={{ color: 'var(--ft-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              <p style={{ marginTop: 0 }}>{selected.details}</p>
              <p style={{ marginTop: 10 }}>Career path: Typically starts with undergraduate study, internships, and progressive specialization — followed by higher studies or professional certifications depending on the field.</p>
              <p style={{ marginTop: 10 }}><strong>Tip:</strong> For students in Class 8–12: {selected.description} Start small: work on simple projects, read related books, and join clubs to explore interest.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
