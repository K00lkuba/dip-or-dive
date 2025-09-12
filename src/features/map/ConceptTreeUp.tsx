import React, { useEffect, useMemo, useState } from "react";
import type { Topic } from "./types";
import ProgressPill from "./ProgressPill";

/** ---------- Shared state (same namespace as other views) ---------- */
const NS = "dod:conceptmap:";
type KnownMap = Record<string, boolean>;
type CollapsedMap = Record<string, boolean>;
const load = <T,>(k: string, f: T): T => {
  try {
    const v = window.localStorage.getItem(NS + k);
    return v ? (JSON.parse(v) as T) : f;
  } catch {
    return f;
  }
};
const save = (k: string, v: unknown) => {
  try {
    window.localStorage.setItem(NS + k, JSON.stringify(v));
  } catch {}
};

function useKnown(mapId: string) {
  const [known, setKnown] = useState<KnownMap>(() => load(`${mapId}:known`, {} as KnownMap));
  useEffect(() => save(`${mapId}:known`, known), [mapId, known]);
  const toggle = (id: string) => setKnown((k) => ({ ...k, [id]: !k[id] }));
  return { known, toggle };
}
function useCollapsed(mapId: string, startExpanded: boolean) {
  const [collapsed, setCollapsed] = useState<CollapsedMap>(() =>
    load(`${mapId}:collapsed`, {} as CollapsedMap)
  );
  useEffect(() => save(`${mapId}:collapsed`, collapsed), [mapId, collapsed]);
  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  const ensureDefault = (id: string) =>
    setCollapsed((c) => (id in c ? c : { ...c, [id]: !startExpanded }));
  return { collapsed, toggle, ensureDefault };
}

/** ---------- Visible tree (respects collapsed) ---------- */
type NodeKind = "topic" | "subtopic" | "card";
type TreeNode = { id: string; label: string; kind: NodeKind; depth: number; children: TreeNode[] };

function visibleTree(topics: Topic[], collapsed: CollapsedMap): TreeNode[] {
  return topics.map((t) => {
    const tNode: TreeNode = { id: t.id, label: t.title, kind: "topic", depth: 0, children: [] };
    if (!(collapsed[t.id] ?? false)) {
      tNode.children = t.subtopics.map((s) => {
        const sNode: TreeNode = {
          id: s.id,
          label: s.title,
          kind: "subtopic",
          depth: 1,
          children: [],
        };
        if (!(collapsed[s.id] ?? false)) {
          sNode.children = s.cards.map((c) => ({
            id: c.id,
            label: c.title,
            kind: "card",
            depth: 2,
            children: [],
          }));
        }
        return sNode;
      });
    }
    return tNode;
  });
}

/** ---------- Bottom-up layout (post-order), then organic paths ---------- */
type Positioned = TreeNode & { xUnit: number; x: number; y: number; parentId?: string };

function layoutBottomUp(roots: TreeNode[], width: number, height: number) {
  const flat: Positioned[] = [];
  const byId = new Map<string, Positioned>();
  let nextX = 0;

  const visit = (n: TreeNode, parentId?: string): Positioned => {
    const kids = n.children.map((c) => visit(c, n.id));
    let xUnit: number;
    if (kids.length === 0) xUnit = nextX++;
    else {
      const minX = Math.min(...kids.map((k) => k.xUnit));
      const maxX = Math.max(...kids.map((k) => k.xUnit));
      xUnit = (minX + maxX) / 2;
    }
    const p: Positioned = { ...n, xUnit, x: 0, y: 0, parentId };
    flat.push(p);
    byId.set(p.id, p);
    return p;
  };
  roots.forEach((r) => visit(r));

  const padX = 40;
  const padY = 60;
  const unitGap = 230; // horizontal spacing between leaf columns
  const levelGap = 150; // vertical spacing
  const minX = Math.min(...flat.map((n) => n.xUnit));
  const maxX = Math.max(...flat.map((n) => n.xUnit));
  const span = Math.max(1, maxX - minX);
  const canvasWidth = Math.max(width, padX * 2 + span * unitGap + 1);
  const canvasHeight = Math.max(height, padY * 2 + 2 * levelGap + 1);

  flat.forEach((n) => {
    n.x = padX + (n.xUnit - minX) * unitGap;
    // Bottom-up: topics lowest, then subtopics, then cards
    n.y = canvasHeight - padY - n.depth * levelGap;
  });

  const links = flat
    .filter((n) => n.parentId)
    .map((n) => ({ from: byId.get(n.parentId!)!, to: n }));

  return { nodes: flat, links, canvasWidth, canvasHeight };
}

