import { useState, useCallback } from "react";
import type { Screen } from "./types";
import { HomeScreen } from "./screens/HomeScreen";
import { QuizGame } from "./screens/quiz/QuizGame";
import { DasavatarGame } from "./screens/dasavatar/DasavatarGame";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const goHome = useCallback(() => setScreen("home"), []);
  const goQuiz = useCallback(() => setScreen("quiz"), []);
  const goDasavatar = useCallback(() => setScreen("dasavatar"), []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-krishna-bg">
      {screen === "home" ? (
        <HomeScreen onStartQuiz={goQuiz} onStartDasavatar={goDasavatar} />
      ) : screen === "quiz" ? (
        <QuizGame onExit={goHome} />
      ) : (
        <DasavatarGame onExit={goHome} />
      )}
    </div>
  );
}
