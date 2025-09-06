import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { NotesPanel } from './features/notes/NotesPanel'

function DemoApp() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <header className="border-b p-4 text-center dark:border-zinc-800">
        <h1 className="text-2xl font-bold">Dip or Dive</h1>
        <p className="text-sm opacity-70">Notes Panel Demo</p>
      </header>
      <main className="p-4">
        <NotesPanel />
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>
)
