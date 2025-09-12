import React from "react";

type Props = React.PropsWithChildren<{ className?: string }>;

export default function Card({ className, children }: Props) {
  return (
    <div
      className={
        "rounded-2xl shadow-lg border border-black/5 bg-white text-slate-900 " +
        (className ?? "")
      }
    >
      {children}
    </div>
  );
}


