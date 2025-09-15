import type { Topic } from "./types";

export const respiratoryConcepts: Topic[] = [
  {
    id: "anatomy",
    title: "Respiratory Anatomy",
    subtopics: [
      {
        id: "upper-airways",
        title: "Upper Airways",
        cards: [
          { id: "nose-pharynx", title: "Nose and Pharynx", content: "Entry points for air into the respiratory system" },
          { id: "larynx", title: "Larynx", content: "Voice box and airway protection" },
          { id: "trachea", title: "Trachea", content: "Windpipe connecting larynx to bronchi" }
        ]
      },
      {
        id: "lower-airways",
        title: "Lower Airways",
        cards: [
          { id: "bronchi", title: "Bronchi", content: "Primary branches of the trachea" },
          { id: "bronchioles", title: "Bronchioles", content: "Smaller airway branches without cartilage" },
          { id: "alveoli", title: "Alveoli", content: "Tiny air sacs where gas exchange occurs" }
        ]
      },
      {
        id: "chest-structures",
        title: "Chest Structures",
        cards: [
          { id: "ribs", title: "Ribs and Sternum", content: "Bony cage protecting the lungs" },
          { id: "diaphragm", title: "Diaphragm", content: "Primary muscle of respiration" },
          { id: "intercostals", title: "Intercostal Muscles", content: "Muscles between ribs aiding respiration" }
        ]
      }
    ]
  },
  {
    id: "physiology",
    title: "Respiratory Physiology",
    subtopics: [
      {
        id: "ventilation",
        title: "Ventilation",
        cards: [
          { id: "inspiration", title: "Inspiration", content: "Active process of breathing in" },
          { id: "expiration", title: "Expiration", content: "Passive process of breathing out" },
          { id: "lung-volumes", title: "Lung Volumes", content: "Different volumes of air in the lungs" }
        ]
      },
      {
        id: "gas-exchange",
        title: "Gas Exchange",
        cards: [
          { id: "diffusion", title: "Diffusion", content: "Movement of gases across alveolar membrane" },
          { id: "oxygen-transport", title: "Oxygen Transport", content: "How oxygen is carried in the blood" },
          { id: "co2-transport", title: "CO2 Transport", content: "How carbon dioxide is carried in the blood" }
        ]
      },
      {
        id: "regulation",
        title: "Respiratory Regulation",
        cards: [
          { id: "chemoreceptors", title: "Chemoreceptors", content: "Sensors detecting blood gas levels" },
          { id: "respiratory-center", title: "Respiratory Center", content: "Brain regions controlling breathing" },
          { id: "neural-control", title: "Neural Control", content: "Nervous system regulation of respiration" }
        ]
      }
    ]
  },
  {
    id: "pathophysiology",
    title: "Respiratory Pathophysiology",
    subtopics: [
      {
        id: "obstructive-diseases",
        title: "Obstructive Diseases",
        cards: [
          { id: "asthma", title: "Asthma", content: "Chronic inflammatory airway disease" },
          { id: "copd", title: "COPD", content: "Chronic obstructive pulmonary disease" },
          { id: "bronchiectasis", title: "Bronchiectasis", content: "Abnormal widening of airways" }
        ]
      },
      {
        id: "restrictive-diseases",
        title: "Restrictive Diseases",
        cards: [
          { id: "pneumonia", title: "Pneumonia", content: "Infection of the lung tissue" },
          { id: "fibrosis", title: "Pulmonary Fibrosis", content: "Scarring of lung tissue" },
          { id: "pleural-effusion", title: "Pleural Effusion", content: "Fluid accumulation in pleural space" }
        ]
      },
      {
        id: "vascular-disorders",
        title: "Vascular Disorders",
        cards: [
          { id: "pulmonary-embolism", title: "Pulmonary Embolism", content: "Blood clot in pulmonary arteries" },
          { id: "pulmonary-hypertension", title: "Pulmonary Hypertension", content: "High blood pressure in lung arteries" },
          { id: "ards", title: "ARDS", content: "Acute respiratory distress syndrome" }
        ]
      }
    ]
  },
  {
    id: "assessment",
    title: "Respiratory Assessment",
    subtopics: [
      {
        id: "history-taking",
        title: "History Taking",
        cards: [
          { id: "symptoms", title: "Respiratory Symptoms", content: "Dyspnea, cough, chest pain, etc." },
          { id: "risk-factors", title: "Risk Factors", content: "Smoking, occupation, family history" },
          { id: "medications", title: "Medications", content: "Current respiratory medications" }
        ]
      },
      {
        id: "physical-exam",
        title: "Physical Examination",
        cards: [
          { id: "inspection", title: "Inspection", content: "Visual assessment of chest and breathing" },
          { id: "palpation", title: "Palpation", content: "Feeling for abnormalities" },
          { id: "percussion", title: "Percussion", content: "Tapping to assess underlying structures" },
          { id: "auscultation", title: "Auscultation", content: "Listening to breath sounds" }
        ]
      },
      {
        id: "diagnostic-tests",
        title: "Diagnostic Tests",
        cards: [
          { id: "pulmonary-function", title: "Pulmonary Function Tests", content: "Measures of lung capacity and flow" },
          { id: "arterial-blood-gas", title: "Arterial Blood Gas", content: "Measurement of blood oxygen and CO2" },
          { id: "imaging", title: "Chest Imaging", content: "X-rays, CT scans, MRI of the chest" }
        ]
      }
    ]
  }
];

