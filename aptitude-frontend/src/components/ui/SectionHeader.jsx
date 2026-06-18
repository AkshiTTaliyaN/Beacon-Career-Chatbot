export default function SectionHeader({ icon, title, subtitle, accentColor = "#00d4ff" }) {
  return (
    <div className="apt-section-header">
      <div className="apt-section-header-accent" style={{ background: accentColor }} />
      {icon ? <div className="apt-section-header-icon">{icon}</div> : null}
      <div className="apt-section-header-text">
        <h2 className="apt-section-title">{title}</h2>
        {subtitle ? <p className="apt-section-subtitle">{subtitle}</p> : null}
      </div>
    </div>
  );
}

