const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt/";

export function slugifyCareerName(name) {
  return (name || "career")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "career";
}

export function getAvatarCacheKey(careerName) {
  return `career-avatar-${slugifyCareerName(careerName)}`;
}

export function buildCareerAvatarPrompt(careerName) {
  const career = (careerName || "career professional").trim();
  return (
    `friendly modern cartoon illustration of a ${career} professional, ` +
    "educational career guidance platform, flat design, clean vector style, white background"
  );
}

export function buildCareerAvatarUrl(careerName) {
  const prompt = buildCareerAvatarPrompt(careerName);
  const encoded = encodeURIComponent(prompt);
  return `${POLLINATIONS_BASE}${encoded}?width=512&height=512&nologo=true`;
}

export function readCachedAvatarUrl(careerName) {
  try {
    const url = localStorage.getItem(getAvatarCacheKey(careerName));
    return url || null;
  } catch {
    return null;
  }
}

export function writeCachedAvatarUrl(careerName, url) {
  try {
    localStorage.setItem(getAvatarCacheKey(careerName), url);
  } catch {
    // Ignore quota errors — URL can still be used for this session.
  }
}

/** Return cached URL or build, cache, and return a new Pollinations URL. */
export function getCareerAvatarUrl(careerName) {
  const cached = readCachedAvatarUrl(careerName);
  if (cached) return cached;

  const url = buildCareerAvatarUrl(careerName);
  writeCachedAvatarUrl(careerName, url);
  return url;
}

export function preloadCareerAvatar(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error("Career avatar failed to load"));
    img.src = url;
  });
}
