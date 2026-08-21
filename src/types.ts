export interface Question {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  image?: string;
}

