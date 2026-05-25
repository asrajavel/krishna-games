export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export type Screen = "home" | "quiz";

