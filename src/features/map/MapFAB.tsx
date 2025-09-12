import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function MapFAB() {
  const { pathname } = useLocation();
  const onMap = pathname === "/study/map";
  if (onMap) return null;

  return (
    <Link
      to="/study/map"
      className="fixed z-40 bottom-5 left-5 px-4 py-2 rounded-full shadow-lg border bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      aria-label="Open Concept Map"
      title="Open Concept Map"
    >
      Concept Map
    </Link>
  );
}
