import { useCallback, useEffect, useState } from "react";
import { Timer } from "../../components/Timer";

interface Props {
  onExit: () => void;
}

const PAIRS = [
  { key: "peacock", picture: "🦚", name: "Peacock" },
  { key: "flute", picture: "🪈", name: "Flute" },
  { key: "cow", picture: "🐄", name: "Surabhi Cow" },
  { key: "lotus", picture: "🪷", name: "Lotus" },
  { key: "govardhan", picture: "⛰️", name: "Govardhan" },
  { key: "vrindavan", picture: "🛕", name: "Vrindavan" },
];

const GAME_DURATION_MS = 75_000;
const AUTO_RESET_SECONDS = 10;

interface Card {
  id: string;
  pairKey: string;
  picture: string;
  name: string;
}

function makeDeck(): Card[] {
  return PAIRS
    .flatMap((pair) => [0, 1].map((copy) => ({ ...pair, id: `${pair.key}-${copy}`, pairKey: pair.key })))
    .sort(() => Math.random() - 0.5);
}

export function MemoryGame({ onExit }: Props) {
  const [cards] = useState(makeDeck);
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);

  const isComplete = matched.length === PAIRS.length;
  const isFinished = isComplete || timedOut;

  useEffect(() => {
    if (selected.length !== 2) return;
    const timeout = window.setTimeout(() => setSelected([]), 800);
    return () => window.clearTimeout(timeout);
  }, [selected]);

  useEffect(() => {
    if (!isFinished) return;
    const interval = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          onExit();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isFinished, onExit]);

  const handleCardClick = (card: Card) => {
    if (isFinished || selected.length === 2 || selected.includes(card.id) || matched.includes(card.pairKey)) return;

    if (selected.length === 0) {
      setSelected([card.id]);
      return;
    }

    const firstCard = cards.find((candidate) => candidate.id === selected[0]);
    setMoves((current) => current + 1);
    if (firstCard?.pairKey === card.pairKey) {
      setMatched((current) => [...current, card.pairKey]);
      setSelected([]);
    } else {
      setSelected([selected[0], card.id]);
    }
  };

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    setSelected([]);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-5 p-8 pt-10 relative bg-game-bg text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={isFinished} variant="edge" />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Memory Match</h1>
        <p className="mt-1 text-xl text-slate-300">Flip two cards and find all six matching pairs.</p>
        <div className="mt-2 text-2xl font-bold text-slate-300">
          Pairs <span className="text-game-accent">{matched.length} / {PAIRS.length}</span>
          <span className="mx-5 text-slate-600">•</span>
          Moves <span className="text-game-accent">{moves}</span>
        </div>
      </header>

      <main className="grid grid-cols-4 grid-rows-3 gap-4 flex-1 min-h-0 max-w-6xl w-full mx-auto">
        {cards.map((card) => {
          const isFaceUp = selected.includes(card.id) || matched.includes(card.pairKey);
          const isMatched = matched.includes(card.pairKey);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={isFinished || isMatched}
              tabIndex={-1}
              className={`
                rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 shadow-xl
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
                  <span className="text-9xl leading-none">{card.picture}</span>
                  <span className={`mt-3 text-2xl font-extrabold ${isMatched ? "text-game-correct-soft" : "text-game-text"}`}>
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

      {isFinished && (
        <div className="absolute inset-0 z-30 bg-game-bg flex flex-col items-center justify-center gap-8 p-8 text-center">
          <h2 className="text-6xl font-extrabold text-game-accent">
            {isComplete ? "All Pairs Found!" : "Time's Up!"}
          </h2>
          <div className="text-8xl font-bold">{matched.length} / {PAIRS.length}</div>
          <p className="text-3xl text-slate-300">
            {isComplete ? `Hare Krishna! Completed in ${moves} moves.` : "Good try! Find all the pairs next time."}
          </p>
          <div className="text-xl text-slate-500">Next player in {countdown}...</div>
        </div>
      )}
    </div>
  );
}
