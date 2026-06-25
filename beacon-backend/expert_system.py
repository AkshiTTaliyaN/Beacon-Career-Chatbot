"""
expert_system.py
Rule-based expert consultation engine for Manzil Career Chatbot.

Takes a career title and student profile, applies compatibility rules,
and returns a structured consultation result with scores, warnings,
a personalised roadmap, relevant exams, and backup career suggestions.
"""

from typing import Any

from career_catalog import CAREER_CATALOG
from exams_catalog import EXAMS_CATALOG
from career_scorer import get_career_domains


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


def _generate_roadmap(career: dict, profile: dict) -> list[dict]:
    """Build a 4-phase career-specific roadmap, skipping phases below the student's class."""
    current_class = profile.get("current_class", 9)
    title = career["title"]
    domains = get_career_domains(title)
    
    # Classify domain to category
    category = "general"
    if any(d in domains for d in ["software_engineering", "data_science"]):
        category = "tech"
    elif any(d in domains for d in ["design", "animation", "architecture", "interior_design", "product_design", "fashion"]):
        category = "design"
    elif any(d in domains for d in ["research", "biotechnology", "healthcare", "medicine", "environmental_science", "veterinary", "food_technology"]):
        category = "science"
    elif any(d in domains for d in ["corporate", "finance", "marketing", "hr", "hospitality", "event_management"]):
        category = "business"
    elif any(d in domains for d in ["law", "media", "journalism", "literature", "content", "linguistics", "social_work", "ngo", "education", "academia"]):
        category = "humanities"
    elif any(d in domains for d in ["defence", "civil_services", "foreign_services", "politics", "geography"]):
        category = "public_service"
    elif any(d in domains for d in ["sports", "physiotherapy"]):
        category = "sports"

    # Action items database
    phase_items_db = {
        "tech": {
            1: [
                "Build basic computational thinking through puzzle-solving or Scratch coding.",
                "Participate in science fairs or computer clubs at school.",
                "Read beginner technology articles or watch educational tech videos."
            ],
            2: [
                "Start learning a core language like Python or Java through online tutorials.",
                "Build a simple personal project (like a calculator, text game, or portfolio page).",
                "Learn the basics of Web Development (HTML/CSS) or Data Analysis (spreadsheets)."
            ],
            3: [
                "Practice basic algorithms on platforms like LeetCode, HackerRank, or GeeksForGeeks.",
                "Focus on getting a high score in school exams and prepare for JEE Main or CUET if applicable.",
                "Start a GitHub account and push your small programming projects there."
            ],
            4: [
                "Attempt mock papers and timed practice tests for competitive entrance exams.",
                "Build one final portfolio project (e.g. a simple mobile app or data dashboard).",
                "Review college admission processes and finalise your target institutions."
            ]
        },
        "design": {
            1: [
                "Maintain a daily sketchbook to build visual representation and hand-eye coordination.",
                "Explore hobbies like photography, crafting, or building physical models.",
                "Read design blogs or study the visual style of products and apps you love."
            ],
            2: [
                "Learn the basics of digital design tools (Figma, Canva, or Adobe Photoshop).",
                "Explore specific domains (e.g., UI/UX, 3D modelling, interior sketches, or fashion illustration).",
                "Take introductory courses in art history, typography, or color theory."
            ],
            3: [
                "Begin structured preparation for design school entrance exams (UCEED, NID, NIFT).",
                "Start compiling your best designs into a clean digital portfolio (e.g., on Behance or Dribbble).",
                "Do small freelance or volunteer design work for school events or local clubs."
            ],
            4: [
                "Attempt previous years' design exam papers and timed sketching mock tests.",
                "Finalise your digital portfolio with 4-5 well-documented design case studies.",
                "Prepare for design school portfolio reviews and personal interview rounds."
            ]
        },
        "science": {
            1: [
                "Participate in school science fairs, science Olympiads, and lab activities.",
                "Read popular science publications (e.g., Scientific American, National Geographic).",
                "Build solid fundamentals in basic mathematics, physics, chemistry, and biology."
            ],
            2: [
                "Shadow or volunteer at a local clinic, laboratory, veterinary centre, or environmental NGO.",
                "Conduct small home science experiments or learn basic data logging/Excel.",
                "Explore specific scientific areas like genetics, bio-tech, botany, or pathology."
            ],
            3: [
                "Start serious preparation for medical or science entrance exams (NEET, JEE, IISER Aptitude Test).",
                "Read scientific papers or introductory textbooks to build a researcher's vocabulary.",
                "Focus heavily on strengthening core theory in Chemistry, Physics, and Biology."
            ],
            4: [
                "Solve full-length NEET/IISER mock papers to master speed and accuracy under pressure.",
                "Keep academic records, project files, and documents ready for board exams.",
                "Research central universities, research institutes (like IISER, IISc), and top medical colleges."
            ]
        },
        "business": {
            1: [
                "Develop strong public speaking and communication skills through debates or MUNs.",
                "Read business biographies and introductory economics/personal finance books.",
                "Take leadership roles in school clubs, group projects, or sports teams."
            ],
            2: [
                "Master spreadsheet tools (Excel/Google Sheets) and learn basic bookkeeping.",
                "Read business newspapers (Economic Times, Mint) to follow national business trends.",
                "Start a micro-enterprise or project (e.g., organizing a charity drive or selling handmade goods)."
            ],
            3: [
                "Begin preparing for management entrance exams like IPMAT (IIM) or CUET.",
                "Build a strong CV highlighting school leadership, event organization, and academic achievements.",
                "Follow case studies of successful startups to understand strategy, marketing, and finance."
            ],
            4: [
                "Attempt timed mock tests for business and economics undergraduate entrance programs.",
                "Research undergraduate business degrees (BBA, BCom, BBM) and target universities.",
                "Practice presentation and group discussion skills for university admission rounds."
            ]
        },
        "humanities": {
            1: [
                "Read high-quality national newspapers and editorial columns daily to build general knowledge.",
                "Join debate clubs, writing competitions, or language classes to hone your expression.",
                "Volunteer for community welfare, teaching underprivileged kids, or local NGOs."
            ],
            2: [
                "Start a personal blog or write regular opinion pieces/essays on topics you care about.",
                "Take introductory courses in sociology, political science, psychology, or creative writing.",
                "Engage in model UNs, youth parliaments, or peer counseling activities."
            ],
            3: [
                "Prepare for humanities entrance exams (CUET) or law exams (CLAT) if pursuing corporate law.",
                "Read landmark books and journals related to your field (legal history, social policy, etc.).",
                "Draft writing samples, research essays, or build your volunteering track record."
            ],
            4: [
                "Solve timed mock tests for CLAT/CUET and review logical reasoning and English comprehension.",
                "Finalise college applications, statement of purpose documents, and letters of recommendation.",
                "Prepare for group discussions or interviews required for private/central humanities universities."
            ]
        },
        "public_service": {
            1: [
                "Focus on physical fitness, playing team sports, and outdoor activities like trekking/hiking.",
                "Join youth organizations like NCC, NSS, Scouts & Guides, or school student council.",
                "Read biographies of civil servants, national leaders, and defense officers."
            ],
            2: [
                "Build strong general knowledge by studying national geography, history, and civic systems.",
                "Follow international affairs, national security topics, and public policy updates.",
                "Participate in physical drills, athletics, or adventure sports to build endurance."
            ],
            3: [
                "For Defense: Begin structured preparation for the NDA entrance examination.",
                "For Civil Services: Focus on building a broad general studies foundation in history, polity, and economics.",
                "Solve logical reasoning, quantitative aptitude, and general mental ability question papers."
            ],
            4: [
                "For NDA: Practice timed NDA mock papers and start daily physical conditioning (running, push-ups).",
                "For Civil Services: Research target undergraduate degrees (such as BA History/Polity or BSc Geography).",
                "Practice mental toughness, communication, and situational awareness exercises."
            ]
        },
        "sports": {
            1: [
                "Train regularly in your primary sport under a qualified coach.",
                "Participate in school, district, and state-level sports tournaments.",
                "Focus on general fitness: flexibility, strength training, and cardiovascular health."
            ],
            2: [
                "Study the basics of human anatomy, sports nutrition, and physical therapy.",
                "Volunteer to assist coach training sessions or referee school sports matches.",
                "Keep a detailed log of your athletic performance, workout routines, and fitness milestones."
            ],
            3: [
                "Prepare for sports university entrance tests or physical education degrees.",
                "Participate in national or open-level tournaments to build your athletic profile.",
                "Learn about sports medicine, kinesiology, or athletic training fundamentals."
            ],
            4: [
                "Review admission criteria for physical education and sports sciences courses.",
                "Maintain peak physical condition and prepare for physical fitness admission tests.",
                "Compile your athletic certificates, video reels, and achievements portfolio."
            ]
        },
        "general": {
            1: [
                "Build strong fundamentals in core subjects like mathematics, languages, and science.",
                "Explore various interests through group projects, hobby workshops, and online videos.",
                "Start developing good study discipline, reading habits, and time-management skills."
            ],
            2: [
                "Choose the right academic stream (PCM, PCB, Commerce, Arts) aligned with your strengths.",
                "Learn practical digital skills like spreadsheets, document editing, and basic slide design.",
                "Research different career pathways, speak to mentors, and read career guides."
            ],
            3: [
                "Identify central universities, local colleges, and professional courses for your goals.",
                "Begin structured preparation for relevant undergraduate entrance examinations (like CUET).",
                "Participate in extracurricular activities that build communication, teamwork, and confidence."
            ],
            4: [
                "Solve timed mock tests and previous-year exam papers for target colleges.",
                "Complete class board exam syllabi alongside entrance preparation.",
                "Prepare required documents, transcripts, and application profiles for target institutions."
            ]
        }
    }

    # Stream & Exam customization info
    related_exams = _match_exams(career, profile)
    exam_names = [e["name"] for e in related_exams]
    subject_weights = career.get("subject_weights", {})
    top_subjects = sorted(subject_weights, key=subject_weights.get, reverse=True)[:3]  # type: ignore[arg-type]

    roadmap_templates = [
        {"phase": "1", "title": "Foundations (Class 9–10)", "class_range": (9, 10)},
        {"phase": "2", "title": "Core Academic Build (Class 11)", "class_range": (11, 11)},
        {"phase": "3", "title": "Intensive Prep (Class 12 — First Half)", "class_range": (12, 12)},
        {"phase": "4", "title": "Revision & Testing (Class 12 — Second Half)", "class_range": (13, 99)},
    ]

    roadmap = []
    category_db = phase_items_db.get(category, phase_items_db["general"])

    for template in roadmap_templates:
        lo, hi = template["class_range"]
        # Skip phases the student has already passed
        if current_class > hi:
            continue

        phase_num = int(template["phase"])
        items = list(category_db.get(phase_num, []))

        # Add custom exam references if present in later phases
        if phase_num >= 2 and exam_names:
            items.append(f"Structured target exams: {', '.join(exam_names)}.")
        if top_subjects:
            items.append(f"Prioritise studying key subjects: {', '.join(top_subjects)}.")

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
        "salary": career.get("salary", "₹6-15 LPA"),
        "streams": career.get("streams", []),
        "cost_level": career.get("cost_level", "medium"),
        "requires_relocation": career.get("requires_relocation", False),
        "riasec_primary": career.get("riasec_primary", ""),
        "riasec_secondary": career.get("riasec_secondary", ""),
        "reason": career.get("reason", ""),
        "sector": career.get("sector", ""),
        "priority_alignment": career.get("priority_alignment", []),
    }
