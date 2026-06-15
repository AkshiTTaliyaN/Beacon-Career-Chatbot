from typing import List, Dict
from career_mapping import (
    CAREER_MAP,
    PERSONALITY_DESCRIPTIONS,
    HOBBY_MAP,
    DOMAIN_CAREERS,
    APTITUDE_SKILLS,
    APTITUDE_SKILL_LABELS,
    RIASEC_APTITUDE_FIT,
)

# ---------------------------------------------------------------------------
# CONSTANTS
# ---------------------------------------------------------------------------
CATEGORIES = ["R", "I", "A", "S", "E", "C"]
CATEGORY_NAMES = {
    "R": "Realistic",
    "I": "Investigative",
    "A": "Artistic",
    "S": "Social",
    "E": "Enterprising",
    "C": "Conventional",
}

APTITUDE_THRESHOLDS = {
    "high":   (10, 15),   # score 10–15 out of 15
    "medium": (6, 9),     # score 6–9
    "low":    (3, 5),     # score 3–5
}


# ---------------------------------------------------------------------------
# SECTION 1 — RIASEC SCORING (unchanged logic, same as before)
# ---------------------------------------------------------------------------
def calculate_riasec_scores(answers: List[int]) -> Dict[str, float]:
    """
    Calculate RIASEC scores from 60 answers (1-5 scale).
    Returns percentage scores (0-100) for each category.
    Max raw score per category = 10 questions * 5 = 50
    """
    if len(answers) != 60:
        raise ValueError(f"Expected 60 answers, got {len(answers)}")

    scores = {}
    for i, cat in enumerate(CATEGORIES):
        raw = sum(answers[i * 10: (i + 1) * 10])
        scores[cat] = round((raw / 50) * 100, 1)

    return scores


# ---------------------------------------------------------------------------
# SECTION 2 — INTEREST / HOBBY PROCESSING
# ---------------------------------------------------------------------------
def process_interests(selected_hobbies: List[str]) -> Dict:
    """
    Takes a list of selected hobby strings.
    Returns:
      - riasec_boost: dict of RIASEC codes with accumulated hobby weight
      - all_domains: flat list of all flagged domain tags
      - interest_careers: deduplicated list of interest-aligned career suggestions
    """
    riasec_boost = {cat: 0 for cat in CATEGORIES}
    domain_counts: Dict[str, int] = {}

    for hobby in selected_hobbies:
        mapping = HOBBY_MAP.get(hobby)
        if not mapping:
            continue
        for code in mapping["riasec"]:
            riasec_boost[code] += 1
        for domain in mapping["domains"]:
            domain_counts[domain] = domain_counts.get(domain, 0) + 1

    # Sort domains by how many hobbies point to them (most reinforced first)
    sorted_domains = sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)
    top_domains = [d for d, _ in sorted_domains[:6]]  # cap at 6 domains

    # Collect career suggestions from top domains, deduplicate by title
    seen_titles = set()
    interest_careers = []
    for domain in top_domains:
        for career in DOMAIN_CAREERS.get(domain, []):
            if career["title"] not in seen_titles:
                seen_titles.add(career["title"])
                interest_careers.append(career)
            if len(interest_careers) >= 6:
                break
        if len(interest_careers) >= 6:
            break

    return {
        "riasec_boost": riasec_boost,
        "top_domains": top_domains,
        "interest_careers": interest_careers,
        "selected_hobbies": selected_hobbies,
    }


# ---------------------------------------------------------------------------
# SECTION 3 — APTITUDE SCORING
# ---------------------------------------------------------------------------
def calculate_aptitude_scores(answers: List[int]) -> Dict:
    """
    Takes 18 answers (3 per skill area, 1-5 scale).
    Skill order: english, patterns, logical, maths, visual, detail
    Returns raw scores, percentage scores, and Low/Medium/High classification.
    """
    if len(answers) != 18:
        raise ValueError(f"Expected 18 aptitude answers, got {len(answers)}")

    skill_scores = {}
    for i, skill in enumerate(APTITUDE_SKILLS):
        raw = sum(answers[i * 3: (i + 1) * 3])  # max 15 per skill
        percentage = round((raw / 15) * 100, 1)

        if raw >= APTITUDE_THRESHOLDS["high"][0]:
            level = "High"
        elif raw >= APTITUDE_THRESHOLDS["medium"][0]:
            level = "Medium"
        else:
            level = "Low"

        skill_scores[skill] = {
            "label": APTITUDE_SKILL_LABELS[skill],
            "raw": raw,
            "percentage": percentage,
            "level": level,
        }

    return skill_scores


