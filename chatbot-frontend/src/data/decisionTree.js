// Decision tree exported from backend decision_tree.json for standalone frontend
export const DECISION_TREE = [
	{
		"id": "Q1",
		"question": "What are you looking for today?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Career Guidance",
				"next": "Q2"
			},
			{
				"letter": "B",
				"text": "Exam Selection",
				"next": "Q10"
			},
			{
				"letter": "C",
				"text": "College Guidance",
				"next": "Q18"
			},
			{
				"letter": "D",
				"text": "I don't know where to start",
				"next": "Q25"
			}
		]
	},
	{
		"id": "Q2",
		"question": "Which class are you in?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Class 8 or 9",
				"next": "Q3"
			},
			{
				"letter": "B",
				"text": "Class 10",
				"next": "Q4"
			},
			{
				"letter": "C",
				"text": "Class 11 or 12",
				"next": "Q5"
			}
		]
	},
	{
		"id": "Q3",
		"question": "Great — it's early and that's an advantage. What subjects do you enjoy most right now?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Maths and Science",
				"next": "Q6"
			},
			{
				"letter": "B",
				"text": "Arts and Literature",
				"next": "Q7"
			},
			{
				"letter": "C",
				"text": "Commerce and Economics",
				"next": "Q8"
			},
			{
				"letter": "D",
				"text": "I enjoy all equally / not sure",
				"next": "Q9"
			}
		]
	},
	{
		"id": "Q4",
		"question": "You're at a crucial stage. Have you chosen your stream for Class 11 yet?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Yes — Science",
				"next": "Q5"
			},
			{
				"letter": "B",
				"text": "Yes — Commerce",
				"next": "Q8"
			},
			{
				"letter": "C",
				"text": "Yes — Arts",
				"next": "Q7"
			},
			{
				"letter": "D",
				"text": "No — still deciding",
				"next": "Q9"
			}
		]
	},
	{
		"id": "Q5",
		"question": "Which stream are you in?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "PCM (Physics Chemistry Maths)",
				"next": "Q6"
			},
			{
				"letter": "B",
				"text": "PCB (Physics Chemistry Biology)",
				"next": "Q7B"
			},
			{
				"letter": "C",
				"text": "PCMB (all four)",
				"next": "Q6"
			},
			{
				"letter": "D",
				"text": "Commerce",
				"next": "Q8"
			},
			{
				"letter": "E",
				"text": "Arts / Humanities",
				"next": "Q7"
			}
		]
	},
	{
		"id": "Q6",
		"question": "PCM opens many doors. What excites you more?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Building things — engineering, technology, architecture",
				"next": "R_ENGINEERING_TECH"
			},
			{
				"letter": "B",
				"text": "Understanding how things work — physics, space, research",
				"next": "R_RESEARCH_ISRO_IISER"
			},
			{
				"letter": "C",
				"text": "Working with data and computers",
				"next": "R_CS_DATA_SCIENCE"
			},
			{
				"letter": "D",
				"text": "Design and creativity with a technical edge",
				"next": "R_ARCHITECTURE_PRODUCT_DESIGN"
			},
			{
				"letter": "E",
				"text": "None of these feel right",
				"next": "Q9"
			}
		]
	},
	{
		"id": "Q7",
		"question": "Arts and Humanities path. What pulls you more?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Helping people and social change",
				"next": "R_PSYCHOLOGY_SOCIAL_WORK"
			},
			{
				"letter": "B",
				"text": "Law and justice",
				"next": "R_LAW_CLAT_NLU"
			},
			{
				"letter": "C",
				"text": "Government and public policy",
				"next": "R_UPSC_CIVIL_SERVICES"
			},
			{
				"letter": "D",
				"text": "Writing, media, journalism",
				"next": "R_MASS_COMM_JOURNALISM"
			},
			{
				"letter": "E",
				"text": "Design, film, performing arts",
				"next": "R_DESIGN_FILM_PERFORMING_ARTS"
			},
			{
				"letter": "F",
				"text": "Not sure",
				"next": "Q9"
			}
		]
	},
	{
		"id": "Q7B",
		"question": "PCB opens medical and life science paths. What interests you more?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Treating patients directly",
				"next": "R_MBBS_NEET"
			},
			{
				"letter": "B",
				"text": "Research and lab work",
				"next": "R_RESEARCH_ISRO_IISER"
			},
			{
				"letter": "C",
				"text": "Healthcare without MBBS",
				"next": "R_MBBS_NEET"
			},
			{
				"letter": "D",
				"text": "Environmental or agricultural science",
				"next": "R_RESEARCH_ISRO_IISER"
			},
			{
				"letter": "E",
				"text": "Not sure",
				"next": "Q9"
			}
		]
	},
	{
		"id": "Q8",
		"question": "Commerce path. Where do you see yourself?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Finance, banking, investments",
				"next": "R_COUNSELLOR_HANDOFF"
			},
			{
				"letter": "B",
				"text": "Running a business or startup",
				"next": "R_COUNSELLOR_HANDOFF"
			},
			{
				"letter": "C",
				"text": "Government jobs and stability",
				"next": "R_COUNSELLOR_HANDOFF"
			},
			{
				"letter": "D",
				"text": "Law from a commerce background",
				"next": "R_LAW_CLAT_NLU"
			},
			{
				"letter": "E",
				"text": "Not sure",
				"next": "Q9"
			}
		]
	},
	{
		"id": "Q9",
		"question": "No worries — let's figure it out together. Which of these sounds most like you?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "I like solving problems and puzzles",
				"next": "Q6"
			},
			{
				"letter": "B",
				"text": "I like creating things — art, writing, music",
				"next": "Q7"
			},
			{
				"letter": "C",
				"text": "I like working with and helping people",
				"next": "Q7"
			},
			{
				"letter": "D",
				"text": "I like understanding how the world works",
				"next": "Q7B"
			},
			{
				"letter": "E",
				"text": "I'm still completely unsure",
				"next": "R_COUNSELLOR_HANDOFF"
			}
		]
	},
	{
		"id": "Q10",
		"question": "Which stream are you in?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Science PCM",
				"next": "Q11"
			},
			{
				"letter": "B",
				"text": "Science PCB",
				"next": "Q12"
			},
			{
				"letter": "C",
				"text": "Commerce",
				"next": "Q13"
			},
			{
				"letter": "D",
				"text": "Arts",
				"next": "Q14"
			},
			{
				"letter": "E",
				"text": "Not decided yet",
				"next": "Q4"
			}
		]
	},
	{
		"id": "Q11",
		"question": "PCM — which career direction?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Engineering",
				"next": "R_ENGINEERING_TECH"
			},
			{
				"letter": "B",
				"text": "Architecture",
				"next": "R_ARCHITECTURE_PRODUCT_DESIGN"
			},
			{
				"letter": "C",
				"text": "Defence forces",
				"next": "R_NDA"
			},
			{
				"letter": "D",
				"text": "Research and science",
				"next": "R_RESEARCH_ISRO_IISER"
			},
			{
				"letter": "E",
				"text": "Dual degree or private college",
				"next": "R_ENGINEERING_TECH"
			}
		]
	},
	{
		"id": "Q12",
		"question": "PCB — which direction?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Doctor MBBS/BDS",
				"next": "R_MBBS_NEET"
			},
			{
				"letter": "B",
				"text": "Research and life sciences",
				"next": "R_RESEARCH_ISRO_IISER"
			},
			{
				"letter": "C",
				"text": "Agriculture",
				"next": "R_ENVIRONMENTAL_SCIENCE_ICAR"
			},
			{
				"letter": "D",
				"text": "Veterinary",
				"next": "R_MBBS_NEET"
			},
			{
				"letter": "E",
				"text": "Pharmacy or allied health",
				"next": "R_MBBS_NEET"
			}
		]
	},
	{
		"id": "Q13",
		"question": "Commerce — which direction?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Chartered Accountancy",
				"next": "R_COUNSELLOR_HANDOFF"
			},
			{
				"letter": "B",
				"text": "MBA or management",
				"next": "R_COUNSELLOR_HANDOFF"
			},
			{
				"letter": "C",
				"text": "Banking and government",
				"next": "R_COUNSELLOR_HANDOFF"
			},
			{
				"letter": "D",
				"text": "Law",
				"next": "R_LAW_CLAT_NLU"
			},
			{
				"letter": "E",
				"text": "Central university admission",
				"next": "R_COUNSELLOR_HANDOFF"
			}
		]
	},
	{
		"id": "Q14",
		"question": "Arts — which direction?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Civil Services IAS/IPS",
				"next": "R_UPSC_CIVIL_SERVICES"
			},
			{
				"letter": "B",
				"text": "Law",
				"next": "R_LAW_CLAT_NLU"
			},
			{
				"letter": "C",
				"text": "Design",
				"next": "R_DESIGN_FILM_PERFORMING_ARTS"
			},
			{
				"letter": "D",
				"text": "Mass communication",
				"next": "R_MASS_COMM_JOURNALISM"
			},
			{
				"letter": "E",
				"text": "Central university",
				"next": "R_COUNSELLOR_HANDOFF"
			}
		]
	},
	{
		"id": "Q18",
		"question": "What are you looking for in a college?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Top ranking government college — low fees",
				"next": "Q19"
			},
			{
				"letter": "B",
				"text": "Private college — good placements",
				"next": "Q20"
			},
			{
				"letter": "C",
				"text": "Research focused institute",
				"next": "Q21"
			},
			{
				"letter": "D",
				"text": "Specific city or state",
				"next": "Q22"
			}
		]
	},
	{
		"id": "Q19",
		"question": "Which field?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Engineering",
				"next": "R_IITS_NITS_VIA_JEE"
			},
			{
				"letter": "B",
				"text": "Medical",
				"next": "R_AIIMS_JIPMER_VIA_NEET"
			},
			{
				"letter": "C",
				"text": "Science research",
				"next": "R_IISc_IISER_KVPY"
			},
			{
				"letter": "D",
				"text": "Law",
				"next": "R_NLUS_VIA_CLAT"
			}
		]
	},
	{
		"id": "Q20",
		"question": "Which field?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Engineering",
				"next": "R_BITS_VIT_MANIPAL_THAPAR"
			},
			{
				"letter": "B",
				"text": "Medical",
				"next": "R_MANIPAL_CMC_KASTURBA"
			},
			{
				"letter": "C",
				"text": "Management",
				"next": "R_NMIMS_CHRIST_SYMBIOSIS"
			},
			{
				"letter": "D",
				"text": "Design",
				"next": "R_PEARL_WHISTLING_WOODS"
			}
		]
	},
	{
		"id": "Q21",
		"question": "Stream?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Science",
				"next": "R_IISc_TIFR_IISERs"
			},
			{
				"letter": "B",
				"text": "Social Science",
				"next": "R_JNU_TISS_AU"
			},
			{
				"letter": "C",
				"text": "Technology",
				"next": "R_IIT_IIIT_HYDERABAD"
			}
		]
	},
	{
		"id": "Q22",
		"question": "Which state or region?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "North India",
				"next": "R_DELHI_JNU_DU_IIT_DELHI_NLU_DELHI"
			},
			{
				"letter": "B",
				"text": "South India",
				"next": "R_IIT_MADRAS_AIIMS_MANGALORE_NLU_BANGALORE"
			},
			{
				"letter": "C",
				"text": "West India",
				"next": "R_IIT_BOMBAY_BITS_PILANI_SYMBIOSIS"
			},
			{
				"letter": "D",
				"text": "East India",
				"next": "R_IIT_KHARAGPUR_JADAVPUR_CALCUTTA"
			},
			{
				"letter": "E",
				"text": "Open to anywhere",
				"next": "Q19"
			}
		]
	},
	{
		"id": "Q25",
		"question": "No problem at all. Let's start from scratch. How old are you?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "13 to 15 (Class 8-10)",
				"next": "Q3"
			},
			{
				"letter": "B",
				"text": "16 to 18 (Class 11-12)",
				"next": "Q5"
			},
			{
				"letter": "C",
				"text": "18+ (after Class 12)",
				"next": "Q26"
			}
		]
	},
	{
		"id": "Q26",
		"question": "Have you already passed Class 12?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Yes, looking for undergraduate options",
				"next": "Q18"
			},
			{
				"letter": "B",
				"text": "Yes, took a gap year",
				"next": "Q27"
			},
			{
				"letter": "C",
				"text": "No, appearing this year",
				"next": "Q5"
			}
		]
	},
	{
		"id": "Q27",
		"question": "What happened during the gap year?",
		"type": "question",
		"options": [
			{
				"letter": "A",
				"text": "Preparing for JEE/NEET",
				"next": "Q11"
			},
			{
				"letter": "B",
				"text": "Reconsidering my stream/career",
				"next": "Q2"
			},
			{
				"letter": "C",
				"text": "Family or personal reasons",
				"next": "R_COUNSELLOR_HANDOFF"
			}
		]
	},
	{
		"id": "R_ENGINEERING_TECH",
		"question": "Engineering & Technology",
		"type": "recommendation",
		"title": "Engineering & Technology",
		"description": [
			"Your interest in building and design is a strong fit for engineering and technical careers.",
			"This path leverages PCM strength and gives you practical, high-growth roles across multiple industries.",
			"You can combine creativity with math, physics, and computing to solve real-world problems."
		],
		"careers": [
			{
				"name": "Software Engineer",
				"description": "Builds applications, platforms, and user-facing systems.",
				"salary": "₹6-20 LPA",
				"stream": "PCM"
			},
			{
				"name": "Mechanical Engineer",
				"description": "Designs machines, vehicles, and industrial equipment.",
				"salary": "₹4-12 LPA",
				"stream": "PCM"
			},
			{
				"name": "Civil Engineer",
				"description": "Plans and supervises construction of buildings and infrastructure.",
				"salary": "₹4-10 LPA",
				"stream": "PCM"
			},
			{
				"name": "Architect",
				"description": "Creates functional and beautiful built environments.",
				"salary": "₹5-15 LPA",
				"stream": "PCM"
			},
			{
				"name": "Electrical Engineer",
				"description": "Works on power systems, electronics and automation solutions.",
				"salary": "₹5-14 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "JEE Main",
				"full_form": "Joint Entrance Examination Main",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to NITs, IIITs, and other engineering colleges",
				"month": "April"
			},
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to IITs and select engineering institutes",
				"month": "May"
			},
			{
				"name": "NATA",
				"full_form": "National Aptitude Test in Architecture",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCM/PCB/Arts",
				"what_it_leads_to": "Admission to architecture colleges like CEPT and SPA",
				"month": "April"
			}
		],
		"next_steps": [
			"Start solving JEE Main level physics and maths problems for 30 minutes daily.",
			"Explore basic CAD or design software to understand architectural and engineering workflows.",
			"Join a weekend coding or robotics workshop to build hands-on design confidence.",
			"Track college cutoffs for NITs, IIITs, and top architecture programs this year."
		],
		"timeline": "Year 1: Build strong PCM fundamentals and take mock JEE/Main tests. Year 2: Focus on board exams, refine engineering interests, and apply to top institutes."
	},
	{
		"id": "R_RESEARCH_ISRO_IISER",
		"question": "Physics and Research Science",
		"type": "recommendation",
		"title": "Physics and Research Science",
		"description": [
			"You are drawn to deep understanding and exploration, which suits research-focused science careers.",
			"This path builds on strong fundamentals in physics, maths, and critical thinking.",
			"It is ideal for students who want to work in space science, labs, or national research institutes."
		],
		"careers": [
			{
				"name": "Research Scientist",
				"description": "Conducts advanced experiments and publishes scientific findings.",
				"salary": "₹8-25 LPA",
				"stream": "PCM"
			},
			{
				"name": "Space Scientist",
				"description": "Designs and analyzes missions for space agencies like ISRO.",
				"salary": "₹7-22 LPA",
				"stream": "PCM"
			},
			{
				"name": "Data Analyst",
				"description": "Interprets scientific data and builds predictive models.",
				"salary": "₹6-18 LPA",
				"stream": "PCM"
			},
			{
				"name": "Laboratory Scientist",
				"description": "Manages laboratory research and testing workflows.",
				"salary": "₹5-14 LPA",
				"stream": "PCM"
			},
			{
				"name": "Science Communicator",
				"description": "Explains research through writing, media, or public engagement.",
				"salary": "₹4-10 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "KVPY",
				"full_form": "Kishore Vaigyanik Protsahan Yojana",
				"conducting_body": "DST",
				"eligibility": "Class 11/12 science students",
				"what_it_leads_to": "Scholarships and access to IISc/IISERs",
				"month": "December"
			},
			{
				"name": "IISER Aptitude Test",
				"full_form": "Indian Institutes of Science Education and Research Aptitude Test",
				"conducting_body": "IISERs",
				"eligibility": "Class 12 science students",
				"what_it_leads_to": "Admission to IISER undergraduate programs",
				"month": "April"
			},
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to IITs and research-oriented institutes",
				"month": "May"
			}
		],
		"next_steps": [
			"Read popular science books on physics and space to strengthen your curiosity.",
			"Solve advanced physics problems and practice numerical reasoning every week.",
			"Participate in science fairs or research internships to gain practical exposure.",
			"Watch lectures from IIT and IISER faculty to understand research career paths."
		],
		"timeline": "Year 1: Sharpen maths and physics foundations with advanced problems. Year 2: Prepare for KVPY/IISER and JEE Advanced, while applying for research internships."
	},
	{
		"id": "R_CS_DATA_SCIENCE",
		"question": "Computer Science & Data Science",
		"type": "recommendation",
		"title": "Computer Science & Data Science",
		"description": [
			"You enjoy working with computers and patterns, a strong sign for CS and data careers.",
			"This pathway blends technical programming with analytics and applied math.",
			"It is excellent for students who want high growth, creative problem solving, and industry-ready skillsets."
		],
		"careers": [
			{
				"name": "Data Scientist",
				"description": "Builds models that turn data into business insight.",
				"salary": "₹8-30 LPA",
				"stream": "PCM"
			},
			{
				"name": "Software Developer",
				"description": "Develops software applications and systems for users.",
				"salary": "₹6-24 LPA",
				"stream": "PCM"
			},
			{
				"name": "Machine Learning Engineer",
				"description": "Implements AI models for real-world products.",
				"salary": "₹10-35 LPA",
				"stream": "PCM"
			},
			{
				"name": "Product Analyst",
				"description": "Uses data to shape product decisions and growth.",
				"salary": "₹7-20 LPA",
				"stream": "PCM"
			},
			{
				"name": "Cloud Architect",
				"description": "Designs cloud services and scalable systems.",
				"salary": "₹12-36 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "JEE Main",
				"full_form": "Joint Entrance Examination Main",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to engineering colleges with CS branches",
				"month": "April"
			},
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to IIT CS programs",
				"month": "May"
			},
			{
				"name": "BITSAT",
				"full_form": "Birla Institute of Technology and Science Admission Test",
				"conducting_body": "BITS Pilani",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to BITS campuses for CS/Data programs",
				"month": "May"
			}
		],
		"next_steps": [
			"Start learning Python and complete a small data or web project.",
			"Practice logic and algorithms for 30 minutes every day.",
			"Join an online data science challenge or hackathon to build a portfolio.",
			"Research top CS programs at IITs, BITS, and IIITs and note their cutoffs."
		],
		"timeline": "Year 1: Learn coding, data basics, and solve programming problems. Year 2: Focus on JEE/engineering entrance prep and create a portfolio of small projects."
	},
	{
		"id": "R_ARCHITECTURE_PRODUCT_DESIGN",
		"question": "Architecture & Product Design",
		"type": "recommendation",
		"title": "Architecture & Product Design",
		"description": [
			"Your mix of technical curiosity and creativity fits architecture and design well.",
			"This path combines spatial thinking with aesthetics and practical engineering.",
			"It prepares you for hands-on work in buildings, products, and user-focused design."
		],
		"careers": [
			{
				"name": "Architect",
				"description": "Designs functional, beautiful buildings and structures.",
				"salary": "₹5-18 LPA",
				"stream": "PCM"
			},
			{
				"name": "Product Designer",
				"description": "Creates digital and physical products with user experience focus.",
				"salary": "₹8-25 LPA",
				"stream": "PCM"
			},
			{
				"name": "Interior Designer",
				"description": "Plans attractive, functional interior spaces.",
				"salary": "₹4-14 LPA",
				"stream": "PCM"
			},
			{
				"name": "Landscape Architect",
				"description": "Designs outdoor environments and public spaces.",
				"salary": "₹4-12 LPA",
				"stream": "PCM"
			},
			{
				"name": "Design Researcher",
				"description": "Studies user needs to inform product design decisions.",
				"salary": "₹6-16 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "NATA",
				"full_form": "National Aptitude Test in Architecture",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCM/PCB/Arts",
				"what_it_leads_to": "Admission to architecture programs",
				"month": "April"
			},
			{
				"name": "JEE Paper 2",
				"full_form": "Joint Entrance Examination Paper 2",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to B.Arch programs in NITs and centrally funded colleges",
				"month": "April"
			},
			{
				"name": "UCEED",
				"full_form": "Undergraduate Common Entrance Exam for Design",
				"conducting_body": "IIT Bombay",
				"eligibility": "Class 12 or equivalent",
				"what_it_leads_to": "Admission to design programs at IITs and other institutes",
				"month": "January"
			}
		],
		"next_steps": [
			"Sketch designs, build simple models, and study architecture portfolios.",
			"Visit local buildings or museums to observe form, function, and space.",
			"Learn basic drafting or CAD tools like SketchUp or AutoCAD.",
			"Review past NATA and UCEED question papers to understand exam patterns."
		],
		"timeline": "Year 1: Build a portfolio of sketches and learn design software. Year 2: Prepare for NATA/UCEED and apply to architecture/design institutes."
	},
	{
		"id": "R_PSYCHOLOGY_SOCIAL_WORK",
		"question": "Psychology & Social Change",
		"type": "recommendation",
		"title": "Psychology & Social Change",
		"description": [
			"You are motivated by helping others and creating social impact.",
			"This path suits students who care about people, community work, and social justice.",
			"You can build a meaningful career in counseling, research, or NGO leadership."
		],
		"careers": [
			{
				"name": "Clinical Psychologist",
				"description": "Works with clients on mental health and therapy.",
				"salary": "₹4-12 LPA",
				"stream": "Arts/Science"
			},
			{
				"name": "Social Worker",
				"description": "Designs and runs community support programs.",
				"salary": "₹3-9 LPA",
				"stream": "Arts"
			},
			{
				"name": "Counselor",
				"description": "Provides guidance for education, career, and emotional health.",
				"salary": "₹3-10 LPA",
				"stream": "Arts"
			},
			{
				"name": "NGO Program Manager",
				"description": "Leads projects that address social issues.",
				"salary": "₹4-14 LPA",
				"stream": "Arts"
			},
			{
				"name": "Human Resources Specialist",
				"description": "Supports employee wellbeing and organizational culture.",
				"salary": "₹5-16 LPA",
				"stream": "Arts/Commerce"
			}
		],
		"exams": [
			{
				"name": "CUET UG",
				"full_form": "Common University Entrance Test Undergraduate",
				"conducting_body": "NTA",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to psychology and social science programs",
				"month": "May"
			},
			{
				"name": "IPU CET",
				"full_form": "Indraprastha University Common Entrance Test",
				"conducting_body": "GGSIPU",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to psychology and social work courses",
				"month": "May"
			},
			{
				"name": "NLSIU Admission Test",
				"full_form": "N/A",
				"conducting_body": "NLSIU",
				"eligibility": "Graduation for social science research programs",
				"what_it_leads_to": "Admission to specialized social science or policy courses",
				"month": "June"
			}
		],
		"next_steps": [
			"Volunteer with a local NGO or helpline to understand social issues firsthand.",
			"Take an introductory psychology or sociology course online.",
			"Read case studies on counseling and community development work.",
			"Meet a counselor or social worker to learn day-to-day career realities."
		],
		"timeline": "Year 1: Build empathy and social awareness through activities and coursework. Year 2: Apply to psychology or social science programs and pursue practical experience."
	},
	{
		"id": "R_LAW_CLAT_NLU",
		"question": "Law & Legal Studies",
		"type": "recommendation",
		"title": "Law & Legal Studies",
		"description": [
			"Your interest in justice and rules fits a career in law and tribunals.",
			"This path works well if you enjoy debate, research, and structured argument.",
			"A law degree opens multiple options including litigation, corporate, and policy work."
		],
		"careers": [
			{
				"name": "Litigation Lawyer",
				"description": "Represents clients in courts and legal disputes.",
				"salary": "₹6-18 LPA",
				"stream": "Arts/Commerce"
			},
			{
				"name": "Corporate Lawyer",
				"description": "Advises companies on contracts and compliance.",
				"salary": "₹8-25 LPA",
				"stream": "Commerce"
			},
			{
				"name": "Legal Researcher",
				"description": "Produces legal analysis for policy and academics.",
				"salary": "₹4-12 LPA",
				"stream": "Arts"
			},
			{
				"name": "Judicial Clerk",
				"description": "Assists judges with case preparation and legal research.",
				"salary": "₹4-10 LPA",
				"stream": "Arts"
			},
			{
				"name": "Public Policy Advisor",
				"description": "Shapes law and regulation through policy work.",
				"salary": "₹7-20 LPA",
				"stream": "Arts"
			}
		],
		"exams": [
			{
				"name": "CLAT",
				"full_form": "Common Law Admission Test",
				"conducting_body": "NLU Consortium",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to NLUs and law programs",
				"month": "May"
			},
			{
				"name": "AILET",
				"full_form": "All India Law Entrance Test",
				"conducting_body": "NLSIU Bengaluru",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to NLSIU law programs",
				"month": "May"
			},
			{
				"name": "LSAT India",
				"full_form": "Law School Admission Test India",
				"conducting_body": "Pearson VUE",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to law colleges across India",
				"month": "March"
			}
		],
		"next_steps": [
			"Read about landmark court cases and legal reasoning.",
			"Join a debate club or moot court activity.",
			"Practice CLAT sample papers and legal aptitude questions.",
			"Visit a law college campus or talk with a practicing lawyer."
		],
		"timeline": "Year 1: Build reading, reasoning and current affairs habits. Year 2: Prepare for CLAT/AILET and begin law college applications."
	},
	{
		"id": "R_UPSC_CIVIL_SERVICES",
		"question": "Civil Services & Public Policy",
		"type": "recommendation",
		"title": "Civil Services & Public Policy",
		"description": [
			"You are motivated by leadership, governance, and public service.",
			"UPSC is a long-term path requiring broad knowledge and disciplined study.",
			"This route suits students who want to shape society through administration."
		],
		"careers": [
			{
				"name": "IAS Officer",
				"description": "Leads administration and district governance.",
				"salary": "₹12-24 LPA",
				"stream": "Any"
			},
			{
				"name": "IPS Officer",
				"description": "Leads policing and internal security operations.",
				"salary": "₹12-24 LPA",
				"stream": "Any"
			},
			{
				"name": "IFS Officer",
				"description": "Represents India in foreign service.",
				"salary": "₹12-24 LPA",
				"stream": "Any"
			},
			{
				"name": "Policy Analyst",
				"description": "Advises on government and development policy.",
				"salary": "₹8-20 LPA",
				"stream": "Any"
			},
			{
				"name": "Development Manager",
				"description": "Runs public or NGO development programs.",
				"salary": "₹6-18 LPA",
				"stream": "Any"
			}
		],
		"exams": [
			{
				"name": "UPSC CSE",
				"full_form": "Union Public Service Commission Civil Services Examination",
				"conducting_body": "UPSC",
				"eligibility": "Graduation in any stream",
				"what_it_leads_to": "Selection to IAS, IPS, IFS and other civil services",
				"month": "May"
			},
			{
				"name": "State PSC",
				"full_form": "State Public Service Commission",
				"conducting_body": "State PSCs",
				"eligibility": "Graduation in any stream",
				"what_it_leads_to": "State administrative services",
				"month": "June-October"
			},
			{
				"name": "SSC CGL",
				"full_form": "Staff Selection Commission Combined Graduate Level",
				"conducting_body": "SSC",
				"eligibility": "Graduation in any stream",
				"what_it_leads_to": "Central government group B and C posts",
				"month": "December"
			}
		],
		"next_steps": [
			"Start reading daily newspapers and build a current affairs notebook.",
			"Practice essay writing and answer structuring regularly.",
			"Study Indian polity, history and economy basics in a structured way.",
			"Take a short online foundation course for civil services exam strategy."
		],
		"timeline": "Year 1: Build strong general knowledge and writing habits. Year 2: Join a UPSC foundation program and start prelims/ mains preparation."
	},
	{
		"id": "R_MASS_COMM_JOURNALISM",
		"question": "Media & Journalism",
		"type": "recommendation",
		"title": "Media & Journalism",
		"description": [
			"You are drawn to storytelling and communicating ideas to an audience.",
			"This path fits students who love writing, media, and current affairs.",
			"It leads to careers in journalism, content, and media production."
		],
		"careers": [
			{
				"name": "Journalist",
				"description": "Reports news and produces stories for media outlets.",
				"salary": "₹4-14 LPA",
				"stream": "Arts"
			},
			{
				"name": "Content Producer",
				"description": "Creates video and digital content for brands.",
				"salary": "₹4-12 LPA",
				"stream": "Arts"
			},
			{
				"name": "PR Specialist",
				"description": "Manages public image and communications for organizations.",
				"salary": "₹5-16 LPA",
				"stream": "Arts"
			},
			{
				"name": "Social Media Manager",
				"description": "Builds online presence and campaigns for audiences.",
				"salary": "₹4-12 LPA",
				"stream": "Arts"
			},
			{
				"name": "Broadcast Producer",
				"description": "Plans and executes TV or radio programs.",
				"salary": "₹5-15 LPA",
				"stream": "Arts"
			}
		],
		"exams": [
			{
				"name": "IIMC Entrance",
				"full_form": "Indian Institute of Mass Communication Entrance",
				"conducting_body": "IIMC",
				"eligibility": "Graduation in any stream",
				"what_it_leads_to": "Admission to journalism and mass communication programs",
				"month": "May"
			},
			{
				"name": "ACJ Entrance",
				"full_form": "Asian College of Journalism Entrance",
				"conducting_body": "ACJ",
				"eligibility": "Graduation in any stream",
				"what_it_leads_to": "Admission to journalism postgraduation courses",
				"month": "April"
			},
			{
				"name": "CUET UG",
				"full_form": "Common University Entrance Test Undergraduate",
				"conducting_body": "NTA",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to media and communication courses at central universities",
				"month": "May"
			}
		],
		"next_steps": [
			"Write opinion pieces or start a blog on topics you care about.",
			"Record short videos or podcasts to practice storytelling.",
			"Follow leading journalists and media channels to learn styles.",
			"Practice interview communication and media analysis."
		],
		"timeline": "Year 1: Build writing and media skills through hands-on content. Year 2: Apply to journalism and communication colleges and build a portfolio."
	},
	{
		"id": "R_DESIGN_FILM_PERFORMING_ARTS",
		"question": "Design, Film & Performing Arts",
		"type": "recommendation",
		"title": "Design, Film & Performing Arts",
		"description": [
			"You are energized by creative expression and storytelling.",
			"This path suits students who want careers in film, design, or performance.",
			"It allows you to translate artistic ideas into real-world creative careers."
		],
		"careers": [
			{
				"name": "Graphic Designer",
				"description": "Creates visual designs for brands and media.",
				"salary": "₹4-12 LPA",
				"stream": "Arts"
			},
			{
				"name": "Film Director",
				"description": "Leads the creative vision for film and video projects.",
				"salary": "₹6-20 LPA",
				"stream": "Arts"
			},
			{
				"name": "Stage Actor",
				"description": "Performs in theatre, film, or television roles.",
				"salary": "₹3-12 LPA",
				"stream": "Arts"
			},
			{
				"name": "Fashion Designer",
				"description": "Designs clothing and lifestyle products.",
				"salary": "₹4-14 LPA",
				"stream": "Arts"
			},
			{
				"name": "Creative Director",
				"description": "Leads brand storytelling and creative campaigns.",
				"salary": "₹10-30 LPA",
				"stream": "Arts"
			}
		],
		"exams": [
			{
				"name": "NID DAT",
				"full_form": "National Institute of Design Design Aptitude Test",
				"conducting_body": "NID",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to design programs",
				"month": "January"
			},
			{
				"name": "NIFT",
				"full_form": "National Institute of Fashion Technology Entrance Exam",
				"conducting_body": "NIFT",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to fashion and design courses",
				"month": "January"
			},
			{
				"name": "FTII",
				"full_form": "Film and Television Institute of India Entrance Exam",
				"conducting_body": "FTII",
				"eligibility": "Diploma/graduate in any stream",
				"what_it_leads_to": "Admission to film and media production programs",
				"month": "July"
			}
		],
		"next_steps": [
			"Create a portfolio of sketches, short films, or performance clips.",
			"Take workshops in design, photography or drama to test your interest.",
			"Study creative directors and designers whose work you admire.",
			"Apply to summer art camps or online creative courses."
		],
		"timeline": "Year 1: Explore creative media and build a strong portfolio. Year 2: Apply to NID/NIFT/FTII and apply to creative institutes."
	},
	{
		"id": "R_IITS_NITS_VIA_JEE",
		"question": "Top Engineering Colleges via JEE",
		"type": "recommendation",
		"title": "Top Engineering Colleges via JEE",
		"description": [
			"Your goal of a top government college matches JEE-ready engineering programs.",
			"This path gives you strong placement potential and low-fee education.",
			"It is suitable for students with a disciplined PCM study plan and long-term ambition."
		],
		"careers": [
			{
				"name": "Computer Engineer",
				"description": "Builds software solutions and systems.",
				"salary": "₹8-25 LPA",
				"stream": "PCM"
			},
			{
				"name": "Electronics Engineer",
				"description": "Designs circuits and embedded systems.",
				"salary": "₹6-18 LPA",
				"stream": "PCM"
			},
			{
				"name": "Civil Engineer",
				"description": "Helps create infrastructure and buildings.",
				"salary": "₹4-12 LPA",
				"stream": "PCM"
			},
			{
				"name": "Aerospace Engineer",
				"description": "Works on aircraft and spacecraft systems.",
				"salary": "₹7-22 LPA",
				"stream": "PCM"
			},
			{
				"name": "Chemical Engineer",
				"description": "Develops manufacturing and materials processes.",
				"salary": "₹6-16 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "JEE Main",
				"full_form": "Joint Entrance Examination Main",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to NITs, IIITs, and other engineering colleges",
				"month": "April"
			},
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to IITs",
				"month": "May"
			},
			{
				"name": "BITSAT",
				"full_form": "Birla Institute of Technology and Science Admission Test",
				"conducting_body": "BITS Pilani",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to BITS campuses",
				"month": "May"
			}
		],
		"next_steps": [
			"Make a JEE Main study plan and take a full mock test this week.",
			"Review previous year JEE Advanced questions for your weaker subjects.",
			"Set up a revision schedule with boards and entrance prep balanced.",
			"Check cutoffs for NITs and IIT branches you would like."
		],
		"timeline": "Year 1: Focus on strength in PCM and complete syllabus. Year 2: Prioritize JEE Main/Advanced prep while maintaining board exam readiness."
	},
	{
		"id": "R_AIIMS_JIPMER_VIA_NEET",
		"question": "Top Medical Colleges via NEET",
		"type": "recommendation",
		"title": "Top Medical Colleges via NEET",
		"description": [
			"You want a government medical college and strong healthcare preparation.",
			"This path is ideal for high-scoring PCB students with a long-term medical focus.",
			"It offers rigorous training and excellent medical career opportunities."
		],
		"careers": [
			{
				"name": "Doctor",
				"description": "Provides patient care in hospitals and clinics.",
				"salary": "₹10-30 LPA",
				"stream": "PCB"
			},
			{
				"name": "Surgeon",
				"description": "Performs complex surgical procedures.",
				"salary": "₹15-40 LPA",
				"stream": "PCB"
			},
			{
				"name": "Medical Researcher",
				"description": "Conducts clinical research and trials.",
				"salary": "₹8-25 LPA",
				"stream": "PCB"
			},
			{
				"name": "Public Health Specialist",
				"description": "Works on health policy and community programs.",
				"salary": "₹6-18 LPA",
				"stream": "PCB"
			},
			{
				"name": "Medical Educator",
				"description": "Teaches future healthcare professionals.",
				"salary": "₹7-20 LPA",
				"stream": "PCB"
			}
		],
		"exams": [
			{
				"name": "NEET UG",
				"full_form": "National Eligibility cum Entrance Test Undergraduate",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to MBBS/BDS and allied health courses",
				"month": "May"
			},
			{
				"name": "AIIMS MBBS",
				"full_form": "All India Institute of Medical Sciences MBBS Entrance",
				"conducting_body": "AIIMS",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to AIIMS medical programs",
				"month": "May"
			},
			{
				"name": "JIPMER MBBS",
				"full_form": "Jawaharlal Institute of Postgraduate Medical Education and Research MBBS Entrance",
				"conducting_body": "JIPMER",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to JIPMER MBBS program",
				"month": "May"
			}
		],
		"next_steps": [
			"Create a daily study routine focused on biology, chemistry and physics.",
			"Solve NEET previous year papers to improve exam strategy.",
			"Attend a medical entrance coaching session for test-taking skills.",
			"Practice full-length NEET mocks and revise high-weightage topics."
		],
		"timeline": "Year 1: Cover PCB syllabus and practice MCQs daily. Year 2: Intensify NEET and AIIMS/JIPMER preparation while tracking your mock scores."
	},
	{
		"id": "R_IISc_IISER_KVPY",
		"question": "Science Research Colleges",
		"type": "recommendation",
		"title": "Science Research Colleges",
		"description": [
			"You aim for research-focused science institutes with strong fundamentals.",
			"This path suits students who want deep scientific training and lab exposure.",
			"It opens options in research, academics, and advanced science careers."
		],
		"careers": [
			{
				"name": "Research Scientist",
				"description": "Leads scientific discovery in labs or institutes.",
				"salary": "₹8-25 LPA",
				"stream": "PCM"
			},
			{
				"name": "Academician",
				"description": "Teaches and researches at universities.",
				"salary": "₹6-18 LPA",
				"stream": "PCM"
			},
			{
				"name": "Biotech Specialist",
				"description": "Develops biotech products and therapies.",
				"salary": "₹7-20 LPA",
				"stream": "PCB"
			},
			{
				"name": "Laboratory Manager",
				"description": "Oversees research lab operations.",
				"salary": "₹5-14 LPA",
				"stream": "PCM"
			},
			{
				"name": "Data Analyst",
				"description": "Analyzes scientific data for research insights.",
				"salary": "₹6-18 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "KVPY",
				"full_form": "Kishore Vaigyanik Protsahan Yojana",
				"conducting_body": "DST",
				"eligibility": "Class 11/12 science students",
				"what_it_leads_to": "Scholarships and IISc/IISER admission support",
				"month": "December"
			},
			{
				"name": "IISER Aptitude Test",
				"full_form": "Indian Institutes of Science Education and Research Aptitude Test",
				"conducting_body": "IISERs",
				"eligibility": "Class 12 science students",
				"what_it_leads_to": "Admission to IISER programs",
				"month": "April"
			},
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to IITs and research-oriented programs",
				"month": "May"
			}
		],
		"next_steps": [
			"Take advanced science electives and read research-based articles.",
			"Practice aptitude questions for KVPY and IISER tests.",
			"Speak with a science teacher about research career options.",
			"Plan your board exam study schedule so you can also prepare for entrance tests."
		],
		"timeline": "Year 1: Strengthen science fundamentals and academic reading. Year 2: Prepare for KVPY/IISER while applying to research-focused institutes."
	},
	{
		"id": "R_NLUS_VIA_CLAT",
		"question": "Top Law Colleges via CLAT",
		"type": "recommendation",
		"title": "Top Law Colleges via CLAT",
		"description": [
			"You want a top law school with strong placement and legal training.",
			"This path fits students who enjoy debate, reasoning, and public affairs.",
			"It offers excellent law career options in courts, corporate firms, and policy."
		],
		"careers": [
			{
				"name": "Corporate Lawyer",
				"description": "Advises companies on legal matters.",
				"salary": "₹8-25 LPA",
				"stream": "Arts/Commerce"
			},
			{
				"name": "Litigation Lawyer",
				"description": "Represents clients in legal disputes.",
				"salary": "₹6-18 LPA",
				"stream": "Arts"
			},
			{
				"name": "Legal Consultant",
				"description": "Provides expert legal advice to firms.",
				"salary": "₹7-20 LPA",
				"stream": "Arts/Commerce"
			},
			{
				"name": "Policy Analyst",
				"description": "Researches law and public policy outcomes.",
				"salary": "₹6-16 LPA",
				"stream": "Arts"
			},
			{
				"name": "Academician",
				"description": "Teaches law and publishes legal research.",
				"salary": "₹5-15 LPA",
				"stream": "Arts"
			}
		],
		"exams": [
			{
				"name": "CLAT",
				"full_form": "Common Law Admission Test",
				"conducting_body": "NLU Consortium",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to National Law Universities",
				"month": "May"
			},
			{
				"name": "AILET",
				"full_form": "All India Law Entrance Test",
				"conducting_body": "NLSIU Bengaluru",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to NLSIU law program",
				"month": "May"
			},
			{
				"name": "LSAT India",
				"full_form": "Law School Admission Test India",
				"conducting_body": "Pearson VUE",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to law colleges across India",
				"month": "March"
			}
		],
		"next_steps": [
			"Practice logical reasoning and legal aptitude questions daily.",
			"Read news and judgments to build legal awareness.",
			"Join a debate or public speaking club to sharpen argumentation.",
			"Study previous CLAT papers and timing techniques."
		],
		"timeline": "Year 1: Build reading and reasoning skills. Year 2: Focus on CLAT/AILET prep and applications."
	},
	{
		"id": "R_BITS_VIT_MANIPAL_THAPAR",
		"question": "Private Engineering Colleges",
		"type": "recommendation",
		"title": "Private Engineering Colleges",
		"description": [
			"You prefer private colleges with strong campus placements and facilities.",
			"This path suits students who want good engineering options beyond top government institutes.",
			"It gives flexibility in branch selection and industry connections."
		],
		"careers": [
			{
				"name": "Software Engineer",
				"description": "Builds and maintains software products.",
				"salary": "₹6-20 LPA",
				"stream": "PCM"
			},
			{
				"name": "Electronics Engineer",
				"description": "Works with circuits and embedded systems.",
				"salary": "₹5-14 LPA",
				"stream": "PCM"
			},
			{
				"name": "Data Engineer",
				"description": "Builds data infrastructure for analytics.",
				"salary": "₹7-22 LPA",
				"stream": "PCM"
			},
			{
				"name": "Mechanical Engineer",
				"description": "Designs mechanical systems and devices.",
				"salary": "₹5-14 LPA",
				"stream": "PCM"
			},
			{
				"name": "Product Manager",
				"description": "Coordinates product strategy and delivery.",
				"salary": "₹12-30 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "BITSAT",
				"full_form": "Birla Institute of Technology and Science Admission Test",
				"conducting_body": "BITS Pilani",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to BITS campuses",
				"month": "May"
			},
			{
				"name": "VITEEE",
				"full_form": "Vellore Institute of Technology Engineering Entrance Exam",
				"conducting_body": "VIT",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to VIT engineering programs",
				"month": "April"
			},
			{
				"name": "Manipal Entrance Test",
				"full_form": "MET",
				"conducting_body": "Manipal Academy of Higher Education",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to Manipal university engineering programs",
				"month": "May"
			}
		],
		"next_steps": [
			"Research BITS, VIT and Manipal branches and their placement records.",
			"Take at least one private college entrance mock test this month.",
			"Create a shortlist of campuses based on branch, location and fees.",
			"Prepare a strong personal profile and documents for admissions."
		],
		"timeline": "Year 1: Align your engineering interests with private college options. Year 2: Complete entrance prep, submit applications, and compare offers."
	},
	{
		"id": "R_MANIPAL_CMC_KASTURBA",
		"question": "Private Medical Colleges",
		"type": "recommendation",
		"title": "Private Medical Colleges",
		"description": [
			"You are focused on a private medical college path with strong healthcare training.",
			"This route is suited to PCB students aiming for medical and allied health careers.",
			"It offers options if government seats are not the sole target."
		],
		"careers": [
			{
				"name": "Doctor",
				"description": "Provides clinical care and patient treatment.",
				"salary": "₹10-30 LPA",
				"stream": "PCB"
			},
			{
				"name": "Dentist",
				"description": "Treats dental and oral health issues.",
				"salary": "₹8-18 LPA",
				"stream": "PCB"
			},
			{
				"name": "Physiotherapist",
				"description": "Helps patients recover physical function.",
				"salary": "₹4-12 LPA",
				"stream": "PCB"
			},
			{
				"name": "Pharmacist",
				"description": "Manages medicines and pharmacy services.",
				"salary": "₹3-10 LPA",
				"stream": "PCB"
			},
			{
				"name": "Medical Researcher",
				"description": "Contributes to biomedical research projects.",
				"salary": "₹6-18 LPA",
				"stream": "PCB"
			}
		],
		"exams": [
			{
				"name": "NEET UG",
				"full_form": "National Eligibility cum Entrance Test Undergraduate",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to MBBS/BDS and allied programs",
				"month": "May"
			},
			{
				"name": "MET",
				"full_form": "Manipal Entrance Test",
				"conducting_body": "MAHE",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to Manipal medical and health science courses",
				"month": "May"
			},
			{
				"name": "CMC Entrance",
				"full_form": "Christian Medical College Entrance",
				"conducting_body": "CMC Vellore",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to CMC medical programs",
				"month": "May"
			}
		],
		"next_steps": [
			"Prepare NEET UG with a focus on high-weightage PCB topics.",
			"Explore private medical colleges and their fee structures.",
			"Evaluate scholarships or loan options for private medical study.",
			"Speak with current medical students to understand campus life."
		],
		"timeline": "Year 1: Focus on NEET and PCB fundamentals. Year 2: Complete application requirements for private medical colleges and choose the best fit."
	},
	{
		"id": "R_NMIMS_CHRIST_SYMBIOSIS",
		"question": "Private Management & Commerce Colleges",
		"type": "recommendation",
		"title": "Private Management & Commerce Colleges",
		"description": [
			"You want a private college with strong placement and management exposure.",
			"This path fits commerce-oriented students seeking business and management careers.",
			"It offers practical programs with industry links and campus mentoring."
		],
		"careers": [
			{
				"name": "Business Analyst",
				"description": "Analyzes business data to drive decisions.",
				"salary": "₹6-18 LPA",
				"stream": "Commerce"
			},
			{
				"name": "Marketing Executive",
				"description": "Creates campaigns to grow brand awareness.",
				"salary": "₹4-14 LPA",
				"stream": "Commerce"
			},
			{
				"name": "HR Specialist",
				"description": "Manages talent and employee initiatives.",
				"salary": "₹5-16 LPA",
				"stream": "Commerce"
			},
			{
				"name": "Finance Manager",
				"description": "Oversees financial planning and budgets.",
				"salary": "₹8-22 LPA",
				"stream": "Commerce"
			},
			{
				"name": "Operations Manager",
				"description": "Optimizes business processes and delivery.",
				"salary": "₹7-20 LPA",
				"stream": "Commerce"
			}
		],
		"exams": [
			{
				"name": "NPAT",
				"full_form": "NMIMS Programs After Twelfth",
				"conducting_body": "NMIMS",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to undergraduate management programs",
				"month": "May"
			},
			{
				"name": "Symbiosis SET",
				"full_form": "Symbiosis Entrance Test",
				"conducting_body": "Symbiosis",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to management and commerce courses",
				"month": "April"
			},
			{
				"name": "Christ Admission Test",
				"full_form": "CAT",
				"conducting_body": "Christ University",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to BBA/BCom programs",
				"month": "April"
			}
		],
		"next_steps": [
			"Research NMIMS, Christ and Symbiosis course specializations.",
			"Prepare an impressive application with academic and extracurricular achievements.",
			"Attend college webinars to understand placement and faculty support.",
			"Review early admission deadlines and application requirements."
		],
		"timeline": "Year 1: Build a strong academic profile and understand program options. Year 2: Apply to private management colleges and prepare for admission tests."
	},
	{
		"id": "R_PEARL_WHISTLING_WOODS",
		"question": "Private Design & Creative Institutes",
		"type": "recommendation",
		"title": "Private Design & Creative Institutes",
		"description": [
			"You want a campus focused on design, media, and creative careers.",
			"This path suits students who value hands-on learning and industry exposure.",
			"It offers strong creative networks and practical project experience."
		],
		"careers": [
			{
				"name": "Fashion Designer",
				"description": "Creates apparel and lifestyle collections.",
				"salary": "₹4-14 LPA",
				"stream": "Arts"
			},
			{
				"name": "Film Producer",
				"description": "Oversees media projects from concept to release.",
				"salary": "₹7-20 LPA",
				"stream": "Arts"
			},
			{
				"name": "Graphic Designer",
				"description": "Designs visual communication for brands.",
				"salary": "₹4-12 LPA",
				"stream": "Arts"
			},
			{
				"name": "Creative Director",
				"description": "Leads creative strategy for campaigns.",
				"salary": "₹10-28 LPA",
				"stream": "Arts"
			},
			{
				"name": "Animator",
				"description": "Produces motion graphics and animation content.",
				"salary": "₹4-12 LPA",
				"stream": "Arts"
			}
		],
		"exams": [
			{
				"name": "NID DAT",
				"full_form": "National Institute of Design Design Aptitude Test",
				"conducting_body": "NID",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to design programs",
				"month": "January"
			},
			{
				"name": "NIFT",
				"full_form": "National Institute of Fashion Technology Entrance Exam",
				"conducting_body": "NIFT",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to fashion and design courses",
				"month": "January"
			},
			{
				"name": "Pearl Academy Entrance",
				"full_form": "Pearl Academy Entrance Exam",
				"conducting_body": "Pearl Academy",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to design and media programs",
				"month": "May"
			}
		],
		"next_steps": [
			"Build a creative portfolio with visual and media samples.",
			"Attend a design workshop or portfolio critique session.",
			"Follow industry trends in fashion, film and creative media.",
			"Prepare presentation and sketching materials for institute admissions."
		],
		"timeline": "Year 1: Collect creative work and build a portfolio. Year 2: Apply to design colleges and complete entrance project briefs."
	},
	{
		"id": "R_IISc_TIFR_IISERs",
		"question": "Elite Research Institutes",
		"type": "recommendation",
		"title": "Elite Research Institutes",
		"description": [
			"You seek the highest research-focused science colleges in India.",
			"This path is ideal for academically driven students with strong science interest.",
			"It leads to rigorous science education and research careers."
		],
		"careers": [
			{
				"name": "Research Scientist",
				"description": "Leads science research in top labs.",
				"salary": "₹10-30 LPA",
				"stream": "PCM"
			},
			{
				"name": "Theoretical Physicist",
				"description": "Studies fundamental physics and models.",
				"salary": "₹8-25 LPA",
				"stream": "PCM"
			},
			{
				"name": "Biotech Researcher",
				"description": "Develops biotechnology solutions.",
				"salary": "₹7-22 LPA",
				"stream": "PCB"
			},
			{
				"name": "Data Scientist",
				"description": "Applies analytics to scientific problems.",
				"salary": "₹9-28 LPA",
				"stream": "PCM"
			},
			{
				"name": "Science Faculty",
				"description": "Teaches and mentors future scientists.",
				"salary": "₹7-18 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "IISER Aptitude Test",
				"full_form": "Indian Institutes of Science Education and Research Aptitude Test",
				"conducting_body": "IISERs",
				"eligibility": "Class 12 science students",
				"what_it_leads_to": "Admission to IISERs",
				"month": "April"
			},
			{
				"name": "KVPY",
				"full_form": "Kishore Vaigyanik Protsahan Yojana",
				"conducting_body": "DST",
				"eligibility": "Class 11/12 science students",
				"what_it_leads_to": "Scholarships and research pathways",
				"month": "December"
			},
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to top engineering and research-friendly programs",
				"month": "May"
			}
		],
		"next_steps": [
			"Take advanced science courses in physics, chemistry and maths.",
			"Start solving research aptitude and reasoning problems.",
			"Attend science seminars or research talks when possible.",
			"Plan your preparation for KVPY and IISER tests alongside boards."
		],
		"timeline": "Year 1: Take advanced science electives and read research-based articles. Year 2: Prepare for KVPY/IISER and JEE Advanced while applying to research-focused institutes."
	},
	{
		"id": "R_JNU_TISS_AU",
		"question": "Social Science & Humanities Institutes",
		"type": "recommendation",
		"title": "Social Science & Humanities Institutes",
		"description": [
			"You are drawn to social science study and interdisciplinary research.",
			"These colleges suit students interested in public policy, arts, and humanities.",
			"They offer a strong foundation for research, teaching, and social careers."
		],
		"careers": [
			{
				"name": "Research Analyst",
				"description": "Works on social policy and research projects.",
				"salary": "₹6-16 LPA",
				"stream": "Arts"
			},
			{
				"name": "Public Policy Expert",
				"description": "Advises organizations on policy design.",
				"salary": "₹7-18 LPA",
				"stream": "Arts"
			},
			{
				"name": "Sociologist",
				"description": "Studies social behavior and institutions.",
				"salary": "₹5-14 LPA",
				"stream": "Arts"
			},
			{
				"name": "Journalist",
				"description": "Reports on social issues and analysis.",
				"salary": "₹4-12 LPA",
				"stream": "Arts"
			},
			{
				"name": "International Relations Specialist",
				"description": "Builds careers in diplomacy or global affairs.",
				"salary": "₹7-20 LPA",
				"stream": "Arts"
			}
		],
		"exams": [
			{
				"name": "CUET UG",
				"full_form": "Common University Entrance Test Undergraduate",
				"conducting_body": "NTA",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to JNU, TISS, and other central university programs",
				"month": "May"
			},
			{
				"name": "TISS NET",
				"full_form": "Tata Institute of Social Sciences National Entrance Test",
				"conducting_body": "TISS",
				"eligibility": "Graduation in relevant fields",
				"what_it_leads_to": "Admission to TISS postgraduate programs",
				"month": "January"
			},
			{
				"name": "JNU Entrance Examination",
				"full_form": "Jawaharlal Nehru University Entrance Examination",
				"conducting_body": "JNU",
				"eligibility": "Class 12 or equivalent",
				"what_it_leads_to": "Admission to JNU undergraduate programs",
				"month": "June"
			}
		],
		"next_steps": [
			"Develop a reading habit around social science and public affairs.",
			"Explore JNU and TISS program details and eligible subjects.",
			"Practice essay writing on social issues and current affairs.",
			"Attend webinars or open days from these institutes."
		],
		"timeline": "Year 1: Research social science programs and build your profile. Year 2: Prepare for CUET and institute-specific tests while strengthening your subject choice."
	},
	{
		"id": "R_IIT_IIIT_HYDERABAD",
		"question": "Top Technology Institutes",
		"type": "recommendation",
		"title": "Top Technology Institutes",
		"description": [
			"You aim for elite technology institutes with strong research and placements.",
			"This path is ideal for students with a technology and mathematics focus.",
			"It leads to high-impact careers in engineering, CS, and innovation."
		],
		"careers": [
			{
				"name": "Software Developer",
				"description": "Builds scalable software applications.",
				"salary": "₹8-28 LPA",
				"stream": "PCM"
			},
			{
				"name": "Data Scientist",
				"description": "Uses data to solve complex problems.",
				"salary": "₹9-30 LPA",
				"stream": "PCM"
			},
			{
				"name": "AI Engineer",
				"description": "Builds artificial intelligence systems.",
				"salary": "₹12-35 LPA",
				"stream": "PCM"
			},
			{
				"name": "Product Manager",
				"description": "Drives product direction and delivery.",
				"salary": "₹12-36 LPA",
				"stream": "PCM"
			},
			{
				"name": "Cybersecurity Expert",
				"description": "Secures systems and networks from threats.",
				"salary": "₹10-30 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to IITs and top technology institutes",
				"month": "May"
			},
			{
				"name": "JEE Main",
				"full_form": "Joint Entrance Examination Main",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to IIITs and other engineering colleges",
				"month": "April"
			},
			{
				"name": "KVPY",
				"full_form": "Kishore Vaigyanik Protsahan Yojana",
				"conducting_body": "DST",
				"eligibility": "Class 11/12 science students",
				"what_it_leads_to": "Scholarships and research-focused programs",
				"month": "December"
			}
		],
		"next_steps": [
			"Start solving higher-level maths and physics problems daily.",
			"Research IIIT Hyderabad admission and its unique programs.",
			"Take at least one online coding or AI course to boost your profile.",
			"Prepare a timetable that balances board exam and entrance test prep."
		],
		"timeline": "Year 1: Strengthen your core PCM concepts and coding skills. Year 2: Focus on JEE Advanced and institute-specific preparation."
	},
	{
		"id": "R_DELHI_JNU_DU_IIT_DELHI_NLU_DELHI",
		"question": "Top Delhi Universities",
		"type": "recommendation",
		"title": "Top Delhi Universities",
		"description": [
			"You are looking for strong Delhi-based colleges across engineering, law, and arts.",
			"This path suits students who want high-quality education and city exposure.",
			"It gives access to vibrant campus life and excellent academic networks."
		],
		"careers": [
			{
				"name": "Software Engineer",
				"description": "Builds software at top Delhi tech firms.",
				"salary": "₹7-22 LPA",
				"stream": "PCM"
			},
			{
				"name": "Lawyer",
				"description": "Practices law with a top Delhi law degree.",
				"salary": "₹6-18 LPA",
				"stream": "Arts/Commerce"
			},
			{
				"name": "Academic Researcher",
				"description": "Studies and teaches at leading institutes.",
				"salary": "₹6-18 LPA",
				"stream": "PCM"
			},
			{
				"name": "Policy Advisor",
				"description": "Works on government or NGO policy teams.",
				"salary": "₹8-20 LPA",
				"stream": "Arts"
			},
			{
				"name": "Data Analyst",
				"description": "Analyzes business and social data.",
				"salary": "₹7-18 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "CUET UG",
				"full_form": "Common University Entrance Test Undergraduate",
				"conducting_body": "NTA",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to DU, JNU, and other central universities",
				"month": "May"
			},
			{
				"name": "JEE Main",
				"full_form": "Joint Entrance Examination Main",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to IIIT Delhi and some engineering programs",
				"month": "April"
			},
			{
				"name": "CLAT",
				"full_form": "Common Law Admission Test",
				"conducting_body": "NLU Consortium",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to NLU Delhi",
				"month": "May"
			}
		],
		"next_steps": [
			"Shortlist Delhi colleges by program, fees and campus culture.",
			"Prepare for CUET and other entrance tests in parallel.",
			"Visit college websites to understand admission criteria.",
			"Build strong application essays or interviews for top universities."
		],
		"timeline": "Year 1: Learn the Delhi college admission process and timelines. Year 2: Apply strategically to your chosen programs and prepare required exams."
	},
	{
		"id": "R_IIT_MADRAS_AIIMS_MANGALORE_NLU_BANGALORE",
		"question": "Top South India Institutes",
		"type": "recommendation",
		"title": "Top South India Institutes",
		"description": [
			"You are focused on premium South Indian colleges for engineering, medicine, or law.",
			"This path suits students seeking excellent academics and campus strength.",
			"It provides access to top recruiters and research opportunities."
		],
		"careers": [
			{
				"name": "Software Engineer",
				"description": "Works on technology products from top South Indian campuses.",
				"salary": "₹8-26 LPA",
				"stream": "PCM"
			},
			{
				"name": "Doctor",
				"description": "Graduates with high medical training from AIIMS or similar colleges.",
				"salary": "₹10-30 LPA",
				"stream": "PCB"
			},
			{
				"name": "Legal Professional",
				"description": "Practices law with a strong regional law school background.",
				"salary": "₹6-18 LPA",
				"stream": "Arts/Commerce"
			},
			{
				"name": "Research Fellow",
				"description": "Works in research labs and science centers.",
				"salary": "₹7-18 LPA",
				"stream": "PCM"
			},
			{
				"name": "Product Manager",
				"description": "Leads product initiatives with South Indian tech industry exposure.",
				"salary": "₹12-32 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to IIT Madras and other top IITs",
				"month": "May"
			},
			{
				"name": "NEET UG",
				"full_form": "National Eligibility cum Entrance Test Undergraduate",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to AIIMS and other medical colleges",
				"month": "May"
			},
			{
				"name": "CLAT",
				"full_form": "Common Law Admission Test",
				"conducting_body": "NLU Consortium",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to NLU Bangalore",
				"month": "May"
			}
		],
		"next_steps": [
			"Review IIT Madras, AIIMS Mangalore, and NLU Bangalore admission criteria.",
			"Create a state-wise shortlist and make a study timeline for exams.",
			"Attend virtual open days or college sessions for South Indian institutes.",
			"Start entrance test preparation and research campus culture."
		],
		"timeline": "Year 1: Focus on exam readiness and college research. Year 2: Finalize applications and complete entrance tests for top South Indian institutes."
	},
	{
		"id": "R_IIT_BOMBAY_BITS_PILANI_SYMBIOSIS",
		"question": "Top West India Institutes",
		"type": "recommendation",
		"title": "Top West India Institutes",
		"description": [
			"You want strong West Indian colleges with excellent placements and academic reputation.",
			"This path suits students who value industry connections and campus life.",
			"It leads to careers in engineering, design, and business."
		],
		"careers": [
			{
				"name": "Software Developer",
				"description": "Builds digital products from leading West Indian campuses.",
				"salary": "₹8-28 LPA",
				"stream": "PCM"
			},
			{
				"name": "Business Analyst",
				"description": "Analyzes business data for corporate decisions.",
				"salary": "₹6-18 LPA",
				"stream": "Commerce"
			},
			{
				"name": "Design Professional",
				"description": "Creates product and visual design solutions.",
				"salary": "₹5-16 LPA",
				"stream": "Arts"
			},
			{
				"name": "Systems Engineer",
				"description": "Develops and maintains technical infrastructure.",
				"salary": "₹7-20 LPA",
				"stream": "PCM"
			},
			{
				"name": "Product Manager",
				"description": "Defines product strategy and launches solutions.",
				"salary": "₹12-32 LPA",
				"stream": "PCM"
			}
		],
		"exams": [
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to IIT Bombay",
				"month": "May"
			},
			{
				"name": "BITSAT",
				"full_form": "Birla Institute of Technology and Science Admission Test",
				"conducting_body": "BITS Pilani",
				"eligibility": "Class 12 with PCM",
				"what_it_leads_to": "Admission to BITS Pilani",
				"month": "May"
			},
			{
				"name": "Symbiosis SET",
				"full_form": "Symbiosis Entrance Test",
				"conducting_body": "Symbiosis",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to Symbiosis programs",
				"month": "April"
			}
		],
		"next_steps": [
			"Research the academic strengths of IIT Bombay, BITS Pilani and Symbiosis.",
			"Prepare for JEE Advanced and BITSAT with well-timed mocks.",
			"Shortlist branches or programs that match your strengths.",
			"Plan application deadlines and required documents."
		],
		"timeline": "Year 1: Build a strong preparation plan for major entrance exams. Year 2: Apply to West India institutes and finalize your college choices."
	},
	{
		"id": "R_IIT_KHARAGPUR_JADAVPUR_CALCUTTA",
		"question": "Top East India Institutes",
		"type": "recommendation",
		"title": "Top East India Institutes",
		"description": [
			"You want strong academic colleges in East India for engineering and law.",
			"This path suits students who prefer a mix of tradition and modern campus life.",
			"It opens options in technology, research, and professional careers."
		],
		"careers": [
			{
				"name": "Civil Engineer",
				"description": "Works on infrastructure and urban development.",
				"salary": "₹5-14 LPA",
				"stream": "PCM"
			},
			{
				"name": "Lawyer",
				"description": "Practices law with prestigious East India degrees.",
				"salary": "₹6-18 LPA",
				"stream": "Arts/Commerce"
			},
			{
				"name": "Research Scientist",
				"description": "Pursues academic science research.",
				"salary": "₹8-22 LPA",
				"stream": "PCM"
			},
			{
				"name": "Software Engineer",
				"description": "Builds technology products in top technical institutes.",
				"salary": "₹8-24 LPA",
				"stream": "PCM"
			},
			{
				"name": "Public Policy Analyst",
				"description": "Supports government policy and development planning.",
				"salary": "₹7-18 LPA",
				"stream": "Arts"
			}
		],
		"exams": [
			{
				"name": "JEE Advanced",
				"full_form": "Joint Entrance Examination Advanced",
				"conducting_body": "IITs",
				"eligibility": "Top JEE Main qualifiers",
				"what_it_leads_to": "Admission to IIT Kharagpur",
				"month": "May"
			},
			{
				"name": "CLAT",
				"full_form": "Common Law Admission Test",
				"conducting_body": "NLU Consortium",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to NLU Kolkata",
				"month": "May"
			},
			{
				"name": "CUET UG",
				"full_form": "Common University Entrance Test Undergraduate",
				"conducting_body": "NTA",
				"eligibility": "Class 12 in any stream",
				"what_it_leads_to": "Admission to central universities and colleges",
				"month": "May"
			}
		],
		"next_steps": [
			"Map East India college options against your preferred field.",
			"Prepare for JEE/CLAT and review program deadlines.",
			"Connect with current students or alumni from these institutes.",
			"Visit virtual campus tours to get a feel for the colleges."
		],
		"timeline": "Year 1: Explore East India institute options and entrance requirements. Year 2: Prepare for exams and apply to your top choices."
	},
	{
		"id": "R_NDA",
		"question": "Defence Forces",
		"type": "recommendation",
		"title": "Defence Forces",
		"description": [
			"You want a disciplined career serving the country, which is ideal for NDA.",
			"This path suits students who enjoy physical, mental and leadership challenges.",
			"It opens roles in the Army, Navy and Air Force with strong career stability."
		],
		"careers": [
			{
				"name": "Army Officer",
				"description": "Leads troops and operations in the Indian Army.",
				"salary": "₹8-20 LPA",
				"stream": "Any"
			},
			{
				"name": "Naval Officer",
				"description": "Commands naval vessels and maritime missions.",
				"salary": "₹8-22 LPA",
				"stream": "Any"
			},
			{
				"name": "Air Force Officer",
				"description": "Operates aircraft and leads aerospace missions.",
				"salary": "₹8-24 LPA",
				"stream": "Any"
			},
			{
				"name": "Military Strategist",
				"description": "Plans operations and defence strategy.",
				"salary": "₹9-25 LPA",
				"stream": "Any"
			},
			{
				"name": "Defence Analyst",
				"description": "Studies security and military trends.",
				"salary": "₹7-18 LPA",
				"stream": "Any"
			}
		],
		"exams": [
			{
				"name": "NDA",
				"full_form": "National Defence Academy",
				"conducting_body": "UPSC",
				"eligibility": "Class 12 in any stream; age 16.5-19.5",
				"what_it_leads_to": "Training for Army, Navy and Air Force officer careers",
				"month": "April/September"
			},
			{
				"name": "CDS",
				"full_form": "Combined Defence Services",
				"conducting_body": "UPSC",
				"eligibility": "Graduation in any stream",
				"what_it_leads_to": "Admission to officer training academies",
				"month": "February/September"
			},
			{
				"name": "AFCAT",
				"full_form": "Air Force Common Admission Test",
				"conducting_body": "Indian Air Force",
				"eligibility": "Graduation in any stream",
				"what_it_leads_to": "Shortlisting for Air Force officer recruitment",
				"month": "February/August"
			}
		],
		"next_steps": [
			"Start a physical fitness routine and teamwork activities.",
			"Read about NDA selection stages and SSB interview process.",
			"Practice general ability and mathematics papers for NDA.",
			"Speak to an ex-serviceman or defence coach for guidance."
		],
		"timeline": "Year 1: Build fitness, discipline and exam readiness. Year 2: Appear for NDA and prepare for SSB interviews to join the academy."
	},
	{
		"id": "R_COUNSELLOR_HANDOFF",
		"question": "It sounds like you'd benefit from a personalised conversation. Our counsellors can help you figure this out in 20 minutes. Choose how you'd like to connect:",
		"type": "handoff",
		"message": "It sounds like you'd benefit from a one-on-one conversation with our counsellors. They can help you get clarity in just 20 minutes — completely free.",
		"contact_options": [
			{
				"type": "WhatsApp",
				"label": "WhatsApp",
				"value": "https://wa.me/91XXXXXXXXXX"
			},
			{
				"type": "Call",
				"label": "Call",
				"value": "+91 12345 67890"
			},
			{
				"type": "Email",
				"label": "Email",
				"value": "mailto:careersupport@example.com"
			}
		]
	},
	{
		"id": "R_MBBS_NEET",
		"question": "Medical Careers via NEET",
		"type": "recommendation",
		"title": "Medical Careers via NEET",
		"description": [
			"You are focused on patient care and medical training, which is ideal for MBBS and related careers.",
			"This path requires strong PCB knowledge and sustained exam preparation.",
			"It prepares you for a respected healthcare career with long-term impact."
		],
		"careers": [
			{
				"name": "MBBS Doctor",
				"description": "Provides clinical healthcare and patient treatment.",
				"salary": "₹10-30 LPA",
				"stream": "PCB"
			},
			{
				"name": "Surgeon",
				"description": "Performs surgeries and advanced medical procedures.",
				"salary": "₹15-40 LPA",
				"stream": "PCB"
			},
			{
				"name": "Medical Researcher",
				"description": "Studies diseases and develops treatments.",
				"salary": "₹8-25 LPA",
				"stream": "PCB"
			},
			{
				"name": "Clinical Pharmacologist",
				"description": "Specializes in drug therapy and patient safety.",
				"salary": "₹8-20 LPA",
				"stream": "PCB"
			},
			{
				"name": "Public Health Doctor",
				"description": "Works on community health and preventive programs.",
				"salary": "₹6-18 LPA",
				"stream": "PCB"
			}
		],
		"exams": [
			{
				"name": "NEET UG",
				"full_form": "National Eligibility cum Entrance Test Undergraduate",
				"conducting_body": "NTA",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to medical and allied health programs",
				"month": "May"
			},
			{
				"name": "AIIMS MBBS",
				"full_form": "All India Institute of Medical Sciences MBBS Entrance",
				"conducting_body": "AIIMS",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to AIIMS medical programs",
				"month": "May"
			},
			{
				"name": "JIPMER MBBS",
				"full_form": "Jawaharlal Institute of Postgraduate Medical Education and Research MBBS Entrance",
				"conducting_body": "JIPMER",
				"eligibility": "Class 12 with PCB",
				"what_it_leads_to": "Admission to JIPMER MBBS program",
				"month": "May"
			}
		],
		"next_steps": [
			"Create a detailed NEET study schedule with weekly targets.",
			"Focus on high-value PCB chapters such as Biology anatomy and Chemistry organic.",
			"Solve at least one full NEET mock exam every two weeks.",
			"Review AIIMS and JIPMER exam patterns alongside NEET practice."
		],
		"timeline": "Year 1: Secure PCB fundamentals and start NEET preparation. Year 2: Intensify NEET and AIIMS/JIPMER preparation while tracking your mock scores."
	} /* truncated for brevity in this patch */
];

