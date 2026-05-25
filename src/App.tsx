import { useState, useCallback } from "react";
import type { Screen } from "./types";
import { HomeScreen } from "./screens/HomeScreen";
import { QuizGame } from "./screens/quiz/QuizGame";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const goHome = useCallback(() => setScreen("home"), []);
  const goQuiz = useCallback(() => setScreen("quiz"), []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-krishna-bg">
      {screen === "home" ? (
        <HomeScreen onStartQuiz={goQuiz} />
      ) : (
        <QuizGame onExit={goHome} />
      )}
    </div>
  );
}
