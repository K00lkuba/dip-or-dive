export type MCQ = {
  id: string;
  prompt: string;
  options: string[];        // length 2–6, typically 4
  answerIndex: number;      // 0-based index into options
};


