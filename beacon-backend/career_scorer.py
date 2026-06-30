"""
career_scorer.py
Seven-component unified career scoring engine.
Weights: RIASEC 25% | Passion 15% | Aptitude 15% | Subject 20% | WorkStyle 15% | Priorities 5% | Feasibility 5%
"""

from typing import Optional, List, Dict
from career_catalog import CAREER_CATALOG

HARD_FILTER_EXCLUDE = "EXCLUDE"

# ─── Mapping Data ─────────────────────────────────────────────────────────────

HOBBY_MAP = {
    # Creative
    "Drawing/Painting":         {"riasec": ["A"],      "domains": ["design", "animation", "architecture"]},
    "Photography":              {"riasec": ["A"],      "domains": ["media", "design", "journalism"]},
    "Writing/Storytelling":     {"riasec": ["A", "I"], "domains": ["journalism", "literature", "content", "law"]},
    "Music (playing instrument)":{"riasec": ["A"],     "domains": ["performing_arts", "music_production"]},
    "Singing":                  {"riasec": ["A"],      "domains": ["performing_arts", "music_production"]},
    "Dancing":                  {"riasec": ["A"],      "domains": ["performing_arts", "event_management"]},
    "Acting/Theatre":           {"riasec": ["A", "S"], "domains": ["performing_arts", "media"]},
    "Crafting/DIY":             {"riasec": ["R", "A"], "domains": ["design", "product_design", "interior_design"]},
    "Fashion/Design":           {"riasec": ["A"],      "domains": ["design", "fashion", "product_design"]},
    "Filmmaking/Editing":       {"riasec": ["A", "I"], "domains": ["media", "animation", "journalism"]},
    "Graphic Design/Digital Art":{"riasec": ["A"],      "domains": ["design", "product_design"]},
    "Video Editing":            {"riasec": ["A", "R"], "domains": ["media", "animation"]},
    "Content Creation/Social Media":{"riasec": ["A", "E"], "domains": ["media", "content"]},
    "DJing/Music Production":   {"riasec": ["A"],      "domains": ["performing_arts", "music_production"]},
    "Podcasting":               {"riasec": ["A", "S"], "domains": ["media", "content", "journalism"]},
    "3D Modelling/Animation":   {"riasec": ["A", "R"], "domains": ["design", "animation", "product_design"]},
    "Creative Writing":         {"riasec": ["A", "I"], "domains": ["literature", "content"]},
    "Stand-up Comedy":          {"riasec": ["A", "E"], "domains": ["performing_arts", "media"]},

    # Physical
    "Cricket":                  {"riasec": ["R", "E"], "domains": ["sports", "defence", "physiotherapy"]},
    "Football":                 {"riasec": ["R", "E"], "domains": ["sports", "defence", "physiotherapy"]},
    "Basketball":               {"riasec": ["R", "E"], "domains": ["sports", "physiotherapy"]},
    "Swimming":                 {"riasec": ["R"],      "domains": ["sports", "physiotherapy", "defence"]},
    "Athletics/Running":        {"riasec": ["R"],      "domains": ["sports", "defence", "physiotherapy"]},
    "Martial Arts":             {"riasec": ["R", "E"], "domains": ["sports", "defence"]},
    "Yoga/Fitness":             {"riasec": ["R", "S"], "domains": ["healthcare", "physiotherapy", "sports"]},
    "Cycling":                  {"riasec": ["R"],      "domains": ["sports", "environmental_science"]},
    "Hiking/Trekking":          {"riasec": ["R", "I"], "domains": ["geography", "environmental_science", "defence"]},
    "Badminton":                {"riasec": ["R", "E"], "domains": ["sports", "physiotherapy"]},
    "Table Tennis":             {"riasec": ["R", "E"], "domains": ["sports", "physiotherapy"]},
    "Lawn Tennis":              {"riasec": ["R", "E"], "domains": ["sports", "physiotherapy"]},
    "Volleyball":               {"riasec": ["R", "E"], "domains": ["sports", "physiotherapy"]},
    "Gym/Weightlifting":        {"riasec": ["R"],      "domains": ["sports", "physiotherapy", "healthcare"]},
    "E-sports/Competitive Gaming":{"riasec": ["I", "R"], "domains": ["software_engineering", "sports"]},
    "Skateboarding":            {"riasec": ["R"],      "domains": ["sports"]},

    # Intellectual
    "Reading":                  {"riasec": ["I", "E"], "domains": ["academia", "civil_services", "law", "literature"]},
    "Debating":                 {"riasec": ["E", "I"], "domains": ["law", "civil_services", "journalism", "politics"]},
    "Chess/Strategy Games":     {"riasec": ["I"],      "domains": ["engineering", "finance", "data_science"]},
    "Quiz/Trivia":              {"riasec": ["I"],      "domains": ["academia", "civil_services", "journalism"]},
    "Coding":                   {"riasec": ["R", "I"], "domains": ["software_engineering", "data_science", "engineering"]},
    "Robotics/Electronics":     {"riasec": ["R", "I"], "domains": ["engineering", "software_engineering"]},
    "Science Experiments":      {"riasec": ["I"],      "domains": ["research", "medicine", "biotechnology"]},
    "Learning Languages":       {"riasec": ["A", "S"], "domains": ["linguistics", "foreign_services", "literature"]},

    # Social/Service
    "Volunteering":             {"riasec": ["S"],      "domains": ["social_work", "ngo", "healthcare"]},
    "Teaching/Tutoring others": {"riasec": ["S", "I"], "domains": ["education", "academia", "social_work"]},
    "Event Organisation":       {"riasec": ["E", "S"], "domains": ["event_management", "hr", "marketing"]},
    "Public Speaking":          {"riasec": ["E", "S"], "domains": ["law", "politics", "media", "corporate"]},
    "Animal Care":              {"riasec": ["S", "R"], "domains": ["veterinary", "environmental_science"]},

    # Practical
    "Cooking/Baking":           {"riasec": ["R", "A"], "domains": ["hospitality", "food_technology"]},
    "Gardening":                {"riasec": ["R", "I"], "domains": ["agriculture", "environmental_science"]},
    "Mechanics/Fixing things":  {"riasec": ["R"],      "domains": ["engineering", "automobile"]},
    "Building models":          {"riasec": ["R", "I"], "domains": ["engineering", "architecture", "product_design"]},
}

