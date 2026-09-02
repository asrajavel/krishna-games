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
  instructionLines: readonly [string, string?];
  variants?: readonly GameVariant[];
  Component: ComponentType<GameProps>;
}

export const GAMES = [
  {
    id: "krishna-quiz",
    title: "Krishna Quiz",
    imageSrc: "./krishna-quiz/board.png",
    instructionLines: [
      "Choose the correct answer",
      "15 seconds for each question",
    ],
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
    instructionLines: [
      "Drag each name or clue to the matching avatar",
      "Total time: 60 seconds",
    ],
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
    instructionLines: [
      "Flip two cards and find the matching pairs",
      "Total time: 75 seconds",
    ],
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
  {
    id: "picture-puzzle",
    title: "Picture Puzzle",
    imageSrc: "./picture-puzzle/board.png",
    instructionLines: [
      "Drag each piece into the correct place",
      "Total time: 75 seconds",
    ],
    Component: PicturePuzzleGame,
  },
  {
    id: "odd-one-out",
    title: "Odd One Out",
    imageSrc: "./odd-one-out/board.png",
    instructionLines: [
      "Choose the item that does not belong",
      "Total time: 75 seconds",
    ],
    Component: OddOneOutGame,
  },
  {
    id: "guess-the-picture",
    title: "Guess the Picture",
    imageSrc: "./guess-the-picture/board.png",
    instructionLines: [
      "Choose what the picture shows, can use the hint button if needed",
      "15 seconds for each picture",
    ],
    Component: GuessThePictureGame,
  },
  {
    id: "match-pairs",
    title: "Match the Pairs",
    imageSrc: "./match-pairs/board.png",
    instructionLines: [
      "Choose an item, then choose its matching pair",
      "Total time: 75 seconds",
    ],
    variants: [
      { id: "kids", title: "Name Pairs", description: "For Kids", imageSrc: "./memory-match/kids.png" },
      { id: "adults", title: "Picture Pairs", description: "For Teens and Grown-ups", imageSrc: "./memory-match/adults.png" },
    ],
    Component: MatchPairsGame,
  },
  {
    id: "krishnas-favorites",
    title: "Krishna's Favorites",
    imageSrc: "./krishnas-favorites/board.png",
    instructionLines: [
      "Mouse over to collect Krishna's favorites and avoid the others",
      "Total time: 75 seconds",
    ],
    Component: KrishnasFavoritesGame,
  },
  {
    id: "route-to-vrindavan",
    title: "Route to Vrindavan",
    imageSrc: "./route-to-vrindavan/board.png",
    instructionLines: [
      "Choose the correct city at each turn",
      "You have 3 lives and 150 seconds",
    ],
    Component: RouteToVrindavanGame,
  },
  {
    id: "write-the-sloka",
    title: "Write the Sloka",
    imageSrc: "./write-the-sloka/board.png",
    instructionLines: [
      "Read the scrolling verse and write it in your notebook",
      "60 seconds for each verse",
    ],
    Component: WriteTheSlokaGame,
  },
  {
    id: "krishnas-forest-maze",
    title: "Krishna’s Forest Maze",
    imageSrc: "./krishnas-forest-maze/hedge-maze.png",
    instructionLines: [
      "Drag Krishna through the maze to reach the cows",
      "Total time: 75 seconds",
    ],
    variants: [
      { id: "kids", title: "Easy Mode", description: "For Kids", imageSrc: "./memory-match/kids.png" },
      { id: "adults", title: "Hard Mode", description: "For Teens and Grown-ups", imageSrc: "./memory-match/adults.png" },
    ],
    Component: KrishnasForestMazeGame,
  },
] as const satisfies readonly Game[];

export type GameId = (typeof GAMES)[number]["id"];
