import { useEffect, useState } from "react";
import { GameCard } from "../components/GameCard";
import { GAMES, type GameId } from "../games";

interface Props {
  onStart: (game: GameId) => void;
}

const ATTRACT_MODE_IDLE_MS = 5_000;

const PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const duration = Math.random() * 8 + 6;
  return {
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${(Math.random() * 4 + 2) / 16}rem`,
    duration,
    delay: -(Math.random() * duration),
    color: Math.random() > 0.5
      ? "color-mix(in srgb, var(--color-game-accent) 65%, transparent)"
      : "color-mix(in srgb, var(--color-krishna-green) 50%, transparent)",
  };
});

export function HomeScreen({ onStart }: Props) {
  const [attractMode, setAttractMode] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    let idleTimeout: number;
    const resetIdleTimeout = () => {
      window.clearTimeout(idleTimeout);
      setAttractMode(false);
      idleTimeout = window.setTimeout(() => setAttractMode(true), ATTRACT_MODE_IDLE_MS);
    };

    resetIdleTimeout();
    window.addEventListener("pointermove", resetIdleTimeout);
    window.addEventListener("pointerdown", resetIdleTimeout);

    return () => {
      window.clearTimeout(idleTimeout);
      window.removeEventListener("pointermove", resetIdleTimeout);
      window.removeEventListener("pointerdown", resetIdleTimeout);
    };
  }, []);

  if (attractMode) {
    const game = GAMES[demoIndex];

    return (
      <div data-attract-mode className="flex h-full w-full flex-col bg-black">
        <h1 className="shrink-0 border-b border-white/15 bg-game-panel py-4 text-center text-5xl font-black text-game-accent shadow-2xl">
          {game.title}
        </h1>
        <video
          key={game.id}
          src={`./instructions/${game.id}.mp4`}
          autoPlay
          muted
          playsInline
          onEnded={() => setDemoIndex((current) => (current + 1) % GAMES.length)}
          className="attract-video min-h-0 w-full flex-1 object-contain"
        />
      </div>
    );
  }

  return (
    <div className="festival-stage relative flex h-full w-full flex-col items-center justify-center gap-14 p-10">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      <header className="relative z-10 text-center">
        <h1 className="shimmer-text text-8xl font-black tracking-tight drop-shadow-lg">
          Krishna Lila Games
        </h1>
      </header>
      <div className="relative z-10 grid h-[48rem] max-h-full w-full max-w-[116rem] grid-cols-4 grid-rows-3 gap-6">
        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            imageSrc={game.imageSrc}
            videoSrc={`./instructions/${game.id}.mp4`}
            onClick={() => onStart(game.id)}
          />
        ))}
      </div>
    </div>
  );
}
