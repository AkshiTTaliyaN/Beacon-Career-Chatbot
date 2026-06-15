// hobbies.js — grouped hobby options for Section 2 (interest inventory)
// Rendered as a multi-select checkbox screen.
// Values must exactly match the keys in HOBBY_MAP in career_mapping.py.

export const HOBBY_CATEGORIES = [
  {
    category: "Creative",
    hobbies: [
      "Drawing/Painting",
      "Photography",
      "Writing/Storytelling",
      "Music (playing instrument)",
      "Singing",
      "Dancing",
      "Acting/Theatre",
      "Crafting/DIY",
      "Fashion/Design",
      "Filmmaking/Editing",
    ],
  },
  {
    category: "Physical",
    hobbies: [
      "Cricket",
      "Football",
      "Basketball",
      "Swimming",
      "Athletics/Running",
      "Martial Arts",
      "Yoga/Fitness",
      "Cycling",
      "Hiking/Trekking",
    ],
  },
  {
    category: "Intellectual",
    hobbies: [
      "Reading",
      "Debating",
      "Chess/Strategy Games",
      "Quiz/Trivia",
      "Coding",
      "Robotics/Electronics",
      "Science Experiments",
      "Learning Languages",
    ],
  },
  {
    category: "Social & Service",
    hobbies: [
      "Volunteering",
      "Teaching/Tutoring others",
      "Event Organisation",
      "Public Speaking",
      "Animal Care",
    ],
  },
  {
    category: "Practical",
    hobbies: [
      "Cooking/Baking",
      "Gardening",
      "Mechanics/Fixing things",
      "Building models",
    ],
  },
];

// Flat list of all hobby strings — useful for validation
export const ALL_HOBBIES = HOBBY_CATEGORIES.flatMap((cat) => cat.hobbies);