def get_career_domains(title: str) -> list[str]:
    title_lower = title.lower()
    domains = []
    
    # Map keywords to domains
    if any(k in title_lower for k in ["software", "developer", "cloud", "web3", "ethical hacker", "prompt", "ar/vr", "game ai", "blockchain"]):
        domains.append("software_engineering")
    if any(k in title_lower for k in ["data", "analyst", "science", "bioinformatics", "risk modeller"]):
        domains.append("data_science")
    if any(k in title_lower for k in ["scientist", "research", "biologist", "chemist", "forensics", "volcanologist"]):
        domains.append("research")
    if any(k in title_lower for k in ["engineer", "technician", "integrator", "installer", "vlsi"]):
        domains.append("engineering")
    if any(k in title_lower for k in ["designer", "illustrator", "artist", "compositor", "animator", "visualizer", "restorer", "customizer", "builder", "modder", "architect"]):
        domains.append("design")
    if any(k in title_lower for k in ["animator", "vfx", "motion graphics", "special effects", "sfx"]):
        domains.append("animation")
    if any(k in title_lower for k in ["architect", "urban planner", "visualizer", "sustainable building"]):
        domains.append("architecture")
    if any(k in title_lower for k in ["interior designer", "furniture"]):
        domains.append("interior_design")
    if any(k in title_lower for k in ["product manager", "product designer", "industrial designer", "toy designer", "footwear designer", "sneaker"]):
        domains.append("product_design")
    if any(k in title_lower for k in ["fashion", "textile", "stylist", "footwear"]):
        domains.append("fashion")
    if any(k in title_lower for k in ["journalist", "anchor", "vlogger", "writer", "editor", "copywriter", "novelist", "public relations", "pr", "relations"]):
        domains.append("media")
        domains.append("journalism")
    if any(k in title_lower for k in ["writer", "editor", "copywriter", "novelist", "author"]):
        domains.append("literature")
        domains.append("content")
    if any(k in title_lower for k in ["lawyer", "legal", "judge", "compliance", "auditor", "safety auditor", "privacy"]):
        domains.append("law")
    if any(k in title_lower for k in ["dj", "music", "sound", "audio", "dubbing", "voice", "actor", "comedian", "choreographer", "vfx", "compositor", "film", "director"]):
        domains.append("performing_arts")
    if any(k in title_lower for k in ["music", "sound", "audio"]):
        domains.append("music_production")
    if any(k in title_lower for k in ["event", "wedding", "coordinator", "producer", "tournament director", "curator"]):
        domains.append("event_management")
    if any(k in title_lower for k in ["sports", "athlete", "gamer", "coach", "fitness", "calisthenics"]):
        domains.append("sports")
    if any(k in title_lower for k in ["army", "police", "officer", "ips", "defence", "pilot", "forensics"]):
        domains.append("defence")
    if any(k in title_lower for k in ["physiotherapist", "recreation therapist", "sports medicine", "rehabilitation", "therapist", "counsellor", "psychologist", "coach"]):
        domains.append("physiotherapy")
    if any(k in title_lower for k in ["doctor", "surgeon", "mbbs", "dentist", "nurse", "healthcare", "medical", "pharmacist", "therapist", "nutritionist", "hospital"]):
        domains.append("healthcare")
        domains.append("medicine")
    if any(k in title_lower for k in ["geography", "town planner", "urban", "landscape", "gis"]):
        domains.append("geography")
    if any(k in title_lower for k in ["environmental", "wildlife", "climate", "sustainability", "solar", "renewable", "ecologist", "biologist"]):
        domains.append("environmental_science")
    if any(k in title_lower for k in ["professor", "lecturer", "academic", "research scholar", "teacher", "educator", "education"]):
        domains.append("academia")
        domains.append("education")
    if any(k in title_lower for k in ["ias", "ips", "civil services", "public policy", "government", "diplomat", "customs"]):
        domains.append("civil_services")
    if any(k in title_lower for k in ["political", "policy", "relations", "sociologist", "advocate"]):
        domains.append("politics")
    if any(k in title_lower for k in ["biotechnology", "genetic", "bioinformatics", "bio"]):
        domains.append("biotechnology")
    if any(k in title_lower for k in ["linguist", "translator", "interpreter", "language"]):
        domains.append("linguistics")
    if any(k in title_lower for k in ["ifs", "international relations", "diplomat"]):
        domains.append("foreign_services")
    if any(k in title_lower for k in ["social worker", "ngo", "community", "volunteer", "youth", "counsellor", "therapist"]):
        domains.append("social_work")
        domains.append("ngo")
    if any(k in title_lower for k in ["hr", "talent", "recruitment", "acquisition", "personnel"]):
        domains.append("hr")
    if any(k in title_lower for k in ["marketing", "brand", "sales", "growth", "public relations", "pr", "advocacy"]):
        domains.append("marketing")
    if any(k in title_lower for k in ["consultant", "analyst", "business", "manager", "strategist", "specialist", "advisory", "entrepreneur", "startup", "merchandising", "real estate", "franchisee"]):
        domains.append("corporate")
    if any(k in title_lower for k in ["veterinarian", "veterinary", "animal", "dog", "wildlife"]):
        domains.append("veterinary")
    if any(k in title_lower for k in ["hotel", "chef", "culinary", "hospitality", "brewer", "barista", "catering"]):
        domains.append("hospitality")
    if any(k in title_lower for k in ["food", "nutritionist", "dietitian", "brewer", "fermentation"]):
        domains.append("food_technology")
    if any(k in title_lower for k in ["agricultural", "agronomist", "farming", "farmer", "hydroponics", "soil"]):
        domains.append("agriculture")
    if any(k in title_lower for k in ["automobile", "automotive", "bicycle", "mechanic", "ev", "aerospace"]):
        domains.append("automobile")
    if any(k in title_lower for k in ["chartered accountant", "accountancy", "ca", "cfa", "finance", "investment", "banking", "tax", "payroll", "underwriter", "trader", "broker", "portfolio", "audit", "accountant"]):
        domains.append("finance")
        
    return list(set(domains))

