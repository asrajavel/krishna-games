import { useEffect, useState } from "react";

interface Props {
  durationMs: number;
  onExpire: () => void;
  paused?: boolean;
  variant?: "default" | "edge";
}

export function Timer({ durationMs, onExpire, paused = false, variant = "default" }: Props) {
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
    if (elapsed === durationMs && !paused) onExpire();
  }, [durationMs, elapsed, onExpire, paused]);

  const progress = 1 - elapsed / durationMs;
  const seconds = Math.ceil((durationMs - elapsed) / 1000);
  const color =
    progress > 0.6 ? "bg-krishna-gold" :
    progress > 0.3 ? "bg-krishna-green" :
    "bg-krishna-wrong";

  if (variant === "edge") {
    return (
      <div className="relative h-3 w-full bg-white/10 overflow-visible shadow-[0_4px_18px_rgba(0,0,0,0.35)]">
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

  return (
    <div className="w-full flex items-center gap-4">
      <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-100`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="text-2xl font-bold text-krishna-cream w-12 text-right">
        {seconds}s
      </span>
    </div>
  );
}
