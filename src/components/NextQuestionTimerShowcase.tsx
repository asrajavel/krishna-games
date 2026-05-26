import { useEffect, useState } from "react";

interface Props {
  durationMs: number;
  active: boolean;
}

function useCountdown(durationMs: number, active: boolean) {
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

  const progress = 1 - elapsed / durationMs; // 1 → 0
  const seconds = Math.ceil((durationMs - elapsed) / 1000);
  return { progress, seconds };
}

// Style 1: Thin flat bar pinned to bottom edge — minimal, unobtrusive
function Style1({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-white/40 text-sm">Style 1 — Thin edge bar</span>
      <div className="w-full h-2 bg-white/10 rounded-none overflow-hidden">
        <div
          className="h-full bg-krishna-gold transition-all duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

// Style 2: Pill bar + countdown label — clear, informative
function Style2({ progress, seconds }: { progress: number; seconds: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-white/40 text-sm">Style 2 — Pill bar + label</span>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-krishna-gold rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-krishna-gold text-lg font-bold w-24 shrink-0">
          Next in {seconds}s
        </span>
      </div>
    </div>
  );
}

// Style 3: Gradient glow bar — lush, thematic
function Style3({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-white/40 text-sm">Style 3 — Gradient glow bar</span>
      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, #0fa, #00d4ff, #ffd700)",
            boxShadow: "0 0 12px rgba(0,212,255,0.7)",
          }}
        />
      </div>
    </div>
  );
}

// Style 4: Segmented blocks — chunky, game-like
function Style4({ progress }: { progress: number }) {
  const total = 8;
  const filled = Math.round(progress * total);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-white/40 text-sm">Style 4 — Segmented blocks</span>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-5 rounded transition-all duration-100"
            style={{
              background: i < filled ? "#ffd700" : "rgba(255,255,255,0.08)",
              boxShadow: i < filled ? "0 0 6px rgba(255,215,0,0.5)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Style 5: Striped shimmer bar — animated, lively
function Style5({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-white/40 text-sm">Style 5 — Shimmer stripe bar</span>
      <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100 shimmer-bar"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

export function NextQuestionTimerShowcase({ durationMs, active }: Props) {
  const { progress, seconds } = useCountdown(durationMs, active);
  if (!active) return null;

  return (
    <div className="w-full max-w-2xl flex flex-col gap-5 p-4 rounded-xl border border-white/10 bg-white/5">
      <p className="text-white/50 text-sm text-center tracking-wide uppercase">
        Pick a next-question timer style
      </p>
      <Style1 progress={progress} />
      <Style2 progress={progress} seconds={seconds} />
      <Style3 progress={progress} />
      <Style4 progress={progress} />
      <Style5 progress={progress} />
    </div>
  );
}
