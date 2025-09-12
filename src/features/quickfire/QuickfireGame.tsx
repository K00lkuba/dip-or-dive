import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MCQ } from "./types";

function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = arr.slice();
  let s = seed % 2147483647;
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type QuickfireGameProps = {
  questions: MCQ[];
  totalQuestions?: number;   // default 5
  totalSeconds?: number;     // default 25
  revealDelayMs?: number;    // default 600
  onExit?: () => void;       // called from results "Close"
};

export default function QuickfireGame({
  questions,
  totalQuestions = 5,
  totalSeconds = 25,
  revealDelayMs = 600,
  onExit,
}: QuickfireGameProps) {
  const roundQs = useMemo(() => {
    const pick = Math.min(totalQuestions, questions.length);
    return shuffle(questions).slice(0, pick);
  }, [questions, totalQuestions]);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const finishedRef = useRef(finished);
  finishedRef.current = finished;

  const total = roundQs.length;
  const current = roundQs[idx];

  // Global 25s countdown
  useEffect(() => {
    if (finished) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [finished]);

  // 1..9 keyboard to answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finishedRef.current) return;
      if (e.key >= "1" && e.key <= "9") {
        const option = Number(e.key) - 1;
        handlePick(option);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, selected]);

  const handlePick = useCallback(
    (optionIndex: number) => {
      if (finished || !current) return;
      if (selected !== null) return; // already answered this one
      const correct = optionIndex === current.answerIndex;
      setSelected(optionIndex);
      if (correct) setScore((s) => s + 1);

      window.setTimeout(() => {
        if (finishedRef.current) return;
        const next = idx + 1;
        if (next >= total) {
          setFinished(true);
        } else {
          setIdx(next);
          setSelected(null);
        }
      }, revealDelayMs);
    },
    [current, finished, idx, revealDelayMs, selected, total]
  );

  const restart = () => {
    setIdx(0);
    setScore(0);
    setTimeLeft(totalSeconds);
    setFinished(false);
    setSelected(null);
  };

  // Progress bar width
  const pct = totalSeconds > 0 ? Math.round((timeLeft / totalSeconds) * 100) : 0;

  if (finished || timeLeft <= 0) {
    return (
      <div className="max-w-3xl mx-auto rounded-2xl border p-6 bg-white dark:bg-white text-black">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Quickfire Results</h2>
          <span className="text-sm">Time: {Math.min(totalSeconds, totalSeconds - timeLeft)}s</span>
        </div>
        <p className="text-lg">
          You scored <span className="font-bold">{score}</span> / {total}.
        </p>
        <div className="mt-4">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 text-black">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">Quickfire MCQ</h2>
        <div className="text-sm">
          {idx + 1} / {total}
        </div>
      </div>

      <div aria-label="time remaining" className="w-full">
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-2 transition-[width] duration-100 bg-emerald-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-right">{timeLeft}s left</div>
      </div>

      <div
        role="group"
        aria-roledescription="Question"
        className="rounded-2xl border p-6 bg-white dark:bg-white"
      >
        <div className="text-lg md:text-xl font-semibold mb-4">{current.prompt}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" aria-live="polite">
          {current.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = selected !== null && i === current.answerIndex;
            const isWrong = isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => handlePick(i)}
                disabled={selected !== null}
                data-selected={isSelected || undefined}
                data-correct={isCorrect || undefined}
                className={[
                  "w-full text-left px-4 py-3 rounded-xl border focus:outline-none focus-visible:ring-2",
                  "transition-colors",
                  selected === null ? "hover:bg-gray-50" : "",
                  isCorrect
                    ? "border-emerald-600 bg-emerald-50"
                    : isWrong
                    ? "border-rose-600 bg-rose-50"
                    : "border-gray-300",
                  "focus-visible:ring-blue-500",
                  "text-black",
                ].join(" ")}
                aria-disabled={selected !== null}
                aria-pressed={isSelected}
              >
                <span className="font-medium">{i + 1}.</span> {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-3 min-h-[1.5rem]" aria-live="polite">
          {selected !== null && (
            <span className="text-sm">
              {selected === current.answerIndex ? (
                <span className="text-emerald-700 font-medium">Correct!</span>
              ) : (
                <span className="text-rose-700 font-medium">Wrong — correct answer is {current.options[current.answerIndex]}.</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


