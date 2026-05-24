// questions.js — 60 RIASEC questions
// 10 per category: R (0-9), I (10-19), A (20-29), S (30-39), E (40-49), C (50-59)
// Scale: 1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 = Strongly Agree

const QUESTIONS = [
  // ── REALISTIC (R) ─────────────────────────────────────────────────────────
  { id: 1,  category: "R", text: "I enjoy working with tools, machines, or equipment." },
  { id: 2,  category: "R", text: "I like building or repairing things with my hands." },
  { id: 3,  category: "R", text: "I prefer outdoor or physical activities over sitting at a desk." },
  { id: 4,  category: "R", text: "I enjoy activities like woodworking, welding, or mechanical repair." },
  { id: 5,  category: "R", text: "I like following clear, step-by-step procedures to complete a task." },
  { id: 6,  category: "R", text: "I would enjoy a job where I work with my hands every day." },
  { id: 7,  category: "R", text: "I find satisfaction in finishing a physical task I can see and touch." },
  { id: 8,  category: "R", text: "I prefer practical subjects like physics, mechanics, or engineering over abstract ones." },
  { id: 9,  category: "R", text: "I enjoy taking apart gadgets or devices to understand how they work." },
  { id: 10, category: "R", text: "I am comfortable working in a workshop, lab, or on a construction site." },

  // ── INVESTIGATIVE (I) ─────────────────────────────────────────────────────
  { id: 11, category: "I", text: "I enjoy solving complex logical or mathematical problems." },
  { id: 12, category: "I", text: "I like reading about scientific discoveries and how things work." },
  { id: 13, category: "I", text: "I prefer to analyse a situation carefully before making a decision." },
  { id: 14, category: "I", text: "I enjoy conducting experiments or researching answers to difficult questions." },
  { id: 15, category: "I", text: "I find myself curious about why things happen the way they do." },
  { id: 16, category: "I", text: "I would enjoy a career that involves research, data analysis, or scientific investigation." },
  { id: 17, category: "I", text: "I like puzzles, brain teasers, or logic games." },
  { id: 18, category: "I", text: "I prefer to think independently and reach my own conclusions rather than follow others." },
  { id: 19, category: "I", text: "I enjoy subjects like biology, chemistry, mathematics, or computer science." },
  { id: 20, category: "I", text: "I find satisfaction in understanding complex systems or theories deeply." },

  // ── ARTISTIC (A) ──────────────────────────────────────────────────────────
  { id: 21, category: "A", text: "I enjoy expressing myself through drawing, painting, music, or writing." },
  { id: 22, category: "A", text: "I like creating things that are original and unique rather than following a template." },
  { id: 23, category: "A", text: "I feel energised when working on creative projects like design, photography, or storytelling." },
  { id: 24, category: "A", text: "I prefer environments that allow me to be imaginative and experiment freely." },
  { id: 25, category: "A", text: "I enjoy activities like performing, singing, acting, or making videos." },
  { id: 26, category: "A", text: "I would enjoy a career in design, media, fashion, film, or the arts." },
  { id: 27, category: "A", text: "I notice the aesthetics and visual design of things around me more than most people." },
  { id: 28, category: "A", text: "I find traditional, rule-heavy environments limiting and prefer creative freedom." },
  { id: 29, category: "A", text: "I enjoy writing stories, poems, scripts, or creative essays." },
  { id: 30, category: "A", text: "I like imagining new ideas and bringing them to life in a creative way." },

  // ── SOCIAL (S) ────────────────────────────────────────────────────────────
  { id: 31, category: "S", text: "I enjoy helping friends or family work through their problems." },
  { id: 32, category: "S", text: "I like working in teams and collaborating with others towards a shared goal." },
  { id: 33, category: "S", text: "I feel fulfilled when I make a positive difference in someone's life." },
  { id: 34, category: "S", text: "I am good at listening to others and understanding how they feel." },
  { id: 35, category: "S", text: "I enjoy teaching, explaining things clearly, or mentoring others." },
  { id: 36, category: "S", text: "I would enjoy a career in healthcare, education, counselling, or social work." },
  { id: 37, category: "S", text: "I like participating in community service, volunteering, or group activities." },
  { id: 38, category: "S", text: "I find it easy to build trust and connect with new people." },
  { id: 39, category: "S", text: "I prefer environments where I can interact with and support people regularly." },
  { id: 40, category: "S", text: "I care deeply about the wellbeing of others, including strangers." },

  // ── ENTERPRISING (E) ──────────────────────────────────────────────────────
  { id: 41, category: "E", text: "I enjoy taking charge and leading a group towards a goal." },
  { id: 42, category: "E", text: "I like convincing or persuading others to see my point of view." },
  { id: 43, category: "E", text: "I feel energised when competing, setting targets, and meeting them." },
  { id: 44, category: "E", text: "I enjoy organising events, running projects, or coordinating people." },
  { id: 45, category: "E", text: "I like coming up with business ideas and thinking about how to make them work." },
  { id: 46, category: "E", text: "I would enjoy a career in business, entrepreneurship, law, or politics." },
  { id: 47, category: "E", text: "I enjoy negotiating deals, debating ideas, or speaking in public." },
  { id: 48, category: "E", text: "I prefer roles where I have responsibility and can make decisions." },
  { id: 49, category: "E", text: "I like setting ambitious goals and working hard to achieve them." },
  { id: 50, category: "E", text: "I am comfortable taking calculated risks when I believe in an outcome." },

  // ── CONVENTIONAL (C) ──────────────────────────────────────────────────────
  { id: 51, category: "C", text: "I enjoy organising information, files, or data in a clear, structured way." },
  { id: 52, category: "C", text: "I prefer having a clear routine and set procedures to follow at work or school." },
  { id: 53, category: "C", text: "I like working with numbers, spreadsheets, or financial records." },
  { id: 54, category: "C", text: "I feel comfortable following rules and working within a structured system." },
  { id: 55, category: "C", text: "I enjoy tasks that require attention to detail and accuracy." },
  { id: 56, category: "C", text: "I would enjoy a career in accounting, banking, administration, or data management." },
  { id: 57, category: "C", text: "I like keeping records, tracking progress, and ensuring things are done correctly." },
  { id: 58, category: "C", text: "I prefer environments that are orderly, predictable, and well-organised." },
  { id: 59, category: "C", text: "I enjoy checking my work carefully and correcting errors before submitting it." },
  { id: 60, category: "C", text: "I like knowing exactly what is expected of me and meeting those expectations consistently." },
];

export default QUESTIONS;