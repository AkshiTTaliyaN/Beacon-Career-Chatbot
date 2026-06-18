"""
Career avatar generation with Gemini/Imagen and filesystem caching.
Any career title can be used — no manual career-to-image mappings required.
"""
from __future__ import annotations

import base64
import json
import os
import re
import time
from pathlib import Path

from dotenv import load_dotenv

_backend_root = Path(__file__).resolve().parent
load_dotenv(_backend_root / ".env")
# Reuse the main portal Gemini key in local dev if aptitude-backend/.env is absent.
load_dotenv(_backend_root.parent / "beacon-backend" / ".env")

DEBUG_LOG_PATH = _backend_root.parent / ".cursor" / "debug-3cdc56.log"


def _debug_log(location: str, message: str, data: dict, hypothesis_id: str) -> None:
    try:
        payload = {
            "sessionId": "3cdc56",
            "location": location,
            "message": message,
            "data": data,
            "timestamp": int(time.time() * 1000),
            "hypothesisId": hypothesis_id,
        }
        with open(DEBUG_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(payload) + "\n")
    except Exception:
        pass

CACHE_DIR = Path(__file__).resolve().parent / "data" / "career_avatar_cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

PROMPT_TEMPLATE = (
    "Create a clean, professional, friendly cartoon avatar of a {career_name} "
    "for a student career guidance platform. Modern flat illustration style, "
    "transparent background, high quality, educational and trustworthy appearance. "
    "Single character portrait, square composition, no text, no watermark."
)

GENERATION_ATTEMPTS = (
    ("imagen", "imagen-4.0-fast-generate-001"),
    ("imagen", "imagen-4.0-generate-001"),
    ("gemini", "gemini-2.5-flash-image"),
)


