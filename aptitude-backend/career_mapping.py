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