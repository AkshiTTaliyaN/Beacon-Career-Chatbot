import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import EdCilLogo from '../assets/edcil.jpeg'
import ManzilHeader from '../components/ManzilHeader'
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
      style={{
        background: '#ffffff',
        border: `1px solid ${color}33`,
        borderRadius: 16,
        padding: '1.5rem 1.25rem',
        textAlign: 'center',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 30px ${color}18`,
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
        {label}
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
      style={{
        background: '#ffffff',
        border: '1px solid #e8edf5',
        borderRadius: 18,
        padding: '1.75rem 1.5rem',
        backdropFilter: 'blur(16px)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 16px 48px rgba(0,0,0,0.3), 0 0 30px ${color}22`,
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
        {title}
      </h3>
      <p style={{ margin: 0, color: '#5f6b8d', fontSize: '0.875rem', lineHeight: 1.65 }}>
        {desc}
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
      style={{
        display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
        padding: '1.25rem 1.5rem',
        background: '#f8fbff',
        border: '1px solid #e8edf5',
        borderRadius: 16,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
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
          {title}
        </div>
        <div style={{ color: '#5f6b8d', fontSize: '0.85rem', lineHeight: 1.6 }}>
          {desc}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main HomePage ─────────────────────────────────────────────────────────── */
export default function HomePage({ onStart }) {
  const features = [
    {
      icon: '🧠',
      title: 'AI Career Counsellor',
      desc: 'Chat with Manzil — an AI counsellor trained on Indian career paths, entrance exams, and scholarships. Get personalised guidance anytime.',
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
      desc: 'Explore 100+ career paths across government, private, and entrepreneurship sectors — complete with roadmaps, required exams, and salary ranges.',
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
      desc: 'Generate a professional career guidance report summarising your profile, top career matches, and next steps — shareable with parents and mentors.',
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
        title="Manzil"
        subtitle="by EdCIL"
        right={(
          <span style={{
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            padding: '0.35rem 0.85rem', borderRadius: 999,
            background: '#eaf1fb', border: '1px solid #dce4f5',
            color: '#2c5492',
          }}>
            🇮🇳 Government Initiative
          </span>
        )}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(5rem, 12vw, 8rem) 1.5rem clamp(4rem, 8vw, 6rem)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '15%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,0,110,0.05) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        {/* EdCIL Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}
        >
          <div style={{
            width: 100, height: 100, borderRadius: 24,
            overflow: 'hidden',
            border: '2px solid rgba(0,212,255,0.25)',
            boxShadow: '0 0 40px rgba(0,212,255,0.15), 0 0 80px rgba(0,212,255,0.06)',
            margin: '0 auto',
          }}>
            <img src={EdCilLogo} alt="EdCIL" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.4rem 1rem', borderRadius: 999, marginBottom: '1.5rem',
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
            fontSize: '0.78rem', fontWeight: 600, color: '#2c5492', letterSpacing: '0.05em',
            position: 'relative', zIndex: 1,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', display: 'inline-block' }} />
          Powered by EdCIL · Ministry of Education, Govt. of India
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
            fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em',
            margin: '0 0 1.25rem', maxWidth: 820,
            color: '#102849',
            position: 'relative', zIndex: 1,
          }}
        >
          Career Guidance{' '}
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Built for India
          </span>
          {' '}— Free for Every Student
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#5f6b8d',
            maxWidth: 620, lineHeight: 1.65, margin: '0 0 2.5rem',
            position: 'relative', zIndex: 1,
          }}
        >
          AI-powered career counselling, psychometric profiling, and personalised roadmaps for Class 8–12 students across India. No fees. No bias. Just clear direction.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}
        >
          <button
            className="ft-button-primary"
            style={{ fontSize: '1rem', padding: '0.9rem 2rem', borderRadius: 999 }}
            onClick={onStart}
          >
            Start Counselling →
          </button>
          <button
            className="ft-button-secondary"
            style={{ fontSize: '1rem', padding: '0.85rem 2rem', borderRadius: 999 }}
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            How It Works ↓
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{ marginTop: '3.5rem', color: '#9ca3af', fontSize: '0.75rem', letterSpacing: '0.1em', position: 'relative', zIndex: 1 }}
        >
          <div style={{ animation: 'ft-float 2s ease-in-out infinite' }}>▼</div>
        </motion.div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────────── */}
      <section style={{ padding: '1rem 1.5rem 3rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <StatCard value={100}  suffix="+"  label="Career Paths"       color="#00d4ff" delay={0}    />
          <StatCard value={50}   suffix="+"  label="Entrance Exams"     color="#8b5cf6" delay={0.1}  />
          <StatCard value={8}    suffix=""   label="Classes Supported"  color="#00ff88" delay={0.2}  />
          <StatCard value={6}    suffix=""   label="RIASEC Types Mapped" color="#f59e0b" delay={0.3}  />
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '4rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="ft-section-label">Platform Features</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#102849', margin: '0 0 0.75rem' }}>
              Everything a student needs
            </h2>
            <p style={{ color: '#5f6b8d', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
              From personality profiling to AI counselling — all tools in one platform, designed specifically for the Indian education system.
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
      <section id="how-it-works" style={{ padding: '4rem 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Section bg glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="ft-section-label">How It Works</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#102849', margin: '0 0 0.75rem' }}>
              From profile to roadmap
            </h2>
            <p style={{ color: '#5f6b8d', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
              Four simple steps to a clear career direction.
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
          style={{
            maxWidth: 900, margin: '0 auto',
            background: '#ffffff',
            border: '1px solid #dce4f5',
            borderRadius: 24,
            padding: 'clamp(2rem, 4vw, 3rem)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
            boxShadow: '0 0 60px rgba(0,212,255,0.05)',
          }}
        >
          <img
            src={EdCilLogo}
            alt="EdCIL"
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 16, border: '1px solid rgba(0,212,255,0.2)', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2c5492', marginBottom: '0.4rem' }}>
              About EdCIL
            </div>
            <h3 style={{ margin: '0 0 0.6rem', fontSize: '1.2rem', fontWeight: 700, color: '#102849' }}>
              A Government of India Enterprise
            </h3>
            <p style={{ margin: 0, color: '#5f6b8d', fontSize: '0.9rem', lineHeight: 1.7 }}>
              EdCIL (India) Limited is a Mini Ratna enterprise under the Ministry of Education, Government of India. Manzil is EdCIL's initiative to democratise career guidance for every student across India — free, unbiased, and built around the Indian education ecosystem.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────────────── */}
      <section style={{ padding: '2rem 1.5rem 4rem', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: 700, margin: '0 auto', textAlign: 'center',
            padding: '3rem 2rem',
            background: '#f0f4ff',
            border: '1px solid #dce4f5',
            borderRadius: 24,
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 60px rgba(0,212,255,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* bg orb */}
          <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
          <h2 style={{ margin: '0 0 0.75rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#102849' }}>
            Ready to find your path?
          </h2>
          <p style={{ margin: '0 auto 2rem', color: '#5f6b8d', fontSize: '1rem', lineHeight: 1.65, maxWidth: 480 }}>
            Complete your profile in under 5 minutes and get personalised career recommendations built around who you actually are.
          </p>
          <button
            className="ft-button-primary"
            style={{ fontSize: '1.05rem', padding: '1rem 2.5rem', borderRadius: 999, boxShadow: '0 0 30px rgba(0,212,255,0.25)' }}
            onClick={onStart}
          >
            Start Counselling →
          </button>
          <p style={{ marginTop: '1rem', color: '#9ca3af', fontSize: '0.8rem' }}>
            Free · No login required to explore
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
          <span>Manzil by EdCIL (India) Limited</span>
        </div>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} EdCIL (India) Limited · Ministry of Education, Government of India · All rights reserved
        </p>
      </footer>
    </div>
  )
}