def slugify_career_name(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", (name or "career").lower().strip())
    return slug.strip("-") or "career"


def _cache_path(slug: str, ext: str) -> Path:
    return CACHE_DIR / f"{slug}.{ext}"


def read_cache(slug: str) -> tuple[bytes, str] | None:
    for ext, mime in (("png", "image/png"), ("jpg", "image/jpeg"), ("webp", "image/webp")):
        path = _cache_path(slug, ext)
        if path.is_file():
            return path.read_bytes(), mime
    return None


def write_cache(slug: str, data: bytes, mime: str = "image/png") -> None:
    ext_map = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp"}
    ext = ext_map.get(mime, "png")
    _cache_path(slug, ext).write_bytes(data)


def build_prompt(career_name: str) -> str:
    return PROMPT_TEMPLATE.format(career_name=career_name.strip())


def generate_placeholder_svg(career_name: str) -> bytes:
    safe_name = (
        (career_name or "Your Career Match")
        .replace("&", "&amp;")
        .replace("<", "")
        .replace(">", "")
        .replace('"', "'")[:32]
    )
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fbff"/>
      <stop offset="100%" stop-color="#eef4ff"/>
    </linearGradient>
    <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#426FB1"/>
      <stop offset="100%" stop-color="#2C5492"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="56" fill="url(#bg)"/>
  <circle cx="256" cy="188" r="86" fill="#2C5492" opacity="0.12"/>
  <circle cx="256" cy="172" r="62" fill="#F4C9A8"/>
  <path d="M194 156c12-28 40-44 62-44s50 16 62 44c-18 10-38 16-62 16s-44-6-62-16z" fill="#2C5492"/>
  <rect x="168" y="248" width="176" height="132" rx="40" fill="url(#shirt)"/>
  <rect x="214" y="300" width="84" height="58" rx="14" fill="#EAF1FB" stroke="#2C5492" stroke-width="4"/>
  <circle cx="256" cy="329" r="10" fill="#2C5492"/>
  <text x="256" y="438" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#111827">{safe_name}</text>
</svg>"""
    return svg.encode("utf-8")


def _generate_with_imagen(client, model: str, career_name: str) -> tuple[bytes, str] | None:
    from google.genai import types

    response = client.models.generate_images(
        model=model,
        prompt=build_prompt(career_name),
        config=types.GenerateImagesConfig(
            number_of_images=1,
            output_mime_type="image/png",
            aspect_ratio="1:1",
        ),
    )
    images = getattr(response, "generated_images", None) or []
    if not images:
        return None
    image_obj = images[0].image
    data = getattr(image_obj, "image_bytes", None)
    if data:
        return data, "image/png"
    return None


def _generate_with_gemini(client, model: str, career_name: str) -> tuple[bytes, str] | None:
    from google.genai import types

    response = client.models.generate_content(
        model=model,
        contents=build_prompt(career_name),
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            image_config=types.ImageConfig(aspect_ratio="1:1"),
        ),
    )
    candidates = getattr(response, "candidates", None) or []
    for candidate in candidates:
        content = getattr(candidate, "content", None)
        if not content:
            continue
        for part in content.parts or []:
            inline = getattr(part, "inline_data", None)
            if inline and inline.data:
                mime = inline.mime_type or "image/png"
                return inline.data, mime
    return None


def _generate_avatar_bytes(career_name: str) -> tuple[tuple[bytes, str] | None, str | None]:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    has_key = bool(api_key)
    # #region agent log
    _debug_log(
        "career_avatar_service.py:_generate_avatar_bytes:entry",
        "generation attempt",
        {"has_api_key": has_key, "career_name": career_name},
        "A",
    )
    # #endregion
    if not api_key:
        return None, "GEMINI_API_KEY not set"

    try:
        from google import genai
    except Exception as exc:
        # #region agent log
        _debug_log(
            "career_avatar_service.py:_generate_avatar_bytes:import",
            "google-genai import failed",
            {"error": f"{type(exc).__name__}: {exc}"},
            "A",
        )
        # #endregion
        print(f"[career_avatar] google-genai import failed: {exc}")
        return None, f"google-genai not installed: {exc}"

    client = genai.Client(api_key=api_key)
    last_error = None

    for kind, model in GENERATION_ATTEMPTS:
        try:
            if kind == "imagen":
                result = _generate_with_imagen(client, model, career_name)
            else:
                result = _generate_with_gemini(client, model, career_name)
            if result:
                # #region agent log
                _debug_log(
                    "career_avatar_service.py:_generate_avatar_bytes:success",
                    "image generated",
                    {"model": model, "kind": kind},
                    "C",
                )
                # #endregion
                return result, None
        except Exception as exc:
            last_error = str(exc)[:300]
            print(f"[career_avatar] {model} failed for '{career_name}': {exc}")
            # #region agent log
            _debug_log(
                "career_avatar_service.py:_generate_avatar_bytes:model_fail",
                "model attempt failed",
                {"model": model, "error": last_error},
                "C",
            )
            # #endregion
    # #region agent log
    _debug_log(
        "career_avatar_service.py:_generate_avatar_bytes:exhausted",
        "all models failed",
        {"career_name": career_name, "last_error": last_error},
        "C",
    )
    # #endregion
    return None, last_error or "all generation models failed"


def get_career_avatar(career_name: str) -> dict:
    career_name = (career_name or "Career Professional").strip()
    slug = slugify_career_name(career_name)
    # #region agent log
    _debug_log(
        "career_avatar_service.py:get_career_avatar:entry",
        "endpoint handler called",
        {"career_name": career_name, "slug": slug},
        "B",
    )
    # #endregion

    cached = read_cache(slug)
    if cached:
        data, mime = cached
        # #region agent log
        _debug_log(
            "career_avatar_service.py:get_career_avatar:fs_cache",
            "filesystem cache hit",
            {"slug": slug, "mime": mime},
            "D",
        )
        # #endregion
        return {
            "career_name": career_name,
            "slug": slug,
            "image_base64": base64.b64encode(data).decode("ascii"),
            "mime_type": mime,
            "cached": True,
            "source": "cache",
            "configured": True,
        }

    has_key = bool(os.getenv("GEMINI_API_KEY", "").strip())
    generated, generation_error = _generate_avatar_bytes(career_name)

    if generated:
        data, mime = generated
        write_cache(slug, data, mime)
        # #region agent log
        _debug_log(
            "career_avatar_service.py:get_career_avatar:generated",
            "returning generated image",
            {"slug": slug, "mime": mime},
            "C",
        )
        # #endregion
        return {
            "career_name": career_name,
            "slug": slug,
            "image_base64": base64.b64encode(data).decode("ascii"),
            "mime_type": mime,
            "cached": False,
            "source": "generated",
            "configured": True,
        }

    placeholder = generate_placeholder_svg(career_name)
    # #region agent log
    _debug_log(
        "career_avatar_service.py:get_career_avatar:placeholder",
        "returning placeholder",
        {"slug": slug, "has_api_key": has_key, "configured": has_key},
        "A",
    )
    # #endregion
    return {
        "career_name": career_name,
        "slug": slug,
        "image_base64": base64.b64encode(placeholder).decode("ascii"),
        "mime_type": "image/svg+xml",
        "cached": False,
        "source": "placeholder" if has_key else "unconfigured",
        "configured": has_key,
        "generation_error": generation_error,
    }
