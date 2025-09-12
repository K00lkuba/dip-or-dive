import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotesPage from './pages/NotesPage'
import QuickfirePage from './features/quickfire/QuickfirePage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/study/quickfire" element={<QuickfirePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
