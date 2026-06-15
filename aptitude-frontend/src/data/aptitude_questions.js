// aptitude_questions.js — 18 self-rated aptitude questions
// 3 per skill area in this order:
//   english (0-2), patterns (3-5), logical (6-8),
//   maths (9-11), visual (12-14), detail (15-17)
// Scale: 1 = Never, 2 = Rarely, 3 = Sometimes, 4 = Usually, 5 = Always

const APTITUDE_QUESTIONS = [
  // ── ENGLISH & LANGUAGE SKILLS ─────────────────────────────────────────────
  {
    id: 1,
    skill: "english",
    label: "English & Language Skills",
    text: "When you read a paragraph, do you usually understand the main idea without rereading it?",
  },
  {
    id: 2,
    skill: "english",
    label: "English & Language Skills",
    text: "Do you find it easy to express your thoughts clearly when writing an essay or letter?",
  },
  {
    id: 3,
    skill: "english",
    label: "English & Language Skills",
    text: "When someone uses an unfamiliar word, do you usually figure out its meaning from context?",
  },

  // ── FINDING PATTERNS & SEQUENCES ──────────────────────────────────────────
  {
    id: 4,
    skill: "patterns",
    label: "Finding Patterns & Sequences",
    text: "When you look at a number or letter series, do you usually spot the pattern quickly?",
  },
  {
    id: 5,
    skill: "patterns",
    label: "Finding Patterns & Sequences",
    text: "In puzzles or games, do you naturally notice repeating structures or rules?",
  },
  {
    id: 6,
    skill: "patterns",
    label: "Finding Patterns & Sequences",
    text: "Do you find it easy to predict what comes next in a sequence once you see the first few items?",
  },

  // ── LOGICAL THINKING ──────────────────────────────────────────────────────
  {
    id: 7,
    skill: "logical",
    label: "Logical Thinking",
    text: "When solving a problem, do you usually break it into steps rather than guessing?",
  },
  {
    id: 8,
    skill: "logical",
    label: "Logical Thinking",
    text: "If someone gives you an argument, can you usually tell whether their reasoning makes sense?",
  },
  {
    id: 9,
    skill: "logical",
    label: "Logical Thinking",
    text: "Do you find it easy to spot the flaw in a statement or conclusion?",
  },

  // ── MATHS & NUMBERS ───────────────────────────────────────────────────────
  {
    id: 10,
    skill: "maths",
    label: "Maths & Numbers",
    text: "Do you usually feel comfortable solving maths problems without a calculator for basic calculations?",
  },
  {
    id: 11,
    skill: "maths",
    label: "Maths & Numbers",
    text: "When dealing with percentages, ratios, or averages, do you find them easy to work with?",
  },
  {
    id: 12,
    skill: "maths",
    label: "Maths & Numbers",
    text: "Do you enjoy working through numerical problems more than descriptive ones?",
  },

  // ── VISUALISING & DRAWING ─────────────────────────────────────────────────
  {
    id: 13,
    skill: "visual",
    label: "Visualising & Drawing",
    text: "Can you usually picture how an object looks from a different angle without physically rotating it?",
  },
  {
    id: 14,
    skill: "visual",
    label: "Visualising & Drawing",
    text: "When reading a map or diagram, do you find it easy to understand spatial relationships?",
  },
  {
    id: 15,
    skill: "visual",
    label: "Visualising & Drawing",
    text: "Do you find it easy to sketch or draw something from memory?",
  },

  // ── ATTENTION TO DETAIL ───────────────────────────────────────────────────
  {
    id: 16,
    skill: "detail",
    label: "Attention to Detail",
    text: "Do you usually catch spelling or grammar mistakes when reading someone else's work?",
  },
  {
    id: 17,
    skill: "detail",
    label: "Attention to Detail",
    text: "When following instructions, do you naturally check each step carefully before moving on?",
  },
  {
    id: 18,
    skill: "detail",
    label: "Attention to Detail",
    text: "In a busy image or chart, do you find it easy to spot small differences or errors?",
  },
];

export default APTITUDE_QUESTIONS;