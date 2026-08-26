import { useEffect, useState } from "react";
import { playSound } from "../soundEffects";

interface Props {
  durationMs: number;
  onExpire: () => void;
  paused?: boolean;
}

export function Timer({ durationMs, onExpire, paused = false }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(
      () => setElapsed((prev) => Math.min(prev + 100, durationMs)),
      100,
    );
    return () => clearInterval(interval);
  }, [durationMs, paused]);

  useEffect(() => {
    if (elapsed === durationMs && !paused) {
      playSound("timeout");
      onExpire();
    }
  }, [durationMs, elapsed, onExpire, paused]);

  const progress = 1 - elapsed / durationMs;
  const seconds = Math.ceil((durationMs - elapsed) / 1000);
  const color =
    progress > 0.6 ? "bg-krishna-gold" :
    progress > 0.3 ? "bg-krishna-green" :
    "bg-krishna-wrong";

  return (
    <div className="relative h-3 w-full overflow-visible bg-white/10 shadow-[0_0.25rem_1.125rem_rgba(0,0,0,0.35)]">
      <div
        className={`h-full ${color} transition-all duration-100`}
        style={{ width: `${progress * 100}%` }}
      />
      <span className="absolute right-6 top-3 rounded-b-xl border-x border-b border-slate-700 bg-game-panel px-4 py-1 text-xl font-extrabold text-krishna-cream shadow-lg">
        {seconds}s
      </span>
    </div>
  );
}
