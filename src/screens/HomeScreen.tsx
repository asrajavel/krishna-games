import { GameCard } from "../components/GameCard";
import { GAMES, type GameId } from "../games";

interface Props {
  onStart: (game: GameId) => void;
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const duration = Math.random() * 8 + 6;
  return {
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    duration,
    delay: -(Math.random() * duration),
    color: Math.random() > 0.5 ? "rgba(255,200,87,0.65)" : "rgba(31,199,182,0.5)",
  };
});

export function HomeScreen({ onStart }: Props) {
  return (
    <div className="festival-stage relative flex h-full w-full flex-col items-center justify-center gap-6 p-6">
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
        <p className="mb-3 text-lg font-bold uppercase tracking-[0.55em] text-krishna-green">
          Enter the world of
        </p>
        <h1 className="shimmer-text text-8xl font-black tracking-tight drop-shadow-lg">
          Krishna Leela
        </h1>
        <p className="mt-3 text-xl tracking-[0.2em] text-krishna-cream/55">
          Ten joyful challenges · One divine adventure
        </p>
      </header>
      <div className="relative z-10 grid h-[28rem] max-h-full w-full max-w-[90rem] grid-cols-5 grid-rows-2 gap-5">
        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            imageSrc={"imageSrc" in game ? game.imageSrc : undefined}
            emoji={"emoji" in game ? game.emoji : undefined}
            onClick={() => onStart(game.id)}
          />
        ))}
      </div>
    </div>
  );
}
