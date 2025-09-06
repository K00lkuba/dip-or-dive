// @@STATE_HOOK_START
import { useEffect, useMemo, useReducer } from 'react'
import type { DifficultyKey } from '../config/module.config'

const STORAGE_KEY = 'cramSiteState.v1'

export type State = {
  difficulty: DifficultyKey
  index: number
  done: Record<string, true>
  gates: Record<string, true>
  customInstructions: string
  settings: { enforceGates: boolean; timerSeconds: number }
}

type Action =
  | { type: 'setDifficulty'; value: DifficultyKey }
  | { type: 'goto'; value: number }
  | { type: 'doneStep'; id: string }
  | { type: 'passGate'; id: string }
  | { type: 'setCustomInstructions'; value: string }
  | { type: 'setSettings'; value: Partial<State['settings']> }

function safeParse(json: string | null): Partial<State> | null {
  if (!json) return null
  try { return JSON.parse(json) as Partial<State> } catch { return null }
}

const initial: State = {
  difficulty: 'last',
  index: 0,
  done: {},
  gates: {},
  customInstructions: 'You are a concise study buddy. Prepend these instructions before prompts.',
  settings: { enforceGates: true, timerSeconds: 30 },
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setDifficulty': return { ...state, difficulty: action.value }
    case 'goto': return { ...state, index: action.value }
    case 'doneStep': return { ...state, done: { ...state.done, [action.id]: true } }
    case 'passGate': return { ...state, gates: { ...state.gates, [action.id]: true } }
    case 'setCustomInstructions': return { ...state, customInstructions: action.value }
    case 'setSettings': return { ...state, settings: { ...state.settings, ...action.value } }
    default: return state
  }
}

export function useModuleState(totalSections = 1): { state: State; dispatch: React.Dispatch<Action> } {
  const [state, dispatch] = useReducer(reducer, initial, (init) => {
    const fromStorage = typeof window !== 'undefined' ? safeParse(localStorage.getItem(STORAGE_KEY)) : null
    return { ...init, ...(fromStorage ?? {}) }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  // clamp navigation index defensively
  const clampedIndex = useMemo(
    () => clamp(state.index, 0, Math.max(0, totalSections - 1)),
    [state.index, totalSections]
  )

  if (clampedIndex !== state.index) {
    // self-correct if out of range
    setTimeout(() => dispatch({ type: 'goto', value: clampedIndex }), 0)
  }

  return { state: { ...state, index: clampedIndex }, dispatch }
}
// @@STATE_HOOK_END