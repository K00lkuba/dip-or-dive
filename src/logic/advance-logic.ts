// @@ADVANCE_LOGIC_START
import type { State } from '../state/useModuleState'
import type { Section } from '../config/module.config'

export function canAdvance(state: State, section: Section): boolean {
  const stepDone = !!state.done[section.id]
  if (!state.settings.enforceGates) return stepDone
  const required = (section.gates ?? []).filter(g => {
    if (g.type === 'timer' && state.difficulty !== 'tri') return false
    return true
  })
  const gatesPassed = required.every(g => !!state.gates[g.id])
  return stepDone && gatesPassed
}
// @@ADVANCE_LOGIC_END