import EdCilLogo from "../assets/edcil.jpeg";
import "./ManzilHeader.css";

export default function ManzilHeader({
  title = "Manzil",
  subtitle,
  center,
  right,
  className = "",
  sticky = true,
}) {
  return (
    <header
      className={`manzil-header ${sticky ? "manzil-header--sticky" : ""} ${className}`.trim()}
    >
      <div className="manzil-header-left">
        <img
          src={EdCilLogo}
          alt="EdCIL (India) Limited"
          className="manzil-header-logo"
        />
        <div className="manzil-header-brand">
          <span className="manzil-header-title">{title}</span>
          {subtitle ? <span className="manzil-header-subtitle">{subtitle}</span> : null}
        </div>
      </div>

      {center ? <div className="manzil-header-center">{center}</div> : null}

      {right ? <div className="manzil-header-right">{right}</div> : null}
    </header>
  );
}