# ---------------------------------------------------------------------------
# SYNTHESIS — Combines all three sections into one unified result
# ---------------------------------------------------------------------------
def synthesise_result(
    riasec_scores: Dict[str, float],
    interest_data: Dict,
    aptitude_scores: Dict,
    name: str,
    class_level: str,
    stream: str,
) -> dict:
    """
    Master function. Takes scores from all three sections and returns
    a single unified result dictionary for the result page and PDF.
    """

    # --- RIASEC primary analysis ---
    sorted_cats = sorted(riasec_scores.items(), key=lambda x: x[1], reverse=True)
    primary_code = sorted_cats[0][0]
    secondary_code = sorted_cats[1][0]
    tertiary_code = sorted_cats[2][0]
    holland_code = primary_code + secondary_code + tertiary_code

    primary_name = CATEGORY_NAMES[primary_code]
    secondary_name = CATEGORY_NAMES[secondary_code]
    description = PERSONALITY_DESCRIPTIONS.get(primary_code, "")

    # Look up primary careers from RIASEC map
    primary_careers = (
        CAREER_MAP.get(holland_code)
        or CAREER_MAP.get(primary_code + secondary_code)
        or CAREER_MAP.get(primary_code, [])
    )

    riasec_score_list = [
        {"category": CATEGORY_NAMES[cat], "code": cat, "score": score}
        for cat, score in sorted_cats
    ]

    # --- Interest-aligned alternatives ---
    # Remove any interest career that duplicates a primary RIASEC career
    primary_titles = {c["title"] for c in primary_careers}
    interest_careers = [
        c for c in interest_data["interest_careers"]
        if c["title"] not in primary_titles
    ][:4]  # show max 4 interest alternatives

    # --- Aptitude summary ---
    # Find which skills the student is strong/weak in relative to their RIASEC type
    relevant_skills = RIASEC_APTITUDE_FIT.get(primary_code, APTITUDE_SKILLS[:3])

    strong_skills = []
    needs_support = []

    for skill in APTITUDE_SKILLS:
        data = aptitude_scores[skill]
        if data["level"] == "High":
            strong_skills.append(data["label"])
        elif data["level"] == "Low" and skill in relevant_skills:
            needs_support.append(data["label"])

    # --- Aptitude-career compatibility flag ---
    # Check if student's aptitude supports the primary career recommendation
    aptitude_fit_note = _get_aptitude_fit_note(primary_code, aptitude_scores, relevant_skills)

    return {
        "name": name,
        "class_level": class_level,
        "stream": stream,

        # RIASEC section
        "holland_code": holland_code,
        "primary_type": primary_name,
        "secondary_type": secondary_name,
        "description": description,
        "riasec_scores": riasec_score_list,
        "primary_careers": primary_careers[:3],

        # Interest section
        "selected_hobbies": interest_data["selected_hobbies"],
        "interest_careers": interest_careers,
        "top_interest_domains": interest_data["top_domains"][:3],

        # Aptitude section
        "aptitude_scores": aptitude_scores,
        "strong_skills": strong_skills,
        "needs_support": needs_support,
        "aptitude_fit_note": aptitude_fit_note,

        # Supporting data (unchanged from original)
        "entrance_exams": get_exams(stream, primary_code),
        "skills_to_build": get_skills(primary_code, secondary_code),
        "closing_note": get_closing_note(primary_name, primary_careers),
    }


