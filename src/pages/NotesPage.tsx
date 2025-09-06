// FILE: src/pages/NotesPage.tsx  (self-contained header, no Header import)
import React from 'react'
import { NotesPanel } from '../features/notes/NotesPanel'

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <header className="border-b p-4 dark:border-slate-800">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <a href="/" className="text-xl font-bold">Dip or Dive</a>
          <nav className="flex gap-4 text-sm opacity-80">
            <a className="underline" href="/">Home</a>
            <a className="underline" href="/notes">Notes</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <h1 className="sr-only">Notes</h1>
        <NotesPanel />
      </main>
    </div>
  )
}
