import React, { useEffect, useMemo, useState } from "react";
import type { Topic, Subtopic, CardItem } from "./types";
import ProgressPill from "./ProgressPill";

/** ----- Shared localStorage (same namespace as ConceptMap) ----- */
const NS = "dod:conceptmap:";
const load = <T,>(key: string, fallback: T): T => {
  try {
    const v = window.localStorage.getItem(NS + key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

type KnownMap = Record<string, boolean>;
type CollapsedMap = Record<string, boolean>;

function useKnown(mapId: string) {
  const [known, setKnown] = useState<KnownMap>(() => load<KnownMap>(`${mapId}:known`, {}));
  useEffect(() => save(`${mapId}:known`, known), [mapId, known]);
  const toggle = (id: string) => setKnown((k) => ({ ...k, [id]: !k[id] }));
  return { known, toggle };
}
function useCollapsed(mapId: string, startExpanded: boolean) {
  const [collapsed, setCollapsed] = useState<CollapsedMap>(() =>
    load<CollapsedMap>(`${mapId}:collapsed`, {})
  );
  useEffect(() => save(`${mapId}:collapsed`, collapsed), [mapId, collapsed]);
  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  const ensureDefault = (id: string) =>
    setCollapsed((c) => (id in c ? c : { ...c, [id]: !startExpanded }));
  return { collapsed, toggle, ensureDefault };
}

/** ----- Tree building & layout (left→right) ----- */
type NodeKind = "topic" | "subtopic" | "card";
type TreeNode = {
  id: string;
  label: string;
  kind: NodeKind;
  children: TreeNode[];
};

function buildTree(topics: Topic[]): TreeNode[] {
  const roots: TreeNode[] = topics.map((t) => ({
    id: t.id,
    label: t.title,
    kind: "topic",
    children: t.subtopics.map((s) => ({
      id: s.id,
      label: s.title,
      kind: "subtopic",
      children: s.cards.map((c) => ({
        id: c.id,
        label: c.title,
        kind: "card",
        children: [],
      })),
    })),
  }));
  return roots;
}

type Positioned = {
  id: string;
  label: string;
  kind: NodeKind;
  depth: number;
  x: number;
  y: number;
  parentId?: string;
};

/**
 * Simple tidy layout:
 * - depth defines column (0..n)
 * - rows per column spread evenly from top to bottom
 * - collapsed nodes don't contribute their descendants
 */
function layoutTree(
  roots: TreeNode[],
  collapsed: CollapsedMap,
  width: number,
  height: number
): { nodes: Positioned[]; links: Array<{ from: Positioned; to: Positioned }>; columns: number } {
  const visibleByDepth: Positioned[][] = [];
  const nodesById = new Map<string, Positioned>();
  const links: Array<{ from: Positioned; to: Positioned }> = [];

  // Gather visible nodes in depth buckets
  const visit = (node: TreeNode, depth: number, parentId?: string) => {
    const pos: Positioned = {
      id: node.id,
      label: node.label,
      kind: node.kind,
      depth,
      x: 0,
      y: 0,
      parentId,
    };
    nodesById.set(node.id, pos);
    if (!visibleByDepth[depth]) visibleByDepth[depth] = [];
    visibleByDepth[depth].push(pos);

    const isCollapsed = collapsed[node.id] ?? false;
    if (isCollapsed) return;
    node.children.forEach((ch) => visit(ch, depth + 1, node.id));
  };
  roots.forEach((r) => visit(r, 0));

  const columns = visibleByDepth.length;
  const colGap = Math.max(260, Math.floor(width / Math.max(columns, 1)));
  const nodeYGap = 90;
  const padX = 24;
  const padY = 40;

  // Position nodes
  visibleByDepth.forEach((bucket, depth) => {
    const usableH = Math.max(height - padY * 2, nodeYGap);
    const step = bucket.length > 1 ? usableH / (bucket.length - 1) : 0;
    bucket.forEach((n, i) => {
      n.x = padX + depth * colGap;
      n.y = padY + (bucket.length > 1 ? i * step : usableH / 2);
    });
  });

  // Build links
  nodesById.forEach((n) => {
    if (!n.parentId) return;
    const parent = nodesById.get(n.parentId);
    if (parent) links.push({ from: parent, to: n });
  });

  return { nodes: Array.from(nodesById.values()), links, columns };
}

/** ----- Node components ----- */
function NodeBox({
  node,
  known,
  onToggleKnown,
  collapsed,
  onToggleCollapsed,
}: {
  node: Positioned;
  known: KnownMap;
  onToggleKnown: (id: string) => void;
  collapsed: CollapsedMap;
  onToggleCollapsed: (id: string) => void;
}) {
  const base =
    "rounded-xl border shadow-sm px-3 py-2 max-w-[290px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100";
  if (node.kind === "card") {
    const isKnown = !!known[node.id];
    return (
      <button
        onClick={() => onToggleKnown(node.id)}
        className={[
          base,
          "text-left text-sm hover:shadow transition",
          isKnown ? "border-emerald-600 ring-1 ring-emerald-300" : "border-slate-200 dark:border-slate-700",
        ].join(" ")}
        title={isKnown ? "Known — click to mark unknown" : "Unknown — click to mark known"}
        aria-pressed={isKnown}
      >
        <span className="inline-flex items-center gap-2">
          <span
            className={[
              "inline-block h-2.5 w-2.5 rounded-full",
              isKnown ? "bg-emerald-500" : "bg-slate-400",
            ].join(" ")}
            aria-hidden="true"
          />
          {node.label}
        </span>
      </button>
    );
  }

  // topic / subtopic header with collapse toggle + progress pill
  return (
    <div
      className={[
        base,
        "bg-gradient-to-r",
        node.kind === "topic"
          ? "from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900"
          : "from-slate-50 to-white dark:from-slate-800 dark:to-slate-900",
        "border-slate-200 dark:border-slate-700",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => onToggleCollapsed(node.id)}
          className="inline-flex items-center gap-2 text-left hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
          aria-expanded={!(collapsed[node.id] ?? false)}
        >
          <Caret open={!(collapsed[node.id] ?? false)} />
          <span className={node.kind === "topic" ? "font-semibold" : "font-medium"}>{node.label}</span>
        </button>
        <ProgressForNode id={node.id} kind={node.kind} />
      </div>
    </div>
  );
}

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

/** Progress context: compute known/total bottom-up for Topic/Subtopic ids */
function useProgress(topics: Topic[], known: KnownMap) {
  const map = useMemo(() => {
    const counts = new Map<string, { known: number; total: number }>();
    for (const t of topics) {
      let tTotal = 0;
      let tKnown = 0;
      for (const s of t.subtopics) {
        let sTotal = s.cards.length;
        let sKnown = s.cards.reduce((acc, c) => acc + (known[c.id] ? 1 : 0), 0);
        counts.set(s.id, { known: sKnown, total: sTotal });
        tTotal += sTotal;
        tKnown += sKnown;
      }
      counts.set(t.id, { known: tKnown, total: tTotal });
    }
    return counts;
  }, [topics, known]);
  return {
    get: (id: string) => map.get(id) ?? { known: 0, total: 0 },
  };
}

const ProgressCtx = React.createContext<{ get: (id: string) => { known: number; total: number } } | null>(null);
function ProgressForNode({ id, kind }: { id: string; kind: NodeKind }) {
  const ctx = React.useContext(ProgressCtx);
  if (!ctx || kind === "card") return null;
  const { known, total } = ctx.get(id);
  return <ProgressPill known={known} total={total} />;
}

/** ----- Main component ----- */
export default function ConceptTree({
  topics,
  mapId = "default",
  startExpanded = true,
  height = 640,
}: {
  topics: Topic[];
  mapId?: string;
  startExpanded?: boolean;
  height?: number;
}) {
  const { known, toggle: toggleKnown } = useKnown(mapId);
  const { collapsed, toggle: toggleCollapsed, ensureDefault } = useCollapsed(mapId, startExpanded);
  const progress = useProgress(topics, known);

  // Ensure top-level nodes have a default collapse value
  useEffect(() => {
    topics.forEach((t) => {
      ensureDefault(t.id);
      t.subtopics.forEach((s) => ensureDefault(s.id));
    });
  }, [topics]); // eslint-disable-line react-hooks/exhaustive-deps

  const roots = useMemo(() => buildTree(topics), [topics]);

  // Layout for a reasonable width; the container scrolls horizontally if needed.
  const approxWidth = 320 * 3 + 120; // 3 columns default; grows if we ever add deeper levels
  const { nodes, links, columns } = useMemo(
    () => layoutTree(roots, collapsed, approxWidth, height),
    [roots, collapsed, height]
  );
  const canvasWidth = Math.max(approxWidth, columns * 320);
  const canvasHeight = Math.max(height, 360);

  return (
    <ProgressCtx.Provider value={progress}>
      <div className="relative w-full overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div
          className="relative"
          style={{ width: canvasWidth, height: canvasHeight }}
          aria-label="Concept map tree"
          role="group"
        >
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full">
            {links.map(({ from, to }) => {
              const x1 = from.x + 150; // right edge of node box (~300/2)
              const y1 = from.y + 0;
              const x2 = to.x; // left edge of child node box
              const y2 = to.y + 0;
              const mx = x1 + (x2 - x1) * 0.5;
              const d = `M ${x1},${y1} C ${mx},${y1} ${mx},${y2} ${x2},${y2}`;
              return (
                <path
                  key={`${from.id}->${to.id}`}
                  d={d}
                  className="stroke-slate-300 dark:stroke-slate-600"
                  strokeWidth={2}
                  fill="none"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((n) => (
            <div
              key={n.id}
              className="absolute"
              style={{ left: n.x, top: n.y, transform: "translate(-10px,-18px)" }}
            >
              <NodeBox
                node={n}
                known={known}
                onToggleKnown={toggleKnown}
                collapsed={collapsed}
                onToggleCollapsed={toggleCollapsed}
              />
            </div>
          ))}
        </div>
      </div>
    </ProgressCtx.Provider>
  );
}
