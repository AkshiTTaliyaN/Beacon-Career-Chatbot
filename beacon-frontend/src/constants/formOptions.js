/** UI labels map to backend enum values in models.py / schemas.py */

export const CLASSES = [9, 10, 11, 12];

export const BOARDS = [
  { label: "CBSE", value: "CBSE" },
  { label: "ICSE", value: "ICSE" },
  { label: "State Board", value: "State Board" },
  { label: "Other", value: "Other" },
];

export const STREAMS = [
  { label: "PCM", value: "pcm", description: "Physics, Chemistry, Maths" },
  { label: "PCB", value: "pcb", description: "Physics, Chemistry, Biology" },
  { label: "PCMB", value: "pcmb", description: "All four sciences" },
  { label: "Commerce", value: "comm", description: "Accounts, Economics, Business" },
  { label: "Arts", value: "arts", description: "Humanities & social sciences" },
  { label: "Not decided", value: "none", description: "Still exploring options" },
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
  { label: "90% and above", value: "90+" },
  { label: "75% – 90%", value: "75-90" },
  { label: "60% – 75%", value: "60-75" },
  { label: "Below 60%", value: "<60" },
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
  { label: "Government job", value: "govt" },
  { label: "Private sector", value: "private" },
  { label: "Higher studies", value: "study" },
  { label: "Entrepreneurship", value: "entrepreneur" },
  { label: "Open to anything", value: "open" },
];

export const RELOCATION_PREFS = [
  { label: "Yes, anywhere in India", value: "yes" },
  { label: "Within my state only", value: "state" },
  { label: "No, stay in my city", value: "no" },
  { label: "Not sure yet", value: "unsure" },
];

export const COST_CONSTRAINTS = [
  { label: "Low cost / government colleges only", value: "yes" },
  { label: "Need scholarship / financial aid", value: "scholarship" },
  { label: "Moderate — family can support partly", value: "moderate" },
  { label: "No major constraint", value: "no" },
];

// ─── NEW: Academic profile constants ────────────────────────────────────────

export const STUDY_HOURS = [
  { label: "Less than 1 hour", value: "lt1" },
  { label: "1 – 2 hours", value: "1to2" },
  { label: "2 – 4 hours", value: "2to4" },
  { label: "More than 4 hours", value: "gt4" },
];

export const COACHING_STATUS = [
  { label: "Self-study only", value: "self" },
  { label: "School tuition / extra classes", value: "school_tuition" },
  { label: "Private coaching centre", value: "coaching" },
  { label: "Online courses / apps", value: "online" },
  { label: "Mix of the above", value: "mix" },
];

export const CAREER_CLARITY = [
  { label: "Very clear — I know what I want", value: "clear" },
  { label: "Have a few options in mind", value: "some_idea" },
  { label: "Still exploring, no fixed idea", value: "exploring" },
  { label: "No idea at all", value: "no_idea" },
];

export const LEARNING_STYLES = [
  { label: "Visual — diagrams, videos, charts", value: "visual" },
  { label: "Reading — notes, textbooks", value: "reading" },
  { label: "Practical — experiments, projects", value: "practical" },
  { label: "Listening — lectures, discussions", value: "listening" },
  { label: "Mix of all styles", value: "mix" },
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