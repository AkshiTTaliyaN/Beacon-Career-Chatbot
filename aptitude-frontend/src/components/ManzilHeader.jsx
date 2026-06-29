import EdCilLogo from "../assets/edcil.jpeg";
import ManzilLogo from "../assets/manzil-logo.png";
import "./ManzilHeader.css";

const DEFAULT_NAV_ITEMS = [
  { label: "Career Library", path: "/careers" },
  { label: "Exam Explorer", path: "/exams" },
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
  title = "Manzil",
  subtitle,
  center,
  right,
  className = "",
  sticky = true,
  showDefaultNav = true,
  navItems,
}) {
  const resolvedNavItems = Array.isArray(navItems) ? navItems : DEFAULT_NAV_ITEMS;

  const leftContent = (title !== "Manzil" || subtitle) ? (
    <div className="manzil-header-brand">
      {title !== "Manzil" ? <span className="manzil-header-page-title">{title}</span> : null}
      {subtitle ? <span className="manzil-header-subtitle">{subtitle}</span> : null}
    </div>
  ) : null;

  return (
    <header
      className={`manzil-header ${sticky ? "manzil-header--sticky" : ""} ${className}`.trim()}
    >
      <div className="manzil-header-left">
        <img
          src={ManzilLogo}
          alt="Manzil"
          className="manzil-brand-logo"
        />
        {leftContent}
      </div>

      <div className="manzil-header-center">
        <img
          src={EdCilLogo}
          alt="EdCIL (India) Limited"
          className="manzil-header-edcil-logo"
        />
      </div>

      <div className="manzil-header-right">
        {showDefaultNav && (
          <nav className="manzil-header-nav" aria-label="Primary">
            {resolvedNavItems.map((item) => (
              <button
                key={item.path}
                type="button"
                className="manzil-header-link"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
            <div className="manzil-header-avatar">M</div>
          </nav>
        )}
        {right}
      </div>
    </header>
  );
}
