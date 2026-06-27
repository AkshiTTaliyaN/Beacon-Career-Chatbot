// In-memory cache to avoid duplicate calls during component lifecycle
const memCache = {};

/**
 * Checks if a text string is worth translating (e.g. not just numbers, emojis, or symbols).
 * @param {string} text 
 * @returns {boolean}
 */
function shouldTranslate(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  
  // Avoid translating strings that only contain numbers, punctuation, emojis, and symbols
  const regexOnlySymbolsAndNumbers = /^[0-9\s.,%+\-*\/()$#@!?:;'"\\|\[\]{}<>_~`👋🎉🔬🎨🤝📈📋🧠💼🏫⚡⏳🎓📍🌟🎯]*$/;
  if (regexOnlySymbolsAndNumbers.test(trimmed)) {
    return false;
  }
  
  return true;
}

/**
 * Translates English text to the target language (default 'km' for Khmer).
 * Uses in-memory and localStorage caches for performance.
 * 
 * @param {string} text 
 * @param {string} targetLang 
 * @returns {Promise<string>}
 */
export async function translateText(text, targetLang = 'km') {
  if (!shouldTranslate(text)) return '';

  const cacheKey = `${targetLang}:${text}`;

  // 1. Check in-memory cache
  if (memCache[cacheKey]) {
    return memCache[cacheKey];
  }

  // 2. Check localStorage cache
  try {
    const cached = localStorage.getItem(`lang_cache:${cacheKey}`);
    if (cached) {
      memCache[cacheKey] = cached;
      return cached;
    }
  } catch (e) {
    console.warn('localStorage read error:', e);
  }

  // 3. Fetch from unofficial Google Translate single API
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Translate API returned code ${res.status}`);
    
    const data = await res.json();
    
    // Parse Google Translate single API response format:
    // [[[translatedText, originalText, ...], ...], ...]
    if (data && data[0] && Array.isArray(data[0])) {
      const translatedText = data[0]
        .map(segment => segment[0])
        .filter(Boolean)
        .join('');
        
      if (translatedText) {
        // Save to memory cache
        memCache[cacheKey] = translatedText;
        // Save to localStorage cache
        try {
          localStorage.setItem(`lang_cache:${cacheKey}`, translatedText);
        } catch (e) {
          console.warn('localStorage write error:', e);
        }
        return translatedText;
      }
    }
  } catch (err) {
    console.error('Translation failed:', err);
  }

  return '';
}
