"""
expert_system.py
Rule-based expert consultation engine for Beacon Career Chatbot.

Takes a career title and student profile, applies compatibility rules,
and returns a structured consultation result with scores, warnings,
a personalised roadmap, relevant exams, and backup career suggestions.
"""

from typing import Any

from career_catalog import CAREER_CATALOG
from exams_catalog import EXAMS_CATALOG


# ─── Helpers ──────────────────────────────────────────────────────────────────


def _find_career(title: str) -> dict | None:
    """Return the career dict whose title matches (case-insensitive)."""
    title_lower = title.strip().lower()
    for career in CAREER_CATALOG:
        if career["title"].strip().lower() == title_lower:
            return career
    return None


def _top_riasec(riasec_scores: dict[str, float]) -> str | None:
    """Return the RIASEC code with the highest score, or None."""
    if not riasec_scores:
        return None
    return max(riasec_scores, key=lambda k: riasec_scores[k])


def _clamp(value: int, lo: int = 0, hi: int = 100) -> int:
    return max(lo, min(hi, value))


def _status_from_score(score: int) -> str:
    if score >= 70:
        return "green"
    elif score >= 40:
        return "amber"
    return "red"


# ─── Rule Functions ───────────────────────────────────────────────────────────
# Each rule receives the same context dict and mutates score / lists in place.


def _rule_stream_compatibility(ctx: dict) -> None:
    """Rule 1 — Stream Compatibility.

    If the student's stream is not in the career's accepted streams list,
    apply a heavy penalty and flag red.
    """
    career = ctx["career"]
    stream = ctx["profile"].get("stream", "").strip().lower()

    if stream and stream not in career.get("streams", []):
        ctx["score"] -= 60
        ctx["force_status"] = "red"
        ctx["warnings"].append(
            f"Your current stream ({stream.upper()}) is not typically aligned with "
            f"{career['title']}. The recommended streams are: "
            f"{', '.join(s.upper() for s in career['streams'])}."
        )


def _rule_academic_strength(ctx: dict) -> None:
    """Rule 2 — Academic Strength.

    For every high-weight subject in the career, check the student's
    self-rated proficiency and adjust score accordingly.
    """
    career = ctx["career"]
    ratings = ctx["profile"].get("subject_ratings", {})

    for subject, weight in career.get("subject_weights", {}).items():
        if weight < 0.75:
            continue

        student_rating = ratings.get(subject)
        if student_rating is None:
            continue  # no data for this subject — skip silently

        if student_rating <= 2:
            ctx["score"] -= 15
            ctx["warnings"].append(
                f"Your self-rated proficiency in {subject} ({student_rating}/5) is below "
                f"the level typically needed for {career['title']}. Consider focused improvement."
            )
            if ctx["current_status"] != "red":
                ctx["current_status"] = "amber"
        elif student_rating >= 4:
            ctx["score"] += 5
            ctx["strengths"].append(
                f"Strong proficiency in {subject} ({student_rating}/5) — "
                f"a key subject for {career['title']}."
            )


def _rule_study_hours(ctx: dict) -> None:
    """Rule 3 — Study Hours vs Competitive Exam requirement.

    If the career has related entrance exams and the student studies
    very few hours, add a warning.
    """
    career = ctx["career"]
    study_hours = ctx["profile"].get("study_hours", "")
    related_exams = _match_exams(career, ctx["profile"])

    if related_exams and study_hours in ("lt1", "1to2"):
        ctx["score"] -= 10
        ctx["warnings"].append(
            f"{career['title']} typically requires clearing competitive exams "
            f"({', '.join(e['name'] for e in related_exams[:3])}). "
            f"Your current study commitment ({study_hours} hrs/day) may need to increase."
        )
        if ctx["current_status"] != "red":
            ctx["current_status"] = "amber"


def _rule_financial_feasibility(ctx: dict) -> None:
    """Rule 4 — Financial Feasibility.

    If cost is a concern and the career pathway is expensive, add
    practical warnings and checklist items.
    """
    career = ctx["career"]
    cost_constraint = ctx["profile"].get("cost_constraint", "").strip().lower()

    if cost_constraint == "yes" and career.get("cost_level") == "high":
        ctx["score"] -= 10
        ctx["warnings"].append(
            f"The typical education pathway for {career['title']} involves high costs. "
            f"Financial planning is essential."
        )
        ctx["checklist"].extend([
            "Research government colleges and institutions with subsidised fees for this field.",
            "Apply for merit-based scholarships and fee-waiver programmes early.",
            "Explore education loan options with nationalised banks (lower interest rates).",
        ])


