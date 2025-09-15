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

/** Math helpers for trunk/branch geometry */
type Pt = { x: number; y: number };
function bezierPoint(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const x = u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x;
  const y = u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y;
  return { x, y };
}
function bezierTangent(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const x = 3*u*u*(p1.x - p0.x) + 6*u*t*(p2.x - p1.x) + 3*t*t*(p3.x - p2.x);
  const y = 3*u*u*(p1.y - p0.y) + 6*u*t*(p2.y - p1.y) + 3*t*t*(p3.y - p2.y);
  return { x, y };
}
function norm(v: Pt): number { return Math.hypot(v.x, v.y) || 1; }
function normal(v: Pt, side: 1 | -1): Pt {
  const nrm = norm(v);
  return { x: side * (-v.y / nrm), y: side * (v.x / nrm) };
}
function hash(s: string): number { let h = 2166136261 >>> 0; for (let i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h = Math.imul(h,16777619);} return h>>>0; }
function rand(seed: number): number { let x = seed || 1; x ^= x<<13; x ^= x>>>17; x ^= x<<5; return ((x>>>0)%10000)/10000; }
function j(seed: number, amp: number): number { return (rand(seed)*2-1)*amp; }

/** Color palette for leaves (pleasant accents) */
const LEAF_COLORS = [
  { bg: "#60a5fa", txt: "white" }, // blue-400
  { bg: "#34d399", txt: "white" }, // emerald-400
  { bg: "#f59e0b", txt: "black" }, // amber-500
  { bg: "#ef4444", txt: "white" }, // red-500
  { bg: "#a78bfa", txt: "white" }, // violet-400
  { bg: "#f97316", txt: "black" }, // orange-500
  { bg: "#22c55e", txt: "white" }, // green-500
  { bg: "#06b6d4", txt: "white" }, // cyan-500
];

