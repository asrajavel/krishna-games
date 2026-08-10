export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  image?: string;
}

export type Screen = "home" | "quiz" | "dasavatar" | "memory" | "sequence";

