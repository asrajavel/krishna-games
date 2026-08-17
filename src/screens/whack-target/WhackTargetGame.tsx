import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";

interface Props {
  onExit: () => void;
}

interface FallingItem {
  id: number;
  emoji: string;
  favorite: boolean;
  lane: number;
  duration: number;
  drift: number;
  feedback?: "correct" | "wrong";
}

const FAVORITES = ["🧈", "🪈", "🦚", "🐄"];
const DISTRACTORS = ["🍕", "🚗", "⚽", "📱"];
const GAME_DURATION_MS = 75_000;
const FREEZE_MS = 4_000;

export function WhackTargetGame({ onExit }: Props) {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"playing" | "frozen" | "results">("playing");
  const nextId = useRef(0);

  useEffect(() => {
    if (phase !== "playing") return;
    const startedAt = Date.now();

    const spawn = () => {
      const id = nextId.current++;
      const favorite = Math.random() < 0.65;
      const choices = favorite ? FAVORITES : DISTRACTORS;
      const elapsed = Date.now() - startedAt;
      const duration = Math.max(3.5, 5.5 - (elapsed / GAME_DURATION_MS) * 2);
      setItems((current) => [
        ...current,
        {
          id,
          emoji: choices[Math.floor(Math.random() * choices.length)],
          favorite,
          lane: Math.floor(Math.random() * 5),
          duration,
          drift: Math.random() * 4 - 2,
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

  const handleClick = (item: FallingItem) => {
    if (phase !== "playing" || item.feedback) return;
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
      <style>{`
        @keyframes favorite-fall {
          from { transform: translate3d(0, -9rem, 0); }
          50% { transform: translate3d(var(--drift-mid), calc(50vh - 4rem), 0); }
          to { transform: translate3d(var(--drift-end), calc(100vh - 8rem), 0); }
        }
        @keyframes favorite-hit {
          50% { transform: scale(1.3); filter: brightness(1.5); }
        }
        @keyframes favorite-wrong {
          25%, 75% { transform: translateX(-0.5rem); }
          50% { transform: translateX(0.5rem); }
        }
      `}</style>

      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={phase !== "playing"} />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Krishna&apos;s Favorites</h1>
        <p className="mt-1 text-xl text-slate-300">
          Click butter, flutes, peacock feathers, and cows!
        </p>
      </header>

      <main className="relative flex-1 min-h-0 max-w-6xl w-full mx-auto overflow-hidden">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            onAnimationEnd={() => removeItem(item.id)}
            tabIndex={-1}
            className="absolute top-0 z-10 w-28 h-28"
            style={{
              "--drift-mid": `${item.drift}rem`,
              "--drift-end": `${item.drift * -0.5}rem`,
              left: `calc(${item.lane * 20 + 10}% - 3.5rem)`,
              animation: `favorite-fall ${item.duration}s linear both`,
              animationPlayState: phase === "frozen" || item.feedback ? "paused" : "running",
            } as CSSProperties}
          >
            <span
              className={`w-full h-full rounded-full border-4 flex items-center justify-center text-7xl shadow-xl
                ${item.feedback === "correct"
                  ? "border-game-correct bg-game-correct/30"
                  : item.feedback === "wrong"
                    ? "border-game-wrong bg-game-wrong/30"
                    : "border-game-accent/70 bg-game-panel-hover transition-transform duration-150 hover:scale-110"
                }`}
              style={{
                animation: item.feedback
                  ? `${item.feedback === "correct" ? "favorite-hit" : "favorite-wrong"} 550ms ease-out`
                  : undefined,
              }}
            >
              {item.emoji}
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