RIASEC_APTITUDE_FIT = {
    "R": ["maths", "visual", "detail"],
    "I": ["logical", "maths", "patterns"],
    "A": ["visual", "english", "detail"],
    "S": ["english", "detail", "logical"],
    "E": ["english", "logical", "patterns"],
    "C": ["detail", "maths", "logical"],
}

RIASEC_LABELS = {
    "I": "Investigative",
    "R": "Realistic",
    "A": "Artistic",
    "S": "Social",
    "E": "Enterprising",
    "C": "Conventional",
}

# ─── Component Functions ──────────────────────────────────────────────────────

def _riasec_score(student_scores: dict, career: dict) -> float:
    """Primary type contributes 70%, secondary 30%."""
    primary = career["riasec_primary"]
    secondary = career["riasec_secondary"]
    p = student_scores.get(primary, 50)
    s = student_scores.get(secondary, 50)
    return (p * 0.7 + s * 0.3) / 100.0


def _passion_score(student_hobbies: list, career_title: str) -> float:
    """Check if the student has selected hobbies mapping to this career's domains."""
    if not student_hobbies:
        return 0.5
    student_domains = set()
    for hobby in student_hobbies:
        mapping = HOBBY_MAP.get(hobby)
        if mapping:
            student_domains.update(mapping["domains"])
    
    career_domains = set(get_career_domains(career_title))
            
    if not career_domains:
        return 0.5
        
    overlap = student_domains & career_domains
    if overlap:
        return 1.0  # match found
    return 0.0


