import type { MCQ } from "./types";

export const sampleMCQ: MCQ[] = [
  {
    id: "q1",
    prompt: "What does Vite primarily improve?",
    options: ["State management", "Dev server speed & DX", "Testing", "Server hosting"],
    answerIndex: 1,
  },
  {
    id: "q2",
    prompt: "Which router does this app use?",
    options: ["Next Router", "react-router-dom", "Reach Router", "Wouter"],
    answerIndex: 1,
  },
  {
    id: "q3",
    prompt: "Tailwind is a…",
    options: ["Utility-first CSS framework", "CSS-in-JS runtime", "Design token compiler", "UI kit only"],
    answerIndex: 0,
  },
  {
    id: "q4",
    prompt: "Keyboard shortcut to pick first option?",
    options: ["Enter", "1", "Space", "Esc"],
    answerIndex: 1,
  },
  {
    id: "q5",
    prompt: "What else ends the round besides 5 answers?",
    options: ["10s pass", "Timer hits 0", "Three wrong answers", "Pressing Close"],
    answerIndex: 1,
  },
];