/** ---------- Organic path helpers (deterministic jitter) ---------- */
function hashPair(a: string, b: string) {
  let h = 2166136261 >>> 0;
  const s = `${a}→${b}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rand01(seed: number) {
  // xorshift
  let x = seed || 1;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return ((x >>> 0) % 10000) / 10000;
}
function jitter(seed: number, amp: number) {
  return (rand01(seed) * 2 - 1) * amp;
}

/** Build an organic cubic Bézier from parent→child with asymmetric bends */
function organicPath(
  from: Positioned,
  to: Positioned,
  opts?: { seed?: number; lift?: number; sway?: number }
) {
  const seed = opts?.seed ?? hashPair(from.id, to.id);
  const cx = (from.x + to.x) / 2 + jitter(seed + 1, opts?.sway ?? 70);
  const liftParent = 80 + Math.abs(jitter(seed + 2, 40));
  const liftChild = 80 + Math.abs(jitter(seed + 3, 40));

  // Start/end anchors roughly inside node boxes
  const x1 = from.x + 150; // ~center-right of node box (300 width assumption)
  const y1 = from.y - 10;
  const x2 = to.x + 10; // near left of child box
  const y2 = to.y + 28;

  const c1x = cx + jitter(seed + 4, 18);
  const c1y = y1 - liftParent;
  const c2x = cx + jitter(seed + 5, 18);
  const c2y = y2 + liftChild;

  return `M ${x1},${y1} C ${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;
}

/** ---------- Visual nodes ---------- */
function Caret({ open }: { open: boolean }) {
  return (
    <svg
      className={["h-4 w-4 transition-transform duration-200", open ? "rotate-90" : ""].join(" ")}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 5l6 5-6 5V5z" />
    </svg>
  );
}

function NodeBox({
  n,
  known,
  collapsed,
  onToggleKnown,
  onToggleCollapsed,
}: {
  n: Positioned;
  known: KnownMap;
  collapsed: CollapsedMap;
  onToggleKnown: (id: string) => void;
  onToggleCollapsed: (id: string) => void;
}) {
  const base =
    "rounded-2xl border shadow-sm px-3 py-2 max-w-[320px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100";

  if (n.kind === "card") {
    const isKnown = !!known[n.id];
    return (
      <button
        onClick={() => onToggleKnown(n.id)}
        className={[
          base,
          "text-left text-[13px] md:text-sm hover:shadow transition",
          isKnown
            ? "border-emerald-600 ring-1 ring-emerald-300"
            : "border-slate-200 dark:border-slate-700",
        ].join(" ")}
        aria-pressed={isKnown}
        title={isKnown ? "Known — click to mark unknown" : "Unknown — click to mark known"}
      >
        <span className="inline-flex items-center gap-2">
          <span
            className={[
              "inline-block h-2.5 w-2.5 rounded-full",
              isKnown ? "bg-emerald-500" : "bg-slate-400",
            ].join(" ")}
            aria-hidden="true"
          />
          {n.label}
        </span>
      </button>
    );
  }

  const isCollapsed = collapsed[n.id] ?? false;
  const headGrad =
    n.kind === "topic"
      ? "from-emerald-50 to-white dark:from-slate-800 dark:to-slate-900"
      : "from-sky-50 to-white dark:from-slate-800 dark:to-slate-900";

  return (
    <div
      className={[
        base,
        "bg-gradient-to-t",
        headGrad,
        "border-slate-200 dark:border-slate-700",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => onToggleCollapsed(n.id)}
          className="inline-flex items-center gap-2 text-left hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
          aria-expanded={!isCollapsed}
        >
          <Caret open={!isCollapsed} />
          <span className={n.kind === "topic" ? "font-semibold" : "font-medium"}>{n.label}</span>
        </button>
        <ProgressBadge id={n.id} kind={n.kind} />
      </div>
    </div>
  );
}

/** Progress for topic/subtopic nodes */
const ProgressCtx = React.createContext<{ get: (id: string) => { known: number; total: number } } | null>(null);
function useProgress(topics: Topic[], known: KnownMap) {
  return useMemo(() => {
    const map = new Map<string, { known: number; total: number }>();
    for (const t of topics) {
      let tKnown = 0,
        tTotal = 0;
      for (const s of t.subtopics) {
        const sTotal = s.cards.length;
        const sKnown = s.cards.reduce((a, c) => a + (known[c.id] ? 1 : 0), 0);
        map.set(s.id, { known: sKnown, total: sTotal });
        tKnown += sKnown;
        tTotal += sTotal;
      }
      map.set(t.id, { known: tKnown, total: tTotal });
    }
    return { get: (id: string) => map.get(id) ?? { known: 0, total: 0 } };
  }, [topics, known]);
}
function ProgressBadge({ id, kind }: { id: string; kind: NodeKind }) {
  const ctx = React.useContext(ProgressCtx);
  if (!ctx || kind === "card") return null;
  const { known, total } = ctx.get(id);
  return <ProgressPill known={known} total={total} />;
}

/** ---------- Main bottom-up organic tree ---------- */
export default function ConceptTreeUp({
  topics,
  mapId = "default",
  startExpanded = true,
  height = 720,
  width = 1200,
}: {
  topics: Topic[];
  mapId?: string;
  startExpanded?: boolean;
  height?: number;
  width?: number;
}) {
  const { known, toggle: toggleKnown } = useKnown(mapId);
  const { collapsed, toggle: toggleCollapsed, ensureDefault } = useCollapsed(mapId, startExpanded);
  const progress = useProgress(topics, known);

  // Ensure defaults for nodes
  useEffect(() => {
    topics.forEach((t) => {
      ensureDefault(t.id);
      t.subtopics.forEach((s) => ensureDefault(s.id));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics]);

  const vis = useMemo(() => visibleTree(topics, collapsed), [topics, collapsed]);
  const { nodes, links, canvasWidth, canvasHeight } = useMemo(
    () => layoutBottomUp(vis, width, height),
    [vis, width, height]
  );

  // Topic nodes (trunks)
  const topicNodes = nodes.filter((n) => n.kind === "topic");

  return (
    <ProgressCtx.Provider value={progress}>
      <div className="relative w-full overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-t from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div
          className="relative"
          style={{ width: canvasWidth, height: canvasHeight }}
          role="group"
          aria-label="Bottom-up concept tree (organic)"
        >
          {/* Branch gradients & glow */}
          <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="branchGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
                <stop offset="100%" stopColor="#60a5fa" /> {/* blue-400 */}
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ground */}
            <rect
              x="0"
              y={canvasHeight - 26}
              width={canvasWidth}
              height="26"
              className="fill-emerald-600/40"
            />

            {/* Trunks from ground to each topic */}
            {topicNodes.map((t) => {
              const x = t.x + 150;
              const yTop = t.y + 30;
              const yGround = canvasHeight - 26;
              const d = `M ${x},${yGround} C ${x - 40},${yGround - 60} ${x - 20},${yTop + 60} ${x},${yTop}`;
              return (
                <path
                  key={`trunk-${t.id}`}
                  d={d}
                  stroke="url(#branchGrad)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#softGlow)"
                  className="opacity-90"
                />
              );
            })}

            {/* Branches: topic→subtopic thicker; subtopic→card thinner, with organic jitter */}
            {links.map(({ from, to }) => {
              const seed = hashPair(from.id, to.id);
              const d = organicPath(from, to, { seed, sway: from.kind === "topic" ? 80 : 60 });
              const thick = from.kind === "topic" ? 5.5 : 3.5;

              // Soft underglow path
              return (
                <g key={`${from.id}->${to.id}`}>
                  <path
                    d={d}
                    stroke="#94a3b8" /* slate-400 shadow */
                    strokeWidth={thick + 1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.25"
                  />
                  <path
                    d={d}
                    stroke="url(#branchGrad)"
                    strokeWidth={thick}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    filter="url(#softGlow)"
                    className="opacity-95"
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes above the SVG so they sit on branches */}
          {nodes.map((n) => (
            <div
              key={n.id}
              className="absolute"
              style={{ left: n.x, top: n.y, transform: "translate(-12px,-18px)" }}
            >
              <NodeBox
                n={n}
                known={known}
                collapsed={collapsed}
                onToggleKnown={toggleKnown}
                onToggleCollapsed={toggleCollapsed}
              />
            </div>
          ))}
        </div>
      </div>
    </ProgressCtx.Provider>
  );
}