def _aptitude_score(student_aptitude_scores: dict, career: dict) -> float:
    """Match the student's tested aptitude strengths against key skills for this RIASEC type."""
    if not student_aptitude_scores:
        return 0.5
    primary = career.get("riasec_primary", "I")
    relevant_skills = RIASEC_APTITUDE_FIT.get(primary, ["maths", "logical", "english"])
    
    numerator = 0.0
    count = 0
    for skill in relevant_skills:
        skill_data = student_aptitude_scores.get(skill)
        if skill_data:
            pct = skill_data.get("pct") if isinstance(skill_data, dict) else skill_data
            if pct is not None:
                numerator += (pct / 100.0)
                count += 1
    if count == 0:
        return 0.5
    return numerator / count


def _subject_score(student_ratings: dict, career: dict) -> float:
    """Compare self-rated subjects with career weights."""
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
        return 0.5
    return numerator / denominator


def _workstyle_score(student_workstyle: dict, career: dict) -> float:
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


def _priority_score(student_priorities: list, career: dict) -> float:
    if not student_priorities:
        return 0.5
    alignment = set(career.get("priority_alignment", []))
    student_set = set(student_priorities)
    matches = len(student_set & alignment)
    return matches / 3.0


def _feasibility_score(profile_data: dict, career: dict, riasec_score: float = 0.5, passion_score: float = 0.5) -> str | float:
    """
    Returns HARD_FILTER_EXCLUDE if career fails hard filters.
    Otherwise returns 0–1 soft feasibility score.
    """
    student_stream = profile_data.get("stream")
    cost_constraint = profile_data.get("cost_constraint")
    target_sector = profile_data.get("target_sector")
    relocation_pref = profile_data.get("relocation_pref")

    # ── Hard filter 1: stream must match (with passion bypass) ────────────────
    career_streams = career.get("streams", [])
    if student_stream and student_stream != "none" and career_streams and student_stream not in career_streams:
        # Passion bypass: if student has strongly aligned RIASEC (personality) and hobbies (passion), bypass!
        if riasec_score >= 0.70 and passion_score >= 0.70:
            pass
        else:
            return HARD_FILTER_EXCLUDE

    # ── Hard filter 2: cost ───────────────────────────────────────────────────
    if cost_constraint == "yes" and career.get("cost_level") == "high":
        return HARD_FILTER_EXCLUDE

    # ── Soft feasibility ──────────────────────────────────────────────────────
    score = 0.0

    # Sector match (0.5)
    career_sector = career.get("sector", "open")
    if target_sector == "open" or not target_sector or career_sector == target_sector:
        score += 0.5
    elif target_sector == "study" and career_sector in ("study", "private"):
        score += 0.3

    # Relocation (0.3)
    requires_relocation = career.get("requires_relocation", False)
    if not requires_relocation:
        score += 0.3
    elif relocation_pref in ("yes", "state", "unsure") or not relocation_pref:
        score += 0.3

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

