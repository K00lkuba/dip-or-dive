import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotesPage from './pages/NotesPage'

/** ⬇️ Concept Map imports */
import { ConceptMapPage, MapFAB } from './features/map'
import { QuickfireFAB } from './features/quickfire'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/notes" element={<NotesPage />} />
        {/* ⬇️ New route to view the Concept Map */}
        <Route path="/study/map" element={<ConceptMapPage />} />
      </Routes>

      {/* ⬇️ Floating link so you can reach the map from any page */}
      <MapFAB />
    </BrowserRouter>
    {/* Always-visible Start Quiz button */}
    <QuickfireFAB />
  </React.StrictMode>
)
