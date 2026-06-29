import React, { useState, useEffect } from 'react';
import { GlassCard, RadialGauge } from '../components/FuturisticCharts.jsx';
import { consultExpert, getExpertCareers } from '../api/client.js';
import ManzilHeader from '../components/ManzilHeader';
import EdCilLogo from '../assets/edcil.jpeg';
import LanguageToggle from '../components/LanguageToggle.jsx';
import '../styles/futuristic.css';
import './ExpertSystemScreen.css';

export default function ExpertSystemScreen() {
  const [careersList, setCareersList] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState(null);
  const [error, setError] = useState(null);
  
  // Interactive checklist state
  const [checkedItems, setCheckedItems] = useState({});



  // 1. Fetch careers list and parse query parameter on mount
  useEffect(() => {
    getExpertCareers()
      .then((list) => {
        setCareersList(list);
        
        const params = new URLSearchParams(window.location.search);
        const urlCareer = params.get('career');
        if (urlCareer && list.includes(urlCareer)) {
          setSelectedCareer(urlCareer);
        } else if (list.length > 0) {
          // Fallback to urlCareer even if not in list (for dynamic safety) or the first item
          setSelectedCareer(urlCareer || list[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to load expert careers:', err);
        setError('Failed to load career catalog. Please verify your connection.');
        setLoading(false);
      });
  }, []);

  // 2. Fetch consultation report when selected career changes
  useEffect(() => {
    if (!selectedCareer) return;

    let active = true;
    const fetchConsultation = async () => {
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      setError(null);
      setCheckedItems({}); // reset checklist

      try {
        const res = await consultExpert(selectedCareer);
        if (active) {
          setConsultation(res);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error('Failed to run consultation:', err);
          setError('Could not compile the expert diagnostic. Make sure your onboarding profile is complete.');
          setLoading(false);
        }
      }
    };

    fetchConsultation();
    return () => {
      active = false;
    };
  }, [selectedCareer]);

  // Handle dropdown or backup career click
  const handleCareerChange = (careerTitle) => {
    setSelectedCareer(careerTitle);
    window.history.pushState({}, '', `/expert?career=${encodeURIComponent(careerTitle)}`);
  };

  const navigateToDashboard = () => {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Get status color & badge text
  const getStatusConfig = (status) => {
    switch (status) {
      case 'green':
        return { color: '#00ff88', text: 'High Compatibility', glowClass: 'ft-glow-green' };
      case 'amber':
        return { color: '#f59e0b', text: 'Moderate Match', glowClass: 'ft-glow-amber' };
      case 'red':
      default:
        return { color: '#ff006e', text: 'Requires Development', glowClass: 'ft-glow-magenta' };
    }
  };

  return (
    <div className="ft-dashboard-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ─── Navbar ─── */}
      <ManzilHeader
        title="AI Expert Consultation"
        className="no-print"
        right={(
          <>
            <button type="button" className="manzil-header-btn" onClick={navigateToDashboard}>
              ← Dashboard
            </button>

          </>
        )}
      />

      {/* ─── Main Content ─── */}
      <main className="expert-screen ft-section" style={{ flex: 1 }}>
        
        {/* Printable Letterhead Header */}
        <div className="print-header" style={{ display: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: 15, marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, color: '#0f172a' }}>MANZIL CAREER PLATFORM</h2>
              <span style={{ fontSize: 12, color: '#64748b' }}>Ministry of Education Initiatives — EdCil</span>
            </div>
            <img src={EdCilLogo} alt="EdCil" style={{ height: 40 }} />
          </div>
          <h1 style={{ textAlign: 'center', fontSize: 24, margin: '20px 0', textTransform: 'uppercase', color: '#0f172a' }}>
            Expert Career consultation & Alignment Diagnostic
          </h1>
        </div>

        {/* Screen Header */}
        <div className="expert-header no-print">
          <h1>AI Expert Consultation</h1>
          <p className="subtitle">Comprehensive match logic, academic requirements, and roadmap diagnostic.</p>
        </div>

        {/* Career Selector Dropdown */}
        {careersList.length > 0 && (
          <div className="career-selector no-print">
            <label htmlFor="career-select">Consulting For:</label>
            <select
              id="career-select"
              value={selectedCareer}
              onChange={(e) => handleCareerChange(e.target.value)}
            >
              {careersList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh', gap: 16 }}>
            <div className="ft-loader" style={{
              width: 50, height: 50, borderRadius: '50%',
              border: '3px solid var(--ft-glass-border)',
              borderTopColor: 'var(--ft-neon-cyan)',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'var(--ft-text-secondary)', fontWeight: 600 }}>Analyzing Profile & Catalog...</p>
            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <GlassCard glowColor="magenta" style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center', padding: 32 }}>
            <span style={{ fontSize: '3rem' }}>⚠️</span>
            <h3 style={{ marginTop: 16 }}>Consultation Unavailable</h3>
            <p style={{ color: 'var(--ft-text-secondary)', margin: '12px 0 24px', lineHeight: 1.6 }}>{error}</p>
            <button className="ft-button-primary" onClick={navigateToDashboard}>Back to Dashboard</button>
          </GlassCard>
        )}

        {/* Main Consultation Output */}
        {!loading && !error && consultation && (() => {
          const statusConfig = getStatusConfig(consultation.status);
          
          return (
            <div className="consultation-result">
              
              {/* Career Profile / What it entails */}
              <GlassCard glowColor="cyan" style={{ marginBottom: 24, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, var(--ft-neon-cyan), var(--ft-neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                      About {consultation.career_title}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--ft-text-primary)', fontSize: '0.92rem', lineHeight: 1.65 }}>
                      {consultation.reason}
                    </p>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px 24px', 
                    background: 'rgba(255, 255, 255, 0.02)', 
                    border: '1.5px solid var(--ft-glass-border)', 
                    padding: '16px 20px', 
                    borderRadius: 12, 
                    minWidth: 280,
                    boxShadow: 'inset 0 0 12px rgba(255,255,255,0.01)'
                  }}>
                    <div>
                      <span style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ft-text-secondary)', opacity: 0.6, fontWeight: 700, display: 'block', marginBottom: 2 }}>Average Salary</span>
                      <strong style={{ color: '#00ff88', fontSize: 13.5 }}>{consultation.salary}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ft-text-secondary)', opacity: 0.6, fontWeight: 700, display: 'block', marginBottom: 2 }}>Entry Cost</span>
                      <strong style={{ color: 'var(--ft-neon-cyan)', fontSize: 13.5, textTransform: 'capitalize' }}>{consultation.cost_level}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ft-text-secondary)', opacity: 0.6, fontWeight: 700, display: 'block', marginBottom: 2 }}>Streams</span>
                      <strong style={{ color: 'var(--ft-neon-purple)', fontSize: 13.5 }}>{consultation.streams?.map(s => s.toUpperCase()).join(', ')}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ft-text-secondary)', opacity: 0.6, fontWeight: 700, display: 'block', marginBottom: 2 }}>Relocation</span>
                      <strong style={{ color: '#f59e0b', fontSize: 13.5 }}>{consultation.requires_relocation ? 'Yes' : 'No'}</strong>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Row 1: Gauge + Strengths & Warnings */}
              <div className="expert-grid">
                
                {/* Score Column */}
                <GlassCard className="score-card" glowColor={consultation.status === 'green' ? 'green' : consultation.status === 'amber' ? 'amber' : 'magenta'}>
                  <div className="gauge-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <RadialGauge
                      value={consultation.compatibility_score}
                      max={100}
                      label={`${consultation.compatibility_score}%`}
                      sublabel="Compatibility"
                      color={statusConfig.color}
                      size={170}
                      strokeWidth={12}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span className="status-badge" style={{
                      display: 'inline-block',
                      padding: '6px 16px',
                      borderRadius: 30,
                      backgroundColor: `${statusConfig.color}15`,
                      border: `1.5px solid ${statusConfig.color}40`,
                      color: statusConfig.color,
                      fontWeight: 700,
                      fontSize: 14,
                      boxShadow: `0 0 12px ${statusConfig.color}20`
                    }}>
                      {statusConfig.text}
                    </span>
                    <p style={{ marginTop: 16, color: 'var(--ft-text-secondary)', fontSize: 13.5, lineHeight: 1.6 }}>
                      {consultation.status === 'green' && `Excellent alignment! Your stream selection, academic self-assessment, and personality priorities strongly match the prerequisites for ${consultation.career_title}.`}
                      {consultation.status === 'amber' && `Good potential, but there are a few academic or preparation gaps to address. Check the warnings and recommended action items below to strengthen your profile.`}
                      {consultation.status === 'red' && `Warning: Significant mismatch found. This path typically requires a different high school stream, specific subjects, or significantly higher study hours. Review the warnings carefully.`}
                    </p>
                  </div>
                </GlassCard>

                {/* Strengths & Warnings Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  
                  {/* Strengths Card */}
                  <GlassCard glowColor="green" style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#00ff88' }}>✓</span> Profile Strengths
                    </h3>
                    {consultation.strengths.length > 0 ? (
                      <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {consultation.strengths.map((str, idx) => (
                          <li key={idx} style={{ color: 'var(--ft-text-primary)', fontSize: 13.5, lineHeight: 1.5 }}>{str}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: 'var(--ft-text-muted)', fontSize: 13, fontStyle: 'italic', margin: 0 }}>No specific highlights identified. Focus on academic building.</p>
                    )}
                  </GlassCard>

                  {/* Warnings Card */}
                  {consultation.warnings.length > 0 && (
                    <GlassCard glowColor="magenta" style={{ borderLeft: '3px solid #ff006e' }}>
                      <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ft-text-primary)' }}>
                        <span style={{ color: '#ff006e' }}>⚠️</span> Alignment Risks & Warnings
                      </h3>
                      <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {consultation.warnings.map((warn, idx) => (
                          <li key={idx} style={{ color: 'var(--ft-text-secondary)', fontSize: 13.5, lineHeight: 1.5 }}>{warn}</li>
                        ))}
                      </ul>
                    </GlassCard>
                  )}

                </div>
              </div>

              {/* Row 2: Action Checklist */}
              <GlassCard glowColor="cyan" style={{ marginTop: 24 }} className="checklist-card">
                <h3 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--ft-neon-cyan)' }}>☑</span> Priority Action Checklist
                </h3>
                <p style={{ color: 'var(--ft-text-secondary)', fontSize: 13, marginBottom: 20 }}>
                  Take control of your transition. Complete these concrete actions to boost compatibility:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {consultation.action_checklist.map((item, idx) => {
                    const isChecked = !!checkedItems[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleCheck(idx)}
                        className={`checklist-item ${isChecked ? 'checked' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: '12px 16px',
                          borderRadius: 8,
                          background: isChecked ? 'rgba(0, 212, 255, 0.05)' : 'rgba(255,255,255,0.02)',
                          border: isChecked ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid var(--ft-glass-border)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{
                          width: 20, height: 20, borderRadius: 4,
                          border: isChecked ? '2px solid var(--ft-neon-cyan)' : '2px solid var(--ft-text-muted)',
                          background: isChecked ? 'var(--ft-neon-cyan)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#080c24', fontSize: 12, fontWeight: 900, flexShrink: 0
                        }}>
                          {isChecked && '✓'}
                        </div>
                        <span style={{
                          fontSize: 13.5,
                          color: isChecked ? 'var(--ft-text-muted)' : 'var(--ft-text-primary)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          lineHeight: 1.4
                        }}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Row 3: 4-Phase Roadmap */}
              {consultation.roadmap && consultation.roadmap.length > 0 && (
                <div style={{ marginTop: 32 }}>
                  <h3 style={{ marginBottom: 20, fontSize: 18, color: 'var(--ft-text-primary)', borderLeft: '3px solid var(--ft-neon-purple)', paddingLeft: 12 }}>
                    Preparation Roadmap
                  </h3>
                  <div className="roadmap-timeline">
                    {consultation.roadmap.map((phase) => (
                      <div key={phase.phase} className="roadmap-phase-node">
                        <div className="phase-circle">{phase.phase}</div>
                        <GlassCard className="phase-content-card" style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: 'var(--ft-neon-purple)' }}>
                            {phase.title}
                          </h4>
                          <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {phase.items.map((item, idx) => (
                              <li key={idx} style={{ color: 'var(--ft-text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </GlassCard>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Row 4: Relevant Examinations */}
              <div style={{ marginTop: 32 }}>
                <h3 style={{ marginBottom: 20, fontSize: 18, color: 'var(--ft-text-primary)', borderLeft: '3px solid var(--ft-neon-cyan)', paddingLeft: 12 }}>
                  Target Entrance Examinations
                </h3>
                {consultation.relevant_exams.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                    {consultation.relevant_exams.map((exam, idx) => (
                      <GlassCard key={idx} glowColor="cyan" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--ft-text-primary)' }}>{exam.name}</h4>
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 4,
                            background: 'rgba(0, 212, 255, 0.15)', color: 'var(--ft-neon-cyan)', border: '1px solid rgba(0,212,255,0.3)',
                            fontWeight: 700
                          }}>{exam.conducting_body}</span>
                        </div>
                        
                        <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div>
                            <strong style={{ color: 'var(--ft-neon-cyan)' }}>Timeline:</strong>{' '}
                            <span style={{ color: 'var(--ft-text-secondary)' }}>{exam.timeline}</span>
                          </div>
                          <div>
                            <strong style={{ color: 'var(--ft-neon-cyan)' }}>Prep Focus:</strong>{' '}
                            <span style={{ color: 'var(--ft-text-secondary)', lineHeight: 1.5 }}>{exam.prep_focus}</span>
                          </div>
                          <div>
                            <strong style={{ color: 'var(--ft-neon-cyan)' }}>Unlocks:</strong>{' '}
                            <span style={{ color: 'var(--ft-text-secondary)', lineHeight: 1.5 }}>{exam.leads_to}</span>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                ) : (
                  <GlassCard style={{ padding: '24px 20px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--ft-text-secondary)', margin: 0, fontSize: 13.5 }}>
                      No specific national-level competitive entrance examinations are typically required for this career. Regular university admissions or direct recruitment paths apply.
                    </p>
                  </GlassCard>
                )}
              </div>

              {/* Row 5: Backup Options */}
              {consultation.backup_careers && consultation.backup_careers.length > 0 && (
                <GlassCard glowColor="purple" style={{ marginTop: 32 }} className="no-print">
                  <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>Explore Backup Career Recommendations</h3>
                  <p style={{ color: 'var(--ft-text-secondary)', fontSize: 13, marginBottom: 16 }}>
                    These paths share similar stream constraints and overlapping RIASEC personality codes. Click to view their diagnostic:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {consultation.backup_careers.map((backup, idx) => (
                      <button
                        key={idx}
                        className="ft-button-secondary"
                        onClick={() => handleCareerChange(backup)}
                        style={{
                          fontSize: 12.5,
                          padding: '10px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        {backup} →
                      </button>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Action Buttons Footer */}
              <div className="expert-footer no-print" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40 }}>
                <button className="ft-button-primary" onClick={() => window.print()}>
                  Print Report
                </button>
                <button className="ft-button-secondary" onClick={navigateToDashboard}>
                  Back to Dashboard
                </button>
              </div>

            </div>
          );
        })()}

      </main>
    </div>
  );
}
