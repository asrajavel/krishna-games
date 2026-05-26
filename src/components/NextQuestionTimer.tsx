import { useEffect, useState } from "react";

interface Props {
  durationMs: number;
  active: boolean;
}

export function NextQuestionTimer({ durationMs, active }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) { setElapsed(0); return; }
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 50;
        if (next >= durationMs) { clearInterval(interval); return durationMs; }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [active, durationMs]);

  const progress = 1 - elapsed / durationMs;
  const seconds = Math.ceil((durationMs - elapsed) / 1000);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-krishna-gold rounded-full transition-all duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="text-krishna-gold text-lg font-bold w-24 shrink-0">
        {active ? `Next in ${seconds}s` : ""}
      </span>
    </div>
  );
}
