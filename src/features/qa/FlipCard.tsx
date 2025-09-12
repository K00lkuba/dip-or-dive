import React from "react";
import Card from "../../components/ui/Card";

export interface FlipCardProps {
  question: string;
  answer: string;
  className?: string;
}

export default function FlipCard({ question, answer, className }: FlipCardProps) {
  const [flipped, setFlipped] = React.useState(false);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((v) => !v);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? "Show question" : "Show answer"}
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={onKeyDown}
      className={
        "outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-2xl " +
        (className ?? "")
      }
    >
      <div className="w-80 h-52 [perspective:1000px]">
        <Card
          className={
            "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] " +
            (flipped ? "[transform:rotateY(180deg)]" : "")
          }
        >
          {/* Front */}
          <div className="absolute inset-0 grid place-items-center p-5 [backface-visibility:hidden] rounded-2xl">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Question
              </div>
              <div className="text-base leading-snug">{question}</div>
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 grid place-items-center p-5 rounded-2xl bg-slate-900 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wide/loose text-white/80 mb-1">
                Answer
              </div>
              <div className="text-base leading-snug">{answer}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


