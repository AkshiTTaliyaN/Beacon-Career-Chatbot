/**
 * bannerImage.js — Image / GIF abstraction layer
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  To switch provider: change PROVIDER below.                 │
 * │  Everything else (ReportPage call sites) stays the same.    │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Supported providers:
 *   "curatedGifs"  — random GIF picked from a hand-curated list (ACTIVE)
 *                    Zero setup, zero API key, works offline.
 *                    Add / remove IDs in CURATED_GIFS below.
 *
 *   "giphy"        — live random GIF from Giphy API
 *                    Requires: VITE_GIPHY_API_KEY in .env
 *                    Get key free at: https://developers.giphy.com (2 min)
 *
 *   "tenor"        — live random GIF from Tenor (Google)
 *                    Requires: VITE_TENOR_API_KEY in .env
 *
 *   "unsplash"     — random static photo (no key, but boring)
 *
 *   "google"       — Google Custom Search image
 *                    Requires: VITE_GOOGLE_API_KEY + VITE_GOOGLE_CX_ID
 */

const PROVIDER = 'curatedGifs'; // ← change this line to switch

/* ─────────────────────────────────────────────────────────────────
   CURATED GIF LIST
   Format: { id: '<giphy_id>', label: '<human description>' }

   All URLs resolve to:
     https://media.giphy.com/media/<id>/giphy-downsized.gif
   (downsized = faster load, same animation, smaller file)

   To add more: go to giphy.com → find a GIF → right-click the GIF
   → "Copy image address" → grab the ID from the URL.

   To verify a GIF: paste
     https://media.giphy.com/media/<id>/giphy-downsized.gif
   into your browser. If it loads, it's good.
   If one breaks later, just delete its entry from the list.
───────────────────────────────────────────────────────────────── */
const CURATED_GIFS = [
  // 🎉 Celebration / confetti
  { id: '3oz8xAFtqoOUUrsh7W', label: 'Gold coins rain'         },
  { id: 'l4Ep2bPV5Uh2sVEqs',  label: 'Confetti explosion'      },
  { id: '26tPnAAJxXe1rJ4Ok',  label: 'Fireworks'               },
  { id: '5GoVLqeAOo6PK',      label: 'Party popper confetti'   },
  { id: 'g9582DNuQppxC',      label: 'Streamer celebration'    },

  // 🕺 Funny dances / reactions
  { id: '3oKIPsx2A87dNgZRza', label: 'SpongeBob imagination'   },
  { id: 'QvBoMEcQ7DQXK',      label: 'SpongeBob happy dance'   },
  { id: '3otPoS81loriI9sO8o', label: 'Carlton dance'           },
  { id: 'mXuPww8oLNhCg',      label: 'Patrick Star excited'    },
  { id: '12NUbkX6p4xOO4',     label: 'Kermit flailing'         },

  // 😎 "Nailed it" / success reactions
  { id: 'GCvktC0KFy9y8',      label: 'Obama not bad'           },
  { id: 'XR9Dp54ZTN5RO',      label: 'Dwight YESSS'            },
  { id: 'artj92V8o75tu',      label: 'Nailed it!'              },
  { id: 'Ka4fEXJNDGMXcUrJeC', label: 'Michael Scott yes!'      },
  { id: 'Ld3bgQUEiLpHjRFZRR', label: 'Excited jump'            },

  // 🙌 High energy / hype
  { id: 'l0HlHFRbmaZtBcoDa',  label: 'High five celebration'   },
  { id: 'ZfK4cXKJTTay1Ava03', label: 'Oprah you get a car'     },
  { id: 'YRMb6dd7zprS00JdGZ', label: 'Happy dance'             },
  { id: 'l0MYt5jPR6QX5pnqM',  label: 'Minions celebrating'     },
  { id: 'J5bMzUG4G28XF7TPUQ', label: 'Legend congratulations'  },
];

/** Pick a random entry from the curated list */
function randomGif() {
  const pick = CURATED_GIFS[Math.floor(Math.random() * CURATED_GIFS.length)];
  // giphy-downsized loads faster than giphy.gif (smaller file, same loop)
  return `https://media.giphy.com/media/${pick.id}/giphy-downsized.gif`;
}

/* ─── Provider resolvers ──────────────────────────────────────── */
const IMAGE_PROVIDERS = {

  /** Zero-setup curated GIF list — ACTIVE provider */
  curatedGifs: () => randomGif(),

  /**
   * Giphy live API — plug in when faculty approves.
   * Free key: https://developers.giphy.com (takes 2 min)
   * Add VITE_GIPHY_API_KEY to beacon-frontend/.env
   */
  giphy: async ({ query = 'nailed it celebrate' } = {}) => {
    const key = import.meta.env.VITE_GIPHY_API_KEY;
    if (!key) throw new Error('VITE_GIPHY_API_KEY not set in .env');
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${key}&tag=${encodeURIComponent(query)}&rating=g`
    );
    const { data } = await res.json();
    return data?.images?.downsized?.url || data?.images?.original?.url || null;
  },

  /**
   * Tenor — plug in when faculty approves.
   * Add VITE_TENOR_API_KEY to beacon-frontend/.env
   */
  tenor: async ({ query = 'nailed it celebrate' } = {}) => {
    const key = import.meta.env.VITE_TENOR_API_KEY;
    if (!key) throw new Error('VITE_TENOR_API_KEY not set in .env');
    const res = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${key}&limit=1&media_filter=gif`
    );
    const { results } = await res.json();
    return results?.[0]?.media_formats?.gif?.url || null;
  },

  /**
   * Unsplash random static photo — fallback, no key needed.
   * Note: source.unsplash.com/random is deprecated and unreliable.
   */
  unsplash: ({ query = 'career,success', width = 900, height = 260 } = {}) =>
    `https://source.unsplash.com/random/${width}x${height}?${query}`,

  /**
   * Google Custom Search — static image.
   * Requires: VITE_GOOGLE_API_KEY + VITE_GOOGLE_CX_ID in .env
   * Free tier: 100 queries/day.
   */
  google: async ({ query = 'career success student' } = {}) => {
    const key = import.meta.env.VITE_GOOGLE_API_KEY;
    const cx  = import.meta.env.VITE_GOOGLE_CX_ID;
    if (!key || !cx) throw new Error('VITE_GOOGLE_API_KEY or VITE_GOOGLE_CX_ID not set in .env');
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&key=${key}&cx=${cx}&num=1`
    );
    const json = await res.json();
    return json.items?.[0]?.link || null;
  },
};

/**
 * getCareerBannerImage(options?)
 * Returns a URL string, or null on error.
 * Always safe to call — errors are caught and logged silently.
 */
export async function getCareerBannerImage(options = {}) {
  try {
    const resolver = IMAGE_PROVIDERS[PROVIDER];
    if (!resolver) throw new Error(`Unknown image provider: "${PROVIDER}"`);
    return await resolver(options);
  } catch (err) {
    console.warn('[bannerImage] Could not get banner image:', err.message);
    return null;
  }
}
