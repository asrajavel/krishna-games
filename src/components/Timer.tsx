import { useEffect, useState } from "react";

interface Props {
  durationMs: number;
  onExpire: () => void;
  paused?: boolean;
}

export function Timer({ durationMs, onExpire, paused = false }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 100;
        if (next >= durationMs) {
          clearInterval(interval);
          onExpire();
          return durationMs;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [durationMs, onExpire, paused]);

  const progress = 1 - elapsed / durationMs;
  const seconds = Math.ceil((durationMs - elapsed) / 1000);
  const color =
    progress > 0.6 ? "bg-krishna-correct" :
    progress > 0.3 ? "bg-yellow-400" :
    "bg-krishna-wrong";

  return (
    <div className="w-full flex items-center gap-4">
      <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
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
