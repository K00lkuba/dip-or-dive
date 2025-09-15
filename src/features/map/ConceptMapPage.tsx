import React from "react";
import ConceptMap from "./ConceptMap";
import ConceptTree from "./ConceptTree";
import ConceptTreeUp from "./ConceptTreeUp";
import RadialConceptMap from "./RadialConceptMap";
import { respiratoryConcepts as topics } from "./sample";
import { useSearchParams } from "react-router-dom";

type View = "outline" | "tree" | "trunk" | "infographic";

export default function ConceptMapPage() {
  const [params, setParams] = useSearchParams();
  const raw = (params.get("view") || "").toLowerCase();
  const view: View =
    raw === "tree" ? "tree" : raw === "trunk" ? "trunk" : raw === "infographic" ? "infographic" : "outline";

  function switchView(v: View) {
    const next = new URLSearchParams(params);
    if (v === "outline") next.delete("view");
    else next.set("view", v);
    setParams(next, { replace: true });
  }

  // --- RUNTIME MARKER so you can confirm this exact file is mounted ---
  // Open DevTools console; you should see this once when visiting /study/map
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug("[ConceptMapPage] view switcher active: outline|tree|trunk|infographic");
  }, []);

  const Button = ({ v, label }: { v: View; label: string }) => (
    <button
      type="button"
      onClick={() => switchView(v)}
      aria-pressed={view === v}
      className={[
        "px-3 py-1.5 text-sm rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        view === v ? "bg-indigo-600 text-white" : "hover:bg-slate-50 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <main className="px-4 py-6 md:py-10 max-w-6xl mx-auto space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Concept Map</h1>
        <div role="tablist" aria-label="Concept map view"
             className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-900">
          <Button v="outline" label="Outline" />
          <Button v="tree" label="Tree" />
          <Button v="trunk" label="Trunk" />
          <Button v="infographic" label="Infographic" />
        </div>
      </header>

      {view === "tree" ? (
        <ConceptTree topics={topics} mapId="respiratory" startExpanded={true} height={640} />
      ) : view === "trunk" ? (
        <ConceptTreeUp topics={topics} mapId="respiratory" startExpanded={true} height={720} width={1200} />
      ) : view === "infographic" ? (
        <RadialConceptMap topics={topics} mapId="respiratory" height={720} width={1200} />
      ) : (
        <ConceptMap topics={topics} mapId="respiratory" startExpanded={true} />
      )}
    </main>
  );
}


