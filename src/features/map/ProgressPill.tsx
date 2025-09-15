import React from "react";

interface ProgressPillProps {
  known: number;
  total: number;
  className?: string;
}

export default function ProgressPill({ known, total, className = "" }: ProgressPillProps) {
  const percentage = total > 0 ? Math.round((known / total) * 100) : 0;
  
  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return "bg-emerald-500 text-white";
    if (percentage >= 75) return "bg-blue-500 text-white";
    if (percentage >= 50) return "bg-yellow-500 text-black";
    if (percentage >= 25) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getProgressColor(percentage)} ${className}`}>
      <span className="text-[10px]">{known}/{total}</span>
      <span className="text-[10px] opacity-75">({percentage}%)</span>
    </div>
  );
}

