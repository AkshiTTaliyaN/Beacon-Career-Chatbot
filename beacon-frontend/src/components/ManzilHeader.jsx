import { useMemo } from "react";
import EdCilTopLogo from "../assets/edcil.jpeg";
import ManzilLogo from "../assets/manzil-logo.png";
import "./ManzilHeader.css";

const DEFAULT_NAV_ITEMS = [
  { label: "Career Library", path: "/careers" },
  { label: "Exam Explorer", path: "/exams" },
  { label: "Chat", path: "/chat" },
  { label: "My Report", path: "/report" },
];

function navigate(path) {
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
}) {
  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") || "" : "";
  const userInitial = useMemo(() => {
    return userName.trim().slice(0, 1).toUpperCase() || "M";
  }, [userName]);

  const centerContent = center ?? (
    (title !== "Manzil" || subtitle) ? (
      <div className="manzil-header-center">
        {title !== "Manzil" ? <span className="manzil-header-page-title">{title}</span> : null}
        {subtitle ? <span className="manzil-header-subtitle">{subtitle}</span> : null}
      </div>
    ) : null
  );

  return (
    <>
      <div className="manzil-header-topbar">
        <img
          src={EdCilTopLogo}
          alt="EdCIL (India) Limited"
          className="manzil-header-topbar-logo"
        />
      </div>

      <header
        className={`manzil-header ${sticky ? "manzil-header--sticky" : ""} ${className}`.trim()}
      >
        <div className="manzil-header-left">
          <img
            src={ManzilLogo}
            alt="Manzil"
            className="manzil-brand-logo"
          />
        </div>

        {centerContent}

        <div className="manzil-header-right">
          {showDefaultNav && (
            <nav className="manzil-header-nav" aria-label="Primary">
              {DEFAULT_NAV_ITEMS.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className="manzil-header-link"
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              ))}
              <div className="manzil-header-avatar" title={userName || "Profile"}>
                {userInitial}
              </div>
            </nav>
          )}
          {right}
        </div>
      </header>
    </>
  );
}
