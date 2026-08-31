import type { ComponentType } from "react";
import { DasavatarMatchGame } from "./screens/dasavatar-match/DasavatarMatchGame";
import { GuessThePictureGame } from "./screens/guess-the-picture/GuessThePictureGame";
import { MatchPairsGame } from "./screens/match-pairs/MatchPairsGame";
import { KrishnasForestMazeGame } from "./screens/krishnas-forest-maze/KrishnasForestMazeGame";
import { MemoryMatchGame } from "./screens/memory-match/MemoryMatchGame";
import { OddOneOutGame } from "./screens/odd-one-out/OddOneOutGame";
import { PicturePuzzleGame } from "./screens/picture-puzzle/PicturePuzzleGame";
import { KrishnaQuizGame } from "./screens/krishna-quiz/KrishnaQuizGame";
import { RouteToVrindavanGame } from "./screens/route-to-vrindavan/RouteToVrindavanGame";
import { LilaSequenceGame } from "./screens/lila-sequence/LilaSequenceGame";
import { WriteTheSlokaGame } from "./screens/write-the-sloka/WriteTheSlokaGame";
import { KrishnasFavoritesGame } from "./screens/krishnas-favorites/KrishnasFavoritesGame";

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
  instructionVideoSrc?: string;
  instructionLines?: readonly [string, string?];
  variants?: readonly GameVariant[];
  Component: ComponentType<GameProps>;
}

export const GAMES = [
  {
    id: "krishna-quiz",
    title: "Krishna Quiz",
    imageSrc: "./krishna-quiz/board.png",
    variants: [
      { id: "krishna-lila-kids", title: "Krishna Lila", description: "For Kids", imageSrc: "./krishna-quiz/krishna-lila.png" },
      { id: "bhagavad-gita-adults", title: "Bhagavad-gita", description: "For Teens and Grown-ups", imageSrc: "./krishna-quiz/bhagavad-gita.png" },
      { id: "mahabharata-adults", title: "Mahabharata", description: "For Teens and Grown-ups", imageSrc: "./krishna-quiz/mahabharata.png" },
      { id: "srimad-bhagavatam-adults", title: "Srimad-Bhagavatam", description: "For Teens and Grown-ups", imageSrc: "./krishna-quiz/srimad-bhagavatam.png" },
      { id: "general-krishna-trivia-adults", title: "Krishna Trivia", description: "For Teens and Grown-ups", imageSrc: "./krishna-quiz/general-trivia.png" },
    ],
    Component: KrishnaQuizGame,
  },
  {
    id: "dasavatar-match",
    title: "Dasavatar Match",
    imageSrc: "./dasavatar-match/board.png",
    variants: [
      { id: "kids", title: "Match the Names", description: "For Kids", imageSrc: "./dasavatar-match/kids.png" },
      { id: "adults", title: "Match the Clues", description: "For Teens and Grown-ups", imageSrc: "./dasavatar-match/adults.png" },
    ],
    Component: DasavatarMatchGame,
  },
  {
    id: "memory-match",
    title: "Memory Match",
    imageSrc: "./memory-match/board.png",
    variants: [
      { id: "kids", title: "Six Pairs", description: "For Kids", imageSrc: "./memory-match/kids.png" },
      { id: "adults", title: "Ten Pairs", description: "For Teens and Grown-ups", imageSrc: "./memory-match/adults.png" },
    ],
    Component: MemoryMatchGame,
  },
  {
    id: "lila-sequence",
    title: "Lila Sequence",
    imageSrc: "./lila-sequence/board.png",
    instructionVideoSrc: "./instructions/lila-sequence-crop.mp4",
    instructionLines: [
      "Drag one scene onto another to swap",
      "Total time: 75 seconds",
    ],
    variants: [
      { id: "kids", title: "Easy Mode", description: "For Kids", imageSrc: "./memory-match/kids.png" },
      { id: "adults", title: "Hard Mode", description: "For Teens and Grown-ups", imageSrc: "./memory-match/adults.png" },
    ],
    Component: LilaSequenceGame,
  },
  { id: "picture-puzzle", title: "Picture Puzzle", imageSrc: "./picture-puzzle/board.png", Component: PicturePuzzleGame },
  { id: "odd-one-out", title: "Odd One Out", imageSrc: "./odd-one-out/board.png", Component: OddOneOutGame },
  { id: "guess-the-picture", title: "Guess the Picture", imageSrc: "./guess-the-picture/board.png", Component: GuessThePictureGame },
  { id: "match-pairs", title: "Match the Pairs", imageSrc: "./match-pairs/board.png", Component: MatchPairsGame },
  { id: "krishnas-favorites", title: "Krishna's Favorites", imageSrc: "./krishnas-favorites/board.png", Component: KrishnasFavoritesGame },
  { id: "route-to-vrindavan", title: "Route to Vrindavan", imageSrc: "./route-to-vrindavan/board.png", Component: RouteToVrindavanGame },
  { id: "write-the-sloka", title: "Write the Sloka", imageSrc: "./write-the-sloka/board.png", Component: WriteTheSlokaGame },
  {
    id: "krishnas-forest-maze",
    title: "Krishna’s Forest Maze",
    imageSrc: "./krishnas-forest-maze/hedge-maze.png",
    variants: [
      { id: "kids", title: "Easy Mode", description: "For Kids", imageSrc: "./memory-match/kids.png" },
      { id: "adults", title: "Hard Mode", description: "For Teens and Grown-ups", imageSrc: "./memory-match/adults.png" },
    ],
    Component: KrishnasForestMazeGame,
  },
] as const satisfies readonly Game[];

export type GameId = (typeof GAMES)[number]["id"];
