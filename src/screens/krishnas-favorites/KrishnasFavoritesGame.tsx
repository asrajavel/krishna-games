import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { playSound } from "../../soundEffects";

interface Props {
  onExit: () => void;
}

interface FallingItem {
  id: number;
  src: string;
  favorite: boolean;
  lane: number;
  duration: number;
  drift: number;
  feedback?: "correct" | "wrong";
}

const FAVORITES = [
  "./memory-match/peacock.png",
  "./memory-match/flute.png",
  "./memory-match/lotus.png",
  "./memory-match/cow.png",
  "./memory-match/butter.png",
];
const DISTRACTORS = [
  "./krishnas-favorites/phone.png",
  "./krishnas-favorites/fight.png",
  "./krishnas-favorites/junk-food.png",
  "./krishnas-favorites/tv.png",
  "./krishnas-favorites/argue.png",
];
const GAME_DURATION_MS = 75_000;
const FREEZE_MS = 4_000;
const LANE_COOLDOWN_MS = 1_800;

export function KrishnasFavoritesGame({ onExit }: Props) {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"playing" | "frozen" | "results">("playing");
  const nextId = useRef(0);
  const lastSpawnAt = useRef([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (phase !== "playing") return;
    const startedAt = Date.now();

    const spawn = () => {
      const now = Date.now();
      const free = lastSpawnAt.current.flatMap((t, i) => (now - t >= LANE_COOLDOWN_MS ? [i] : []));
      if (!free.length) return;
      const lane = free[Math.floor(Math.random() * free.length)];
      lastSpawnAt.current[lane] = now;
      const id = nextId.current++;
      const favorite = Math.random() < 0.65;
      const choices = favorite ? FAVORITES : DISTRACTORS;
      const elapsed = now - startedAt;
      const duration = Math.max(3.5, 5.5 - (elapsed / GAME_DURATION_MS) * 2);
      setItems((current) => [
        ...current,
        {
          id,
          src: choices[Math.floor(Math.random() * choices.length)],
          favorite,
          lane,
          duration,
          drift: Math.random() * 2.4 - 1.2,
        },
      ]);
    };

    spawn();
    const interval = window.setInterval(spawn, 700);
    return () => window.clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "frozen") return;
    const timeout = window.setTimeout(() => setPhase("results"), FREEZE_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const handleHit = (item: FallingItem) => {
    if (phase !== "playing" || item.feedback) return;
    playSound(item.favorite ? "correct" : "wrong");
    setScore((current) => current + (item.favorite ? 10 : -5));
    setItems((current) =>
      current.map((candidate) =>
        candidate.id === item.id
          ? { ...candidate, feedback: item.favorite ? "correct" : "wrong" }
          : candidate,
      ),
    );
  };

  const handleExpire = useCallback(() => setPhase("frozen"), []);

  if (phase === "results") {
    return (
      <GameResultScreen
        title="Time's Up!"
        score={score}
        message="You found Krishna's favorites!"
        onExit={onExit}
      />
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col gap-4 p-8 pt-10 bg-game-bg text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={phase !== "playing"} />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Krishna&apos;s Favorites</h1>
        <p className="mt-1 text-xl text-slate-300">
          Sweep over peacock, flute, lotus, cow, and butter!
        </p>
        <div className="mt-2 text-5xl font-extrabold text-slate-300">
          Score <span className="text-game-accent">{score}</span>
        </div>
      </header>

      <main className="relative flex-1 min-h-0 max-w-6xl w-full mx-auto overflow-hidden">
        {items.map((item) => (
          <button
            key={item.id}
            onMouseEnter={() => handleHit(item)}
            onAnimationEnd={() => removeItem(item.id)}
            tabIndex={-1}
            className="absolute top-0 z-10 w-44 h-44"
            style={{
              "--drift-mid": `${item.drift}rem`,
              "--drift-end": `${item.drift * -0.5}rem`,
              left: `calc(${item.lane * 20 + 10}% - 5.5rem)`,
              animation: `favorite-fall ${item.duration}s linear both`,
              animationPlayState: phase === "frozen" || item.feedback ? "paused" : "running",
            } as CSSProperties}
          >
            <span
              className={`w-full h-full rounded-full border-4 overflow-hidden flex items-center justify-center shadow-xl
                ${item.feedback === "correct"
                  ? "favorite-hit border-game-correct bg-game-correct/30"
                  : item.feedback === "wrong"
                    ? "shake border-game-wrong bg-game-wrong/30"
                    : "border-game-accent/70 bg-game-text transition-transform duration-150 hover:scale-110"
                }`}
            >
              <img src={item.src} alt="" className="w-full h-full object-contain p-2" />
            </span>
            {item.feedback && (
              <strong className={`absolute -right-4 -top-4 text-3xl font-black drop-shadow-lg ${
                item.feedback === "correct" ? "text-game-correct-soft" : "text-game-wrong-soft"
              }`}>
                {item.feedback === "correct" ? "+10" : "-5"}
              </strong>
            )}
          </button>
        ))}
      </main>

    </div>
  );
}
