import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import EdCilLogo from '../assets/edcil.jpeg'
import ManzilHeader from '../components/ManzilHeader'
import BilingualText from '../components/BilingualText.jsx'
import { useLanguage } from '../context/LanguageContext'
import '../styles/futuristic.css'

/* ── helpers ─────────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

/* ── Stat card with animated count-up ─────────────────────────────────────── */
function StatCard({ value, suffix = '', label, color, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useCountUp(value, 1600, inView)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="home-page-card home-page-stat-card"
      style={{
        background: '#ffffff',
        border: `1px solid ${color}33`,
        borderRadius: 18,
        padding: '1.35rem 1.15rem',
        textAlign: 'center',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 12px 30px ${color}14`,
        flex: 1,
        minWidth: 140,
      }}
    >
      <div style={{
        fontSize: 'clamp(2rem, 4vw, 2.75rem)',
        fontWeight: 800,
        color,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        textShadow: `0 0 20px ${color}66`,
      }}>
        {count}{suffix}
      </div>
      <div style={{ marginTop: '0.5rem', color: '#5f6b8d', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.02em' }}>
        <BilingualText text={label} />
      </div>
    </motion.div>
  )
}

/* ── Feature card ─────────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, color, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className="home-page-card home-page-feature-card"
      style={{
        background: '#ffffff',
        border: '1px solid #e8edf5',
        borderRadius: 20,
        padding: '1.5rem 1.35rem',
        backdropFilter: 'blur(16px)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        y: -3,
        boxShadow: `0 16px 40px rgba(15,31,61,0.12), 0 0 24px ${color}16`,
        borderColor: `${color}44`,
      }}
    >
      {/* Icon bubble */}
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', marginBottom: '1rem',
        boxShadow: `0 0 16px ${color}22`,
      }}>
        {icon}
      </div>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 700, color: '#102849', letterSpacing: '-0.01em' }}>
        <BilingualText text={title} />
      </h3>
      <p style={{ margin: 0, color: '#5f6b8d', fontSize: '0.875rem', lineHeight: 1.65 }}>
        <BilingualText text={desc} />
      </p>
      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${color}12, transparent 70%)`,
        borderRadius: '0 18px 0 0',
        pointerEvents: 'none',
      }} />
    </motion.div>
  )
}

