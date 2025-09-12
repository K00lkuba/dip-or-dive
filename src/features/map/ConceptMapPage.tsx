import React from "react";
import ConceptMap from "./ConceptMap";
import ConceptTree from "./ConceptTree";
import ConceptTreeUp from "./ConceptTreeUp";
import { respiratoryConcepts } from "./sample";
import { useSearchParams } from "react-router-dom";

export default function ConceptMapPage() {
  const [params, setParams] = useSearchParams();
  const view = params.get("view") === "tree"
    ? "tree"
    : params.get("view") === "trunk"
    ? "trunk"
    : "outline";

  const switchView = (v: "outline" | "tree" | "trunk") => {
    const next = new URLSearchParams(params);
    if (v === "outline") next.delete("view");
    else next.set("view", v === "tree" ? "tree" : "trunk");
    setParams(next, { replace: true });
  };

  return (
    <main className="px-4 py-6 md:py-10 max-w-6xl mx-auto space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Concept Map</h1>
        <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-900">
          <button
            onClick={() => switchView("outline")}
            aria-pressed={view === "outline"}
            className={[
              "px-3 py-1.5 text-sm rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              view === "outline" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            Outline
          </button>
          <button
            onClick={() => switchView("tree")}
            aria-pressed={view === "tree"}
            className={[
              "px-3 py-1.5 text-sm rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              view === "tree" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            Tree
          </button>
          <button
            onClick={() => switchView("trunk")}
            aria-pressed={view === "trunk"}
            className={[
              "px-3 py-1.5 text-sm rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              view === "trunk" ? "bg-indigo-600 text-white" : "hover:bg-slate-50 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            Trunk
          </button>
        </div>
      </header>

      {view === "tree" ? (
        <ConceptTree topics={respiratoryConcepts} mapId="respiratory" startExpanded={true} height={640} />
      ) : view === "trunk" ? (
        <ConceptTreeUp topics={respiratoryConcepts} mapId="respiratory" startExpanded={true} height={720} width={1200} />
      ) : (
        <ConceptMap topics={respiratoryConcepts} mapId="respiratory" startExpanded={true} />
      )}
    </main>
  );
}


