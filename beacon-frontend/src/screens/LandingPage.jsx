import { motion } from "framer-motion";
import ManzilHeader from "../components/ManzilHeader";
import "./LandingPage.css";

const FEATURES = [
  {
    icon: "📊",
    title: "Career Assessment",
    desc: "RIASEC-based aptitude and interest profiling tailored to your class and stream.",
  },
  {
    icon: "🧠",
    title: "Personality Analysis",
    desc: "Understand your Holland Code, strengths, and work-style preferences in minutes.",
  },
  {
    icon: "🎯",
    title: "Career Recommendations",
    desc: "Smart matches across careers, entrance exams, and pathways built for students.",
  },
  {
    icon: "💬",
    title: "AI Counsellor",
    desc: "Chat with our AI for personalised guidance on colleges, streams, and next steps.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage({ onStart }) {
  return (
    <div className="manzil-landing">
      <div className="manzil-landing-bg" aria-hidden="true">
        <div className="manzil-landing-orb manzil-landing-orb--1" />
        <div className="manzil-landing-orb manzil-landing-orb--2" />
        <div className="manzil-landing-grid" />
      </div>

      <ManzilHeader
        title=""
        subtitle="Career Guidance Platform"
        showDefaultNav={false}
      />

      <main className="manzil-landing-main">
        <motion.section
          className="manzil-landing-hero"
          {...fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="manzil-landing-kicker">AI-powered career counselling</p>
          <h1 className="manzil-landing-title">
            Discover the career path
            <span> built for you</span>
          </h1>
          <p className="manzil-landing-desc">
            AI-powered career counselling platform helping students discover careers,
            colleges, streams and opportunities through aptitude, personality and career
            assessments.
          </p>
          <motion.button
            type="button"
            className="manzil-landing-cta"
            onClick={onStart}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Career Counselling
            <span aria-hidden="true">→</span>
          </motion.button>
        </motion.section>

        <motion.section
          className="manzil-landing-features"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {FEATURES.map((feature, i) => (
            <motion.article
              key={feature.title}
              className="manzil-feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(44, 84, 146, 0.18)" }}
            >
              <span className="manzil-feature-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h2>{feature.title}</h2>
              <p>{feature.desc}</p>
            </motion.article>
          ))}
        </motion.section>
      </main>

      <footer className="manzil-landing-footer">
        <p>Guiding students from curiosity to clarity.</p>
      </footer>
    </div>
  );
}
