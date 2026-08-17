import { useCallback, useEffect, useState } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { shuffle } from "../../shuffle";

interface Props {
  onExit: () => void;
}

const PAIRS = [
  { id: "krishna", character: "Krishna", characterEmoji: "🦚", match: "Flute", matchEmoji: "🪈" },
  { id: "radha", character: "Radha", characterEmoji: "🌸", match: "Vrindavan", matchEmoji: "🛕" },
  { id: "balarama", character: "Balarama", characterEmoji: "💪", match: "Plough", matchEmoji: "🪓" },
  { id: "yashoda", character: "Mother Yashoda", characterEmoji: "👩", match: "Butter Pot", matchEmoji: "🫙" },
  { id: "arjuna", character: "Arjuna", characterEmoji: "🏹", match: "Bhagavad Gita", matchEmoji: "📖" },
  { id: "sudama", character: "Sudama", characterEmoji: "🙏", match: "Flattened Rice", matchEmoji: "🍚" },
];

const GAME_DURATION_MS = 75_000;
const CELEBRATION_MS = 4_000;

type Phase = "playing" | "celebrating" | "result";
type Side = "left" | "right";

export function MatchPairsGame({ onExit }: Props) {
  const [matches] = useState(() => shuffle(PAIRS));
  const [selected, setSelected] = useState<{ id: string; side: Side } | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (phase !== "celebrating") return;
    const timeout = window.setTimeout(() => setPhase("result"), CELEBRATION_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  const handlePick = (side: Side, id: string) => {
    if (phase !== "playing" || matched.includes(id)) return;
    if (!selected || selected.side === side) {
      setSelected({ id, side });
      return;
    }
    if (selected.id === id) {
      const nextMatched = [...matched, id];
      setMatched(nextMatched);
      setSelected(null);
      if (nextMatched.length === PAIRS.length) setPhase("celebrating");
      return;
    }

    setWrong(`${side}:${id}`);
    window.setTimeout(() => setWrong(null), 500);
  };

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    setSelected(null);
    setPhase("result");
  }, []);

  if (phase === "result") {
    return (
      <GameResultScreen
        title={timedOut ? "Time's Up!" : "Perfect Match!"}
        score={`${matched.length} / ${PAIRS.length}`}
        message={timedOut ? "Good try! Match every character next time." : "Hare Krishna! You connected every pair."}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 p-8 pt-10 relative bg-game-bg text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={phase !== "playing"} />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Match the Pairs</h1>
        <p className="mt-1 text-xl text-slate-300">
          Choose one item, then choose its match on the other side.
        </p>
      </header>

      <main className="grid grid-cols-[26.25rem_25rem_26.25rem] flex-1 min-h-0 max-w-[77.5rem] w-full mx-auto">
        <svg className="col-start-2 row-start-1 z-10 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {matched.map((id) => {
            const leftIndex = PAIRS.findIndex((pair) => pair.id === id);
            const rightIndex = matches.findIndex((pair) => pair.id === id);
            const y1 = ((leftIndex + 0.5) / PAIRS.length) * 100;
            const y2 = ((rightIndex + 0.5) / PAIRS.length) * 100;
            return (
              <line
                key={id}
                x1="0"
                y1={y1}
                x2="100"
                y2={y2}
                className="stroke-game-correct opacity-75"
                strokeWidth="0.1875rem"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        <div className="col-start-1 row-start-1 relative z-20 grid grid-rows-6 gap-3">
          {PAIRS.map((pair) => {
            const isMatched = matched.includes(pair.id);
            const isSelected = selected?.side === "left" && selected.id === pair.id;
            const isWrong = wrong === `left:${pair.id}`;
            return (
              <button
                key={pair.id}
                onClick={() => handlePick("left", pair.id)}
                disabled={phase !== "playing" || isMatched}
                tabIndex={-1}
                className={`rounded-2xl border-2 px-6 flex items-center gap-5 text-left transition-all shadow-lg ${
                  isMatched
                    ? "border-game-correct bg-game-correct/15"
                    : isSelected
                      ? "border-game-accent bg-game-panel-hover scale-[1.02]"
                      : isWrong
                        ? "border-game-wrong bg-game-wrong/15 shake"
                      : "border-slate-600 bg-game-panel hover:border-game-accent"
                }`}
              >
                <span className="text-5xl">{pair.characterEmoji}</span>
                <span className="text-2xl font-extrabold">{pair.character}</span>
              </button>
            );
          })}
        </div>

        <div className="col-start-3 row-start-1 relative z-20 grid grid-rows-6 gap-3">
          {matches.map((pair) => {
            const isMatched = matched.includes(pair.id);
            const isSelected = selected?.side === "right" && selected.id === pair.id;
            const isWrong = wrong === `right:${pair.id}`;
            return (
              <button
                key={pair.id}
                onClick={() => handlePick("right", pair.id)}
                disabled={phase !== "playing" || isMatched}
                tabIndex={-1}
                className={`rounded-2xl border-2 px-6 flex items-center gap-5 text-left transition-all shadow-lg ${
                  isMatched
                    ? "border-game-correct bg-game-correct/15"
                    : isSelected
                      ? "border-game-accent bg-game-panel-hover scale-[1.02]"
                      : isWrong
                        ? "border-game-wrong bg-game-wrong/15 shake"
                      : "border-slate-600 bg-game-panel hover:border-game-accent"
                }`}
              >
                <span className="text-5xl">{pair.matchEmoji}</span>
                <span className="text-2xl font-extrabold">{pair.match}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