def _rule_relocation(ctx: dict) -> None:
    """Rule 5 — Relocation Preference.

    If the student prefers not to relocate but the career typically
    requires it, add a minor penalty.
    """
    career = ctx["career"]
    relocation_pref = ctx["profile"].get("relocation_pref", "").strip().lower()

    if relocation_pref == "no" and career.get("requires_relocation", False):
        ctx["score"] -= 5
        ctx["warnings"].append(
            f"{career['title']} often requires relocation (e.g. field postings, "
            f"metro-based roles, or on-site work). This may conflict with your "
            f"preference to stay local."
        )


def _rule_riasec_alignment(ctx: dict) -> None:
    """Bonus — RIASEC Alignment.

    Match student's dominant RIASEC code against the career's primary
    and secondary codes.
    """
    career = ctx["career"]
    riasec_scores = ctx["profile"].get("riasec_scores", {})
    top_code = _top_riasec(riasec_scores)

    if not top_code:
        return

    top_code = top_code.strip().upper()

    if top_code == career.get("riasec_primary", "").upper():
        ctx["score"] += 5
        ctx["strengths"].append(
            f"Your dominant personality type ({top_code}) matches the primary RIASEC "
            f"code for {career['title']} — a strong natural fit."
        )
    elif top_code == career.get("riasec_secondary", "").upper():
        ctx["score"] += 3
        ctx["strengths"].append(
            f"Your dominant personality type ({top_code}) aligns with the secondary "
            f"RIASEC code for {career['title']} — a supportive fit."
        )


# ─── Exam Matching ────────────────────────────────────────────────────────────


def _match_exams(career: dict, profile: dict) -> list[dict]:
    """Return exams from EXAMS_CATALOG that are relevant to this career + profile.

    An exam matches when:
    1. The student's stream is in the exam's eligibility_streams (or exam accepts 'any').
    2. The career title is in the exam's related_careers.
    3. The student's current class >= exam's min_class - 2 (preparation window).
    """
    stream = profile.get("stream", "").strip().lower()
    current_class = profile.get("current_class", 12)
    career_title = career["title"]

    matched: list[dict] = []

    for exam in EXAMS_CATALOG:
        # Stream eligibility
        eligible_streams = [s.lower() for s in exam.get("eligibility_streams", [])]
        if stream and stream not in eligible_streams and "any" not in eligible_streams:
            continue

        # Career relevance
        if career_title not in exam.get("related_careers", []):
            continue

        # Class-level readiness (allow 2-year prep window)
        if current_class < exam.get("min_class", 12) - 2:
            continue

        matched.append({
            "name": exam["name"],
            "timeline": exam["timeline"],
            "prep_focus": exam["prep_focus"],
            "leads_to": exam["leads_to"],
        })

    return matched


# ─── Roadmap Generation ──────────────────────────────────────────────────────


_PHASE_TEMPLATES: list[dict[str, Any]] = [
    {
        "phase": "Phase 1",
        "title": "Foundations (Class 9–10)",
        "class_range": (9, 10),
        "base_items": [
            "Build strong fundamentals in core subjects.",
            "Explore interests through projects, competitions, and reading.",
            "Start developing good study habits and time-management skills.",
        ],
    },
    {
        "phase": "Phase 2",
        "title": "Core Academic Build (Class 11)",
        "class_range": (11, 11),
        "base_items": [
            "Choose the right stream and optional subjects aligned with your career goal.",
            "Begin structured preparation for relevant entrance exams.",
            "Join coaching / online courses if needed and build a study schedule.",
        ],
    },
    {
        "phase": "Phase 3",
        "title": "Intensive Prep (Class 12 — First Half)",
        "class_range": (12, 12),
        "base_items": [
            "Intensify entrance-exam preparation with timed mock tests.",
            "Complete the Class 12 syllabus alongside exam prep.",
            "Apply for exam registrations and keep documents ready.",
        ],
    },
    {
        "phase": "Phase 4",
        "title": "Revision & Testing (Class 12 — Second Half)",
        "class_range": (13, 99),  # effectively 12 second half and beyond
        "base_items": [
            "Full-length mock tests and previous-year paper practice.",
            "Revise weak areas identified in mocks.",
            "Board exam preparation and final entrance exam attempts.",
        ],
    },
]


def _generate_roadmap(career: dict, profile: dict) -> list[dict]:
    """Build a 4-phase roadmap, skipping phases below the student's class."""
    current_class = profile.get("current_class", 9)
    subject_weights = career.get("subject_weights", {})
    top_subjects = sorted(subject_weights, key=subject_weights.get, reverse=True)[:3]  # type: ignore[arg-type]

    related_exams = _match_exams(career, profile)
    exam_names = [e["name"] for e in related_exams]

    roadmap: list[dict] = []

    for template in _PHASE_TEMPLATES:
        lo, hi = template["class_range"]

        # Skip phases the student has already passed
        if current_class > hi:
            continue

        items = list(template["base_items"])

        # Customise with career-specific subjects
        if top_subjects:
            items.append(
                f"Focus especially on: {', '.join(top_subjects)}."
            )

        # Customise with exam info
        if exam_names:
            items.append(
                f"Target exams: {', '.join(exam_names)}."
            )

        roadmap.append({
            "phase": template["phase"],
            "title": template["title"],
            "items": items,
        })

    return roadmap


