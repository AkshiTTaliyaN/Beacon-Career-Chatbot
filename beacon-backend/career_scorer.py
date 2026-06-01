"""
career_scorer.py
Five-component unified career scoring engine.
Weights: RIASEC 35% | Subject 25% | WorkStyle 20% | Priorities 12% | Feasibility 8%
"""

from typing import Optional
from career_catalog import CAREER_CATALOG


# ─── Component 1 — RIASEC Match (35%) ─────────────────────────────────────────

def _riasec_score(student_scores: dict, career: dict) -> float:
    """
    Primary type contributes 70%, secondary 30%.
    student_scores: {"R": 72, "I": 89, "A": 45, "S": 38, "E": 55, "C": 61}
    Returns normalised 0–1.
    """
    primary = career["riasec_primary"]
    secondary = career["riasec_secondary"]
    p = student_scores.get(primary, 50)
    s = student_scores.get(secondary, 50)
    return (p * 0.7 + s * 0.3) / 100


# ─── Component 2 — Subject Strength (25%) ─────────────────────────────────────

def _subject_score(student_ratings: dict, career: dict) -> float:
    """
    student_ratings: {"mathematics": 4, "computerScience": 5, ...} (1–5 scale)
    career subject_weights: {"mathematics": 0.9, "computerScience": 0.8, ...}
    Returns 0–1, or 0.5 (neutral) if no relevant subjects present.
    """
    weights = career.get("subject_weights", {})
    if not weights:
        return 0.5

    numerator = 0.0
    denominator = 0.0
    for subject, weight in weights.items():
        if subject in student_ratings:
            rating = student_ratings[subject]
            numerator += (rating / 5.0) * weight
            denominator += weight

    if denominator == 0:
        return 0.5  # no matching subjects — neutral score
    return numerator / denominator


# ─── Component 3 — Work Style Alignment (20%) ─────────────────────────────────

def _workstyle_score(student_workstyle: dict, career: dict) -> float:
    """
    student_workstyle: {"building": 2, "researching": 5, ...} (1–5 scale)
    career workstyle_weights: {"researching": 0.9, ...}
    Returns 0–1, or 0.5 if no workstyle data.
    """
    weights = career.get("workstyle_weights", {})
    if not weights or not student_workstyle:
        return 0.5

    numerator = 0.0
    denominator = 0.0
    for axis, weight in weights.items():
        if axis in student_workstyle:
            val = student_workstyle[axis]
            numerator += (val / 5.0) * weight
            denominator += weight

    if denominator == 0:
        return 0.5
    return numerator / denominator


# ─── Component 4 — Career Priorities (12%) ────────────────────────────────────

def _priority_score(student_priorities: list, career: dict) -> float:
    """
    student_priorities: ["Intellectual Challenge", "High Salary", "Work Life Balance"]
    career priority_alignment: ["Intellectual Challenge", "High Salary"]
    Score = matched / 3 (since student always picks exactly 3).
    Returns 0–1, or 0.5 if no priority data.
    """
    if not student_priorities:
        return 0.5
    alignment = set(career.get("priority_alignment", []))
    student_set = set(student_priorities)
    matches = len(student_set & alignment)
    return matches / 3.0


# ─── Component 5 — Feasibility (8%) ───────────────────────────────────────────

HARD_FILTER_EXCLUDE = "EXCLUDE"

