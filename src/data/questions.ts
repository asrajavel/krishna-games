import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the name of Krishna's flute?",
    options: ["Veena", "Murali", "Shehnai", "Tambura"],
    correctIndex: 1,
    image: "./images/flute.jpg",
  },
  {
    id: 2,
    question: "What did young Krishna steal that the gopis complained about?",
    options: ["Fruits", "Butter", "Milk", "Sweets"],
    correctIndex: 1,
    image: "./images/butter.jpg",
  },
  {
    id: 3,
    question: "Which serpent did Krishna dance on to subdue?",
    options: ["Vasuki", "Shesha", "Kaliya", "Takshaka"],
    correctIndex: 2,
    image: "./images/kaliya.jpg",
  },
  {
    id: 4,
    question: "What hill did Krishna lift on His little finger to protect the villagers?",
    options: ["Govardhan", "Himalaya", "Vindhya", "Meru"],
    correctIndex: 0,
    image: "./images/govardhan.jpg",
  },
  {
    id: 5,
    question: "Who was Krishna's foster mother in Gokul?",
    options: ["Devaki", "Kunti", "Yashoda", "Rohini"],
    correctIndex: 2,
    image: "./images/yashoda.jpg",
  },
];

export function getQuestions(): Question[] {
  return QUESTIONS.map((q) => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5) as [string, string, string, string];
    return { ...q, options: shuffledOptions, correctIndex: shuffledOptions.indexOf(correctAnswer) };
  });
}
