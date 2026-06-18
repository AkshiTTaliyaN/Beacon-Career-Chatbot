import { motion, AnimatePresence } from "framer-motion";
import { DEMO_MODE } from "../config";
import FloatingBackground from "./onboarding/FloatingBackground";
import ProgressHeader from "./onboarding/ProgressHeader";
import "../styles/onboarding.css";

const contentVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
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
        <motion.div
          className="card glass-panel"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${title}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {title && <h1 className="card-title onboard-card-title">{title}</h1>}
              {subtitle && <p className="card-subtitle onboard-card-subtitle">{subtitle}</p>}

              {showProgress && <ProgressHeader step={step} totalSteps={totalSteps} />}

              {children}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      <footer className="footer onboard-footer">
        <p>© {new Date().getFullYear()} Manzil — helping students find careers that fit</p>
      </footer>
    </div>
  );
}
