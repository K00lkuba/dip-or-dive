import React from "react";

type ProgressPillProps = { known: number; total: number; className?: string };

export function ProgressPill({ known, total, className = "" }: ProgressPillProps) {
  const pct = total > 0 ? (known / total) * 100 : 0;
  const tone =
    total === 0
      ? "bg-gray-200 text-gray-700"
      : pct >= 80
      ? "bg-emerald-100 text-emerald-800"
      : pct >= 50
      ? "bg-amber-100 text-amber-800"
      : "bg-blue-100 text-blue-800";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
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


