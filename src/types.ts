export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export type Screen = "home" | "quiz";

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  answered: boolean;
  selectedIndex: number | null;
}

export type InputAction = "up" | "down" | "select";
