import { DEMO_MODE } from "../config";

/**
 * Layout.jsx — updated for full-website presentation.
 * Changes:
 *  - Removed "B" brand-mark icon
 *  - "Beacon" and "Career Guidance Portal" are centered
 *  - Wider max-width card for desktop
 *  - Header and card padding improved for website context
 */
export default function Layout({ children, step, totalSteps, title, subtitle }) {
  const showProgress = step >= 2 && step <= 4;
  const progressPct = showProgress ? ((step - 1) / (totalSteps - 2)) * 100 : 0;

  return (
    <div className="layout">
      <header className="header">
        <div className="brand">
          {/* Brand-mark icon removed as requested */}
          <div className="brand-text">
            <p className="brand-name">Beacon</p>
            <p className="brand-tag">Career Guidance Portal</p>
          </div>
        </div>
        {DEMO_MODE && <span className="demo-badge">Demo mode</span>}
      </header>

      <main className="main">
        <div className="card">
          {title && <h1 className="card-title">{title}</h1>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}

          {showProgress && (
            <div className="progress-wrap" aria-label="Form progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="progress-label">
                Step {step - 1} of 3 — Profile setup
              </p>
            </div>
          )}

          {children}
        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Beacon — Career Guidance Platform</p>
      </footer>
    </div>
  );
}