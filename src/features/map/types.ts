export interface Card {
  id: string;
  title: string;
  content?: string;
}

export interface Subtopic {
  id: string;
  title: string;
  cards: Card[];
}

export interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}


export interface ConceptNode {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
  progress: number;
  categoryId?: number;
}