def _generate_reason(
    career: dict,
    component_scores: dict,
    student_data: dict,
) -> str:
    """Identifies the top 2 contributing components and generates a 2-sentence reason."""
    contributions = {
        k: v[0] * v[1]
        for k, v in component_scores.items()
        if k != "feasibility"
    }
    ranked = sorted(contributions.items(), key=lambda x: x[1], reverse=True)
    top1, top2 = ranked[0][0], ranked[1][0]

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

    # Sentence templates
    if top1 == "passion":
        intro = f"Your personal passions/hobbies are highly aligned with the core domains of this field."
    elif top1 == "aptitude":
        intro = f"Your tested aptitude strengths indicate that you have the key skills required for this role."
    elif top1 == "riasec" and top2 == "subject":
        if top_subject:
            intro = f"Your {primary_label} personality score and your strong performance in {top_subject} make this a well-matched career."
        else:
            intro = f"Your {primary_label} personality score shows that this career is built for the way you naturally think."
    elif top1 == "riasec" and top2 == "workstyle":
        intro = f"Your {primary_label} personality score and your preferred work style both point strongly toward this path."
    elif top1 == "riasec" and top2 == "priorities":
        intro = f"Your {primary_label} personality score and career priorities align closely with what this path offers."
    elif top1 == "subject" and top2 == "riasec":
        if top_subject:
            intro = f"Your strength in {top_subject} and your {primary_label} personality type make this a great fit."
        else:
            intro = f"Your subject profile and {primary_label} personality type together point to this career."
    elif top1 == "subject" and top2 == "workstyle":
        if top_subject:
            intro = f"Your academic strength in {top_subject} and preferred work style match what this career demands."
        else:
            intro = f"Your academic profile and preferred work style are both well-aligned with this career."
    elif top1 == "workstyle" and top2 == "riasec":
        intro = f"The way you like to work, and your {primary_label} personality score, are both strong matches."
    elif top1 == "priorities" and top2 == "riasec":
        intro = f"The career priorities you selected and your {primary_label} personality type align well."
    else:
        intro = f"Your profile — including your {primary_label} personality score and overall preferences — points toward this career."

    detail = career.get("reason", "")
    return f"{intro} {detail}"