def _get_aptitude_fit_note(
    primary_code: str,
    aptitude_scores: Dict,
    relevant_skills: List[str],
) -> str:
    """
    Returns a short note about whether aptitude supports or challenges
    the primary career recommendation. Used on result page.
    """
    low_relevant = [
        aptitude_scores[s]["label"]
        for s in relevant_skills
        if aptitude_scores[s]["level"] == "Low"
    ]
    high_relevant = [
        aptitude_scores[s]["label"]
        for s in relevant_skills
        if aptitude_scores[s]["level"] == "High"
    ]

    if not low_relevant:
        return "Your self-rated aptitude aligns well with your recommended career direction. Keep building on your strengths."
    elif len(low_relevant) == len(relevant_skills):
        return (
            f"Your aptitude scores suggest you may want extra support in "
            f"{', '.join(low_relevant)} before pursuing this career path. "
            f"This does not mean you cannot succeed — it means focused preparation will be important."
        )
    else:
        return (
            f"You show strong ability in {', '.join(high_relevant) if high_relevant else 'some areas'}, "
            f"but may benefit from extra practice in {', '.join(low_relevant)}. "
            f"Consider this when planning your preparation strategy."
        )


# ---------------------------------------------------------------------------
# SUPPORTING FUNCTIONS (unchanged from original)
# ---------------------------------------------------------------------------
def get_exams(stream: str, primary: str) -> List[dict]:
    exam_map = {
        "PCM": [
            {"name": "JEE Main", "desc": "NITs and IIITs for engineering"},
            {"name": "JEE Advanced", "desc": "IITs"},
            {"name": "BITSAT", "desc": "BITS Pilani"},
            {"name": "IISER Aptitude Test", "desc": "Research-focused BSc / MSc programs"},
        ],
        "PCB": [
            {"name": "NEET UG", "desc": "MBBS, BDS, BAMS across India"},
            {"name": "AIIMS", "desc": "Top medical institutions"},
            {"name": "JIPMER", "desc": "Government medical college, Puducherry"},
            {"name": "IISER Aptitude Test", "desc": "Research-focused BSc / MSc programs"},
        ],
        "Commerce": [
            {"name": "CA Foundation", "desc": "Chartered Accountancy pathway"},
            {"name": "CLAT", "desc": "Law colleges for commerce+law combo"},
            {"name": "CUET", "desc": "Central Universities for BCom, BBA"},
            {"name": "IPM (IIM)", "desc": "Integrated MBA program at IIMs"},
        ],
        "Humanities": [
            {"name": "CLAT", "desc": "National Law Schools"},
            {"name": "CUET", "desc": "Central Universities for BA programs"},
            {"name": "NID DAT", "desc": "National Institute of Design"},
            {"name": "NIFT Entrance", "desc": "Fashion and design colleges"},
        ],
    }
    return exam_map.get(stream, exam_map["PCM"])


