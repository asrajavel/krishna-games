import { useEffect } from "react";

interface Props {
  title: string;
  score?: string | number;
  message: string;
  onExit: () => void;
}

const AUTO_RESET_MS = 120000;

export function GameResultScreen({ title, score, message, onExit }: Props) {
  useEffect(() => {
    const timeout = window.setTimeout(onExit, AUTO_RESET_MS);
    return () => window.clearTimeout(timeout);
  }, [onExit]);

  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-8 bg-game-bg p-8 text-center text-game-text">
      <h1 className="text-6xl font-extrabold text-game-accent">{title}</h1>
      {score !== undefined && <div className="text-8xl font-bold">{score}</div>}
      <p className="text-3xl text-slate-300">{message}</p>
      <button
        onClick={onExit}
        tabIndex={-1}
        className="rounded-xl border border-game-accent bg-game-panel px-8 py-4 text-xl text-game-accent shadow-lg hover:bg-game-panel-hover"
      >
        Back to Home
      </button>
    </main>
  );
}
