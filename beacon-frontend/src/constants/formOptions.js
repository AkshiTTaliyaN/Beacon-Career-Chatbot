/** UI labels map to backend enum values in models.py / schemas.py */

export const CLASSES = [8, 9, 10, 11, 12];

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

export const INITIAL_FORM = {
  current_class: "",
  board: "",
  // Bug 2 fix: null instead of "" — empty string is not a valid StreamEnum value
  stream: null,
  city: "",
  state: "",
  school_name: "",
  performance_band: "",
  strongest_subject: "",
  weakest_subject: "",
  income_bracket: "",
  father_occupation: "",
  mother_occupation: "",
  relative_influence: "",
  family_preference: "",
  target_sector: "",
  relocation_pref: "",
  cost_constraint: "",
  additional_notes: "",
};