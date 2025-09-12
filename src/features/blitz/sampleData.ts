import { BlitzQuestion } from "./types";

export const sampleQuestions: BlitzQuestion[] = [
  {
    id: "q1",
    prompt: "Which study mode focuses on rapid-fire questions?",
    choices: [
      { id: "c1", text: "Blitz (Dip)" },
      { id: "c2", text: "Deep Dive" },
      { id: "c3", text: "Nap Mode" },
    ],
    answerId: "c1",
    explanation: "Blitz = quick recall under time.",
    tags: ["modes"],
    difficulty: "easy",
  },
  {
    id: "q2",
    prompt: "Keyboard: which key submits the current selection?",
    choices: [
      { id: "c1", text: "Space" },
      { id: "c2", text: "Enter" },
      { id: "c3", text: "Esc" },
    ],
    answerId: "c2",
    explanation: "Enter submits; digits select choices; N/S skip; P pause.",
    tags: ["a11y", "shortcuts"],
    difficulty: "easy",
  },
  {
    id: "q3",
    prompt: "Accuracy is computed as…",
    choices: [
      { id: "c1", text: "Correct / Total Answered" },
      { id: "c2", text: "Total / Time" },
      { id: "c3", text: "Random" },
    ],
    answerId: "c1",
  },
  {
    id: "q4",
    prompt: "What happens when the timer hits 0?",
    choices: [
      { id: "c1", text: "Session ends and results display" },
      { id: "c2", text: "Timer loops" },
      { id: "c3", text: "The app crashes" },
    ],
    answerId: "c1",
  },
  {
    id: "q5",
    prompt: "Which keys skip to the next question?",
    choices: [
      { id: "c1", text: "N or S" },
      { id: "c2", text: "A or D" },
      { id: "c3", text: "Shift or Tab" },
    ],
    answerId: "c1",
  },
];


