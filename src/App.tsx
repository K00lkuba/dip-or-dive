// @@APP_START
import { DIFFICULTY, sections } from './config/module.config'
import { useModuleState } from './state/useModuleState'
import { canAdvance } from './logic/advance-logic'
import Pager from './components/Pager'
import ProgressDots from './components/ProgressDots'
import StepCard from './components/StepCard'
import GateTimer from './components/GateTimer'
import GateQuiz from './components/GateQuiz'
import SettingsPanel from './components/SettingsPanel'
import { ErrorBoundary } from './components/ErrorBoundary'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Flame, Gauge } from 'lucide-react'
import { Link } from 'react-router-dom'  // [Link = in-app navigation]
import FlipCard from './components/FlipCard'


function DifficultyBadge({ k, active, onClick }: { k: keyof typeof DIFFICULTY, active: boolean, onClick: () => void }) {
  const d = DIFFICULTY[k]
  return (
    <button onClick={onClick}
      className={
        'px-3 py-1 rounded-xl border text-xs ' +
        (active ? 'border-blue-500 bg-blue-600/20' : 'border-slate-700 bg-slate-900 hover:bg-slate-800')
      }>
      {d.badge}
    </button>
  )
}


function GateRenderer(props: { id: string; type: 'timer'|'quiz'; config?: any; passed: boolean; onPass: (id: string) => void }) {
  if (props.type === 'timer') return <GateTimer id={props.id} seconds={props.config?.seconds ?? 30} passed={props.passed} onPass={props.onPass} />
  if (props.type === 'quiz') return <GateQuiz id={props.id} config={props.config} passed={props.passed} onPass={props.onPass} />
  return null
}

export default function AppRoot() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
}

function App() {
  const { state, dispatch } = useModuleState(sections.length)
  const section = sections[state.index]
  const promptsToShow = DIFFICULTY[state.difficulty].prompts
  const canNext = canAdvance(state, section)

  const [settingsOpen, setSettingsOpen] = useState(false)

  // fallback-safe local useState without importing explicitly per file
  // (bundlers will tree-shake unused parts; this keeps file count down)

  return (
    <div className="min-h-screen flex flex-col gap-4 p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div initial={{ rotate: -8 }} animate={{ rotate: 0 }} className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <Flame className="w-5 h-5 text-orange-400" />
          </motion.div>
          <div>
            <div className="text-lg font-semibold">Last-Minute Cram</div>
            <div className="text-xs text-slate-400">Respiratory Module</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DifficultyBadge k="last" active={state.difficulty==='last'} onClick={() => dispatch({ type: 'setDifficulty', value: 'last' })} />
          <DifficultyBadge k="med"  active={state.difficulty==='med'}  onClick={() => dispatch({ type: 'setDifficulty', value: 'med'  })} />
          <DifficultyBadge k="hard" active={state.difficulty==='hard'} onClick={() => dispatch({ type: 'setDifficulty', value: 'hard' })} />
          <DifficultyBadge k="tri"  active={state.difficulty==='tri'}  onClick={() => dispatch({ type: 'setDifficulty', value: 'tri'  })} />
          {/* Notes link (navigation to /notes) */}
          <Link
            to="/notes"
            className="ml-2 px-3 py-1 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs"
          >
            Notes
          </Link>
          <button onClick={() => setSettingsOpen(true)} className="ml-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-center py-2">
          <FlipCard
            question="What is the time complexity of binary search?"
            answer="O(log n) — halving the search space each step."
          />
        </div>
        <Pager
          index={state.index}
          total={sections.length}
          canNext={canNext}
          onPrev={() => dispatch({ type: 'goto', value: Math.max(0, state.index - 1) })}
          onNext={() => dispatch({ type: 'goto', value: Math.min(sections.length - 1, state.index + 1) })}
        >
          <StepCard
            section={section}
            instructions={state.customInstructions}
            promptsToShow={promptsToShow}
            done={!!state.done[section.id]}
            onDone={() => dispatch({ type: 'doneStep', id: section.id })}
          />

          {/* Gates */}
          <div className="mt-4 space-y-3">
            {(section.gates ?? []).map((g) => (
              <GateRenderer
                key={g.id}
                id={g.id}
                type={(g as any).type}
                config={(g as any).config}
                passed={!!state.gates[g.id]}
                onPass={(id: string) => dispatch({ type: 'passGate', id })}
              />
            ))}
          </div>

          {/* Custom instructions editor */}
          <div className="mt-4 rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <h3 className="font-semibold">Custom Instructions</h3>
            </div>
            <textarea
              className="w-full min-h-[90px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
              value={state.customInstructions}
              onChange={e => dispatch({ type: 'setCustomInstructions', value: e.target.value })}
            />
            <p className="text-xs text-slate-400">Prepended to prompts when copying/opening.</p>
          </div>
        </Pager>

        <ProgressDots index={state.index} total={sections.length} />
      </div>

      <SettingsPanel
        open={settingsOpen}
        settings={state.settings}
        onChange={(p) => dispatch({ type: 'setSettings', value: p })}
        onClose={() => setSettingsOpen(false)}
      />

      <footer className="text-center text-xs text-slate-500 mt-2">
        Built for speed. All state saved locally.
      </footer>
    </div>
  )
}
// @@APP_END