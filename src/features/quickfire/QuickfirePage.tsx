import QuickfireGame from "./QuickfireGame";
import type { MCQ } from "./types";
import Card from "../../components/ui/Card";

const sample: MCQ[] = [
  {
    id: "q1",
    prompt: "What does Vite primarily improve in development?",
    options: ["State management", "Dev server speed & DX", "Testing framework", "Server-side rendering"],
    answerIndex: 1,
  },
  {
    id: "q2",
    prompt: "Which router are we using?",
    options: ["Next Router", "Reach Router", "react-router-dom", "wouter"],
    answerIndex: 2,
  },
  {
    id: "q3",
    prompt: "Tailwind is primarily a…",
    options: ["CSS-in-JS runtime", "Utility-first CSS framework", "Design token compiler", "Component library"],
    answerIndex: 1,
  },
  {
    id: "q4",
    prompt: "TypeScript’s type for a React component that takes children is…",
    options: ["React.FC", "PropsWithChildren", "ComponentType", "JSX.Element"],
    answerIndex: 1,
  },
  {
    id: "q5",
    prompt: "Which command starts the Vite dev server?",
    options: ["npm run start", "npm run serve", "npm run dev", "npm run preview"],
    answerIndex: 2,
  },
  {
    id: "q6",
    prompt: "ARIA live region for polite updates uses…",
    options: ['role="alert"', 'aria-live="polite"', 'aria-pressed="true"', 'tabindex="-1"'],
    answerIndex: 1,
  },
];

export default function QuickfirePage() {
  return (
    <main className="px-4 py-6 md:py-10 space-y-4">
      <Card className="mb-2">
        <h1 className="text-2xl font-bold">Quickfire MCQ (5 in 25s)</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Answer 5 questions in 25 seconds. Click or press 1–4 to answer. You’ll see if you’re right, then it auto-advances.
        </p>
      </Card>
      <QuickfireGame questions={sample} />
    </main>
  );
}


