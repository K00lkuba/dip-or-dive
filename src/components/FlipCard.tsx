"use client"

import React, { useCallback, useState } from 'react'
import styles from './FlipCard.module.css'

export interface FlipCardProps {
  question: string
  answer: string
  className?: string
}

export default function FlipCard({ question, answer, className }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  const toggle = useCallback(() => setFlipped(v => !v), [])

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <div
      className={`${styles.container} ${flipped ? styles.flipped : ''} ${styles.focusable} ${className ?? ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? 'Show question' : 'Show answer'}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      <div className={styles.card}>
        <div className={`${styles.face} ${styles.front}`}>
          <div>
            <div style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: 6 }}>Question</div>
            <div>{question}</div>
          </div>
        </div>
        <div className={`${styles.face} ${styles.back}`}>
          <div>
            <div style={{ opacity: 0.8, fontSize: '0.85rem', marginBottom: 6 }}>Answer</div>
            <div>{answer}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


