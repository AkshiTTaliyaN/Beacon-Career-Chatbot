import FloatingBackground from "./FloatingBackground";

export default function HeroBanner({
  onStart,
  title,
  subtitle,
  badges,
  ctaText = "Take the Test →",
  imageSrc,
  imageAlt = "Student exploring career options",
  imageCaption,
  children,
}) {
  return (
    <section className="apt-hero">
      <FloatingBackground />

      <div className="apt-hero-inner">
        <div className="apt-hero-content">
          {badges?.length ? (
            <div className="apt-hero-badges">
              {badges.map((b) => (
                <span key={b} className="apt-badge">
                  {b}
                </span>
              ))}
            </div>
          ) : null}

          {title ? <h1 className="apt-hero-title">{title}</h1> : null}
          {subtitle ? <p className="apt-hero-sub">{subtitle}</p> : null}
          {children ? <div className="apt-hero-children">{children}</div> : null}

          {onStart ? (
            <button type="button" className="apt-btn apt-btn-primary" onClick={onStart}>
              {ctaText}
            </button>
          ) : null}
        </div>

        {imageSrc ? (
          <div className="apt-hero-illustration" aria-hidden={imageCaption ? "false" : "true"}>
            <div className="apt-hero-illustration-frame">
              <img src={imageSrc} alt={imageCaption ? imageAlt : imageCaption || imageAlt} />
            </div>
            {imageCaption ? <div className="apt-hero-illustration-caption">{imageCaption}</div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

