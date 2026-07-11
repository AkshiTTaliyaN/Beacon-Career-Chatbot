// ocean_questions.js - 20 Big Five (OCEAN) personality questions
//
// Source: Donnellan, M. B., Oswald, F. L., Baird, B. M., & Lucas, R. E.
// (2006). The Mini-IPIP scales. Psychological Assessment, 18, 192-203.
// Public-domain IPIP items (ipip.ori.org). Wording unchanged apart from a
// leading "I" so each statement reads as a full sentence.
//
// 4 items per trait, 20 total, interleaved so consecutive items differ.
//   O = Openness, C = Conscientiousness, E = Extraversion,
//   A = Agreeableness, N = Neuroticism
//
// `reverse: true` marks the 11 reverse-keyed items. Do NOT flip them here —
// the backend flips them once (6 - answer). Flipping in both places would
// double-flip and silently corrupt the scores.
//
// Scale: 1 = Strongly Disagree ... 5 = Strongly Agree.
// (Agreement/accuracy anchors — NOT the Never..Always scale used by the
// aptitude section, because these are descriptive statements.)
//
// Field shape mirrors aptitude_questions.js: integer `id`, plus `skill` and
// `label` so TestPage's existing question-rendering map works unchanged.
// `trait` and `reverse` are the extra fields the OCEAN scoring needs.

const OCEAN_SCALE_LABELS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const OCEAN_QUESTIONS = [
  {
    id: 1,
    skill: "E",
    trait: "E",
    label: "Extraversion",
    text: "I am the life of the party.",
    reverse: false,
  },
  {
    id: 2,
    skill: "A",
    trait: "A",
    label: "Agreeableness",
    text: "I sympathize with others' feelings.",
    reverse: false,
  },
  {
    id: 3,
    skill: "C",
    trait: "C",
    label: "Conscientiousness",
    text: "I get chores done right away.",
    reverse: false,
  },
  {
    id: 4,
    skill: "N",
    trait: "N",
    label: "Neuroticism",
    text: "I have frequent mood swings.",
    reverse: false,
  },
  {
    id: 5,
    skill: "O",
    trait: "O",
    label: "Openness",
    text: "I have a vivid imagination.",
    reverse: false,
  },
  {
    id: 6,
    skill: "E",
    trait: "E",
    label: "Extraversion",
    text: "I don't talk a lot.",
    reverse: true,
  },
  {
    id: 7,
    skill: "A",
    trait: "A",
    label: "Agreeableness",
    text: "I am not really interested in others.",
    reverse: true,
  },
  {
    id: 8,
    skill: "C",
    trait: "C",
    label: "Conscientiousness",
    text: "I often forget to put things back in their proper place.",
    reverse: true,
  },
  {
    id: 9,
    skill: "N",
    trait: "N",
    label: "Neuroticism",
    text: "I am relaxed most of the time.",
    reverse: true,
  },
  {
    id: 10,
    skill: "O",
    trait: "O",
    label: "Openness",
    text: "I have difficulty understanding abstract ideas.",
    reverse: true,
  },
  {
    id: 11,
    skill: "E",
    trait: "E",
    label: "Extraversion",
    text: "I talk to a lot of different people at parties.",
    reverse: false,
  },
  {
    id: 12,
    skill: "A",
    trait: "A",
    label: "Agreeableness",
    text: "I feel others' emotions.",
    reverse: false,
  },
  {
    id: 13,
    skill: "C",
    trait: "C",
    label: "Conscientiousness",
    text: "I like order.",
    reverse: false,
  },
  {
    id: 14,
    skill: "N",
    trait: "N",
    label: "Neuroticism",
    text: "I get upset easily.",
    reverse: false,
  },
  {
    id: 15,
    skill: "O",
    trait: "O",
    label: "Openness",
    text: "I am not interested in abstract ideas.",
    reverse: true,
  },
  {
    id: 16,
    skill: "E",
    trait: "E",
    label: "Extraversion",
    text: "I keep in the background.",
    reverse: true,
  },
  {
    id: 17,
    skill: "A",
    trait: "A",
    label: "Agreeableness",
    text: "I am not interested in other people's problems.",
    reverse: true,
  },
  {
    id: 18,
    skill: "C",
    trait: "C",
    label: "Conscientiousness",
    text: "I make a mess of things.",
    reverse: true,
  },
  {
    id: 19,
    skill: "N",
    trait: "N",
    label: "Neuroticism",
    text: "I seldom feel blue.",
    reverse: true,
  },
  {
    id: 20,
    skill: "O",
    trait: "O",
    label: "Openness",
    text: "I do not have a good imagination.",
    reverse: true,
  },
];

export { OCEAN_SCALE_LABELS };
export default OCEAN_QUESTIONS;