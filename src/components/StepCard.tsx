// @@STEP_CARD_START
import PromptCard from './PromptCard'
import type { Section } from '../config/module.config'

type Props = {
  section: Section
  instructions: string
  promptsToShow: number
  done: boolean
  onDone: () => void
}

export default function StepCard({ section, instructions, promptsToShow, done, onDone }: Props) {
  const prompts = section.prompts.slice(0, Math.max(1, promptsToShow))

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
        <h2 className="text-xl font-semibold">{section.title}</h2>
        <p className="text-slate-300 text-sm mt-1">{section.summary}</p>
        <ul className="mt-3 list-disc list-inside text-sm text-slate-200">
          {section.essentials.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {prompts.map((p, i) => (
          <PromptCard key={i} label={p.label} text={p.text} instructions={instructions} />
        ))}
      </div>

      <div className="pt-1">
        <button onClick={onDone}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600">
          {done ? 'Marked Done ✓' : 'Mark Step Done'}
        </button>
      </div>
    </div>
  )
}
// @@STEP_CARD_END