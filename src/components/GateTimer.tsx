// @@GATE_TIMER_START
import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, TimerReset } from 'lucide-react'

type Props = { id: string; seconds: number; passed: boolean; onPass: (id: string) => void }

export default function GateTimer({ id, seconds, passed, onPass }: Props) {
  const [remain, setRemain] = useState<number>(seconds)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  function start() {
    if (timerRef.current) window.clearInterval(timerRef.current)
    setRemain(seconds)
    timerRef.current = window.setInterval(() => {
      setRemain(r => {
        if (r <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          onPass(id)
          return 0
        }
        return r - 1
      })
    }, 1000)
  }

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 flex items-center justify-between">
      <div className="text-sm">
        <div className="font-medium">Timer Gate</div>
        <div className="text-slate-400">{passed ? 'Passed' : `Remain: ${remain}s`}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={start}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">
          <TimerReset className="w-4 h-4" /> Start {seconds}s
        </button>
        {passed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
      </div>
    </div>
  )
}
// @@GATE_TIMER_END