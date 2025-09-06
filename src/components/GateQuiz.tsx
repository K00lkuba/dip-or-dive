// @@GATE_QUIZ_START
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type QuizConfig = { question: string; options: string[]; answerIndex: number }
type Props = { id: string; config: QuizConfig; passed: boolean; onPass: (id: string) => void }

export default function GateQuiz({ id, config, passed, onPass }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string>('')

  function submit() {
    if (picked === null) { setFeedback('Pick an option.'); return }
    if (picked === config.answerIndex) { onPass(id); setFeedback('Correct!') }
    else { setFeedback('Try again.') }
  }

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 space-y-2">
      <div className="font-medium">Quiz Gate</div>
      <div className="text-sm">{config.question}</div>
      <div className="flex flex-col gap-2">
        {config.options.map((opt, i) => (
          <label key={i} className="inline-flex items-center gap-2 text-sm">
            <input type="radio" name={id} disabled={passed} checked={picked===i} onChange={() => setPicked(i)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button disabled={passed} onClick={submit}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-60">
          Submit
        </button>
        {passed && <span className="inline-flex items-center gap-1 text-green-500 text-sm"><CheckCircle2 className="w-4 h-4" /> Passed</span>}
        <span className="text-xs text-slate-400">{feedback}</span>
      </div>
    </div>
  )
}
// @@GATE_QUIZ_END