def _feasibility_score(profile_data: dict, career: dict) -> str | float:
    """
    Returns HARD_FILTER_EXCLUDE if career fails hard filters.
    Otherwise returns 0–1 soft feasibility score.
    """
    student_stream = profile_data.get("stream")        # e.g. "pcm"
    cost_constraint = profile_data.get("cost_constraint")  # "yes" | "scholarship" | "moderate" | "no"
    target_sector = profile_data.get("target_sector")  # "govt" | "private" | "study" | "entrepreneur" | "open"
    relocation_pref = profile_data.get("relocation_pref")  # "yes" | "state" | "no" | "unsure"

    # ── Hard filter 1: stream must match ──────────────────────────────────────
    career_streams = career.get("streams", [])
    if student_stream and career_streams and student_stream not in career_streams:
        return HARD_FILTER_EXCLUDE

    # ── Hard filter 2: cost — student needs low cost, career is high cost ─────
    if cost_constraint == "yes" and career.get("cost_level") == "high":
        return HARD_FILTER_EXCLUDE

    # ── Soft feasibility score ────────────────────────────────────────────────
    score = 0.0

    # Sector match (0.5)
    career_sector = career.get("sector", "open")
    if target_sector == "open" or not target_sector or career_sector == target_sector:
        score += 0.5
    elif target_sector == "study" and career_sector in ("study", "private"):
        score += 0.3  # partial — research/study paths partially compatible with private

    # Relocation (0.3)
    requires_relocation = career.get("requires_relocation", False)
    if not requires_relocation:
        score += 0.3  # doesn't require relocation → always feasible
    elif relocation_pref in ("yes", "state", "unsure") or not relocation_pref:
        score += 0.3  # student open to it
    # else: career requires relocation, student won't → 0 pts

    # Cost compatibility (0.2)
    career_cost = career.get("cost_level", "medium")
    if cost_constraint == "no":
        score += 0.2
    elif cost_constraint == "moderate" and career_cost in ("low", "medium"):
        score += 0.2
    elif cost_constraint == "scholarship" and career_cost in ("low", "medium"):
        score += 0.15
    elif cost_constraint == "yes" and career_cost == "low":
        score += 0.2
    elif career_cost == "low":
        score += 0.1

    return min(score, 1.0)


# ─── Reason Generator ─────────────────────────────────────────────────────────

RIASEC_LABELS = {
    "I": "Investigative",
    "R": "Realistic",
    "A": "Artistic",
    "S": "Social",
    "E": "Enterprising",
    "C": "Conventional",
}

def _generate_reason(
    career: dict,
    component_scores: dict,
    student_data: dict,
) -> str:
    """
    Identifies the top 2 contributing components and generates a 2-sentence reason.
    component_scores: {"riasec": (score, weight), "subject": ..., ...}
    """
    # Compute weighted contributions
    contributions = {
        k: v[0] * v[1]
        for k, v in component_scores.items()
        if k != "feasibility"  # feasibility is a filter, not a reason
    }
    ranked = sorted(contributions.items(), key=lambda x: x[1], reverse=True)
    top1, top2 = ranked[0][0], ranked[1][0]

    # Build first sentence from top signals
    primary_label = RIASEC_LABELS.get(career["riasec_primary"], career["riasec_primary"])
    subject_ratings = student_data.get("subject_ratings") or {}
    top_subject = ""
    if subject_ratings:
        best = max(subject_ratings.items(), key=lambda x: x[1], default=None)
        if best:
            top_subject = best[0].replace("computerScience", "Computer Science") \
                                  .replace("businessStudies", "Business Studies") \
                                  .replace("politicalScience", "Political Science")
            top_subject = top_subject[0].upper() + top_subject[1:]

    # Sentence templates per signal combination
    if top1 == "riasec" and top2 == "subject":
        if top_subject:
            intro = (
                f"Your {primary_label} personality score and your strong performance in {top_subject} "
                f"make this a well-matched career for you."
            )
        else:
            intro = (
                f"Your {primary_label} personality score is the strongest signal here — "
                f"this career is built for the way you naturally think and work."
            )
    elif top1 == "riasec" and top2 == "workstyle":
        intro = (
            f"Your {primary_label} personality score and the way you described your preferred work style "
            f"both point strongly toward this career."
        )
    elif top1 == "riasec" and top2 == "priorities":
        intro = (
            f"Your {primary_label} personality score and the career priorities you selected "
            f"align closely with what this path offers."
        )
    elif top1 == "subject" and top2 == "riasec":
        if top_subject:
            intro = (
                f"Your strength in {top_subject} and your {primary_label} personality type "
                f"together make this a strong academic and personality fit."
            )
        else:
            intro = (
                f"Your subject profile and {primary_label} personality type "
                f"together point to this career."
            )
    elif top1 == "subject" and top2 == "workstyle":
        if top_subject:
            intro = (
                f"Your academic strength in {top_subject} and your preferred work style "
                f"are both well-matched to what this career demands day-to-day."
            )
        else:
            intro = (
                f"Your academic profile and preferred work style are both well-aligned with this career."
            )
    elif top1 == "workstyle" and top2 == "riasec":
        intro = (
            f"The way you described how you like to work, and your {primary_label} personality score, "
            f"are both strong matches for this career."
        )
    elif top1 == "priorities" and top2 == "riasec":
        intro = (
            f"The career priorities you selected and your {primary_label} personality type "
            f"align well with what this path delivers."
        )
    else:
        intro = (
            f"Your profile — including your {primary_label} personality score and overall preferences — "
            f"points toward this as a well-suited career."
        )

    # Second sentence: career's own day-to-day reason from catalog
    detail = career.get("reason", "")
    return f"{intro} {detail}"


