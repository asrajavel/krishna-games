import { useState, useCallback, type ComponentType } from "react";
import { GAMES, type GameId, type GameProps } from "./games";
import { GameVariantScreen } from "./screens/GameVariantScreen";
import { HomeScreen } from "./screens/HomeScreen";

interface Selection {
  gameId: GameId;
  variantId?: string;
}

export default function App() {
  const [selection, setSelection] = useState<Selection | null>(null);

  const goHome = useCallback(() => setSelection(null), []);
  const startGame = useCallback((gameId: GameId) => setSelection({ gameId }), []);
  const selectVariant = useCallback((variantId: string) => {
    setSelection((current) => current ? { ...current, variantId } : current);
  }, []);

  const activeGame = selection
    ? GAMES.find((game) => game.id === selection.gameId)
    : undefined;
  const variants = activeGame && "variants" in activeGame
    ? activeGame.variants
    : undefined;
  const ActiveGame = activeGame?.Component as ComponentType<GameProps> | undefined;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-krishna-bg">
      {selection && (
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
      {!selection ? (
        <HomeScreen onStart={startGame} />
      ) : variants && !selection.variantId ? (
        <GameVariantScreen
          gameTitle={activeGame?.title ?? ""}
          variants={variants}
          onSelect={selectVariant}
          onExit={goHome}
        />
      ) : ActiveGame ? (
        <ActiveGame onExit={goHome} variantId={selection.variantId} />
      ) : (
        null
      )}
    </div>
  );
}
