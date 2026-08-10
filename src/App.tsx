import { useState, useCallback } from "react";
import type { Screen } from "./types";
import { HomeScreen } from "./screens/HomeScreen";
import { QuizGame } from "./screens/quiz/QuizGame";
import { DasavatarGame } from "./screens/dasavatar/DasavatarGame";
import { MemoryGame } from "./screens/memory/MemoryGame";
import { SequenceGame } from "./screens/sequence/SequenceGame";
import { PuzzleGame } from "./screens/puzzle/PuzzleGame";
import { OddOneOutGame } from "./screens/odd-one-out/OddOneOutGame";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const goHome = useCallback(() => setScreen("home"), []);
  const goQuiz = useCallback(() => setScreen("quiz"), []);
  const goDasavatar = useCallback(() => setScreen("dasavatar"), []);
  const goMemory = useCallback(() => setScreen("memory"), []);
  const goSequence = useCallback(() => setScreen("sequence"), []);
  const goPuzzle = useCallback(() => setScreen("puzzle"), []);
  const goOddOneOut = useCallback(() => setScreen("odd-one-out"), []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-krishna-bg">
      {screen === "home" ? (
        <HomeScreen
          onStartQuiz={goQuiz}
          onStartDasavatar={goDasavatar}
          onStartMemory={goMemory}
          onStartSequence={goSequence}
          onStartPuzzle={goPuzzle}
          onStartOddOneOut={goOddOneOut}
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
      ) : (
        null
      )}
    </div>
  );
}
