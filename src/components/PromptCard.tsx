// @@PROMPT_CARD_START
import { copyText, openNewChat } from '../services/browser'
import { ClipboardCopy, MessageSquarePlus } from 'lucide-react'
import { useState } from 'react'

type Props = {
  label: string
  text: string
  instructions: string
}

export default function PromptCard({ label, text, instructions }: Props) {
  const [status, setStatus] = useState<string | null>(null)

  const combined = `${instructions.trim()}\n\n${text.trim()}`

  async function doCopy() {
    const ok = await copyText(combined)
    setStatus(ok ? 'Copied to clipboard.' : 'Copy blocked — select text and press ⌘/Ctrl+C.')
    if (!ok) {
      // Select text fallback in a hidden textarea for manual copy.
      const ta = document.createElement('textarea')
      ta.value = combined
      ta.style.position = 'fixed'; ta.style.left = '-9999px'
      document.body.appendChild(ta); ta.select()
      setTimeout(() => document.body.removeChild(ta), 500)
    }
  }

  async function copyAndOpen() {
    const okCopy = await copyText(combined)
    const okOpen = openNewChat()
    if (okCopy && okOpen) setStatus('Copied and opened ChatGPT. Paste there.')
    else if (!okCopy && okOpen) setStatus('Open ok. Copy blocked — select and copy manually.')
    else if (okCopy && !okOpen) setStatus('Copied. Popup blocked — open ChatGPT manually.')
    else setStatus('Actions blocked — copy text manually and open ChatGPT.')
  }

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{label}</h4>
      </div>
      <p className="text-sm text-slate-300">{text}</p>
      <div className="flex gap-2 pt-1">
        <button onClick={doCopy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">
          <ClipboardCopy className="w-4 h-4" /> Copy
        </button>
        <button onClick={copyAndOpen}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-600">
          <MessageSquarePlus className="w-4 h-4" /> Copy + Open
        </button>
      </div>
      {status && <div className="text-xs text-slate-400">{status}</div>}
    </div>
  )
}
// @@PROMPT_CARD_END