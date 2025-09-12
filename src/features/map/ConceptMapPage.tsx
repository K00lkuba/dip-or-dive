import React from "react";
import ConceptMap from "./ConceptMap";
import { respiratoryConcepts } from "./sample";

export default function ConceptMapPage() {
  return (
    <main className="px-4 py-6 md:py-10 max-w-5xl mx-auto">
      <ConceptMap topics={respiratoryConcepts} mapId="respiratory" startExpanded={true} />
    </main>
  );
}


