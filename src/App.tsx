import { useState, useCallback } from "react";
import { GAMES, type GameId } from "./games";
import { HomeScreen } from "./screens/HomeScreen";

export default function App() {
  const [screen, setScreen] = useState<"home" | GameId>("home");

  const goHome = useCallback(() => setScreen("home"), []);
  const startGame = useCallback((game: GameId) => setScreen(game), []);
  const ActiveGame = screen === "home"
    ? null
    : GAMES.find((game) => game.id === screen)?.Component;

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
        <HomeScreen onStart={startGame} />
      ) : ActiveGame ? (
        <ActiveGame onExit={goHome} />
      ) : (
        null
      )}
    </div>
  );
}
