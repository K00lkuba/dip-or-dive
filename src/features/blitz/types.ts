export type BlitzChoice = {
  id: string;
  text: string;
};

export type BlitzQuestion = {
  id: string;
  prompt: string;
  choices: BlitzChoice[];
  answerId: string; // id of the correct choice
  explanation?: string;
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
};

export type BlitzResult = {
  playedAt: string; // ISO
  durationSec: number;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number; // 0..1
};


