import type { MCQ } from "./types";

// Respiratory Physiology MCQs (pick 5 per round)
export const sampleMCQ: MCQ[] = [
  {
    id: "resp1",
    prompt: "Which change causes a RIGHT shift of the oxyhemoglobin dissociation curve?",
    options: ["↓Temperature", "↓PaCO₂", "↓2,3-BPG", "↑H⁺ (acidosis)"],
    answerIndex: 3,
  },
  {
    id: "resp2",
    prompt: "Alveolar gas equation (sea level) is best approximated by:",
    options: [
      "PAO₂ = PiO₂ − (PaCO₂/R)",
      "PAO₂ = PaO₂ − PaCO₂",
      "PAO₂ = FiO₂ × PaCO₂",
      "PAO₂ = (PaCO₂ × R) − PiO₂",
    ],
    answerIndex: 0,
  },
  {
    id: "resp3",
    prompt: "Physiologic dead space INCREASES most characteristically with:",
    options: ["Pulmonary embolism", "Asthma attack", "Left-to-right shunt", "High altitude"],
    answerIndex: 0,
  },
  {
    id: "resp4",
    prompt: "Where is the V/Q ratio highest in an upright lung?",
    options: ["Apex", "Base", "Mid-lung equally", "Uniform throughout"],
    answerIndex: 0,
  },
  {
    id: "resp5",
    prompt: "Lung compliance is defined as:",
    options: ["ΔP/ΔV", "ΔV/ΔP", "Airway resistance × flow", "FEV₁/FVC"],
    answerIndex: 1,
  },
  {
    id: "resp6",
    prompt: "Obstructive disease typically changes FEV₁/FVC how?",
    options: ["Increases", "Decreases", "No change", "Becomes >90%"],
    answerIndex: 1,
  },
  {
    id: "resp7",
    prompt: "Hypoxemia with a NORMAL A–a gradient is most consistent with:",
    options: ["Right-to-left shunt", "Diffusion limitation", "V/Q mismatch", "Hypoventilation"],
    answerIndex: 3,
  },
  {
    id: "resp8",
    prompt: "The Haldane effect refers to:",
    options: [
      "CO₂ binding increases with deoxygenation (in tissues)",
      "O₂ binding increases with higher temperature",
      "Rightward shift from ↑H⁺ (Bohr effect)",
      "O₂ binding increases CO₂ content of blood",
    ],
    answerIndex: 0,
  },
];


