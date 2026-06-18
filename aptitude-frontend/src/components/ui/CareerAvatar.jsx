import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  buildCareerAvatarUrl,
  getCareerAvatarUrl,
  preloadCareerAvatar,
  readCachedAvatarUrl,
  writeCachedAvatarUrl,
} from "../../utils/careerAvatar";

function CareerIllustrationSkeleton({ variant }) {
  return (
    <div
      className={`career-illustration career-illustration--loading career-illustration--${variant}`}
      aria-hidden="true"
    >
      <div className="career-illustration-skeleton-shimmer" />
      <div className="career-illustration-skeleton-body">
        <div className="career-illustration-skeleton-icon" />
        <span />
        <span />
      </div>
    </div>
  );
}

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
  showCaption = false,
  className = "",
}) {
  const [status, setStatus] = useState("loading");
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!careerName?.trim()) {
      setStatus("error");
      setImageUrl(null);
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setImageUrl(null);

    async function loadAvatar() {
      const cachedUrl = readCachedAvatarUrl(careerName);
      const url = cachedUrl || getCareerAvatarUrl(careerName);

      try {
        await preloadCareerAvatar(url);
        if (cancelled) return;
        setImageUrl(url);
        setStatus("ready");
      } catch {
        if (cancelled) return;

        // Cached URL may be stale — retry once with a fresh URL.
        if (cachedUrl) {
          try {
            const freshUrl = buildCareerAvatarUrl(careerName);
            writeCachedAvatarUrl(careerName, freshUrl);
            await preloadCareerAvatar(freshUrl);
            if (cancelled) return;
            setImageUrl(freshUrl);
            setStatus("ready");
            return;
          } catch {
            // Fall through to fallback illustration.
          }
        }

        setStatus("error");
        setImageUrl(null);
      }
    }

    loadAvatar();
    return () => {
      cancelled = true;
    };
  }, [careerName]);

  if (status === "loading") {
    return <CareerIllustrationSkeleton variant={variant} />;
  }

  if (status === "error" || !imageUrl) {
    return (
      <CareerIllustrationFallback
        careerName={careerName}
        accentColor={accentColor}
        variant={variant}
      />
    );
  }

  return (
    <motion.div
      className={`career-illustration career-illustration--ready career-illustration--${variant} ${className}`.trim()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={imageUrl}
        alt={`Illustration of a ${careerName}`}
        className="career-illustration-image"
        loading="eager"
        onError={() => {
          setStatus("error");
          setImageUrl(null);
        }}
      />
      {showCaption ? <p className="career-illustration-caption">{careerName}</p> : null}
    </motion.div>
  );
}
