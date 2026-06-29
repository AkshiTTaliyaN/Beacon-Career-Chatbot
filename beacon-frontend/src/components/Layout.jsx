import { DEMO_MODE } from "../config";
import ManzilHeader from "./ManzilHeader";
import FloatingBackground from "./onboarding/FloatingBackground";
import ProgressHeader from "./onboarding/ProgressHeader";
import "../styles/onboarding.css";

export default function Layout({ children, step, totalSteps, title, subtitle }) {
  const showProgress = typeof step === "number" && typeof totalSteps === "number" && totalSteps > 1 && step >= 1;

  return (
    <div className="layout onboard-layout">
      <FloatingBackground />

      <ManzilHeader
        title="Manzil"
        subtitle="Your career guidance companion"
        showDefaultNav={false}
        right={DEMO_MODE ? <span className="demo-badge onboard-demo-badge">Demo mode</span> : null}
      />

      <main className="main onboard-main">
        {/* No opacity animation on outer card — always visible */}
        <div className="card glass-panel">
          <div key={`${step}-${title}`}>
            {title && <h1 className="card-title onboard-card-title">{title}</h1>}
            {subtitle && <p className="card-subtitle onboard-card-subtitle">{subtitle}</p>}

            {showProgress && <ProgressHeader step={step} totalSteps={totalSteps} />}

            {children}
          </div>
        </div>
      </main>

      <footer className="footer onboard-footer">
        <p>© {new Date().getFullYear()} Manzil — helping students find careers that fit</p>
      </footer>
    </div>
  );
}

