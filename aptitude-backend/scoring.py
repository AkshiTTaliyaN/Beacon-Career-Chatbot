from typing import List, Dict
from career_mapping import CAREER_MAP, PERSONALITY_DESCRIPTIONS

# Questions are grouped: Q1-10 = Realistic, Q11-20 = Investigative,
# Q21-30 = Artistic, Q31-40 = Social, Q41-50 = Enterprising, Q51-60 = Conventional
CATEGORIES = ["R", "I", "A", "S", "E", "C"]
CATEGORY_NAMES = {
    "R": "Realistic",
    "I": "Investigative",
    "A": "Artistic",
    "S": "Social",
    "E": "Enterprising",
    "C": "Conventional"
}

def calculate_scores(answers: List[int]) -> Dict[str, float]:
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

def get_result(scores: Dict[str, float], name: str, class_level: str, stream: str) -> dict:
    sorted_cats = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    primary_code = sorted_cats[0][0]
    secondary_code = sorted_cats[1][0]
    tertiary_code = sorted_cats[2][0]
    holland_code = primary_code + secondary_code + tertiary_code

    primary_name = CATEGORY_NAMES[primary_code]
    secondary_name = CATEGORY_NAMES[secondary_code]

    description = PERSONALITY_DESCRIPTIONS.get(primary_code, "")
    careers = CAREER_MAP.get(holland_code) or CAREER_MAP.get(primary_code + secondary_code) or CAREER_MAP.get(primary_code, [])

    score_list = [
        {"category": CATEGORY_NAMES[cat], "code": cat, "score": score}
        for cat, score in sorted_cats
    ]

    return {
        "name": name,
        "class_level": class_level,
        "stream": stream,
        "holland_code": holland_code,
        "primary_type": primary_name,
        "secondary_type": secondary_name,
        "description": description,
        "scores": score_list,
        "careers": careers[:3],
        "entrance_exams": get_exams(stream, primary_code),
        "skills_to_build": get_skills(primary_code, secondary_code),
        "closing_note": get_closing_note(primary_name, careers)
    }

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
        "Investigative": f"Your Investigative personality means you thrive when given complex problems to solve. The careers ahead of you are intellectually rich and financially rewarding. Start building your analytical skills now — learn Python, strengthen your mathematics, and practise real-world data projects. With steady focus and curiosity, the right path will become clear. Share this report with your parents and teachers to plan the next steps together.",
        "Realistic": f"Your Realistic nature means you are built to create, build, and solve with your hands and mind. Careers in engineering and technology reward exactly the kind of focused, practical thinking you bring. Start with hands-on projects, build your technical foundation, and explore workshops or labs near you. Share this report with your parents and teachers to plan together.",
        "Artistic": f"Your Artistic personality is a genuine strength in today's creative economy. Design, media, and content careers are growing fast in India. Start building a portfolio now — even small projects matter. Share this report with your teachers and parents so they understand the exciting paths available to you.",
        "Social": f"Your Social personality is your superpower. People-focused careers in education, counselling, healthcare, and social work are both meaningful and in demand. Start practising communication and leadership skills today. Share this report with your parents and teachers to explore the best pathway for you.",
        "Enterprising": f"Your Enterprising nature means you are made to lead, influence, and build. Business and law careers reward the ambition and drive you naturally have. Start practising leadership and financial thinking today. Share this report with your parents and teachers to map out your journey.",
        "Conventional": f"Your Conventional strength means you excel at organisation, accuracy, and structured thinking. Finance, accounting, and administrative careers value exactly these qualities. Start building your spreadsheet and numeracy skills today. Share this report with your parents and teachers to plan your path forward.",
    }
    return notes.get(primary_name, f"Your personality profile points toward a strong and rewarding career path. Share this report with your parents and teachers to plan the next steps together.")