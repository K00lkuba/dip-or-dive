import React from "react";
import { FlipCard } from ".";
import type { QAItem } from "./types";

export default function CardsGrid({ items }: { items: QAItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((it) => (
        <FlipCard key={it.id} question={it.question} answer={it.answer} />
      ))}
    </div>
  );
}