/* ── Step card ─────────────────────────────────────────────────────────────── */
function StepCard({ num, title, desc, color, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="home-page-card home-page-step-card"
      style={{
        display: 'flex', gap: '1rem', alignItems: 'flex-start',
        padding: '1.1rem 1.2rem',
        background: '#f8fbff',
        border: '1px solid #e8edf5',
        borderRadius: 18,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="home-page-step-badge" style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(135deg, ${color}55, ${color}22)`,
        border: `1px solid ${color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '1rem', color,
        boxShadow: `0 0 14px ${color}33`,
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#102849', marginBottom: '0.3rem' }}>
          <BilingualText text={title} />
        </div>
        <div style={{ color: '#5f6b8d', fontSize: '0.85rem', lineHeight: 1.6 }}>
          <BilingualText text={desc} />
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main HomePage ─────────────────────────────────────────────────────────── */
export default function HomePage({ onStart, onLogin }) {
  const { language } = useLanguage()
  const features = [
    {
      icon: '🧠',
      title: 'AI Career Counsellor',
      desc: 'Chat with our AI counsellor trained on Indian career paths, entrance exams, and scholarships. Get personalised guidance anytime.',
      color: '#2c5492',
    },
    {
      icon: '🎯',
      title: 'Psychometric Profiling',
      desc: 'RIASEC-based psychometric assessment that maps your personality, strengths, and work-style to careers that truly suit you.',
      color: '#8b5cf6',
    },
    {
      icon: '📚',
      title: 'Career Library',
      desc: 'Explore 100+ career paths across government, private, and entrepreneurship sectors, complete with roadmaps, required exams, and salary ranges.',
      color: '#00ff88',
    },
    {
      icon: '📝',
      title: 'Exam Explorer',
      desc: 'Browse 50+ competitive entrance exams with eligibility criteria, important dates, preparation tips, and cutoff trends.',
      color: '#f59e0b',
    },
    {
      icon: '🔬',
      title: 'Expert System',
      desc: 'Rules-based expert system that cross-validates your profile against real career requirements and flags gaps to address.',
      color: '#ff006e',
    },
    {
      icon: '📄',
      title: 'Detailed PDF Report',
      desc: 'Generate a professional career guidance report summarising your profile, top career matches, and next steps, shareable with parents and mentors.',
      color: '#14b8a6',
    },
  ]

  const steps = [
    { num: 1, title: 'Complete your profile', desc: 'Tell us your class, stream, subjects, interests, and goals. Takes under 5 minutes.', color: '#2c5492' },
    { num: 2, title: 'Take the psychometric test', desc: 'Answer a research-backed RIASEC questionnaire to map your personality type.', color: '#8b5cf6' },
    { num: 3, title: 'Get your recommendations', desc: 'Receive ranked career matches with detailed roadmaps tailored to your profile.', color: '#00ff88' },
    { num: 4, title: 'Chat and explore', desc: 'Discuss your results with the AI counsellor, explore exams, and download your report.', color: '#f59e0b' },
  ]

  return (
    <div className="ft-dashboard-bg" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

      <ManzilHeader
        title={<BilingualText text="Career Guidance Portal" />}
        subtitle={<BilingualText text="Ministry of Education · Government of India" />}
        showDefaultNav={false}
        right={(
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end', minWidth: 0 }}>
            <button
              onClick={onLogin}
              className="ft-button-secondary"
              style={{
                fontSize: "0.85rem",
                padding: "0.45rem 1.1rem",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                cursor: "pointer"
              }}
            >
              <BilingualText text="Login" />
            </button>
            <span className="gov-initiative-badge" style={{
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              padding: '0.35rem 0.85rem', borderRadius: 999,
              background: '#eaf1fb', border: '1px solid #dce4f5',
              color: '#2c5492',
            }}>
              🇮🇳 <BilingualText text="Government Initiative" />
            </span>
          </div>
        )}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="home-page-hero-section" style={{
        position: 'relative', overflow: 'hidden',
        minHeight: '70vh',
        padding: 'clamp(1.75rem, 3vw, 2.5rem) 1.25rem',
        display: 'flex', alignItems: 'center',
        background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
      }}>
        <div className="home-page-hero-shell" style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(1.5rem, 3vw, 2.25rem)',
          border: '1px solid #e4ebf6',
          borderRadius: 28,
          background: 'rgba(255,255,255,0.96)',
          boxShadow: '0 20px 50px rgba(15,31,61,0.05)',
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: 'clamp(1.25rem, 3vw, 2rem)',
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.45rem 0.7rem', border: '1px solid #e4ebf6', borderRadius: 999, background: '#f8fbff' }}>
              <img src={EdCilLogo} alt="EdCIL" style={{ width: 34, height: 34, objectFit: 'contain', borderRadius: 8 }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2c5492', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                <BilingualText text="EdCIL · Ministry of Education" />
              </span>
            </div>

            <motion.h1
              className="home-page-hero-title"
              style={{
                fontSize: 'clamp(2.2rem, 4.3vw, 3.3rem)',
                fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.04em',
                margin: '0 0 0.85rem', maxWidth: 560,
                color: '#102849',
                position: 'relative', zIndex: 1,
              }}
            >
              <div style={{ display: 'block', marginBottom: '0.35rem' }}>
                <div style={{ color: '#102849' }}>Career Guidance</div>
                {language === 'km' && (
                  <div style={{ fontSize: '0.55em', fontWeight: 500, color: '#5f6b8d', marginTop: '0.1rem', letterSpacing: 'normal', textTransform: 'none' }}>
                    ការណែនាំអំពីអាជីព
                  </div>
                )}
              </div>
              <div style={{ display: 'block', marginBottom: '0.35rem' }}>
                <span style={{ color: '#2c5492' }}>
                  Built for Everyone
                </span>
                {language === 'km' && (
                  <div style={{ fontSize: '0.55em', fontWeight: 500, color: '#5f6b8d', marginTop: '0.1rem', background: 'none', WebkitTextFillColor: '#5f6b8d', WebkitBackgroundClip: 'initial', letterSpacing: 'normal', textTransform: 'none' }}>
                    បង្កើតឡើងសម្រាប់អ្នករាល់គ្នា
                  </div>
                )}
              </div>
              <div style={{ display: 'block' }}>
                <div style={{ fontSize: '0.6em', fontWeight: 700, color: '#2c5492' }}>
                  Free for Every Student
                </div>
                {language === 'km' && (
                  <div style={{ fontSize: '0.45em', fontWeight: 500, color: '#5f6b8d', marginTop: '0.1rem', letterSpacing: 'normal', textTransform: 'none' }}>
                    ឥតគិតថ្លៃសម្រាប់សិស្សគ្រប់រូប
                  </div>
                )}
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="home-page-hero-subtitle"
              style={{
                fontSize: 'clamp(1rem, 1.75vw, 1.08rem)', color: '#5f6b8d',
                maxWidth: 620, lineHeight: 1.7, margin: '0 0 1.4rem',
                position: 'relative', zIndex: 1,
              }}
            >
              <BilingualText text="AI-powered career counselling, psychometric profiling, and personalised roadmaps for Class 9–12 students. No fees. No bias. Just clear direction." />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="home-page-hero-actions"
              style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'flex-start', position: 'relative', zIndex: 1 }}
            >
              <button
                className="ft-button-primary home-page-button-primary"
                style={{ fontSize: '1rem', padding: '0.95rem 1.7rem', borderRadius: 12 }}
                onClick={onStart}
              >
                <BilingualText text="Start Counselling →" />
              </button>
              <button
                className="ft-button-secondary home-page-button-secondary"
                style={{ fontSize: '1rem', padding: '0.95rem 1.7rem', borderRadius: 12 }}
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BilingualText text="How It Works ↓" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div className="home-page-hero-preview" style={{ width: '100%', maxWidth: 480, padding: '1.1rem', border: '1px solid #e4ebf6', borderRadius: 24, background: '#f8fbff', boxShadow: '0 12px 28px rgba(15,31,61,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2c5492', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Student roadmap</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#102849', marginTop: '0.15rem' }}>Recommended next steps</div>
                </div>
                <div style={{ padding: '0.4rem 0.6rem', borderRadius: 999, background: '#ffffff', border: '1px solid #e4ebf6', color: '#2c5492', fontSize: '0.75rem', fontWeight: 700 }}>Live</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '0.8rem' }}>
                <div style={{ padding: '0.8rem', borderRadius: 16, background: '#ffffff', border: '1px solid #e4ebf6' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#5f6b8d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Profile</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#102849', marginTop: '0.25rem' }}>92%</div>
                </div>
                <div style={{ padding: '0.8rem', borderRadius: 16, background: '#ffffff', border: '1px solid #e4ebf6' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#5f6b8d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Matches</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#102849', marginTop: '0.25rem' }}>18 paths</div>
                </div>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: 18, background: '#ffffff', border: '1px solid #e4ebf6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#102849' }}>Next recommendation</span>
                  <span style={{ fontSize: '0.72rem', color: '#2c5492', fontWeight: 700 }}>AI guided</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: '#eef4fc', overflow: 'hidden' }}>
                  <div style={{ width: '72%', height: '100%', borderRadius: 999, background: '#2c5492' }} />
                </div>
                <div style={{ marginTop: '0.7rem', color: '#5f6b8d', fontSize: '0.86rem', lineHeight: 1.55 }}>
                  Explore careers, exams, and roadmaps tailored to your profile.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────── */}
      <section className="home-page-stats-section" style={{ padding: '0.75rem 1.5rem 2.5rem', position: 'relative', zIndex: 1 }}>
        <div className="home-page-stat-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <StatCard value={180}  suffix="+"  label="Career Paths"       color="#00d4ff" delay={0}    />
          <StatCard value={10}   suffix="+"  label="Entrance Exams"     color="#8b5cf6" delay={0.1}  />
          <StatCard value={4}    suffix=""   label="Classes Supported"  color="#00ff88" delay={0.2}  />
          <StatCard value={6}    suffix=""   label="RIASEC Types Mapped" color="#f59e0b" delay={0.3}  />
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="home-page-section" style={{ padding: '3.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="ft-section-label"><BilingualText text="Platform Features" /></span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#102849', margin: '0 0 0.75rem' }}>
              <BilingualText text="Everything a student needs" />
            </h2>
            <p style={{ color: '#5f6b8d', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
              <BilingualText text="From personality profiling to AI counselling, all tools are integrated in one platform designed specifically for the education system." />
            </p>
          </div>

          {/* Feature grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="home-page-section" style={{ padding: '3.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Section bg glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="ft-section-label"><BilingualText text="How It Works" /></span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#102849', margin: '0 0 0.75rem' }}>
              <BilingualText text="From profile to roadmap" />
            </h2>
            <p style={{ color: '#5f6b8d', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
              <BilingualText text="Four simple steps to a clear career direction." />
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {steps.map((s, i) => (
              <StepCard key={s.num} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── About EDCIL strip ──────────────────────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="home-page-card home-page-about-card"
        style={{
            maxWidth: 900, margin: '0 auto',
            background: '#ffffff',
            border: '1px solid #dce4f5',
            borderRadius: 22,
            padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
            boxShadow: '0 16px 36px rgba(15,31,61,0.06)',
          }}
        >
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2c5492', marginBottom: '0.4rem' }}>
              <BilingualText text="About EdCIL" />
            </div>
            <h3 style={{ margin: '0 0 0.6rem', fontSize: '1.2rem', fontWeight: 700, color: '#102849' }}>
              <BilingualText text="A Government Enterprise" />
            </h3>
            <p style={{ margin: 0, color: '#5f6b8d', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <BilingualText text="EdCIL Limited is a Mini Ratna enterprise under the Ministry of Education. This platform is EdCIL's initiative to democratise career guidance for every student, making it free, unbiased, and built around the education ecosystem." />
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────────────── */}
      <section style={{ padding: '1.5rem 1.5rem 3.5rem', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="home-page-card home-page-cta-panel"
          style={{
            maxWidth: 700, margin: '0 auto', textAlign: 'center',
            padding: '2.5rem 2rem',
            background: '#f0f4ff',
            border: '1px solid #dce4f5',
            borderRadius: 24,
            backdropFilter: 'blur(16px)',
            boxShadow: '0 16px 36px rgba(44,84,146,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* bg orb */}
          <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
          <h2 style={{ margin: '0 0 0.75rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#102849' }}>
            <BilingualText text="Ready to find your path?" />
          </h2>
          <p style={{ margin: '0 auto 2rem', color: '#5f6b8d', fontSize: '1rem', lineHeight: 1.65, maxWidth: 480 }}>
            <BilingualText text="Complete your profile in under 5 minutes and get personalised career recommendations built around who you actually are." />
          </p>
          <button
            className="ft-button-primary"
            style={{ fontSize: '1.05rem', padding: '1rem 2.5rem', borderRadius: 999, boxShadow: '0 0 30px rgba(0,212,255,0.25)' }}
            onClick={onStart}
          >
            <BilingualText text="Start Counselling →" />
          </button>
          <p style={{ marginTop: '1rem', color: '#9ca3af', fontSize: '0.8rem' }}>
            <BilingualText text="Free · No login required to explore" />
          </p>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #e8edf5',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.8rem',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <img src={EdCilLogo} alt="EdCIL" style={{ height: 20, width: 20, objectFit: 'cover', borderRadius: 4, opacity: 0.6 }} />
          <span><BilingualText text="Career Guidance Portal by EdCIL Limited" /></span>
        </div>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} <BilingualText text="EdCIL Limited · Ministry of Education · All rights reserved" />
        </p>
      </footer>
    </div>
  )
}
