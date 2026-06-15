PERSONALITY_DESCRIPTIONS = {
    "R": "Realistic individuals are practical, hands-on, and mechanically inclined. You enjoy working with tools, machines, and physical systems. You are grounded, dependable, and prefer concrete tasks over abstract ones. Building, fixing, and creating tangible things energises you.",
    "I": "Investigative individuals are analytical, curious, and enjoy research and problem solving. You prefer working with ideas and data rather than routine tasks, and you are motivated by understanding how systems work. Deep focus, logical thinking, and a love for discovery are hallmarks of this type.",
    "A": "Artistic individuals are creative, expressive, and imaginative. You thrive when given freedom to think outside the box and communicate ideas through design, writing, music, or performance. You value originality and are energised by creative challenges.",
    "S": "Social individuals are empathetic, collaborative, and people-oriented. You are motivated by helping, teaching, and connecting with others. You excel at communication, teamwork, and supporting those around you. Making a difference in people's lives is what drives you.",
    "E": "Enterprising individuals are ambitious, persuasive, and natural leaders. You are drawn to challenges that involve influencing others, taking initiative, and building things from the ground up. Business, management, and leadership roles align strongly with your personality.",
    "C": "Conventional individuals are detail-oriented, organised, and methodical. You thrive in structured environments where accuracy and systems matter. Data management, finance, and administration come naturally to you, and you take pride in precision and reliability.",
}

