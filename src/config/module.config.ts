// @@MODULE_CONFIG_START
export type DifficultyKey = 'last' | 'med' | 'hard' | 'tri'
export type Gate = { type: 'quiz' | 'timer'; id: string; config?: any }
export type PromptItem = { label: string; text: string }
export type Section = {
  id: string; title: string; summary: string;
  essentials: string[]; prompts: PromptItem[]; gates?: Gate[];
}

export const DIFFICULTY: Record<DifficultyKey, { name: string; badge: string; ring: string; prompts: number }> = {
  last: { name: 'Last-Minute', badge: 'LAST', ring: 'ring-green-500', prompts: 1 },
  med:  { name: 'Medium', badge: 'MED', ring: 'ring-yellow-500', prompts: 2 },
  hard: { name: 'Hard', badge: 'HARD', ring: 'ring-orange-500', prompts: 3 },
  tri:  { name: 'Trial-by-Fire', badge: 'TRI', ring: 'ring-red-500', prompts: 4 },
}

// Seed Respiratory sections (5)
export const sections: Section[] = [
  {
    id: 'resp-anatomy',
    title: 'Anatomy',
    summary: 'Big-picture map: airways, lungs, pleura, vasculature.',
    essentials: [
      'Conducting vs respiratory zone',
      'Right main bronchus is wider/shorter',
      'Alveolar type I vs II cells',
    ],
    prompts: [
      { label: 'Path flow', text: 'Describe airflow from nares to alveoli in 6 bullets.' },
      { label: 'Lung surface', text: 'List lobes & fissures. What touches the right hilum anteriorly?' },
      { label: 'Alveolar cells', text: 'Contrast type I vs II pneumocytes; role of surfactant.' },
      { label: 'Blood/gas', text: 'Sketch pulmonary vs bronchial circulation in one diagram.' },
    ],
    gates: [
      { type: 'quiz', id: 'anatomy-quiz-1', config: {
        question: 'Which main bronchus is more vertical?',
        options: ['Left', 'Right', 'Neither'],
        answerIndex: 1,
      }},
    ]
  },
  {
    id: 'resp-physiology',
    title: 'Physiology',
    summary: 'Pressures, compliance, gas exchange, V/Q.',
    essentials: [
      'FRC set by chest wall vs lung recoil',
      'A-a gradient concept',
      'Regions vary in V/Q (apex vs base)',
    ],
    prompts: [
      { label: 'Compliance', text: 'Explain compliance and its clinical correlates (emphysema vs fibrosis).' },
      { label: 'V/Q', text: 'Apex vs base: which has higher V/Q? Why?' },
      { label: 'Diffusion', text: 'DLCO changes in emphysema vs anemia?' },
      { label: 'Shunt vs dead space', text: 'One-liners that distinguish shunt from dead space with examples.' },
    ],
    gates: [
      { type: 'timer', id: 'phys-timer-1', config: { seconds: 30 } }
    ]
  },
  {
    id: 'resp-control',
    title: 'Control of Breathing',
    summary: 'Sensors, controllers, effectors; CO2 drives.',
    essentials: [
      'Central vs peripheral chemoreceptors',
      'Hypercapnic ventilatory response',
      'Sleep hypoventilation basics',
    ],
    prompts: [
      { label: 'Controllers', text: 'Medullary centers overview; what do they modulate?' },
      { label: 'Chemoreceptors', text: 'Compare central vs peripheral chemoreceptors in a table.' },
      { label: 'Hypoxia drive', text: 'At what PaO2 do peripheral chemoreceptors kick in?' },
      { label: 'Sleep', text: 'Two changes in ventilation during REM sleep.' },
    ],
    gates: [
      { type: 'quiz', id: 'control-quiz-1', config: {
        question: 'Primary driver of ventilation at sea level?',
        options: ['O2', 'CO2', 'HCO3-'],
        answerIndex: 1,
      }},
    ]
  },
  {
    id: 'resp-path',
    title: 'Pathology',
    summary: 'Obstructive vs restrictive, gas exchange defects.',
    essentials: [
      'Obstructive: low FEV1/FVC',
      'Restrictive: low TLC',
      'Embolism → dead space increase',
    ],
    prompts: [
      { label: 'Spirometry', text: 'Differentiate obstructive vs restrictive in 3 bullets.' },
      { label: 'Asthma vs COPD', text: 'Key distinctions (reversibility, inflammation type).' },
      { label: 'PE gas', text: 'Why V/Q → ∞ in PE? Explain.' },
      { label: 'Fibrosis', text: 'How fibrosis alters diffusion and A–a gradient.' },
    ],
    gates: [
      { type: 'timer', id: 'path-timer-1', config: { seconds: 45 } }
    ]
  },
  {
    id: 'resp-recall',
    title: 'Recall Drills',
    summary: 'Rapid prompts to recite without notes.',
    essentials: [
      'Mnemonic: RALS (pulm artery relation to bronchus)',
      'Hb–O2 curve shifts',
      'High altitude acclimatization steps',
    ],
    prompts: [
      { label: 'RALS', text: 'Explain RALS and clinical implication.' },
      { label: 'O2 curve', text: 'Factors shifting Hb–O2 curve left vs right.' },
      { label: 'Altitude', text: 'List 4 acclimatization changes at high altitude.' },
      { label: 'PE vs pneumonia', text: 'V/Q and A–a gradient patterns.' },
    ],
    gates: [
      { type: 'quiz', id: 'recall-quiz-1', config: {
        question: 'RALS means pulmonary artery is _____ to bronchus on the right.',
        options: ['anterior', 'lateral', 'superior'],
        answerIndex: 0,
      }},
    ]
  },
]
// @@MODULE_CONFIG_END