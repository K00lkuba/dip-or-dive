// @@SETTINGS_PANEL_START
import { motion } from 'framer-motion'
import type { State } from '../state/useModuleState'

type Props = {
  open: boolean
  settings: State['settings']
  onChange: (p: Partial<State['settings']>) => void
  onClose: () => void
}

export default function SettingsPanel({ open, settings, onChange, onClose }: Props) {
  return (
    <motion.div
      initial={false}
      animate={{ x: open ? 0 : 360 }}
      transition={{ type: 'spring', stiffness: 250, damping: 30 }}
      className="fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 p-4 z-40"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Settings</h3>
        <button className="text-slate-300 hover:text-white" onClick={onClose}>Close</button>
      </div>
      <div className="mt-4 space-y-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.enforceGates}
            onChange={e => onChange({ enforceGates: e.target.checked })} />
          <span>Enforce gates</span>
        </label>
        <div>
          <label className="block mb-1">Default timer (seconds)</label>
          <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            min={5} max={600}
            value={settings.timerSeconds}
            onChange={e => onChange({ timerSeconds: Math.max(5, Math.min(600, Number(e.target.value) || 0)) })} />
        </div>
        <p className="text-xs text-slate-400">Settings persist locally.</p>
      </div>
    </motion.div>
  )
}
// @@SETTINGS_PANEL_END