/** Main component */
export default function ConceptTreeInfographic({
  topics,
  mapId = "default",
  height = 720,
  width = 1200,
}: {
  topics: Topic[];
  mapId?: string;
  height?: number;
  width?: number;
}) {
  const { known, toggle: toggleKnown } = useKnown(mapId);

  // Flatten subtopics and compute progress per subtopic/topic
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

  /** Layout: one big trunk + branches that fan outward.
      We sample the trunk with ts across [0.22 .. 0.92] and alternate sides. */
  const padX = 48, padY = 56;
  const W = Math.max(width, 900), H = Math.max(height, 600);
  const trunk: [Pt, Pt, Pt, Pt] = [
    { x: W * 0.15, y: H - padY },   // start (ground left)
    { x: W * 0.28, y: H * 0.60 },   // control1
    { x: W * 0.45, y: H * 0.42 },   // control2
    { x: W * 0.58, y: H * 0.18 },   // end (upper mid-right)
  ];

  // precompute branch sockets along trunk
  const nLeaves = subs.length || 1;
  const tMin = 0.22, tMax = 0.92;
  const step = (tMax - tMin) / Math.max(nLeaves, 1);
  const sockets = subs.map(({ sub }, i) => {
    const t = tMin + step * (i + 0.5);
    const p = bezierPoint(...trunk, t);
    const tang = bezierTangent(...trunk, t);
    const side: 1 | -1 = (i % 2 === 0 ? 1 : -1);
    const n = normal(tang, side);
    const seed = hash(sub.id);
    const branchLen = 180 + j(seed + 1, 40);
    const anchor: Pt = { x: p.x + j(seed + 2, 8), y: p.y + j(seed + 3, 8) };
    const leafCenter: Pt = { x: anchor.x + n.x * branchLen, y: anchor.y + n.y * branchLen + j(seed + 4, 10) };
    const elbow: Pt = { x: anchor.x + n.x * (branchLen * 0.55) + j(seed + 5, 22), y: anchor.y + n.y * (branchLen * 0.55) + j(seed + 6, 16) };
    return { subId: sub.id, anchor, elbow, leafCenter, side, t, seed };
  });

  // Leaf details drawer
  const [openSub, setOpenSub] = useState<string | null>(null);
  const open = (id: string) => setOpenSub(id);
  const close = () => setOpenSub(null);

  return (
    <div className="relative w-full overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="relative" style={{ width: W, height: H }}>
        {/* SVG: trunk + branches */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id="leafLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />  {/* emerald-500 */}
              <stop offset="100%" stopColor="#60a5fa" /> {/* blue-400 */}
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Ground */}
          <rect x="0" y={H - 26} width={W} height="26" className="fill-emerald-700/35" />

          {/* Trunk (brownish) */}
          <path
            d={`M ${trunk[0].x},${trunk[0].y} C ${trunk[1].x},${trunk[1].y} ${trunk[2].x},${trunk[2].y} ${trunk[3].x},${trunk[3].y}`}
            stroke="#7c5f46" /* a warm bark color */
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#glow)"
            opacity="0.95"
          />

          {/* Branches */}
          {sockets.map((s, i) => {
            const thick = 7; // main branches
            const d = `M ${s.anchor.x},${s.anchor.y} C ${s.elbow.x},${s.elbow.y} ${s.leafCenter.x - s.side*40},${s.leafCenter.y + 0} ${s.leafCenter.x - s.side*12},${s.leafCenter.y}`;
            return (
              <g key={`b-${s.subId}`}>
                <path d={d} stroke="#93c5fd" strokeWidth={thick + 2} strokeLinecap="round" fill="none" opacity="0.25" />
                <path d={d} stroke="url(#leafLine)" strokeWidth={thick} strokeLinecap="round" fill="none" filter="url(#glow)" />
              </g>
            );
          })}
        </svg>

        {/* HTML leaves & labels (for easy interactivity + Tailwind styling) */}
        {sockets.map((s, i) => {
          const { sub } = subs[i];
          const color = LEAF_COLORS[i % LEAF_COLORS.length];
          const prog = subProgress.bySub.get(sub.id) || { known: 0, total: sub.cards.length };
          const r = 26;
          const labelSideClass = s.side === 1 ? "left-full ml-3 items-start" : "right-full mr-3 items-end";
          return (
            <div key={`leaf-${sub.id}`} className="absolute" style={{ left: s.leafCenter.x, top: s.leafCenter.y, transform: "translate(-50%,-50%)" }}>
              {/* Leaf (circle button) */}
              <button
                onClick={() => open(sub.id)}
                className="relative grid place-items-center rounded-full shadow-lg ring-2 ring-white/70 dark:ring-slate-800"
                style={{ width: r * 2, height: r * 2, background: color.bg, color: color.txt }}
                aria-label={`${sub.title} (${prog.known}/${prog.total}) — open`}
                title="Open details"
              >
                {/* tiny dot to mimic 'fruit/leaf' marker */}
                <span className="absolute w-2 h-2 rounded-full bg-white/80 top-1 right-1" />
              </button>

              {/* Label with title + progress */}
              <div className={`absolute top-1/2 -translate-y-1/2 flex ${labelSideClass} gap-2`}>
                <div className="rounded-xl border border-slate-200/80 bg-white/95 dark:bg-slate-900/95 dark:border-slate-700 px-3 py-1.5 shadow-md">
                  <div className="text-[13px] md:text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap max-w-[260px] overflow-hidden text-ellipsis">
                    {sub.title}
                  </div>
                </div>
                <ProgressPill known={prog.known} total={prog.total} />
              </div>
            </div>
          );
        })}

        {/* Details Drawer */}
        {openSub && (() => {
          const s = subs.find((x) => x.sub.id === openSub)!;
          const prog = subProgress.bySub.get(openSub)!;
          return (
            <div className="absolute top-4 right-4 z-10 w-[min(92vw,420px)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/98 dark:bg-slate-900/98 shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-slate-100">{s.sub.title}</div>
                <div className="flex items-center gap-2">
                  <ProgressPill known={prog.known} total={prog.total} />
                  <button onClick={close} className="rounded-lg border px-2.5 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Close</button>
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {s.sub.cards.map((c) => {
                    const isKnown = !!known[c.id];
                    return (
                      <li key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-white dark:bg-slate-900">
                        <span className="text-sm text-slate-800 dark:text-slate-100">{c.title}</span>
                        <button
                          onClick={() => toggleKnown(c.id)}
                          className={[
                            "ml-3 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                            isKnown ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700",
                          ].join(" ")}
                          aria-pressed={isKnown}
                        >
                          {isKnown ? "Known" : "Mark Known"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

