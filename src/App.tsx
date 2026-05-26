import { useState, useCallback } from "react";
import type { Screen } from "./types";
import { HomeScreen } from "./screens/HomeScreen";
import { QuizGame } from "./screens/quiz/QuizGame";
import { KurukshetraDemo } from "./screens/kurukshetra/KurukshetraDemo";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const goHome = useCallback(() => setScreen("home"), []);
  const goQuiz = useCallback(() => setScreen("quiz"), []);
  const goKurukshetra = useCallback(() => setScreen("kurukshetra"), []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-krishna-bg">
      {screen === "home" && <HomeScreen onStartQuiz={goQuiz} onStartKurukshetra={goKurukshetra} />}
      {screen === "quiz" && <QuizGame onExit={goHome} />}
      {screen === "kurukshetra" && <KurukshetraDemo onExit={goHome} />}
    </div>
  );
}
