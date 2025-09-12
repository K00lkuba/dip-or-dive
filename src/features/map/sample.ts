import type { Topic } from "./types";

export const respiratoryConcepts: Topic[] = [
  {
    id: "topic-ventilation",
    title: "Ventilation & Mechanics",
    subtopics: [
      {
        id: "st-compliance",
        title: "Compliance & Elastance",
        cards: [
          { id: "c-compliance-def", title: "Compliance = ΔV/ΔP; restrictive ↓, emphysema ↑" },
          { id: "c-surfactant", title: "Surfactant ↓ surface tension; ↑ compliance; NRDS lacks it" },
        ],
      },
      {
        id: "st-resistance",
        title: "Airway Resistance",
        cards: [
          { id: "c-poiseuille", title: "Resistance ∝ 1/r⁴ (Poiseuille); small radius ↑ resistance" },
          { id: "c-parasym", title: "Parasympathetic tone ↑ resistance (bronchoconstriction)" },
        ],
      },
    ],
  },
  {
    id: "topic-gas",
    title: "Gas Exchange & Transport",
    subtopics: [
      {
        id: "st-diffusion",
        title: "Diffusion & A–a",
        cards: [
          { id: "c-ficks", title: "Fick’s law: Vgas ∝ (A/T) × (P1−P2) × D" },
          { id: "c-aa", title: "A–a gradient ↑ in V/Q mismatch, diffusion limit, shunt" },
        ],
      },
      {
        id: "st-hbo2",
        title: "Hemoglobin–O₂",
        cards: [
          { id: "c-bohr", title: "Bohr effect: ↑H+, ↑CO₂, ↑Temp, ↑2,3-BPG → right shift" },
          { id: "c-haldane", title: "Haldane effect: deoxygenation ↑ CO₂ carrying capacity" },
        ],
      },
    ],
  },
];


