// @@PAGER_START
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

type Props = {
  index: number
  total: number
  canNext: boolean
  children: React.ReactNode
  onPrev: () => void
  onNext: () => void
}

export default function Pager({ index, total, canNext, children, onPrev, onNext }: Props) {
  return (
    <div className="relative h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <div className="absolute inset-y-0 left-0 flex items-center p-3">
        <button onClick={onPrev} disabled={index===0}
          className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 disabled:opacity-50">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center p-3">
        <button onClick={onNext} disabled={!canNext || index===total-1}
          className="p-2 rounded-xl bg-blue-700 hover:bg-blue-600 disabled:opacity-50">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="h-full overflow-auto p-6"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 24 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
// @@PAGER_END