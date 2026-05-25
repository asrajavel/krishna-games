import type { Question } from "../types";

export const ALL_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "In which city was Lord Krishna born?",
    options: ["Vrindavan", "Mathura", "Dwarka", "Gokul"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "What is the name of Krishna's flute?",
    options: ["Veena", "Murali", "Shehnai", "Tambura"],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Who was Krishna's childhood friend and cowherd companion?",
    options: ["Arjuna", "Sudama", "Balrama", "Nakula"],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Which sacred text contains Krishna's teachings to Arjuna?",
    options: ["Ramayana", "Vedas", "Bhagavad Gita", "Upanishads"],
    correctIndex: 2,
  },
  {
    id: 5,
    question: "What did young Krishna steal that the gopis complained about?",
    options: ["Fruits", "Butter", "Milk", "Sweets"],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "Which serpent did Krishna dance on to subdue?",
    options: ["Vasuki", "Shesha", "Kaliya", "Takshaka"],
    correctIndex: 2,
  },
  {
    id: 7,
    question: "What hill did Krishna lift on His little finger to protect the villagers?",
    options: ["Govardhan", "Himalaya", "Vindhya", "Meru"],
    correctIndex: 0,
  },
  {
    id: 8,
    question: "Who was Krishna's foster mother in Gokul?",
    options: ["Devaki", "Kunti", "Yashoda", "Rohini"],
    correctIndex: 2,
  },
  {
    id: 9,
    question: "How many chapters are in the Bhagavad Gita?",
    options: ["12", "18", "24", "16"],
    correctIndex: 1,
  },
  {
    id: 10,
    question: "What is Krishna's weapon — the spinning disc called?",
    options: ["Trishul", "Sudarshan Chakra", "Vajra", "Pashupatastra"],
    correctIndex: 1,
  },
];

export function pickRandomQuestions(count: number): Question[] {
  const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q) => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5) as [string, string, string, string];
    return { ...q, options: shuffledOptions, correctIndex: shuffledOptions.indexOf(correctAnswer) };
  });
}
