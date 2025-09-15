import React, { useEffect, useMemo, useState } from "react";
import type { Topic, Subtopic } from "./types";
import ProgressPill from "./ProgressPill";

/** Shared state (same namespace as other views) */
const NS = "dod:conceptmap:";
type KnownMap = Record<string, boolean>;
const load = <T,>(k: string, f: T): T => {
  try { const v = window.localStorage.getItem(NS + k); return v ? (JSON.parse(v) as T) : f; } catch { return f; }
};
const save = (k: string, v: unknown) => { try { window.localStorage.setItem(NS + k, JSON.stringify(v)); } catch {} };

function useKnown(mapId: string) {
  const [known, setKnown] = useState<KnownMap>(() => load(`${mapId}:known`, {} as KnownMap));
  useEffect(() => save(`${mapId}:known`, known), [mapId, known]);
  const toggle = (id: string) => setKnown((k) => ({ ...k, [id]: !k[id] }));
  return { known, toggle };
}

/** Data shaping: take all subtopics from all topics */
function flattenSubtopics(topics: Topic[]): Array<{ topicId: string; sub: Subtopic }> {
  const out: Array<{ topicId: string; sub: Subtopic }> = [];
  for (const t of topics) for (const s of t.subtopics) out.push({ topicId: t.id, sub: s });
  return out;
}

export default function ConceptMap({
  topics,
  mapId = "default",
  startExpanded = false,
}: {
  topics: Topic[];
  mapId?: string;
  startExpanded?: boolean;
}) {
  const { known, toggle: toggleKnown } = useKnown(mapId);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    topics.reduce((acc, topic) => ({ ...acc, [topic.id]: startExpanded }), {})
  );
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<string, boolean>>({});

  const subs = useMemo(() => flattenSubtopics(topics), [topics]);
  
  const subProgress = useMemo(() => {
    const m = new Map<string, { known: number; total: number }>();
    for (const { sub } of subs) {
      const total = sub.cards.length;
      const k = sub.cards.reduce((acc, c) => acc + (known[c.id] ? 1 : 0), 0);
      m.set(sub.id, { known: k, total });
    }
    const t = new Map<string, { known: number; total: number }>();
    for (const topic of topics) {
      let K = 0, T = 0;
      for (const s of topic.subtopics) { const sp = m.get(s.id) || { known: 0, total: s.cards.length }; K += sp.known; T += sp.total; }
      t.set(topic.id, { known: K, total: T });
    }
    return { bySub: m, byTopic: t };
  }, [subs, topics, known]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleSubtopic = (subtopicId: string) => {
    setExpandedSubtopics(prev => ({ ...prev, [subtopicId]: !prev[subtopicId] }));
  };

  return (
    <div className="space-y-4">
      {topics.map((topic) => {
        const isExpanded = expandedTopics[topic.id];
        const topicProgress = subProgress.byTopic.get(topic.id) || { known: 0, total: 0 };
        
        return (
          <div key={topic.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            {/* Topic Header */}
            <button
              onClick={() => toggleTopic(topic.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isExpanded ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isExpanded && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{topic.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <ProgressPill known={topicProgress.known} total={topicProgress.total} />
                <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Subtopic List */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-2">
                {topic.subtopics.map((subtopic) => {
                  const isSubExpanded = expandedSubtopics[subtopic.id];
                  const subtopicProgress = subProgress.bySub.get(subtopic.id) || { known: 0, total: subtopic.cards.length };
                  
                  return (
                    <div key={subtopic.id} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      {/* Subtopic Header */}
                      <button
                        onClick={() => toggleSubtopic(subtopic.id)}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
                        aria-expanded={isSubExpanded}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSubExpanded ? 'border-blue-500 bg-blue-500' : 'border-slate-400 dark:border-slate-500'
                          }`}>
                            {isSubExpanded && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <h3 className="font-medium text-slate-800 dark:text-slate-200">{subtopic.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <ProgressPill known={subtopicProgress.known} total={subtopicProgress.total} />
                          <div className={`transform transition-transform ${isSubExpanded ? 'rotate-90' : ''}`}>
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {/* Cards List */}
                      {isSubExpanded && (
                        <div className="px-3 pb-3 space-y-2">
                          {subtopic.cards.map((card) => {
                            const isKnown = !!known[card.id];
                            return (
                              <div key={card.id} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-600 p-2 bg-white dark:bg-slate-900">
                                <span className="text-sm text-slate-700 dark:text-slate-300">{card.title}</span>
                                <button
                                  onClick={() => toggleKnown(card.id)}
                                  className={`ml-3 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                                    isKnown 
                                      ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700" 
                                      : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                                  }`}
                                  aria-pressed={isKnown}
                                >
                                  {isKnown ? "Known" : "Mark Known"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

