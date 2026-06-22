import { useEffect, useState } from "react";

interface Props {
  score: number;
  total: number;
  onDone: () => void;
}

const AUTO_RESET_SECONDS = 10;

export function QuizResult({ score, total, onDone }: Props) {
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onDone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onDone]);

  const getMessage = () => {
    if (score === total) return "Hare Krishna! Perfect!";
    if (score >= total * 0.6) return "Well played! Jai Shri Krishna!";
    return "Keep learning about Krishna!";
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8 bg-game-bg text-game-text">
      <div className="rounded-3xl border border-slate-700 bg-game-panel p-12 text-center shadow-2xl">
        <h2 className="text-5xl font-bold text-game-accent">Quiz Complete!</h2>
        <div className="mt-8 text-8xl font-bold">
          {score} / {total}
        </div>
        <p className="mt-8 text-3xl text-slate-300">{getMessage()}</p>
      </div>
      <div className="text-xl text-slate-500 mt-8">
        Next player in {countdown}...
      </div>
      <button
        onClick={onDone}
        tabIndex={-1}
        className="mt-4 px-8 py-4 bg-game-panel border border-game-accent rounded-xl text-game-accent text-xl hover:bg-game-panel-hover shadow-lg"
      >
        Back to Home
      </button>
    </div>
  );
}
