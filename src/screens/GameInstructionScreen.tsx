import { useEffect } from "react";
import { playSound } from "../soundEffects";

interface Props {
  videoSrc: string;
  lines: readonly [string, string?];
  onStart: () => void;
  onExit: () => void;
}

const AUTO_RESET_MS = 120_000;

export function GameInstructionScreen({ videoSrc, lines, onStart, onExit }: Props) {
  useEffect(() => {
    const timeout = window.setTimeout(onExit, AUTO_RESET_MS);
    return () => window.clearTimeout(timeout);
  }, [onExit]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-black/70 p-8">
      <section className="flex w-full max-w-[52rem] flex-col items-center gap-4 rounded-[2rem] border border-white/10 bg-game-panel p-6 text-center shadow-2xl">
        <h1 className="text-4xl font-black text-game-accent">How to Play</h1>

        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="aspect-video w-full rounded-2xl border-2 border-game-accent/30 bg-game-bg object-contain"
        />

        <div className="mt-8 space-y-0.5">
          <p className="text-2xl font-extrabold text-krishna-cream">{lines[0]}</p>
          {lines[1] && <p className="text-xl font-bold text-game-accent">{lines[1]}</p>}
        </div>

        <button
          onClick={() => {
            playSound("click");
            onStart();
          }}
          tabIndex={-1}
          className="mt-8 rounded-[2rem] border-b-8 border-amber-700 bg-game-accent px-10 py-3 text-2xl font-black text-game-bg transition-transform hover:-translate-y-1 hover:bg-game-accent-soft active:translate-y-1 active:border-b-4"
        >
          Start Game
        </button>
      </section>
    </div>
  );
}
