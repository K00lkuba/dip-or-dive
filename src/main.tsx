import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import { ConceptMapPage, MapFAB } from "./features/map";
import { QuickfireFAB } from "./features/quickfire";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/study/map" element={<ConceptMapPage />} />
      </Routes>

      {/* GLOBAL-FABS-ANCHOR: Do not remove MapFAB or QuickfireFAB. */}
      <MapFAB />
      <QuickfireFAB />
    </BrowserRouter>
  </React.StrictMode>
);