ENGINE2_EXPLANATIONS = {
    'Advertising Creative Director': 'Leading creative teams and crafting persuasive campaigns rewards your top personality strengths.',
    'Administrative Manager': 'Keeping systems and people organised is where you naturally excel.',
    'Administrative Officer': 'Keeping organisations running smoothly rewards your organisational precision and people skills.',
    'App Developer': 'Designing and building mobile applications that solve real-world problems fits your technical drive.',
    'Architect': 'Designing structures that are both functional and beautiful is a perfect blend of your top traits.',
    'Bank Manager': 'Leading a branch while managing finances and customer relations fits your conventional-social blend.',
    'Behavioural Economist': 'Studying how people make decisions combines your investigative and social interests powerfully.',
    'Biomedical Engineer': 'Combines your investigative drive with practical application in healthcare and medical technology.',
    'Brand Strategist': 'Building brand identity and vision requires the creative-leadership blend you naturally have.',
    'Business Development Manager': 'Finding and building new business opportunities aligns with your enterprising and realistic traits.',
    'Chartered Accountant': 'Precision and financial mastery are your natural strengths.',
    'Civil Engineer': 'Building and designing infrastructure rewards your hands-on practical approach.',
    'Clinical Psychologist': 'Helping people understand and manage their minds uses your empathy, creativity, and leadership.',
    'Cognitive Scientist': 'Studying how the mind works blends your investigative curiosity with your creative and social interests.',
    'Content Creator': 'Building audiences through creative work suits your expressive personality.',
    'Content Strategist': 'Creating and managing content that connects with audiences suits your creative and social nature.',
    'Counselling Psychologist': 'A fulfilling career guiding people through challenges suits your warm, analytical personality.',
    'Counsellor': 'Guiding people through challenges suits your empathetic personality.',
    'Creative Technologist': 'Bridging art and technology is a growing field that rewards exactly your combination of strengths.',
    'Data Analyst': 'Turning raw data into actionable insights suits your logical, structured thinking style.',
    'Data Entry Specialist': 'Accurate, systematic data management suits your detail-oriented and reliable personality.',
    'Data Scientist': 'Your analytical drive and curiosity are ideal for data science.',
    'Electrician / Electrical Engineer': 'Technical, hands-on work with measurable results.',
    'Entrepreneur': 'Building something from scratch rewards your natural leadership and ambition.',
    'Environmental Scientist': 'Your analytical approach makes you well-suited to studying and solving environmental challenges.',
    'Event Manager': 'Coordinating people and experiences to create memorable events suits your energetic social nature.',
    'Film Director': 'Bringing stories to life on screen rewards your creative vision and social awareness.',
    'Financial Analyst': 'Methodical analysis of financial data suits your detail-oriented personality.',
    'Game Designer': 'Building interactive worlds and systems combines your technical and creative strengths.',
    'Graphic Designer': 'Visual communication is where your artistic instinct shines.',
    'Health Educator': 'Teaching communities about health and wellbeing aligns with your social and artistic communication skills.',
    'Human Resources Manager': 'Managing people, culture, and workplace wellbeing rewards your social and enterprising traits.',
    'Industrial Designer': 'Creating products that are practical and well-designed suits your realistic and artistic mix.',
    'Investment Banker': 'High-stakes financial decision-making rewards your analytical, ambitious personality.',
    'Journalist': 'Investigating and storytelling aligns with your expressive and people-aware personality.',
    'Lab Technician': 'Maintaining precision and following protocols in a lab environment suits your conventional nature.',
    'Management Consultant': 'Solving complex business problems and influencing strategy suits your leadership-analytical blend.',
    'Marketing Manager': 'Creating strategies that drive results suits your ambitious, creative approach.',
    'Mechanical Engineer': 'Working with machines and systems is a natural fit for your realistic nature.',
    'NGO Program Manager': 'Designing and running programs that help communities matches your social and creative strengths.',
    'Occupational Therapist': 'Practical, helping-focused work that rewards your grounded and empathetic approach.',
    'Office Manager': 'Coordinating operations, people, and systems is where your conventional strengths shine.',
    'Operations Manager': 'Running efficient operations uses your practical leadership and people management strengths.',
    'PR Specialist': 'Managing public image and communication combines your artistic and enterprising traits.',
    'Physiotherapist': 'Helping people recover physically uses both your practical skills and people-oriented side.',
    'Product Designer': 'Your mix of analytical and artistic strengths is ideal for designing user-centred digital products.',
    'Psychologist': 'Your blend of analytical thinking, creativity, and social sensitivity is a natural fit for psychology.',
    'Psychotherapist': 'Helping people through creative and talking therapies suits your artistic and empathetic nature.',
    'Quality Assurance Analyst': 'Checking systems and processes for errors aligns with your methodical, precise approach.',
    'Research Analyst': 'Investigating and interpreting data suits your investigative personality.',
    'Research Psychologist': 'Designing and conducting studies on human behaviour suits your curious, methodical nature.',
    'Research Scientist': 'Your curiosity and investigative personality aligns perfectly with research work in labs or institutions.',
    'Sales Manager': 'Influencing and persuading comes naturally to enterprising personalities.',
    'School Counsellor': 'Guiding students through academic and personal challenges is deeply suited to your personality.',
    'Social Worker': 'Making a difference in communities is what your social drive is built for.',
    'Software Engineer': 'Logical problem solving is at the heart of software development.',
    'Supply Chain Manager': 'Coordinating complex logistics networks suits your organised, results-driven personality.',
    'Tax Consultant': 'Navigating complex tax laws and helping clients comply suits your structured, analytical personality.',
    'Teacher': 'Shaping young minds is a profound expression of your social nature.',
    'Teacher / Educator': 'Shaping young minds through teaching is one of the most meaningful expressions of your social personality.',
    'UI/UX Designer': 'Designing experiences that feel right rewards your aesthetic sensibility.',
    'UX Researcher': 'Combines analytical thinking with creative problem solving to improve how people interact with products.',
    'Veterinarian': 'A hands-on career helping animals suits your realistic and scientific personality perfectly.',
    'Writer / Author': 'Your imaginative mind and curiosity about people make you a natural storyteller.',
}

