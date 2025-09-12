import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotesPage from './pages/NotesPage'
import QuickfirePage from './features/quickfire/QuickfirePage'
/** ⬇️ Add the Concept Map demo route */
import { ConceptMapPage } from './features/map'
import { QuickfireFAB } from './features/quickfire'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/study/quickfire" element={<QuickfirePage />} />
        <Route path="/study/map" element={<ConceptMapPage />} />
      </Routes>
    </BrowserRouter>
    {/* Always-visible Start Quiz button */}
    <QuickfireFAB />
  </React.StrictMode>
)
