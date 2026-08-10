import { useState, useCallback } from "react";
import type { Screen } from "./types";
import { HomeScreen } from "./screens/HomeScreen";
import { QuizGame } from "./screens/quiz/QuizGame";
import { DasavatarGame } from "./screens/dasavatar/DasavatarGame";
import { MemoryGame } from "./screens/memory/MemoryGame";
import { SequenceGame } from "./screens/sequence/SequenceGame";
import { PuzzleGame } from "./screens/puzzle/PuzzleGame";
import { OddOneOutGame } from "./screens/odd-one-out/OddOneOutGame";
import { MatchPairsGame } from "./screens/match-pairs/MatchPairsGame";
import { WhackTargetGame } from "./screens/whack-target/WhackTargetGame";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const goHome = useCallback(() => setScreen("home"), []);
  const goQuiz = useCallback(() => setScreen("quiz"), []);
  const goDasavatar = useCallback(() => setScreen("dasavatar"), []);
  const goMemory = useCallback(() => setScreen("memory"), []);
  const goSequence = useCallback(() => setScreen("sequence"), []);
  const goPuzzle = useCallback(() => setScreen("puzzle"), []);
  const goOddOneOut = useCallback(() => setScreen("odd-one-out"), []);
  const goMatchPairs = useCallback(() => setScreen("match-pairs"), []);
  const goWhackTarget = useCallback(() => setScreen("whack-target"), []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-krishna-bg">
      {screen !== "home" && (
        <button
          onClick={goHome}
          aria-label="Cancel game and return home"
          tabIndex={-1}
          className="absolute left-6 top-3 z-50 rounded-b-xl border-x border-b border-slate-700 bg-game-panel px-4 py-2 text-krishna-cream shadow-lg hover:bg-game-panel-hover hover:text-game-accent"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7" />
          </svg>
        </button>
      )}
      {screen === "home" ? (
        <HomeScreen
          onStartQuiz={goQuiz}
          onStartDasavatar={goDasavatar}
          onStartMemory={goMemory}
          onStartSequence={goSequence}
          onStartPuzzle={goPuzzle}
          onStartOddOneOut={goOddOneOut}
          onStartMatchPairs={goMatchPairs}
          onStartWhackTarget={goWhackTarget}
        />
      ) : screen === "quiz" ? (
        <QuizGame onExit={goHome} />
      ) : screen === "dasavatar" ? (
        <DasavatarGame onExit={goHome} />
      ) : screen === "memory" ? (
        <MemoryGame onExit={goHome} />
      ) : screen === "sequence" ? (
        <SequenceGame onExit={goHome} />
      ) : screen === "puzzle" ? (
        <PuzzleGame onExit={goHome} />
      ) : screen === "odd-one-out" ? (
        <OddOneOutGame onExit={goHome} />
      ) : screen === "match-pairs" ? (
        <MatchPairsGame onExit={goHome} />
      ) : screen === "whack-target" ? (
        <WhackTargetGame onExit={goHome} />
      ) : (
        null
      )}
    </div>
  );
}
