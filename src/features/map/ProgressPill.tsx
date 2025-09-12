import React from "react";

type ProgressPillProps = { known: number; total: number; className?: string };

export function ProgressPill({ known, total, className = "" }: ProgressPillProps) {
  const pct = total > 0 ? (known / total) * 100 : 0;
  const tone =
    total === 0
      ? "bg-slate-200 text-slate-700 border-slate-300"
      : pct >= 80
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : pct >= 50
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-rose-100 text-rose-700 border-rose-200";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        "border shadow-sm",
        tone,
        className,
      ].join(" ")}
      aria-label={`Progress ${known} of ${total}`}
    >
      {known}/{total}
    </span>
  );
}

export default ProgressPill;


