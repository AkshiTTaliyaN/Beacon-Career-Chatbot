"""
exams_catalog.py
Structured catalog of major Indian entrance examinations.
Each entry links exams to the careers they unlock (referencing titles in career_catalog.py).
"""

EXAMS_CATALOG = [

    # ── Engineering ───────────────────────────────────────────────────────────

    {
        "name": "JEE Main",
        "conducting_body": "NTA (National Testing Agency)",
        "eligibility_streams": ["pcm", "pcmb"],
        "min_class": 12,
        "leads_to": "B.Tech / B.E. admissions to NITs, IIITs, and GFTIs — gateway to engineering and technology careers",
        "timeline": "January & April sessions each year",
        "prep_focus": "Physics, Chemistry, and Mathematics at Class 11-12 level; emphasis on problem-solving speed and conceptual clarity",
        "related_careers": [
            "Software Engineer",
            "Mechanical Engineer",
            "Civil Engineer",
            "Electrical Engineer",
            "Data Scientist",
            "Data Analyst",
            "Biomedical Engineer",
            "Game Designer",
            "Quality Assurance Analyst",
        ],
    },

    {
        "name": "JEE Advanced",
        "conducting_body": "IITs (Indian Institutes of Technology)",
        "eligibility_streams": ["pcm", "pcmb"],
        "min_class": 12,
        "leads_to": "B.Tech / B.S. / Dual Degree admissions to the 23 IITs — the most prestigious engineering institutions in India",
        "timeline": "May / June (only for top 2,50,000 JEE Main qualifiers)",
        "prep_focus": "Deep conceptual understanding of Physics, Chemistry, and Mathematics; multi-concept problems and analytical reasoning",
        "related_careers": [
            "Software Engineer",
            "Mechanical Engineer",
            "Civil Engineer",
            "Electrical Engineer",
            "Data Scientist",
            "Research Scientist",
            "Biomedical Engineer",
            "Architect",
        ],
    },

    # ── Medical ───────────────────────────────────────────────────────────────

    {
        "name": "NEET-UG",
        "conducting_body": "NTA (National Testing Agency)",
        "eligibility_streams": ["pcb", "pcmb"],
        "min_class": 12,
        "leads_to": "MBBS, BDS, BAMS, BHMS, and other medical/paramedical undergraduate programmes",
        "timeline": "May each year",
        "prep_focus": "Biology (Botany + Zoology), Chemistry, and Physics at Class 11-12 level; NCERT mastery is critical",
        "related_careers": [
            "Doctor (MBBS)",
            "Physiotherapist",
            "Biomedical Engineer",
            "Research Scientist",
            "Environmental Scientist",
            "Psychologist",
        ],
    },

    # ── Law ────────────────────────────────────────────────────────────────────

    {
        "name": "CLAT",
        "conducting_body": "Consortium of NLUs (National Law Universities)",
        "eligibility_streams": ["pcm", "pcb", "pcmb", "comm", "arts", "any"],
        "min_class": 12,
        "leads_to": "5-year integrated B.A. LL.B. / B.Com. LL.B. at top National Law Universities",
        "timeline": "December each year",
        "prep_focus": "English comprehension, current affairs & general knowledge, legal reasoning, logical reasoning, and quantitative techniques",
        "related_careers": [
            "Lawyer / Legal Advisor",
            "IAS / Civil Services Officer",
        ],
    },

    # ── Design ────────────────────────────────────────────────────────────────

    {
        "name": "NID DAT",
        "conducting_body": "NID (National Institute of Design)",
        "eligibility_streams": ["pcm", "pcb", "pcmb", "comm", "arts", "any"],
        "min_class": 12,
        "leads_to": "B.Des. programmes at NID Ahmedabad and its campuses — leading to careers in industrial, communication, and textile design",
        "timeline": "Prelims in December, Mains / Studio Test in April",
        "prep_focus": "Visual aptitude, sketching, design thinking, observation skills, creativity, and general awareness of design",
        "related_careers": [
            "UI/UX Designer",
            "Graphic Designer",
            "Architect",
        ],
    },

    # ── Civil Services ────────────────────────────────────────────────────────

    {
        "name": "UPSC CSE",
        "conducting_body": "UPSC (Union Public Service Commission)",
        "eligibility_streams": ["pcm", "pcb", "pcmb", "comm", "arts", "any"],
        "min_class": 21,  # requires a bachelor's degree (effectively post-graduation of class 12 + 3)
        "leads_to": "IAS, IPS, IFS, and other All India / Central Services — top administrative positions in Indian government",
        "timeline": "Prelims in May, Mains in September, Interview in February-March (annual cycle)",
        "prep_focus": "General studies (history, geography, polity, economy, science), essay writing, optional subject, current affairs, and ethics",
        "related_careers": [
            "IAS / Civil Services Officer",
            "Lawyer / Legal Advisor",
            "Social Worker / NGO Manager",
        ],
    },

    # ── Defence ───────────────────────────────────────────────────────────────

    {
        "name": "NDA",
        "conducting_body": "UPSC (Union Public Service Commission)",
        "eligibility_streams": ["pcm", "pcmb", "any"],
        "min_class": 12,
        "leads_to": "Training at the National Defence Academy — commissioning into the Indian Army, Navy, or Air Force",
        "timeline": "April & September (two attempts per year); Navy and Air Force wings require PCM",
        "prep_focus": "Mathematics, general ability (English, GK, physics, chemistry, geography, history), and physical fitness",
        "related_careers": [
            "IAS / Civil Services Officer",
            "Mechanical Engineer",
            "Electrical Engineer",
        ],
    },

    # ── Management ────────────────────────────────────────────────────────────

    {
        "name": "IPMAT",
        "conducting_body": "IIM Indore / IIM Rohtak",
        "eligibility_streams": ["pcm", "pcb", "pcmb", "comm", "arts", "any"],
        "min_class": 12,
        "leads_to": "5-year Integrated Programme in Management (IPM) at IIMs — direct path to an MBA without a separate entrance after graduation",
        "timeline": "May / June each year",
        "prep_focus": "Quantitative aptitude, verbal ability, and logical reasoning; strong fundamentals in mathematics and English",
        "related_careers": [
            "Management Consultant",
            "Marketing Manager",
            "HR Manager",
            "Operations Manager",
            "Investment Banker",
            "Entrepreneur",
        ],
    },

    # ── Design (IIT) ──────────────────────────────────────────────────────────

    {
        "name": "UCEED",
        "conducting_body": "IIT Bombay (on behalf of IITs offering design programmes)",
        "eligibility_streams": ["pcm", "pcb", "pcmb", "comm", "arts", "any"],
        "min_class": 12,
        "leads_to": "B.Des. programmes at IIT Bombay, IIT Delhi, IIT Guwahati, IIITDM Jabalpur, and other participating institutes",
        "timeline": "January each year",
        "prep_focus": "Visualisation & spatial ability, observation & design sensitivity, analytical & logical reasoning, and creative ability",
        "related_careers": [
            "UI/UX Designer",
            "Graphic Designer",
            "Architect",
            "Game Designer",
        ],
    },

    # ── Fashion Design ────────────────────────────────────────────────────────

    {
        "name": "NIFT Entrance",
        "conducting_body": "NTA (for NIFT — National Institute of Fashion Technology)",
        "eligibility_streams": ["pcm", "pcb", "pcmb", "comm", "arts", "any"],
        "min_class": 12,
        "leads_to": "B.Des. / B.FTech programmes at NIFT campuses across India — careers in fashion design, textile design, and fashion management",
        "timeline": "February each year",
        "prep_focus": "Creative ability test (CAT), general ability test (GAT) covering quantitative ability, English, GK, and design awareness",
        "related_careers": [
            "UI/UX Designer",
            "Graphic Designer",
            "Entrepreneur",
            "Marketing Manager",
        ],
    },

    # ── Chartered Accountancy ─────────────────────────────────────────────────

    {
        "name": "CA Foundation",
        "conducting_body": "ICAI (Institute of Chartered Accountants of India)",
        "eligibility_streams": ["comm", "pcm", "pcmb", "arts", "any"],
        "min_class": 12,
        "leads_to": "Chartered Accountancy qualification (CA Foundation → CA Intermediate → CA Final) — the gold standard for accounting and audit professionals",
        "timeline": "January, May, and September sessions each year",
        "prep_focus": "Accounting principles, business laws, quantitative aptitude, business economics, and business correspondence",
        "related_careers": [
            "Chartered Accountant",
            "Financial Analyst",
            "Investment Banker",
            "Bank Manager / Finance Officer",
            "Operations Manager",
        ],
    },
]