# ─── Main Scoring Function ────────────────────────────────────────────────────

WEIGHTS = {
    "riasec": 0.35,
    "subject": 0.25,
    "workstyle": 0.20,
    "priorities": 0.12,
    "feasibility": 0.08,
}


def score_careers(profile) -> list[dict]:
    """
    Takes a StudentProfile ORM object and returns a ranked list of top 5 careers.
    Each career dict has: rank, title, salary, stream, reason, total_score.
    """
    # Extract profile data
    riasec = profile.riasec_scores or {}
    subject_ratings = profile.subject_ratings or {}
    work_style = profile.work_style or {}
    career_priorities = profile.career_priorities or []

    profile_data = {
        "stream": profile.stream.value if profile.stream else None,
        "cost_constraint": profile.cost_constraint.value if profile.cost_constraint else None,
        "target_sector": profile.target_sector.value if profile.target_sector else None,
        "relocation_pref": profile.relocation_pref.value if profile.relocation_pref else None,
        "subject_ratings": subject_ratings,
    }

    # Determine if each component has real data (for weight redistribution)
    has_riasec = bool(riasec)
    has_subjects = bool(subject_ratings)
    has_workstyle = bool(work_style)
    has_priorities = bool(career_priorities)

    # Compute effective weights with graceful degradation
    effective_weights = dict(WEIGHTS)
    if not has_subjects:
        # Redistribute subject weight to RIASEC
        effective_weights["riasec"] += effective_weights["subject"]
        effective_weights["subject"] = 0.0
    if not has_workstyle:
        effective_weights["riasec"] += effective_weights["workstyle"]
        effective_weights["workstyle"] = 0.0
    if not has_priorities:
        effective_weights["riasec"] += effective_weights["priorities"]
        effective_weights["priorities"] = 0.0

    results = []

    for career in CAREER_CATALOG:
        # ── Feasibility first (may exclude) ───────────────────────────────────
        feas = _feasibility_score(profile_data, career)
        if feas == HARD_FILTER_EXCLUDE:
            continue

        # ── Component scores ──────────────────────────────────────────────────
        r_score = _riasec_score(riasec, career) if has_riasec else 0.5
        s_score = _subject_score(subject_ratings, career) if has_subjects else 0.5
        w_score = _workstyle_score(work_style, career) if has_workstyle else 0.5
        p_score = _priority_score(career_priorities, career) if has_priorities else 0.5

        component_scores = {
            "riasec": (r_score, effective_weights["riasec"]),
            "subject": (s_score, effective_weights["subject"]),
            "workstyle": (w_score, effective_weights["workstyle"]),
            "priorities": (p_score, effective_weights["priorities"]),
            "feasibility": (feas, effective_weights["feasibility"]),
        }

        total = (
            r_score * effective_weights["riasec"] +
            s_score * effective_weights["subject"] +
            w_score * effective_weights["workstyle"] +
            p_score * effective_weights["priorities"] +
            feas * effective_weights["feasibility"]
        )

        # ── Generate reason ───────────────────────────────────────────────────
        reason = _generate_reason(career, component_scores, profile_data)

        # ── Stream display ────────────────────────────────────────────────────
        stream_display_map = {
            "pcm": "PCM", "pcb": "PCB", "pcmb": "PCM/PCB",
            "comm": "Commerce", "arts": "Arts",
        }
        student_stream = profile_data.get("stream", "")
        stream_display = stream_display_map.get(student_stream, "All Streams")

        results.append({
            "title": career["title"],
            "salary": career["salary"],
            "stream": stream_display,
            "reason": reason,
            "total_score": round(total, 4),
        })

    # Sort descending and take top 5
    results.sort(key=lambda x: x["total_score"], reverse=True)
    top5 = results[:5]

    # Add rank and strip internal score
    for i, item in enumerate(top5, 1):
        item["rank"] = i
        del item["total_score"]

    return top5
