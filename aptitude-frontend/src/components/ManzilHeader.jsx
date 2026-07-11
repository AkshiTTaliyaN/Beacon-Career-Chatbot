import EdCilLogo from "../assets/edcil.jpeg";
import ManzilLogo from "../assets/manzil-logo.png";
import LanguageToggle from "./LanguageToggle.jsx";
import "./ManzilHeader.css";

// Portal nav. These paths all live on beacon-frontend, not here, which is
// exactly why they cannot survive on the standalone site: there is no beacon
// origin to send anyone to.
const DEFAULT_NAV_ITEMS = [
  { label: "Career Library", path: "/careers" },
  { label: "Chat", path: "/chat" },
  { label: "My Report", path: "/report" },
];

function getBeaconOrigin() {
  if (typeof window === "undefined") return "http://localhost:5173";
  const params = new URLSearchParams(window.location.search);
  return params.get("origin") || import.meta.env.VITE_BEACON_APP_ORIGIN || "http://localhost:5173";
}

function navigate(path) {
  const beaconOrigin = getBeaconOrigin().replace(/\/$/, "");

  if (path.startsWith("http://") || path.startsWith("https://")) {
    window.location.href = path;
    return;
  }

  if (path.startsWith("/")) {
    window.location.href = `${beaconOrigin}${path}`;
    return;
  }

  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function ManzilHeader({
  title = "",
  subtitle,
  center,
  right,
  className = "",
  sticky = true,
  showDefaultNav = true,
  navItems,

  // ── Standalone mode ──────────────────────────────────────────────────────
  // standalone   : true on the public assessment site. No portal, so Career
  //                Library, Chat and the avatar are removed entirely.
  // hasReport    : a report exists in this session (App restores it from
  //                localStorage on load). Controls whether "My Report" shows.
  // onViewReport : in-app callback. In standalone "My Report" must NOT navigate
  //                to beacon's /report route, it has to render the result page
  //                inside this app.
  standalone = false,
  hasReport = false,
  onViewReport,
}) {
  // Portal keeps the original behaviour: a localStorage flag set when the test
  // was completed, used to decide whether to surface the beacon /report link.
  let portalHasTakenTest = false;
  try {
    portalHasTakenTest = localStorage.getItem("psychometricCompleted") === "true";
  } catch {
    portalHasTakenTest = false;
  }

  const resolvedNavItems = (Array.isArray(navItems) ? navItems : DEFAULT_NAV_ITEMS).filter((item) => {
    if (standalone) {
      // Career Library and Chat live on the portal and do not exist here.
      if (item.label !== "My Report") return false;
      // And My Report only makes sense once there is a report to show.
      return hasReport;
    }

    if (item.label === "My Report" && !portalHasTakenTest) return false;
    return true;
  });

  const handleNavClick = (item) => {
    // Standalone "My Report" is an in-app page change, not a cross-origin jump.
    if (standalone && item.label === "My Report") {
      if (typeof onViewReport === "function") onViewReport();
      return;
    }
    navigate(item.path);
  };

  const leftContent = (title || subtitle) ? (
    <div className="manzil-header-brand">
      {title ? <span className="manzil-header-page-title">{title}</span> : null}
      {subtitle ? <span className="manzil-header-subtitle">{subtitle}</span> : null}
    </div>
  ) : null;

  // In standalone with no report yet, resolvedNavItems is empty and there is no
  // avatar, so the nav element would render as an empty box. Skip it entirely.
  const showNav = showDefaultNav && (resolvedNavItems.length > 0 || !standalone);

  return (
    <header
      className={`manzil-header ${sticky ? "manzil-header--sticky" : ""} ${className}`.trim()}
    >
      <div className="manzil-header-left">
        <img
          src={EdCilLogo}
          alt="EdCIL (India) Limited"
          className="manzil-header-edcil-logo-left"
          style={{ height: '36px', objectFit: 'contain', marginRight: '12px' }}
        />
        {leftContent}
      </div>

      {/* Previously this prop was destructured and never rendered, so the page
          title/name block that TestPage and ResultPage pass in was silently
          dropped. Only rendered when something is actually passed, so headers
          that do not use it (LandingPage) are unaffected. */}
      {center ? <div className="manzil-header-center">{center}</div> : null}

      <div className="manzil-header-right">
        {showNav && (
          <nav className="manzil-header-nav" aria-label="Primary">
            {resolvedNavItems.map((item) => (
              <button
                key={item.path}
                type="button"
                className="manzil-header-link"
                onClick={() => handleNavClick(item)}
              >
                {item.label}
              </button>
            ))}
            {/* The avatar represents a logged-in portal account. Standalone has
                no auth, so showing a user chip there would be a lie. */}
            {!standalone && <div className="manzil-header-avatar">U</div>}
          </nav>
        )}
        <LanguageToggle className="no-print" />
        {right}
      </div>
    </header>
  );
}