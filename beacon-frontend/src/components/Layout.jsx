import { motion, AnimatePresence } from "framer-motion";
import { DEMO_MODE } from "../config";
import FloatingBackground from "./onboarding/FloatingBackground";
import ProgressHeader from "./onboarding/ProgressHeader";
import "../styles/onboarding.css";

// NOTE: opacity is intentionally kept at 1 in all initial states.
// framer-motion v12 + React 19 does not reliably trigger opacity
// transitions on mount — elements stay invisible until interaction.
// Slide-only animations are used instead as a safe alternative.
const contentVariants = {
  initial: { opacity: 1, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 1, y: -10 },
};

export default function Layout({ children, step, totalSteps, title, subtitle }) {
  const showProgress = typeof step === "number" && typeof totalSteps === "number" && totalSteps > 1 && step >= 1;

  return (
    <div className="layout onboard-layout">
      <FloatingBackground />

      <header className="header onboard-header">
        <div className="brand">
          <div className="brand-text">
            <p className="brand-name onboard-brand-name">Manzil</p>
            <p className="brand-tag onboard-brand-tag">Your career guidance companion</p>
          </div>
        </div>
        {DEMO_MODE && <span className="demo-badge onboard-demo-badge">Demo mode</span>}
      </header>

      <main className="main onboard-main">
        {/* No opacity animation on outer card — always visible */}
        <div className="card glass-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${title}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {title && <h1 className="card-title onboard-card-title">{title}</h1>}
              {subtitle && <p className="card-subtitle onboard-card-subtitle">{subtitle}</p>}

              {showProgress && <ProgressHeader step={step} totalSteps={totalSteps} />}

              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="footer onboard-footer">
        <p>© {new Date().getFullYear()} Manzil — helping students find careers that fit</p>
      </footer>
    </div>
  );
}
