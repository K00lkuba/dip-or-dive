import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BlitzQuestion, BlitzResult } from "./types";
import { useTimer } from "./useTimer";
import Card from "../../components/ui/Card";
import { loadJSON, saveJSON } from "../../lib/storage";
import { BlitzResults } from "./BlitzResults";

type SprintProps = {
  questions: BlitzQuestion[];
  durationSec?: number; // default 60
  onFinish?: (result: BlitzResult) => void;
};

type ChoiceState = "idle" | "correct" | "wrong";

export default function Sprint({ questions, durationSec = 60, onFinish }: SprintProps) {
  const validQuestions = useMemo(() => questions.filter(q => q.choices.length >= 2), [questions]);
  const [order, setOrder] = useState<number[]>(() => shuffle(validQuestions.length));
  const [idx, setIdx] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [choiceStateById, setChoiceStateById] = useState<Record<string, ChoiceState>>({});
  const [sessionKey] = useState<string>(() => `blitz:last:${durationSec}`);
  const [showResults, setShowResults] = useState(false);

  const { secondsLeft, running, start, pause, reset } = useTimer(durationSec, {
    onComplete: () => finalize(),
    tickMs: 200,
  });

  const current = validQuestions[order[idx] ?? 0];
  const nextUp = validQuestions[order[(idx + 1) % validQuestions.length] ?? 0];

  const accuracy = answeredCount === 0 ? 0 : correctCount / answeredCount;

  useEffect(() => {
    // reset when duration changes
    reset(durationSec);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSec]);

  const begin = useCallback(() => {
    setAnsweredCount(0);
    setCorrectCount(0);
    setSelectedId(null);
    setChoiceStateById({});
    setOrder(shuffle(validQuestions.length));
    setIdx(0);
    setShowResults(false);
    reset(durationSec);
    start();
  }, [validQuestions.length, reset, start, durationSec]);

  const submit = useCallback((choiceId?: string) => {
    if (!running) return;
    const picked = choiceId ?? selectedId;
    if (!picked || !current) return;

    const isCorrect = picked === current.answerId;
    setChoiceStateById((prev) => ({ ...prev, [picked]: isCorrect ? "correct" : "wrong" }));
    setAnsweredCount((n) => n + 1);
    if (isCorrect) setCorrectCount((n) => n + 1);

    // brief delay for feedback, then advance
    window.setTimeout(() => {
      setChoiceStateById({});
      setSelectedId(null);
      setIdx((i) => (i + 1) % validQuestions.length);
    }, 180);
  }, [running, current, validQuestions.length, selectedId]);

  const skip = useCallback(() => {
    if (!running) return;
    setChoiceStateById({});
    setSelectedId(null);
    setIdx((i) => (i + 1) % validQuestions.length);
  }, [running, validQuestions.length]);

  const finalize = useCallback(() => {
    const result: BlitzResult = {
      playedAt: new Date().toISOString(),
      durationSec,
      totalAnswered: answeredCount,
      totalCorrect: correctCount,
      accuracy,
    };
    saveJSON(sessionKey, result);
    setShowResults(true);
    if (onFinish) onFinish(result);
  }, [answeredCount, correctCount, accuracy, onFinish, durationSec, sessionKey]);

  // Keyboard shortcuts: 1..9 select, Enter submit, N/S skip, P pause/resume
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k >= "1" && k <= "9") {
        const idx = Number(k) - 1;
        const id = current?.choices[idx]?.id;
        if (id) {
          setSelectedId(id);
          e.preventDefault();
        }
      } else if (k === "enter") {
        if (selectedId) {
          submit(selectedId);
          e.preventDefault();
        }
      } else if (k === "n" || k === "s") {
        skip();
        e.preventDefault();
      } else if (k === "p") {
        if (running) pause(); else start();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [current, selectedId, submit, skip, pause, start, running]);

  const lowTime = secondsLeft <= 10;

  if (!validQuestions.length) {
    return (
      <Card className="p-6">
        <div className="font-semibold">Blitz Mode</div>
        <p className="text-sm text-muted-foreground mt-2">
          No questions provided. Pass a non-empty array of questions to start.
        </p>
      </Card>
    );
  }

  if (showResults) {
    const last = loadJSON<BlitzResult | null>(sessionKey, null);
    return (
      <BlitzResults
        result={last ?? {
          playedAt: new Date().toISOString(),
          durationSec,
          totalAnswered: answeredCount,
          totalCorrect: correctCount,
          accuracy,
        }}
        onRestart={begin}
      />
    );
  }

  return (
    <Card className="p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-xl border px-2.5 py-1 text-xs">
            Q{idx + 1}
          </span>
          <span className="text-xs text-muted-foreground">
            Answered: {answeredCount} • Correct: {correctCount} • Acc: {Math.round(accuracy * 100)}%
          </span>
        </div>
        <div
          className={[
            "inline-flex items-center justify-center rounded-2xl px-3 py-1.5 text-sm font-semibold",
            lowTime ? "bg-red-600 text-white" : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
          ].join(" ")}
          aria-live={lowTime ? "assertive" : "off"}
        >
          ⏱ {Math.floor(secondsLeft)}s
        </div>
      </div>

      {/* Prompt */}
      <div className="mt-4 text-lg font-medium">{current.prompt}</div>

      {/* Choices */}
      <div className="mt-4 grid gap-2">
        {current.choices.map((c, i) => {
          const isSelected = selectedId === c.id;
          const state = choiceStateById[c.id] ?? "idle";
          const base =
            "w-full text-left rounded-2xl border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
          const visual =
            state === "correct"
              ? "bg-green-100 border-green-400"
              : state === "wrong"
              ? "bg-red-100 border-red-400"
              : isSelected
              ? "border-blue-500 ring-1 ring-blue-500"
              : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50";
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${i + 1}: ${c.text}`}
              className={`${base} ${visual}`}
              onClick={() => setSelectedId(c.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  setSelectedId(c.id);
                  e.preventDefault();
                }
              }}
            >
              <span className="text-sm font-medium mr-2">{i + 1}.</span>
              <span className="text-sm">{c.text}</span>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          disabled={!selectedId || !running}
          onClick={() => submit()}
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
        >
          Submit (Enter)
        </button>
        <button
          type="button"
          onClick={skip}
          disabled={!running}
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium border hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Skip (N)
        </button>
        <div className="ml-auto inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => (running ? pause() : start())}
            className="inline-flex items-center justify-center rounded-2xl px-3 py-1.5 text-sm font-medium border hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            aria-pressed={running}
          >
            {running ? "Pause (P)" : "Resume (P)"}
          </button>
          <button
            type="button"
            onClick={finalize}
            className="inline-flex items-center justify-center rounded-2xl px-3 py-1.5 text-sm font-medium border hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            End
          </button>
        </div>
      </div>

      {/* Footer: Next up + explainer */}
      <div className="mt-4 text-xs text-muted-foreground">
        Next up: <span className="font-medium">{truncate(nextUp?.prompt ?? "", 64)}</span>
      </div>
    </Card>
  );
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function shuffle(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}


