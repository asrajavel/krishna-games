import { useEffect, useState, useCallback } from "react";
import { useInput } from "../../hooks/useInput";

interface Props {
  score: number;
  total: number;
  onDone: () => void;
}

const AUTO_RESET_SECONDS = 10;

export function QuizResult({ score, total, onDone }: Props) {
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);

  const noop = useCallback(() => {}, []);
  useInput({ onUp: noop, onDown: noop, onSelect: onDone });

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
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8">
      <h2 className="text-5xl font-bold text-krishna-gold">Quiz Complete!</h2>
      <div className="text-8xl font-bold text-krishna-cream">
        {score} / {total}
      </div>
      <p className="text-3xl text-krishna-cream/80">{getMessage()}</p>
      <div className="text-xl text-krishna-cream/50 mt-8">
        Next player in {countdown}...
      </div>
      <button
        onClick={onDone}
        className="mt-4 px-8 py-4 bg-krishna-gold/10 border-2 border-krishna-gold rounded-xl text-krishna-gold text-xl hover:bg-krishna-gold/20 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
      >
        Back to Home
      </button>
    </div>
  );
}
