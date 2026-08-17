import { useEffect, useState } from "react";

interface Props {
  title: string;
  score?: string | number;
  message: string;
  onExit: () => void;
}

const AUTO_RESET_SECONDS = 10;

export function GameResultScreen({ title, score, message, onExit }: Props) {
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);

  useEffect(() => {
    const interval = window.setInterval(() => setCountdown((current) => current - 1), 1000);
    const timeout = window.setTimeout(onExit, AUTO_RESET_SECONDS * 1000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [onExit]);

  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-8 bg-game-bg p-8 text-center text-game-text">
      <h1 className="text-6xl font-extrabold text-game-accent">{title}</h1>
      {score !== undefined && <div className="text-8xl font-bold">{score}</div>}
      <p className="text-3xl text-slate-300">{message}</p>
      <p className="text-xl text-slate-500">Next player in {countdown}...</p>
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
