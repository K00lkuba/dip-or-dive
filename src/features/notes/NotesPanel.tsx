import React, { useEffect, useMemo, useState } from 'react'

type NotesPanelProps = {
  storageKey?: string
  className?: string
}

/** Keeps notes in localStorage. Export/import as JSON. */
export function NotesPanel({ storageKey = 'dod:notes', className = '' }: NotesPanelProps) {
  const [text, setText] = useState<string>('')
  const [savedAt, setSavedAt] = useState<number | null>(null)

  // Debounced save
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const payload = { text, savedAt: Date.now() }
        localStorage.setItem(storageKey, JSON.stringify(payload))
        setSavedAt(payload.savedAt)
      } catch {}
    }, 300)
    return () => clearTimeout(id)
  }, [text, storageKey])

  // Load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as { text?: string; savedAt?: number }
        if (typeof parsed.text === 'string') setText(parsed.text)
        if (typeof parsed.savedAt === 'number') setSavedAt(parsed.savedAt)
      }
    } catch {}
  }, [storageKey])

  const savedLabel = useMemo(() => {
    if (!savedAt) return 'Not saved yet'
    const d = new Date(savedAt)
    return `Saved ${d.toLocaleTimeString()}`
  }, [savedAt])

  function onExport() {
    try {
      const blob = new Blob([JSON.stringify({ text }, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'notes.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {}
  }

  function onImport(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as { text?: string }
        if (typeof data.text === 'string') setText(data.text)
      } catch {}
    }
    reader.readAsText(file)
  }

  function onClear() {
    setText('')
  }

  return (
    <div className={`mx-auto max-w-3xl p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Notes</h1>
        <span className="text-xs opacity-70">{savedLabel}</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type notes here..."
        className="h-64 w-full resize-y rounded-2xl border border-zinc-300 bg-white p-3 text-sm outline-none ring-0 transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onExport} className="rounded-xl border px-3 py-1 text-sm hover:opacity-90 active:opacity-80 dark:border-zinc-700">
          Export JSON
        </button>
        <label className="rounded-xl border px-3 py-1 text-sm hover:opacity-90 active:opacity-80 dark:border-zinc-700">
          Import JSON
          <input type="file" accept="application/json" onChange={onImport} className="hidden" />
        </label>
        <button onClick={onClear} className="rounded-xl border px-3 py-1 text-sm hover:opacity-90 active:opacity-80 dark:border-zinc-700">
          Clear
        </button>
      </div>
    </div>
  )
}

export default NotesPanel
