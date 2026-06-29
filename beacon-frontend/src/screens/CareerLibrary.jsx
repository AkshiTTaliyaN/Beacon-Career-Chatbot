import React, { useState, useEffect } from 'react';
import '../styles/futuristic.css';
import { getCareerCatalog } from '../api/client';
import ManzilHeader from '../components/ManzilHeader';
import LanguageToggle from '../components/LanguageToggle.jsx';

export default function CareerLibrary() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [careersData, setCareersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    setLoading(true);
    getCareerCatalog()
      .then(data => {
        setCareersData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load career library.');
        setLoading(false);
      });
  }, []);

  const filtered = careersData.filter(c => filter === 'All' ? true : c.stream === filter);

  return (
    <div className="ft-dashboard-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ─── Navbar ─── */}
      <ManzilHeader
        title="Career Library"
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
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--ft-text-secondary)', fontWeight: 700 }}>
            Loading career library...
          </div>
        ) : error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: 'var(--ft-text-secondary)' }}>
            <p style={{ fontWeight: 700, color: 'red', marginBottom: 12 }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ padding: '0.6rem 1.2rem', borderRadius: 10, background: 'var(--ft-neon-cyan)', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#080c24' }}>Retry</button>
          </div>
        ) : (
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
        )}
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
              <p style={{ marginTop: 10 }}><strong>Tip:</strong> For students in Class 9–12: {selected.description} Start small: work on simple projects, read related books, and join clubs to explore interest.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
