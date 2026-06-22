import { useEffect, useState } from "react";

interface Props {
  durationMs: number;
  active: boolean;
}

export function NextQuestionTimer({ durationMs, active }: Props) {
  if (!active) return null;

  return <ActiveNextQuestionTimer durationMs={durationMs} />;
}

function ActiveNextQuestionTimer({ durationMs }: Pick<Props, "durationMs">) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 50;
        if (next >= durationMs) { clearInterval(interval); return durationMs; }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [durationMs]);

  const seconds = Math.ceil((durationMs - elapsed) / 1000);

  return (
    <div className="absolute bottom-6 right-8 text-krishna-gold/70 text-2xl font-bold tabular-nums">
      {seconds}s
    </div>
  );
}