# ─── Backup Careers ───────────────────────────────────────────────────────────


def _find_backup_careers(career: dict, profile: dict, limit: int = 3) -> list[str]:
    """Find 2-3 backup careers from CAREER_CATALOG.

    Selection criteria:
    1. Same stream as the student.
    2. Shares RIASEC primary or secondary with the target career.
    3. NOT the current career.
    4. Ranked by overlap in subject_weights keys.
    """
    stream = profile.get("stream", "").strip().lower()
    riasec_primary = career.get("riasec_primary", "")
    riasec_secondary = career.get("riasec_secondary", "")
    career_subjects = set(career.get("subject_weights", {}).keys())
    career_title = career["title"]

    candidates: list[tuple[int, str]] = []

    for other in CAREER_CATALOG:
        if other["title"] == career_title:
            continue

        # Must share the student's stream
        if stream and stream not in other.get("streams", []):
            continue

        # Must share at least one RIASEC code
        shares_riasec = (
            other.get("riasec_primary") in (riasec_primary, riasec_secondary)
            or other.get("riasec_secondary") in (riasec_primary, riasec_secondary)
        )
        if not shares_riasec:
            continue

        # Score by subject overlap
        other_subjects = set(other.get("subject_weights", {}).keys())
        overlap = len(career_subjects & other_subjects)
        candidates.append((overlap, other["title"]))

    # Sort descending by overlap, then alphabetically for stability
    candidates.sort(key=lambda x: (-x[0], x[1]))

    return [title for _, title in candidates[:limit]]


# ─── Main Consultation Function ──────────────────────────────────────────────


def consult(career_title: str, profile_data: dict) -> dict:
    """Run the expert consultation engine for a given career and student profile.

    Parameters
    ----------
    career_title : str
        The title of a career from ``CAREER_CATALOG``.
    profile_data : dict
        Student profile containing keys such as ``stream``, ``current_class``,
        ``subject_ratings``, ``study_hours``, ``cost_constraint``,
        ``relocation_pref``, ``performance_band``, ``riasec_scores``,
        ``work_style``, ``career_priorities``.

    Returns
    -------
    dict
        A structured consultation result with compatibility score, status,
        strengths, warnings, action checklist, roadmap, relevant exams,
        and backup career suggestions.
    """
    # ── Find the career ──────────────────────────────────────────────────
    career = _find_career(career_title)
    if career is None:
        return {
            "career_title": career_title,
            "compatibility_score": 0,
            "status": "red",
            "strengths": [],
            "warnings": [f"Career '{career_title}' was not found in the catalog."],
            "action_checklist": [],
            "roadmap": [],
            "relevant_exams": [],
            "backup_careers": [],
        }

    # ── Initialise scoring context ───────────────────────────────────────
    ctx: dict[str, Any] = {
        "career": career,
        "profile": profile_data,
        "score": 50,            # neutral starting point
        "force_status": None,   # set by rules that force a status
        "current_status": "green",
        "strengths": [],
        "warnings": [],
        "checklist": [],
    }

    # ── Apply rules ──────────────────────────────────────────────────────
    _rule_stream_compatibility(ctx)
    _rule_academic_strength(ctx)
    _rule_study_hours(ctx)
    _rule_financial_feasibility(ctx)
    _rule_relocation(ctx)
    _rule_riasec_alignment(ctx)

    # ── Finalise score & status ──────────────────────────────────────────
    final_score = _clamp(ctx["score"])
    status = ctx["force_status"] or _status_from_score(final_score)

    # ── Build supplementary sections ─────────────────────────────────────
    relevant_exams = _match_exams(career, profile_data)
    roadmap = _generate_roadmap(career, profile_data)
    backup_careers = _find_backup_careers(career, profile_data)

    # ── Default checklist items (always useful) ──────────────────────────
    checklist = list(ctx["checklist"])
    if not checklist:
        checklist.append(
            f"Research the full education pathway for {career['title']} and identify target institutions."
        )
    checklist.append("Talk to a professional or mentor currently working in this field.")
    if relevant_exams:
        checklist.append(
            f"Register for / begin preparation for: {', '.join(e['name'] for e in relevant_exams[:3])}."
        )

    # ── Assemble result ──────────────────────────────────────────────────
    return {
        "career_title": career["title"],
        "compatibility_score": final_score,
        "status": status,
        "strengths": ctx["strengths"],
        "warnings": ctx["warnings"],
        "action_checklist": checklist,
        "roadmap": roadmap,
        "relevant_exams": relevant_exams,
        "backup_careers": backup_careers,
    }
