import { useEffect, useRef, useState } from "react";
import QuickfireGame from "./QuickfireGame";
import { sampleMCQ } from "./sample";

export default function QuickfireFAB() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed z-50 bottom-5 right-5 px-4 py-3 rounded-full shadow-lg border bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Start Quickfire quiz"
        title="Start Quickfire (5 in 25s)"
      >
        Start Quiz
      </button>

      {/* Lightweight modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Quickfire quiz"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg md:text-xl font-bold">Quickfire (5 in 25s)</h2>
              <button
                ref={closeBtnRef}
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Close
              </button>
            </div>
            <div className="p-4 md:p-6">
              <QuickfireGame
                questions={sampleMCQ}
                totalQuestions={5}
                totalSeconds={25}
                revealDelayMs={600}
                onExit={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}



