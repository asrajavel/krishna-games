import type { ComponentType } from "react";
import { DasavatarGame } from "./screens/dasavatar/DasavatarGame";
import { MatchPairsGame } from "./screens/match-pairs/MatchPairsGame";
import { MazeGame } from "./screens/maze/MazeGame";
import { MemoryGame } from "./screens/memory/MemoryGame";
import { OddOneOutGame } from "./screens/odd-one-out/OddOneOutGame";
import { PuzzleGame } from "./screens/puzzle/PuzzleGame";
import { QuizGame } from "./screens/quiz/QuizGame";
import { RouteToVrindavanGame } from "./screens/route-to-vrindavan/RouteToVrindavanGame";
import { SequenceGame } from "./screens/sequence/SequenceGame";
import { WhackTargetGame } from "./screens/whack-target/WhackTargetGame";

export interface GameVariant {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
}

export interface GameProps {
  onExit: () => void;
  variantId?: string;
  variantImageSrc?: string;
}

interface Game {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  emoji?: string;
  variants?: readonly GameVariant[];
  Component: ComponentType<GameProps>;
}

export const GAMES = [
  {
    id: "quiz",
    title: "Krishna Quiz",
    description: "Test your knowledge!",
    imageSrc: "./quiz/quiz-icon.svg",
    variants: [
      { id: "krishna-lila-kids", title: "Krishna Lila", description: "For Kids", imageSrc: "./quiz/krishna-lila.png" },
      { id: "bhagavad-gita-adults", title: "Bhagavad-gita", description: "For Teens and Grown-ups", imageSrc: "./quiz/bhagavad-gita.png" },
      { id: "mahabharata-adults", title: "Mahabharata", description: "For Teens and Grown-ups", imageSrc: "./quiz/mahabharata.png" },
      { id: "srimad-bhagavatam-adults", title: "Srimad-Bhagavatam", description: "For Teens and Grown-ups", imageSrc: "./quiz/srimad-bhagavatam.png" },
      { id: "general-krishna-trivia-adults", title: "General Krishna Trivia", description: "For Teens and Grown-ups", imageSrc: "./quiz/general-trivia.png" },
    ],
    Component: QuizGame,
  },
  {
    id: "dasavatar",
    title: "Dasavatar Match",
    description: "Match the ten avatars",
    imageSrc: "./dasavatar/dasavatar-icon.svg",
    variants: [
      { id: "kids", title: "Match the Names", description: "For Kids", imageSrc: "./dasavatar/kids.png" },
      { id: "adults", title: "Match the Clues", description: "For Teens and Grown-ups", imageSrc: "./dasavatar/adults.png" },
    ],
    Component: DasavatarGame,
  },
  { id: "memory", title: "Memory Match", description: "Flip cards to find pairs", imageSrc: "./memory/memory-icon.svg", Component: MemoryGame },
  { id: "sequence", title: "Lila Sequence", description: "Put Krishna's pastimes in order", imageSrc: "./sequence/sequence-icon.svg", Component: SequenceGame },
  { id: "puzzle", title: "Picture Puzzle", description: "Reassemble Krishna's picture", imageSrc: "./puzzle/yashoda-krishna.jpg", Component: PuzzleGame },
  { id: "odd-one-out", title: "Odd One Out", description: "Find what does not belong", emoji: "🔍", Component: OddOneOutGame },
  { id: "match-pairs", title: "Match the Pairs", description: "Connect characters and symbols", emoji: "🔗", Component: MatchPairsGame },
  { id: "whack-target", title: "Krishna's Favorites", description: "Catch Krishna's favorite things", emoji: "🧈", Component: WhackTargetGame },
  { id: "route-to-vrindavan", title: "Route to Vrindavan", description: "Guide the pilgrimage bus", imageSrc: "./route-to-vrindavan/icon.svg", Component: RouteToVrindavanGame },
  { id: "maze", title: "Krishna’s Forest Maze", description: "Trace the path to the cows", imageSrc: "./maze/icon.svg", Component: MazeGame },
] as const satisfies readonly Game[];

export type GameId = (typeof GAMES)[number]["id"];
