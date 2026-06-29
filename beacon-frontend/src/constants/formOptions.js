/** UI labels map to backend enum values in models.py / schemas.py */

export const CLASSES = [9, 10, 11, 12];

export const BOARDS = [
  { label: "CBSE", value: "CBSE", description: "Central Board — used by most schools" },
  { label: "ICSE", value: "ICSE", description: "Certificate Board — common in many private schools" },
  { label: "State Board", value: "State Board", description: "Your state's own education board" },
  { label: "Other", value: "Other", description: "IGCSE, IB, NIOS, or any other board" },
];

export const STREAMS = [
  { label: "PCM", value: "pcm", description: "Engineering, tech, science" },
  { label: "PCB", value: "pcb", description: "Medicine, biotech, life sciences" },
  { label: "PCMB", value: "pcmb", description: "Keeps both options open" },
  { label: "Commerce", value: "comm", description: "CA, finance, business" },
  { label: "Arts", value: "arts", description: "Law, media, civil services" },
  { label: "Not decided yet", value: "none", description: "Still exploring" },
];

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "History",
  "Geography",
  "Political Science",
  "Economics",
  "Accountancy",
  "Business Studies",
  "Computer Science",
  "Physical Education",
  "Sanskrit",
  "Other",
];

export const PERFORMANCE_BANDS = [
  { label: "90% and above", value: "90+", description: "Consistently high scores" },
  { label: "75% – 90%", value: "75-90", description: "Doing well overall" },
  { label: "60% – 75%", value: "60-75", description: "In the middle" },
  { label: "Below 60%", value: "<60", description: "Working on improving" },
];

export const INCOME_BRACKETS = [
  { label: "Below ₹2 lakh per year", value: "A" },
  { label: "₹2 – 5 lakh per year", value: "B" },
  { label: "₹5 – 10 lakh per year", value: "C" },
  { label: "Above ₹10 lakh per year", value: "D" },
];

export const OCCUPATIONS = [
  "Government employee",
  "Private sector employee",
  "Self-employed / Business",
  "Farmer / Agriculture",
  "Daily wage / Labour",
  "Homemaker",
  "Retired",
  "Not employed",
  "Other",
  "Prefer not to say",
];

export const TARGET_SECTORS = [
  { label: "Government job", value: "govt", description: "Civil services, railways, defence" },
  { label: "Private sector", value: "private", description: "Tech, finance, corporate" },
  { label: "Higher studies", value: "study", description: "College or university" },
  { label: "Own business", value: "entrepreneur", description: "Startup or freelance" },
  { label: "Open to anything", value: "open", description: "Still figuring it out" },
];

export const RELOCATION_PREFS = [
  { label: "Yes — anywhere", value: "yes", description: "Happy to move for the right opportunity" },
  { label: "Within my state", value: "state", description: "Not too far from home" },
  { label: "Prefer my city", value: "no", description: "Stay close to home" },
  { label: "Not sure yet", value: "unsure", description: "Haven't decided" },
];

export const COST_CONSTRAINTS = [
  { label: "Low cost / govt colleges", value: "yes", description: "Need affordable options" },
  { label: "Need scholarship", value: "scholarship", description: "Fees are a concern" },
  { label: "Moderate budget", value: "moderate", description: "Family can support partly" },
  { label: "Not a major concern", value: "no", description: "Fees aren't the main factor" },
];

// ─── NEW: Academic profile constants ────────────────────────────────────────

export const STUDY_HOURS = [
  { label: "Less than 1 hour", value: "lt1", description: "Mostly school only" },
  { label: "1 – 2 hours", value: "1to2", description: "Homework & revision" },
  { label: "2 – 4 hours", value: "2to4", description: "Solid daily routine" },
  { label: "More than 4 hours", value: "gt4", description: "Intensive study" },
];

export const COACHING_STATUS = [
  { label: "Self-study", value: "self", description: "Books, notes, online" },
  { label: "School tuition", value: "school_tuition", description: "Extra classes at school" },
  { label: "Coaching centre", value: "coaching", description: "JEE, NEET, or board prep" },
  { label: "Online apps", value: "online", description: "Unacademy, PW, etc." },
  { label: "Mix of methods", value: "mix", description: "Depends on subject" },
];

export const CAREER_CLARITY = [
  { label: "Very clear", value: "clear", description: "I know what I want" },
  { label: "A few options", value: "some_idea", description: "Narrowed to 2–3 ideas" },
  { label: "Still exploring", value: "exploring", description: "Nothing decided yet" },
  { label: "No idea yet", value: "no_idea", description: "And that's okay" },
];

export const LEARNING_STYLES = [
  { label: "Visual", value: "visual", description: "Videos, diagrams, charts" },
  { label: "Reading & writing", value: "reading", description: "Textbooks and notes" },
  { label: "Hands-on", value: "practical", description: "Projects and experiments" },
  { label: "Listening", value: "listening", description: "Lectures and discussions" },
  { label: "Mix of styles", value: "mix", description: "Depends on the subject" },
];

// ─── INITIAL_FORM ────────────────────────────────────────────────────────────

export const INITIAL_FORM = {
  name: "",

  current_class: "",
  board: "",
  stream: null,
  city: "",
  state: "",
  school_name: "",

  // existing academic
  performance_band: "",
  strongest_subject: "",
  weakest_subject: "",

  // A: new academic fields
  enjoyed_subjects: [],       // multi-select from SUBJECTS
  study_hours: "",            // from STUDY_HOURS
  coaching_status: "",        // from COACHING_STATUS
  career_clarity: "",         // from CAREER_CLARITY
  learning_style: "",         // from LEARNING_STYLES
  extracurricular: "",        // free text

  // family context
  income_bracket: "",
  father_occupation: "",
  mother_occupation: "",
  relative_influence: "",
  family_preference: "",

  // goals
  target_sector: "",
  relocation_pref: "",
  cost_constraint: "",
  additional_notes: "",

  subjectRatings: {},        // e.g. { mathematics: 4, physics: 3 }
  subjectInterests: {},      // e.g. { mathematics: 'Calculus', physics: 'Mechanics' }
  workStyle: {},             // sliders: building, researching, creative, helping, leading, structured
  careerPriorities: [],      // array of 3 selected priorities
  workPreferences: {},       // { soloTeam: 3, relocation: 'Yes' }
};