CAREER_MAP = {
    # Investigative dominant
    "IRC": [
        {"title": "Data Scientist", "salary": "₹8 – 25 LPA", "reason": "Your analytical nature and love for problem solving makes this a strong fit. You will enjoy finding patterns in data and building models.", "stream": "PCM"},
        {"title": "Research Scientist", "salary": "₹6 – 18 LPA", "reason": "Your curiosity and investigative personality aligns perfectly with research work in labs or institutions.", "stream": "PCM/PCB"},
        {"title": "Software Engineer", "salary": "₹7 – 30 LPA", "reason": "Investigative types excel at debugging, system design, and building logical solutions to complex problems.", "stream": "PCM"},
    ],
    "IRS": [
        {"title": "Biomedical Engineer", "salary": "₹6 – 20 LPA", "reason": "Combines your investigative drive with practical application in healthcare and medical technology.", "stream": "PCM/PCB"},
        {"title": "Environmental Scientist", "salary": "₹5 – 15 LPA", "reason": "Your analytical approach makes you well-suited to studying and solving environmental challenges.", "stream": "PCB"},
        {"title": "Data Analyst", "salary": "₹5 – 18 LPA", "reason": "Turning raw data into actionable insights suits your logical, structured thinking style.", "stream": "PCM"},
    ],
    "IAE": [
        {"title": "UX Researcher", "salary": "₹7 – 22 LPA", "reason": "Combines analytical thinking with creative problem solving to improve how people interact with products.", "stream": "PCM/Humanities"},
        {"title": "Cognitive Scientist", "salary": "₹6 – 18 LPA", "reason": "Studying how the mind works blends your investigative curiosity with your creative and social interests.", "stream": "Humanities/PCB"},
        {"title": "Product Designer", "salary": "₹8 – 24 LPA", "reason": "Your mix of analytical and artistic strengths is ideal for designing user-centred digital products.", "stream": "PCM/Humanities"},
    ],
    "IAS": [
        {"title": "Psychologist", "salary": "₹4 – 18 LPA", "reason": "Your blend of analytical thinking, creativity, and social sensitivity is a natural fit for psychology.", "stream": "PCB/Humanities"},
        {"title": "Behavioural Economist", "salary": "₹8 – 25 LPA", "reason": "Studying how people make decisions combines your investigative and social interests powerfully.", "stream": "Commerce/Humanities"},
        {"title": "Research Psychologist", "salary": "₹5 – 16 LPA", "reason": "Designing and conducting studies on human behaviour suits your curious, methodical nature.", "stream": "Humanities/PCB"},
    ],
    # Realistic dominant
    "RIE": [
        {"title": "Mechanical Engineer", "salary": "₹5 – 18 LPA", "reason": "Your practical, hands-on approach combined with analytical thinking makes engineering a strong match.", "stream": "PCM"},
        {"title": "Civil Engineer", "salary": "₹5 – 16 LPA", "reason": "Building infrastructure and solving real-world structural problems suits your grounded personality.", "stream": "PCM"},
        {"title": "Electrician / Electrical Engineer", "salary": "₹4 – 20 LPA", "reason": "Hands-on technical work with measurable results aligns with your realistic strengths.", "stream": "PCM"},
    ],
    "RIS": [
        {"title": "Physiotherapist", "salary": "₹4 – 12 LPA", "reason": "Helping people recover physically uses both your practical skills and people-oriented side.", "stream": "PCB"},
        {"title": "Veterinarian", "salary": "₹4 – 14 LPA", "reason": "A hands-on career helping animals suits your realistic and scientific personality perfectly.", "stream": "PCB"},
        {"title": "Occupational Therapist", "salary": "₹4 – 12 LPA", "reason": "Practical, helping-focused work that rewards your grounded and empathetic approach.", "stream": "PCB"},
    ],
    "RIA": [
        {"title": "Architect", "salary": "₹5 – 20 LPA", "reason": "Designing structures that are both functional and beautiful is a perfect blend of your top traits.", "stream": "PCM"},
        {"title": "Industrial Designer", "salary": "₹5 – 18 LPA", "reason": "Creating products that are practical and well-designed suits your realistic and artistic mix.", "stream": "PCM/Humanities"},
        {"title": "Game Designer", "salary": "₹6 – 22 LPA", "reason": "Building interactive worlds and systems combines your technical and creative strengths.", "stream": "PCM"},
    ],
    # Artistic dominant
    "AIE": [
        {"title": "UI/UX Designer", "salary": "₹6 – 22 LPA", "reason": "Designing digital experiences that are beautiful and functional is ideal for your creative-analytical blend.", "stream": "PCM/Humanities"},
        {"title": "Graphic Designer", "salary": "₹4 – 15 LPA", "reason": "Visual communication is where your artistic instinct and attention to craft will shine.", "stream": "Humanities"},
        {"title": "Creative Technologist", "salary": "₹8 – 25 LPA", "reason": "Bridging art and technology is a growing field that rewards exactly your combination of strengths.", "stream": "PCM/Humanities"},
    ],
    "ASE": [
        {"title": "Content Strategist", "salary": "₹5 – 18 LPA", "reason": "Creating and managing content that connects with audiences suits your creative and social nature.", "stream": "Humanities/Commerce"},
        {"title": "Journalist", "salary": "₹3 – 12 LPA", "reason": "Investigating and storytelling aligns with your expressive and people-aware personality.", "stream": "Humanities"},
        {"title": "PR Specialist", "salary": "₹5 – 16 LPA", "reason": "Managing public image and communication combines your artistic and enterprising traits.", "stream": "Humanities/Commerce"},
    ],
    "AIS": [
        {"title": "Psychotherapist", "salary": "₹5 – 16 LPA", "reason": "Helping people through creative and talking therapies suits your artistic and empathetic nature.", "stream": "Humanities/PCB"},
        {"title": "Writer / Author", "salary": "₹3 – 15 LPA", "reason": "Your imaginative mind and curiosity about people make you a natural storyteller.", "stream": "Humanities"},
        {"title": "Film Director", "salary": "₹6 – 30 LPA", "reason": "Bringing stories to life on screen rewards your creative vision and social awareness.", "stream": "Humanities"},
    ],
    # Social dominant
    "SIA": [
        {"title": "School Counsellor", "salary": "₹4 – 12 LPA", "reason": "Guiding students through academic and personal challenges is deeply suited to your personality.", "stream": "Humanities"},
        {"title": "Social Worker", "salary": "₹3 – 10 LPA", "reason": "Supporting communities and individuals in need aligns with your caring, people-first values.", "stream": "Humanities"},
        {"title": "NGO Program Manager", "salary": "₹5 – 15 LPA", "reason": "Designing and running programs that help communities matches your social and creative strengths.", "stream": "Humanities/Commerce"},
    ],
    "SER": [
        {"title": "Human Resources Manager", "salary": "₹6 – 18 LPA", "reason": "Managing people, culture, and workplace wellbeing rewards your social and enterprising traits.", "stream": "Commerce/Humanities"},
        {"title": "Teacher / Educator", "salary": "₹3 – 12 LPA", "reason": "Shaping young minds through teaching is one of the most meaningful expressions of your social personality.", "stream": "Humanities"},
        {"title": "Event Manager", "salary": "₹4 – 14 LPA", "reason": "Coordinating people and experiences to create memorable events suits your energetic social nature.", "stream": "Commerce/Humanities"},
    ],
    "SAE": [
        {"title": "Clinical Psychologist", "salary": "₹5 – 18 LPA", "reason": "Helping people understand and manage their minds uses your empathy, creativity, and leadership.", "stream": "PCB/Humanities"},
        {"title": "Counselling Psychologist", "salary": "₹4 – 14 LPA", "reason": "A fulfilling career guiding people through challenges suits your warm, analytical personality.", "stream": "Humanities/PCB"},
        {"title": "Health Educator", "salary": "₹4 – 12 LPA", "reason": "Teaching communities about health and wellbeing aligns with your social and artistic communication skills.", "stream": "PCB/Humanities"},
    ],
    # Enterprising dominant
    "EIS": [
        {"title": "Management Consultant", "salary": "₹10 – 35 LPA", "reason": "Solving complex business problems and influencing strategy suits your leadership-analytical blend.", "stream": "Commerce/PCM"},
        {"title": "Entrepreneur", "salary": "Variable", "reason": "Building something from scratch is where your enterprising drive and investigative thinking shine most.", "stream": "Commerce"},
        {"title": "Investment Banker", "salary": "₹12 – 40 LPA", "reason": "High-stakes financial decision-making rewards your analytical, ambitious personality.", "stream": "Commerce"},
    ],
    "EAS": [
        {"title": "Marketing Manager", "salary": "₹7 – 22 LPA", "reason": "Creating campaigns that influence and inspire combines your enterprising and artistic strengths.", "stream": "Commerce/Humanities"},
        {"title": "Brand Strategist", "salary": "₹8 – 25 LPA", "reason": "Building brand identity and vision requires the creative-leadership blend you naturally have.", "stream": "Commerce/Humanities"},
        {"title": "Advertising Creative Director", "salary": "₹10 – 30 LPA", "reason": "Leading creative teams and crafting persuasive campaigns rewards your top personality strengths.", "stream": "Humanities/Commerce"},
    ],
    "ERS": [
        {"title": "Operations Manager", "salary": "₹8 – 20 LPA", "reason": "Running efficient operations uses your practical leadership and people management strengths.", "stream": "Commerce"},
        {"title": "Supply Chain Manager", "salary": "₹7 – 22 LPA", "reason": "Coordinating complex logistics networks suits your organised, results-driven personality.", "stream": "Commerce/PCM"},
        {"title": "Business Development Manager", "salary": "₹8 – 24 LPA", "reason": "Finding and building new business opportunities aligns with your enterprising and realistic traits.", "stream": "Commerce"},
    ],
    # Conventional dominant
    "CIE": [
        {"title": "Chartered Accountant", "salary": "₹8 – 25 LPA", "reason": "Precision, financial analysis, and professional standards suit your conventional-investigative nature.", "stream": "Commerce"},
        {"title": "Financial Analyst", "salary": "₹7 – 22 LPA", "reason": "Analysing data and advising on investments rewards your methodical, detail-oriented approach.", "stream": "Commerce/PCM"},
        {"title": "Tax Consultant", "salary": "₹6 – 18 LPA", "reason": "Navigating complex tax laws and helping clients comply suits your structured, analytical personality.", "stream": "Commerce"},
    ],
    "CSE": [
        {"title": "Bank Manager", "salary": "₹8 – 18 LPA", "reason": "Leading a branch while managing finances and customer relations fits your conventional-social blend.", "stream": "Commerce"},
        {"title": "Administrative Officer", "salary": "₹5 – 14 LPA", "reason": "Keeping organisations running smoothly rewards your organisational precision and people skills.", "stream": "Commerce/Humanities"},
        {"title": "Office Manager", "salary": "₹4 – 12 LPA", "reason": "Coordinating operations, people, and systems is where your conventional strengths shine.", "stream": "Commerce"},
    ],
    "CRS": [
        {"title": "Data Entry Specialist", "salary": "₹3 – 8 LPA", "reason": "Accurate, systematic data management suits your detail-oriented and reliable personality.", "stream": "Commerce"},
        {"title": "Quality Assurance Analyst", "salary": "₹5 – 15 LPA", "reason": "Checking systems and processes for errors aligns with your methodical, precise approach.", "stream": "Commerce/PCM"},
        {"title": "Lab Technician", "salary": "₹3 – 10 LPA", "reason": "Maintaining precision and following protocols in a lab environment suits your conventional nature.", "stream": "PCB"},
    ],
    # Fallback single-category
    "I": [
        {"title": "Data Scientist", "salary": "₹8 – 25 LPA", "reason": "Your analytical drive and curiosity are ideal for data science.", "stream": "PCM"},
        {"title": "Software Engineer", "salary": "₹7 – 30 LPA", "reason": "Logical problem solving is at the heart of software development.", "stream": "PCM"},
        {"title": "Research Analyst", "salary": "₹5 – 16 LPA", "reason": "Investigating and interpreting data suits your investigative personality.", "stream": "PCM"},
    ],
    "R": [
        {"title": "Civil Engineer", "salary": "₹5 – 16 LPA", "reason": "Building and designing infrastructure rewards your hands-on practical approach.", "stream": "PCM"},
        {"title": "Mechanical Engineer", "salary": "₹5 – 18 LPA", "reason": "Working with machines and systems is a natural fit for your realistic nature.", "stream": "PCM"},
        {"title": "Electrician / Electrical Engineer", "salary": "₹4 – 20 LPA", "reason": "Technical, hands-on work with measurable results.", "stream": "PCM"},
    ],
    "A": [
        {"title": "Graphic Designer", "salary": "₹4 – 15 LPA", "reason": "Visual communication is where your artistic instinct shines.", "stream": "Humanities"},
        {"title": "Content Creator", "salary": "₹3 – 15 LPA", "reason": "Building audiences through creative work suits your expressive personality.", "stream": "Humanities"},
        {"title": "UI/UX Designer", "salary": "₹6 – 22 LPA", "reason": "Designing experiences that feel right rewards your aesthetic sensibility.", "stream": "Humanities/PCM"},
    ],
    "S": [
        {"title": "Teacher", "salary": "₹3 – 12 LPA", "reason": "Shaping young minds is a profound expression of your social nature.", "stream": "Humanities"},
        {"title": "Counsellor", "salary": "₹4 – 14 LPA", "reason": "Guiding people through challenges suits your empathetic personality.", "stream": "Humanities"},
        {"title": "Social Worker", "salary": "₹3 – 10 LPA", "reason": "Making a difference in communities is what your social drive is built for.", "stream": "Humanities"},
    ],
    "E": [
        {"title": "Entrepreneur", "salary": "Variable", "reason": "Building something from scratch rewards your natural leadership and ambition.", "stream": "Commerce"},
        {"title": "Sales Manager", "salary": "₹6 – 18 LPA", "reason": "Influencing and persuading comes naturally to enterprising personalities.", "stream": "Commerce"},
        {"title": "Marketing Manager", "salary": "₹7 – 22 LPA", "reason": "Creating strategies that drive results suits your ambitious, creative approach.", "stream": "Commerce"},
    ],
    "C": [
        {"title": "Chartered Accountant", "salary": "₹8 – 25 LPA", "reason": "Precision and financial mastery are your natural strengths.", "stream": "Commerce"},
        {"title": "Financial Analyst", "salary": "₹7 – 22 LPA", "reason": "Methodical analysis of financial data suits your detail-oriented personality.", "stream": "Commerce"},
        {"title": "Administrative Manager", "salary": "₹5 – 14 LPA", "reason": "Keeping systems and people organised is where you naturally excel.", "stream": "Commerce"},
    ],
}


