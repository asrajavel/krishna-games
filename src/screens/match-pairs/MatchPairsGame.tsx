import { useCallback, useEffect, useState } from "react";
import { CelebrationRain } from "../../components/CelebrationRain";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { REVEAL_HOLD_MS } from "../../feedback";
import type { GameProps } from "../../games";
import { shuffle } from "../../shuffle";
import { playSound } from "../../soundEffects";

interface Pair {
  id: string;
  left: string;
  right: string;
}

const KIDS_PAIRS: Pair[] = [
  { id: "krishna", left: "Krishna", right: "Flute" },
  { id: "radha", left: "Radha", right: "Vrindavan" },
  { id: "balarama", left: "Balarama", right: "Plough" },
  { id: "yashoda", left: "Mother Yashoda", right: "Butter Pot" },
  { id: "arjuna", left: "Arjuna", right: "Bhagavad Gita" },
  { id: "sudama", left: "Sudama", right: "Flattened Rice" },
];

const ADULT_PAIRS: Pair[] = Array.from({ length: 23 }, (_, index) => {
  const left = index * 2 + 1;
  return {
    id: `adult-${left}`,
    left: `./match-pairs/adults/${left}.png`,
    right: `./match-pairs/adults/${left + 1}.png`,
  };
});

const GAME_DURATION_MS = 75_000;
const CELEBRATION_MS = 4_000;

type Phase = "playing" | "celebrating" | "result";
type Side = "left" | "right";

export function MatchPairsGame({ onExit, variantId }: GameProps) {
  const adults = variantId === "adults";
  const [pairs] = useState(() => adults ? shuffle(ADULT_PAIRS).slice(0, 8) : KIDS_PAIRS);
  const [matches] = useState(() => shuffle(pairs));
  const [selected, setSelected] = useState<{ id: string; side: Side } | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("playing");
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (phase !== "celebrating") return;
    const timeout = window.setTimeout(() => setPhase("result"), CELEBRATION_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  const handlePick = (side: Side, id: string) => {
    if (phase !== "playing" || matched.includes(id) || wrong.length) return;
    if (!selected || selected.side === side) {
      playSound("select");
      setSelected({ id, side });
      return;
    }
    if (selected.id === id) {
      const nextMatched = [...matched, id];
      playSound("correct");
      setMatched(nextMatched);
      setSelected(null);
      if (nextMatched.length === pairs.length) setPhase("celebrating");
      return;
    }

    playSound("wrong");
    setWrong([`${selected.side}:${selected.id}`, `${side}:${id}`]);
    setSelected(null);
    window.setTimeout(() => setWrong([]), REVEAL_HOLD_MS);
  };

  const cardTone = (isMatched: boolean, isSelected: boolean, isWrong: boolean) =>
    isMatched
      ? "reveal-pop pop-correct reveal-once border-game-correct"
      : isWrong
        ? "reveal-pop pop-wrong border-game-wrong"
        : isSelected
          ? "border-game-accent bg-game-panel-hover scale-[1.02]"
          : "border-slate-600 bg-game-panel hover:border-game-accent";

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    setSelected(null);
    setPhase("result");
  }, []);

  if (phase === "result") {
    return (
      <GameResultScreen
        title={timedOut ? "Time's Up!" : "Perfect Match!"}
        score={`${matched.length} / ${pairs.length}`}
        message={timedOut ? "Good try! Match every pair next time." : "Hare Krishna! You connected every pair."}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 p-8 pt-10 relative bg-game-bg text-game-text">
      {phase === "celebrating" && <CelebrationRain />}
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={phase !== "playing"} />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Match the Pairs</h1>
        <p className="mt-1 text-xl text-slate-300">
          Choose one item, then choose its match on the other side.
        </p>
      </header>

      <main className={`grid flex-1 min-h-0 w-full mx-auto ${
        adults
          ? "grid-cols-8 grid-rows-[12rem_1fr_12rem] gap-x-4 max-w-[112rem]"
          : "grid-cols-6 grid-rows-[12rem_1fr_12rem] gap-x-6 max-w-[90rem]"
      }`}>
        <svg
          className={`z-10 h-full w-full pointer-events-none col-start-1 row-start-2 ${
            adults ? "col-span-8" : "col-span-6"
          }`}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {matched.map((id) => {
            const leftIndex = pairs.findIndex((pair) => pair.id === id);
            const rightIndex = matches.findIndex((pair) => pair.id === id);
            const leftPosition = ((leftIndex + 0.5) / pairs.length) * 100;
            const rightPosition = ((rightIndex + 0.5) / pairs.length) * 100;
            return (
              <line
                key={id}
                x1={leftPosition}
                y1="0"
                x2={rightPosition}
                y2="100"
                className="stroke-game-correct opacity-75"
                strokeWidth="0.75rem"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        <div className={`relative z-20 grid min-h-0 col-start-1 row-start-1 ${
          adults ? "col-span-8 grid-cols-8 gap-4" : "col-span-6 grid-cols-6 gap-6"
        }`}>
          {pairs.map((pair) => {
            const isMatched = matched.includes(pair.id);
            const isSelected = selected?.side === "left" && selected.id === pair.id;
            const isWrong = wrong.includes(`left:${pair.id}`);
            return (
              <button
                key={pair.id}
                onClick={() => handlePick("left", pair.id)}
                disabled={phase !== "playing" || isMatched || wrong.length > 0}
                tabIndex={-1}
                className={`flex size-48 max-h-full max-w-full place-self-center items-center justify-center overflow-hidden rounded-2xl border-2 p-2 text-center shadow-lg transition-all ${cardTone(isMatched, isSelected, isWrong)}`}
              >
                {adults ? (
                  <img src={pair.left} alt="" className="h-full min-h-0 w-full rounded-xl bg-game-text p-2 object-contain" />
                ) : (
                  <span className="text-3xl font-extrabold leading-tight">{pair.left}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className={`relative z-20 grid min-h-0 col-start-1 row-start-3 ${
          adults ? "col-span-8 grid-cols-8 gap-4" : "col-span-6 grid-cols-6 gap-6"
        }`}>
          {matches.map((pair) => {
            const isMatched = matched.includes(pair.id);
            const isSelected = selected?.side === "right" && selected.id === pair.id;
            const isWrong = wrong.includes(`right:${pair.id}`);
            return (
              <button
                key={pair.id}
                onClick={() => handlePick("right", pair.id)}
                disabled={phase !== "playing" || isMatched || wrong.length > 0}
                tabIndex={-1}
                className={`flex size-48 max-h-full max-w-full place-self-center items-center justify-center overflow-hidden rounded-2xl border-2 p-2 text-center shadow-lg transition-all ${cardTone(isMatched, isSelected, isWrong)}`}
              >
                {adults ? (
                  <img src={pair.right} alt="" className="h-full min-h-0 w-full rounded-xl bg-game-text p-2 object-contain" />
                ) : (
                  <span className="text-3xl font-extrabold leading-tight">{pair.right}</span>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
