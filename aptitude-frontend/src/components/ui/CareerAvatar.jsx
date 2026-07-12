function CareerIllustrationFallback({ careerName, accentColor, variant }) {
  return (
    <div
      className={`career-illustration career-illustration--fallback career-illustration--${variant}`}
      style={{ "--career-accent": accentColor }}
      role="img"
      aria-label={`Career illustration for ${careerName}`}
    >
      <div className="career-illustration-fallback-scene" aria-hidden="true">
        <div className="career-illustration-fallback-glow" />
        <div className="career-illustration-fallback-figure">
          <div className="career-illustration-fallback-head" />
          <div className="career-illustration-fallback-torso" />
          <div className="career-illustration-fallback-prop" />
        </div>
      </div>
      <p className="career-illustration-fallback-label">{careerName}</p>
    </div>
  );
}

export default function CareerAvatar({
  careerName,
  accentColor = "#2C5492",
  variant = "hero",
}) {
  return (
    <CareerIllustrationFallback
      careerName={careerName}
      accentColor={accentColor}
      variant={variant}
    />
  );
}