export type CardItem = {
  id: string;
  title: string;
};

export type Subtopic = {
  id: string;
  title: string;
  cards: CardItem[];
};

export type Topic = {
  id: string;
  title: string;
  subtopics: Subtopic[];
};