def get_skills(primary: str, secondary: str) -> List[dict]:
    skill_map = {
        "I": [
            {"name": "Python programming", "desc": "Start with NPTEL or Coursera beginner course and build small projects."},
            {"name": "Mathematics", "desc": "Strengthen calculus and statistics; focus on Class 12 topics and problem solving."},
            {"name": "Logical reasoning", "desc": "Practice previous year JEE problems and timed reasoning tests."},
            {"name": "Data analysis basics", "desc": "Try Google Sheets or Excel projects with real datasets."},
            {"name": "Scientific reading", "desc": "Read one article per week on ArXiv, ScienceDaily, or popular science outlets."},
        ],
        "R": [
            {"name": "CAD / Technical drawing", "desc": "Learn AutoCAD basics or use free tools like TinkerCAD."},
            {"name": "Basic electronics", "desc": "Explore Arduino or Raspberry Pi for hands-on projects."},
            {"name": "Physics applications", "desc": "Focus on mechanics, electricity, and real-world problem sets."},
            {"name": "Workshop skills", "desc": "Join a maker space or school lab to build physical projects."},
            {"name": "Mathematics", "desc": "Build strong algebra and trigonometry foundations."},
        ],
        "A": [
            {"name": "Design tools", "desc": "Start with Canva, then move to Figma or Adobe XD for UI/UX."},
            {"name": "Creative writing", "desc": "Write short stories or opinion pieces to develop voice and clarity."},
            {"name": "Digital art", "desc": "Explore Procreate or Krita for digital illustration fundamentals."},
            {"name": "Photography basics", "desc": "Study composition, lighting, and editing using free tools."},
            {"name": "Portfolio building", "desc": "Maintain a digital portfolio of your best creative work."},
        ],
        "S": [
            {"name": "Communication skills", "desc": "Join a debate club or practise public speaking regularly."},
            {"name": "Psychology basics", "desc": "Read introductory texts on human behaviour and motivation."},
            {"name": "Volunteering", "desc": "Engage in community service to build empathy and leadership."},
            {"name": "Active listening", "desc": "Practise reflective listening in conversations and group settings."},
            {"name": "Education tools", "desc": "Explore tutoring peers to develop teaching skills early."},
        ],
        "E": [
            {"name": "Business basics", "desc": "Read case studies on Indian startups and entrepreneurs."},
            {"name": "Public speaking", "desc": "Join MUN, debate, or school council to build leadership."},
            {"name": "Negotiation skills", "desc": "Practise decision-making through business simulations and games."},
            {"name": "Financial literacy", "desc": "Learn personal finance basics: budgeting, savings, and investing."},
            {"name": "Networking", "desc": "Connect with mentors and professionals on LinkedIn."},
        ],
        "C": [
            {"name": "MS Excel / Spreadsheets", "desc": "Master formulas, pivot tables, and data organisation."},
            {"name": "Accounting basics", "desc": "Study debit/credit, balance sheets, and financial statements."},
            {"name": "Typing and organisation", "desc": "Build fast, accurate typing and strong file management habits."},
            {"name": "Data entry tools", "desc": "Learn database fundamentals using Airtable or Google Sheets."},
            {"name": "Attention to detail", "desc": "Practise proofreading documents and spotting errors in data."},
        ],
    }
    skills = skill_map.get(primary, skill_map["I"])[:3]
    secondary_skills = skill_map.get(secondary, [])
    if secondary_skills:
        skills.append(secondary_skills[0])
        if len(secondary_skills) > 3:
            skills.append(secondary_skills[3])
    return skills[:5]


def get_closing_note(primary_name: str, careers: list) -> str:
    career_name = careers[0]["title"] if careers else "your chosen career"
    notes = {
        "Investigative": "Your Investigative personality means you thrive when given complex problems to solve. The careers ahead of you are intellectually rich and financially rewarding. Start building your analytical skills now — learn Python, strengthen your mathematics, and practise real-world data projects. With steady focus and curiosity, the right path will become clear. Share this report with your parents and teachers to plan the next steps together.",
        "Realistic": "Your Realistic nature means you are built to create, build, and solve with your hands and mind. Careers in engineering and technology reward exactly the kind of focused, practical thinking you bring. Start with hands-on projects, build your technical foundation, and explore workshops or labs near you. Share this report with your parents and teachers to plan together.",
        "Artistic": "Your Artistic personality is a genuine strength in today's creative economy. Design, media, and content careers are growing fast in India. Start building a portfolio now — even small projects matter. Share this report with your teachers and parents so they understand the exciting paths available to you.",
        "Social": "Your Social personality is your superpower. People-focused careers in education, counselling, healthcare, and social work are both meaningful and in demand. Start practising communication and leadership skills today. Share this report with your parents and teachers to explore the best pathway for you.",
        "Enterprising": "Your Enterprising nature means you are made to lead, influence, and build. Business and law careers reward the ambition and drive you naturally have. Start practising leadership and financial thinking today. Share this report with your parents and teachers to map out your journey.",
        "Conventional": "Your Conventional strength means you excel at organisation, accuracy, and structured thinking. Finance, accounting, and administrative careers value exactly these qualities. Start building your spreadsheet and numeracy skills today. Share this report with your parents and teachers to plan your path forward.",
    }
    return notes.get(primary_name, "Your personality profile points toward a strong and rewarding career path. Share this report with your parents and teachers to plan the next steps together.")