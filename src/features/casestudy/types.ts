export interface CaseStudy {
  id: string;
  title: string;
  case: string;
  questions: Question[];
}

export interface Question {
  id: string;
  number: number;
  text: string;
  answer: string;
}

export interface CaseStudyState {
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  showAnswer: boolean;
  scores: Record<string, number>;
}
