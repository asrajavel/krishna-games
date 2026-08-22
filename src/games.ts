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
  imageSrc: string;
  variants?: readonly GameVariant[];
  Component: ComponentType<GameProps>;
}

export const GAMES = [
  {
    id: "quiz",
    title: "Krishna Quiz",
    imageSrc: "./quiz/board.png",
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
    imageSrc: "./dasavatar/board.png",
    variants: [
      { id: "kids", title: "Match the Names", description: "For Kids", imageSrc: "./dasavatar/kids.png" },
      { id: "adults", title: "Match the Clues", description: "For Teens and Grown-ups", imageSrc: "./dasavatar/adults.png" },
    ],
    Component: DasavatarGame,
  },
  {
    id: "memory",
    title: "Memory Match",
    imageSrc: "./memory/board.png",
    variants: [
      { id: "kids", title: "Six Pairs", description: "For Kids", imageSrc: "./memory/kids.png" },
      { id: "adults", title: "Ten Pairs", description: "For Teens and Grown-ups", imageSrc: "./memory/adults.png" },
    ],
    Component: MemoryGame,
  },
  { id: "sequence", title: "Lila Sequence", imageSrc: "./sequence/board.png", Component: SequenceGame },
  { id: "puzzle", title: "Picture Puzzle", imageSrc: "./puzzle/board.png", Component: PuzzleGame },
  { id: "odd-one-out", title: "Odd One Out", imageSrc: "./odd-one-out/board.png", Component: OddOneOutGame },
  { id: "match-pairs", title: "Match the Pairs", imageSrc: "./match-pairs/board.png", Component: MatchPairsGame },
  { id: "whack-target", title: "Krishna's Favorites", imageSrc: "./whack-target/board.png", Component: WhackTargetGame },
  { id: "route-to-vrindavan", title: "Route to Vrindavan", imageSrc: "./route-to-vrindavan/board.png", Component: RouteToVrindavanGame },
  {
    id: "maze",
    title: "Krishna’s Forest Maze",
    imageSrc: "./maze/hedge-maze.png",
    variants: [
      { id: "kids", title: "Easy Mode", description: "For Kids", imageSrc: "./memory/kids.png" },
      { id: "adults", title: "Hard Mode", description: "For Teens and Grown-ups", imageSrc: "./memory/adults.png" },
    ],
    Component: MazeGame,
  },
] as const satisfies readonly Game[];

export type GameId = (typeof GAMES)[number]["id"];