# ---------------------------------------------------------------------------
# HOBBY MAPPING
# Maps each hobby to:
#   - riasec: list of RIASEC codes it reinforces
#   - domains: career domain tags used to find interest-aligned alternatives
# ---------------------------------------------------------------------------
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


# ---------------------------------------------------------------------------
# DOMAIN TO CAREERS
# Maps career domain tags to interest-aligned career suggestions.
# These appear on the result page as "Based on your interests, you may also
# want to explore..." — separate from the primary RIASEC recommendation.
# ---------------------------------------------------------------------------
DOMAIN_CAREERS = {
    "design":               [{"title": "Graphic Designer", "salary": "₹4 – 15 LPA", "stream": "Humanities"},
                             {"title": "UI/UX Designer", "salary": "₹6 – 22 LPA", "stream": "PCM/Humanities"}],
    "animation":            [{"title": "Animator", "salary": "₹4 – 18 LPA", "stream": "Humanities"},
                             {"title": "Visual Effects Artist", "salary": "₹5 – 20 LPA", "stream": "Humanities/PCM"}],
    "architecture":         [{"title": "Architect", "salary": "₹5 – 20 LPA", "stream": "PCM"},
                             {"title": "Interior Designer", "salary": "₹4 – 15 LPA", "stream": "Humanities"}],
    "media":                [{"title": "Journalist", "salary": "₹3 – 12 LPA", "stream": "Humanities"},
                             {"title": "Content Creator", "salary": "₹3 – 15 LPA", "stream": "Humanities"}],
    "journalism":           [{"title": "Journalist", "salary": "₹3 – 12 LPA", "stream": "Humanities"},
                             {"title": "News Anchor", "salary": "₹4 – 18 LPA", "stream": "Humanities"}],
    "literature":           [{"title": "Writer / Author", "salary": "₹3 – 15 LPA", "stream": "Humanities"},
                             {"title": "Editor", "salary": "₹4 – 14 LPA", "stream": "Humanities"}],
    "content":              [{"title": "Content Strategist", "salary": "₹5 – 18 LPA", "stream": "Humanities/Commerce"},
                             {"title": "Copywriter", "salary": "₹4 – 15 LPA", "stream": "Humanities"}],
    "law":                  [{"title": "Lawyer", "salary": "₹5 – 30 LPA", "stream": "Humanities"},
                             {"title": "Judge / Magistrate", "salary": "₹8 – 20 LPA", "stream": "Humanities"}],
    "performing_arts":      [{"title": "Actor", "salary": "Variable", "stream": "Humanities"},
                             {"title": "Music Producer", "salary": "₹5 – 25 LPA", "stream": "Humanities"}],
    "music_production":     [{"title": "Music Producer", "salary": "₹5 – 25 LPA", "stream": "Humanities"},
                             {"title": "Sound Engineer", "salary": "₹4 – 18 LPA", "stream": "Humanities/PCM"}],
    "event_management":     [{"title": "Event Manager", "salary": "₹4 – 14 LPA", "stream": "Commerce/Humanities"},
                             {"title": "Wedding Planner", "salary": "₹4 – 12 LPA", "stream": "Commerce"}],
    "product_design":       [{"title": "Industrial Designer", "salary": "₹5 – 18 LPA", "stream": "PCM/Humanities"},
                             {"title": "Product Designer", "salary": "₹8 – 24 LPA", "stream": "PCM/Humanities"}],
    "interior_design":      [{"title": "Interior Designer", "salary": "₹4 – 15 LPA", "stream": "Humanities"},
                             {"title": "Architect", "salary": "₹5 – 20 LPA", "stream": "PCM"}],
    "fashion":              [{"title": "Fashion Designer", "salary": "₹4 – 20 LPA", "stream": "Humanities"},
                             {"title": "Textile Designer", "salary": "₹3 – 12 LPA", "stream": "Humanities"}],
    "sports":               [{"title": "Sports Coach", "salary": "₹3 – 15 LPA", "stream": "PCB/Humanities"},
                             {"title": "Sports Manager", "salary": "₹5 – 18 LPA", "stream": "Commerce/Humanities"}],
    "defence":              [{"title": "Indian Army Officer", "salary": "₹7 – 20 LPA", "stream": "PCM/Humanities"},
                             {"title": "Police / IPS Officer", "salary": "₹6 – 18 LPA", "stream": "Humanities"}],
    "physiotherapy":        [{"title": "Physiotherapist", "salary": "₹4 – 12 LPA", "stream": "PCB"},
                             {"title": "Sports Medicine Doctor", "salary": "₹8 – 25 LPA", "stream": "PCB"}],
    "healthcare":           [{"title": "Doctor (MBBS)", "salary": "₹8 – 30 LPA", "stream": "PCB"},
                             {"title": "Nurse / Healthcare Worker", "salary": "₹3 – 10 LPA", "stream": "PCB"}],
    "geography":            [{"title": "Geographer", "salary": "₹4 – 14 LPA", "stream": "Humanities"},
                             {"title": "Town Planner", "salary": "₹5 – 16 LPA", "stream": "PCM/Humanities"}],
    "environmental_science":[{"title": "Environmental Scientist", "salary": "₹5 – 15 LPA", "stream": "PCB"},
                             {"title": "Wildlife Biologist", "salary": "₹4 – 14 LPA", "stream": "PCB"}],
    "academia":             [{"title": "Professor / Lecturer", "salary": "₹5 – 18 LPA", "stream": "Any"},
                             {"title": "Research Scholar", "salary": "₹4 – 14 LPA", "stream": "Any"}],
    "civil_services":       [{"title": "IAS / IPS Officer", "salary": "₹8 – 20 LPA", "stream": "Any"},
                             {"title": "State Government Officer", "salary": "₹6 – 16 LPA", "stream": "Any"}],
    "politics":             [{"title": "Political Analyst", "salary": "₹5 – 18 LPA", "stream": "Humanities"},
                             {"title": "Policy Researcher", "salary": "₹5 – 16 LPA", "stream": "Humanities"}],
    "engineering":          [{"title": "Mechanical Engineer", "salary": "₹5 – 18 LPA", "stream": "PCM"},
                             {"title": "Civil Engineer", "salary": "₹5 – 16 LPA", "stream": "PCM"}],
    "software_engineering": [{"title": "Software Engineer", "salary": "₹7 – 30 LPA", "stream": "PCM"},
                             {"title": "App Developer", "salary": "₹6 – 25 LPA", "stream": "PCM"}],
    "data_science":         [{"title": "Data Scientist", "salary": "₹8 – 25 LPA", "stream": "PCM"},
                             {"title": "Data Analyst", "salary": "₹5 – 18 LPA", "stream": "PCM"}],
    "finance":              [{"title": "Financial Analyst", "salary": "₹7 – 22 LPA", "stream": "Commerce"},
                             {"title": "Investment Banker", "salary": "₹12 – 40 LPA", "stream": "Commerce"}],
    "research":             [{"title": "Research Scientist", "salary": "₹6 – 18 LPA", "stream": "PCM/PCB"},
                             {"title": "Research Analyst", "salary": "₹5 – 16 LPA", "stream": "Any"}],
    "medicine":             [{"title": "Doctor (MBBS)", "salary": "₹8 – 30 LPA", "stream": "PCB"},
                             {"title": "Pharmacist", "salary": "₹4 – 14 LPA", "stream": "PCB"}],
    "biotechnology":        [{"title": "Biotechnologist", "salary": "₹5 – 18 LPA", "stream": "PCB"},
                             {"title": "Genetic Counsellor", "salary": "₹6 – 20 LPA", "stream": "PCB"}],
    "linguistics":          [{"title": "Linguist", "salary": "₹4 – 14 LPA", "stream": "Humanities"},
                             {"title": "Translator / Interpreter", "salary": "₹4 – 16 LPA", "stream": "Humanities"}],
    "foreign_services":     [{"title": "IFS Officer", "salary": "₹8 – 20 LPA", "stream": "Humanities"},
                             {"title": "International Relations Analyst", "salary": "₹6 – 18 LPA", "stream": "Humanities"}],
    "social_work":          [{"title": "Social Worker", "salary": "₹3 – 10 LPA", "stream": "Humanities"},
                             {"title": "NGO Program Manager", "salary": "₹5 – 15 LPA", "stream": "Humanities"}],
    "ngo":                  [{"title": "NGO Program Manager", "salary": "₹5 – 15 LPA", "stream": "Humanities"},
                             {"title": "Development Sector Consultant", "salary": "₹6 – 18 LPA", "stream": "Humanities"}],
    "education":            [{"title": "Teacher / Educator", "salary": "₹3 – 12 LPA", "stream": "Humanities"},
                             {"title": "School Counsellor", "salary": "₹4 – 12 LPA", "stream": "Humanities"}],
    "hr":                   [{"title": "HR Manager", "salary": "₹6 – 18 LPA", "stream": "Commerce/Humanities"},
                             {"title": "Talent Acquisition Specialist", "salary": "₹5 – 16 LPA", "stream": "Commerce"}],
    "marketing":            [{"title": "Marketing Manager", "salary": "₹7 – 22 LPA", "stream": "Commerce/Humanities"},
                             {"title": "Brand Strategist", "salary": "₹8 – 25 LPA", "stream": "Commerce"}],
    "corporate":            [{"title": "Management Consultant", "salary": "₹10 – 35 LPA", "stream": "Commerce"},
                             {"title": "Business Analyst", "salary": "₹7 – 22 LPA", "stream": "Commerce/PCM"}],
    "veterinary":           [{"title": "Veterinarian", "salary": "₹4 – 14 LPA", "stream": "PCB"},
                             {"title": "Animal Welfare Officer", "salary": "₹3 – 10 LPA", "stream": "PCB"}],
    "hospitality":          [{"title": "Hotel Manager", "salary": "₹5 – 18 LPA", "stream": "Commerce/Humanities"},
                             {"title": "Chef / Culinary Artist", "salary": "₹3 – 15 LPA", "stream": "Humanities"}],
    "food_technology":      [{"title": "Food Technologist", "salary": "₹4 – 14 LPA", "stream": "PCB"},
                             {"title": "Nutritionist / Dietitian", "salary": "₹4 – 12 LPA", "stream": "PCB"}],
    "agriculture":          [{"title": "Agricultural Scientist", "salary": "₹4 – 14 LPA", "stream": "PCB"},
                             {"title": "Agronomist", "salary": "₹4 – 12 LPA", "stream": "PCB"}],
    "automobile":           [{"title": "Automobile Engineer", "salary": "₹5 – 18 LPA", "stream": "PCM"},
                             {"title": "Automotive Designer", "salary": "₹6 – 20 LPA", "stream": "PCM"}],
}



APTITUDE_SKILLS = [
    "english",        # Linguistic proficiency
    "patterns",       # Pattern analysis
    "logical",        # Logical comprehension
    "maths",          # Quantitative reasoning
    "visual",         # Visual spatial skills
    "detail",         # Precision / detail analysis
]

APTITUDE_SKILL_LABELS = {
    "english":  "English & Language Skills",
    "patterns": "Finding Patterns & Sequences",
    "logical":  "Logical Thinking",
    "maths":    "Maths & Numbers",
    "visual":   "Visualising & Drawing",
    "detail":   "Attention to Detail",
}

# Which aptitude skills matter most for each RIASEC primary type
RIASEC_APTITUDE_FIT = {
    "R": ["maths", "visual", "detail"],
    "I": ["logical", "maths", "patterns"],
    "A": ["visual", "english", "detail"],
    "S": ["english", "detail", "logical"],
    "E": ["english", "logical", "patterns"],
    "C": ["detail", "maths", "logical"],
}