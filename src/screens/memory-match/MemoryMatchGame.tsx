import { useCallback, useEffect, useState } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import type { GameProps } from "../../games";
import { shuffle } from "../../shuffle";
import { playSound } from "../../soundEffects";

const KIDS_PAIRS = [
  { key: "peacock", name: "Peacock" },
  { key: "flute", name: "Flute" },
  { key: "cow", name: "Surabhi Cow" },
  { key: "lotus", name: "Lotus" },
  { key: "govardhan", name: "Govardhan" },
  { key: "krishna", name: "Krishna" },
];

const ADULT_PAIRS = [
  { key: "butter", name: "Butter" },
  { key: "sudarshan", name: "Sudarshan" },
  { key: "tulsi", name: "Tulsi" },
  { key: "conch", name: "Conch" },
];

const GAME_DURATION_MS = 75_000;

export function MemoryMatchGame({ onExit, variantId }: GameProps) {
  const adults = variantId === "adults";
  const pairs = adults ? [...KIDS_PAIRS, ...ADULT_PAIRS] : KIDS_PAIRS;
  const [cards] = useState(() =>
    shuffle(pairs.flatMap((pair) => [0, 1].map((copy) => ({ ...pair, id: `${pair.key}-${copy}` })))),
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  const isComplete = matched.length === pairs.length;
  const isFinished = isComplete || timedOut;

  useEffect(() => {
    if (selected.length !== 2) return;
    const timeout = window.setTimeout(() => setSelected([]), 800);
    return () => window.clearTimeout(timeout);
  }, [selected]);

  const handleCardClick = (card: (typeof cards)[number]) => {
    if (isFinished || selected.length === 2 || selected.includes(card.id) || matched.includes(card.key)) return;

    if (selected.length === 0) {
      playSound("select");
      setSelected([card.id]);
      return;
    }

    const firstCard = cards.find((candidate) => candidate.id === selected[0]);
    setMoves((current) => current + 1);
    if (firstCard?.key === card.key) {
      playSound("correct");
      setMatched((current) => [...current, card.key]);
      setSelected([]);
    } else {
      playSound("wrong");
      setSelected([selected[0], card.id]);
    }
  };

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    setSelected([]);
  }, []);

  if (isFinished) {
    return (
      <GameResultScreen
        title={isComplete ? "All Pairs Found!" : "Time's Up!"}
        score={`${matched.length} / ${pairs.length}`}
        message={isComplete ? `Hare Krishna! Completed in ${moves} moves.` : "Good try! Find all the pairs next time."}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 p-8 pt-10 relative bg-game-bg text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={isFinished} />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Memory Match</h1>
        <p className="mt-1 text-xl text-slate-300">Flip two cards and find all {pairs.length} matching pairs.</p>
        <div className="mt-2 text-2xl font-bold text-slate-300">
          Pairs <span className="text-game-accent">{matched.length} / {pairs.length}</span>
          <span className="mx-5 text-slate-600">•</span>
          Moves <span className="text-game-accent">{moves}</span>
        </div>
      </header>

      <main className={`grid gap-4 flex-1 min-h-0 w-full mx-auto ${adults ? "grid-cols-5 grid-rows-4 max-w-7xl" : "grid-cols-4 grid-rows-3 max-w-6xl"}`}>
        {cards.map((card) => {
          const isFaceUp = selected.includes(card.id) || matched.includes(card.key);
          const isMatched = matched.includes(card.key);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={isFinished || isMatched}
              tabIndex={-1}
              className={`
                rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-all duration-200 shadow-xl
                ${isMatched
                  ? "border-game-correct bg-game-correct/15"
                  : isFaceUp
                    ? "border-game-accent bg-game-panel"
                    : "border-slate-600 bg-game-panel hover:border-game-accent hover:bg-game-panel-hover hover:scale-[1.02]"
                }
              `}
            >
              {isFaceUp ? (
                <>
                  <div className="flex-1 min-h-0 w-full rounded-xl bg-game-text p-2">
                    <img src={`./memory-match/${card.key}.png`} alt="" className="h-full w-full object-contain" />
                  </div>
                  <span className={`mt-2 shrink-0 text-2xl font-extrabold ${isMatched ? "text-game-correct-soft" : "text-game-text"}`}>
                    {card.name}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-7xl text-game-accent">?</span>
                  <span className="mt-2 text-lg font-bold uppercase tracking-[0.3em] text-slate-400">Flip</span>
                </>
              )}
            </button>
          );
        })}
      </main>

    </div>
  );
}