WEIGHTS = {
    "riasec": 0.25,
    "passion": 0.15,
    "aptitude": 0.15,
    "subject": 0.20,
    "workstyle": 0.15,
    "priorities": 0.05,
    "feasibility": 0.05,
}

def score_careers(profile) -> list[dict]:
    """
    Takes a StudentProfile ORM object and returns a ranked list of top 10 careers.
    Integrates onboarding signals, RIASEC personality, Hobbies/Passion, and Aptitude tests.
    """
    riasec = profile.riasec_scores or {}
    subject_ratings = profile.subject_ratings or {}
    work_style = profile.work_style or {}
    career_priorities = profile.career_priorities or []
    hobbies = profile.hobbies or []
    aptitude_scores = profile.aptitude_scores or {}

    profile_data = {
        "stream": profile.stream.value if profile.stream else None,
        "cost_constraint": profile.cost_constraint.value if profile.cost_constraint else None,
        "target_sector": profile.target_sector.value if profile.target_sector else None,
        "relocation_pref": profile.relocation_pref.value if profile.relocation_pref else None,
        "subject_ratings": subject_ratings,
        "hobbies": hobbies,
        "aptitude_scores": aptitude_scores,
    }

    has_riasec = bool(riasec)
    has_hobbies = bool(hobbies)
    has_aptitude = bool(aptitude_scores)
    has_subjects = bool(subject_ratings)
    has_workstyle = bool(work_style)
    has_priorities = bool(career_priorities)

    # Compute effective weights with graceful degradation
    effective_weights = dict(WEIGHTS)
    
    if not has_riasec:
        effective_weights["subject"] += effective_weights["riasec"]
        effective_weights["riasec"] = 0.0
    if not has_hobbies:
        target = "riasec" if has_riasec else "subject"
        effective_weights[target] += effective_weights["passion"]
        effective_weights["passion"] = 0.0
    if not has_aptitude:
        target = "riasec" if has_riasec else "subject"
        effective_weights[target] += effective_weights["aptitude"]
        effective_weights["aptitude"] = 0.0
        
    if not has_subjects:
        target = "riasec" if has_riasec else "workstyle"
        effective_weights[target] += effective_weights["subject"]
        effective_weights["subject"] = 0.0
    if not has_workstyle:
        target = "riasec" if has_riasec else "subject"
        effective_weights[target] += effective_weights["workstyle"]
        effective_weights["workstyle"] = 0.0
    if not has_priorities:
        target = "riasec" if has_riasec else "subject"
        effective_weights[target] += effective_weights["priorities"]
        effective_weights["priorities"] = 0.0

    results = []

    for career in CAREER_CATALOG:
        # Calculate RIASEC & Passion first for feasibility bypass check
        r_score = _riasec_score(riasec, career) if has_riasec else 0.5
        pass_score = _passion_score(hobbies, career["title"]) if has_hobbies else 0.5
        
        # ── Feasibility check (with passion stream-bypass) ───────────────────
        feas = _feasibility_score(profile_data, career, riasec_score=r_score, passion_score=pass_score)
        if feas == HARD_FILTER_EXCLUDE:
            continue

        # ── Other Component scores ────────────────────────────────────────────
        apt_score = _aptitude_score(aptitude_scores, career) if has_aptitude else 0.5
        s_score = _subject_score(subject_ratings, career) if has_subjects else 0.5
        w_score = _workstyle_score(work_style, career) if has_workstyle else 0.5
        p_score = _priority_score(career_priorities, career) if has_priorities else 0.5

        component_scores = {
            "riasec": (r_score, effective_weights["riasec"]),
            "passion": (pass_score, effective_weights["passion"]),
            "aptitude": (apt_score, effective_weights["aptitude"]),
            "subject": (s_score, effective_weights["subject"]),
            "workstyle": (w_score, effective_weights["workstyle"]),
            "priorities": (p_score, effective_weights["priorities"]),
            "feasibility": (feas, effective_weights["feasibility"]),
        }

        total = (
            r_score * effective_weights["riasec"] +
            pass_score * effective_weights["passion"] +
            apt_score * effective_weights["aptitude"] +
            s_score * effective_weights["subject"] +
            w_score * effective_weights["workstyle"] +
            p_score * effective_weights["priorities"] +
            feas * effective_weights["feasibility"]
        )

        reason = _generate_reason(career, component_scores, profile_data)

        # ── Stream Display Label ──────────────────────────────────────────────
        stream_display_map = {
            "pcm": "PCM", "pcb": "PCB", "pcmb": "PCM/PCB",
            "comm": "Commerce", "arts": "Arts",
        }
        student_stream = profile_data.get("stream", "")
        stream_display = stream_display_map.get(student_stream, "All Streams")

        description = ENGINE2_EXPLANATIONS.get(career["title"]) or career.get("reason", "")

        results.append({
            "title": career["title"],
            "salary": career["salary"],
            "stream": stream_display,
            "reason": reason,
            "description": description,
            "riasec_primary": career.get("riasec_primary", ""),
            "riasec_secondary": career.get("riasec_secondary", ""),
            "cost_level": career.get("cost_level", ""),
            "requires_relocation": career.get("requires_relocation", False),
            "priority_alignment": career.get("priority_alignment", []),
            "sector": career.get("sector", ""),
            "total_score": round(total, 4),
        })

    # Sort descending and take top 10
    results.sort(key=lambda x: x["total_score"], reverse=True)
    top10 = results[:10]

    # Add rank and strip score
    for i, item in enumerate(top10, 1):
        item["rank"] = i
        del item["total_score"]

    return top10
