import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { Topic, Subtopic, CardItem } from "./types";
import ProgressPill from "./ProgressPill";

/** Minimal, safe localStorage helpers (no external deps) */
const ns = "dod:conceptmap:";
const load = <T,>(key: string, fallback: T): T => {
  try {
    const v = window.localStorage.getItem(ns + key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(ns + key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
};

type KnownMap = Record<string, boolean>;
type CollapsedMap = Record<string, boolean>;

export type ConceptMapProps = {
  topics: Topic[];
  /** namespace to separate multiple maps’ state */
  mapId?: string;
  /** start with topics expanded? default: true */
  startExpanded?: boolean;
};

function useKnown(mapId: string) {
  const [known, setKnown] = useState<KnownMap>(() => load<KnownMap>(`${mapId}:known`, {}));
  useEffect(() => save(`${mapId}:known`, known), [mapId, known]);
  const toggle = useCallback((cardId: string) => {
    setKnown((k) => ({ ...k, [cardId]: !k[cardId] }));
  }, []);
  const set = useCallback((cardId: string, val: boolean) => {
    setKnown((k) => ({ ...k, [cardId]: val }));
  }, []);
  return { known, toggle, set };
}

function useCollapsed(mapId: string, startExpanded: boolean) {
  const [collapsed, setCollapsed] = useState<CollapsedMap>(() =>
    load<CollapsedMap>(`${mapId}:collapsed`, {})
  );
  useEffect(() => save(`${mapId}:collapsed`, collapsed), [mapId, collapsed]);
  const toggle = useCallback((id: string) => {
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  }, []);
  const ensureDefault = useCallback(
    (id: string) => {
      setCollapsed((c) => (id in c ? c : { ...c, [id]: !startExpanded }));
    },
    [startExpanded]
  );
  return { collapsed, toggle, ensureDefault };
}

/** Aggregate progress for a subtree */
function countCards(subtopics: Subtopic[]) {
  let total = 0;
  for (const st of subtopics) total += st.cards.length;
  return total;
}
function countKnownInSubtopics(subtopics: Subtopic[], known: KnownMap) {
  let knownCount = 0;
  for (const st of subtopics) for (const c of st.cards) if (known[c.id]) knownCount++;
  return knownCount;
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      className={[
        "h-4 w-4 transition-transform duration-200",
        open ? "rotate-90" : "rotate-0",
      ].join(" ")}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 5l6 5-6 5V5z" />
    </svg>
  );
}

function CardRow({
  card,
  isKnown,
  onToggle,
}: {
  card: CardItem;
  isKnown: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50 dark:hover:bg-gray-800/40">
      <span className="text-sm md:text-base">{card.title}</span>
      <button
        onClick={onToggle}
        className={[
          "ml-3 inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs md:text-sm",
          isKnown
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        ].join(" ")}
        aria-pressed={isKnown}
        aria-label={isKnown ? "Mark unknown" : "Mark known"}
        title={isKnown ? "Known — click to mark unknown" : "Unknown — click to mark known"}
      >
        {isKnown ? "Known" : "Mark Known"}
      </button>
    </li>
  );
}

function SubtopicNode({
  sub,
  known,
  onToggleKnown,
  collapsed,
  onToggleCollapsed,
  ensureDefaultCollapsed,
}: {
  sub: Subtopic;
  known: KnownMap;
  onToggleKnown: (cardId: string) => void;
  collapsed: CollapsedMap;
  onToggleCollapsed: (id: string) => void;
  ensureDefaultCollapsed: (id: string) => void;
}) {
  const total = sub.cards.length;
  const knownCount = sub.cards.reduce((acc, c) => acc + (known[c.id] ? 1 : 0), 0);
  const isCollapsed = collapsed[sub.id] ?? false;
  useEffect(() => ensureDefaultCollapsed(sub.id), [ensureDefaultCollapsed, sub.id]);

  const panelId = `sub-${sub.id}-panel`;

  return (
    <li className="rounded-2xl border">
      <button
        onClick={() => onToggleCollapsed(sub.id)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={!isCollapsed}
        aria-controls={panelId}
      >
        <span className="inline-flex items-center gap-2">
          <Caret open={!isCollapsed} />
          <span className="font-medium">{sub.title}</span>
        </span>
        <ProgressPill known={knownCount} total={total} />
      </button>
      <div id={panelId} role="region" hidden={isCollapsed} className="px-4 pb-4">
        <ul className="mt-2 space-y-2">
          {sub.cards.map((c) => (
            <CardRow
              key={c.id}
              card={c}
              isKnown={!!known[c.id]}
              onToggle={() => onToggleKnown(c.id)}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}

function TopicNode({
  topic,
  known,
  onToggleKnown,
  collapsed,
  onToggleCollapsed,
  ensureDefaultCollapsed,
}: {
  topic: Topic;
  known: KnownMap;
  onToggleKnown: (cardId: string) => void;
  collapsed: CollapsedMap;
  onToggleCollapsed: (id: string) => void;
  ensureDefaultCollapsed: (id: string) => void;
}) {
  const total = countCards(topic.subtopics);
  const knownCount = countKnownInSubtopics(topic.subtopics, known);
  const isCollapsed = collapsed[topic.id] ?? false;
  useEffect(() => ensureDefaultCollapsed(topic.id), [ensureDefaultCollapsed, topic.id]);

  const panelId = `top-${topic.id}-panel`;

  return (
    <li className="rounded-2xl border bg-white/90 dark:bg-gray-900/80">
      <button
        onClick={() => onToggleCollapsed(topic.id)}
        className="w-full flex items-center justify-between px-4 py-3 text-left rounded-t-2xl"
        aria-expanded={!isCollapsed}
        aria-controls={panelId}
      >
        <span className="inline-flex items-center gap-2">
          <Caret open={!isCollapsed} />
          <span className="text-lg font-semibold">{topic.title}</span>
        </span>
        <ProgressPill known={knownCount} total={total} />
      </button>
      <div id={panelId} role="region" hidden={isCollapsed} className="px-4 pb-4">
        <ul className="mt-2 space-y-3">
          {topic.subtopics.map((st) => (
            <SubtopicNode
              key={st.id}
              sub={st}
              known={known}
              onToggleKnown={onToggleKnown}
              collapsed={collapsed}
              onToggleCollapsed={onToggleCollapsed}
              ensureDefaultCollapsed={ensureDefaultCollapsed}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function ConceptMap({ topics, mapId = "default", startExpanded = true }: ConceptMapProps) {
  const { known, toggle: toggleKnown } = useKnown(mapId);
  const { collapsed, toggle: toggleCollapsed, ensureDefault } = useCollapsed(mapId, startExpanded);

  // keyboard hint: expand/collapse all
  const [allOpen, setAllOpen] = useState(startExpanded);
  const totalCards = useMemo(
    () => topics.reduce((acc, t) => acc + countCards(t.subtopics), 0),
    [topics]
  );
  const knownCards = useMemo(
    () => topics.reduce((acc, t) => acc + countKnownInSubtopics(t.subtopics, known), 0),
    [topics, known]
  );

  const resetProgress = () => {
    // wipe known only for this mapId
    save(`${mapId}:known`, {});
    window.location.reload();
  };

  const expandAll = (open: boolean) => {
    const next: CollapsedMap = {};
    const visit = (t: Topic) => {
      next[t.id] = !open;
      t.subtopics.forEach((st) => {
        next[st.id] = !open;
      });
    };
    topics.forEach(visit);
    save(`${mapId}:collapsed`, next);
    setAllOpen(open);
    window.location.reload();
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Concept Map</h1>
        <div className="flex items-center gap-2">
          <ProgressPill known={knownCards} total={totalCards} />
          <button
            onClick={() => expandAll(true)}
            className="rounded-lg border px-2.5 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Expand all"
          >
            Expand all
          </button>
          <button
            onClick={() => expandAll(false)}
            className="rounded-lg border px-2.5 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Collapse all"
          >
            Collapse all
          </button>
          <button
            onClick={resetProgress}
            className="rounded-lg border px-2.5 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Reset progress
          </button>
        </div>
      </header>

      <ul className="space-y-4">
        {topics.map((t) => (
          <TopicNode
            key={t.id}
            topic={t}
            known={known}
            onToggleKnown={toggleKnown}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
            ensureDefaultCollapsed={ensureDefault}
          />
        ))}
      </ul>
    </section>
  );
}


