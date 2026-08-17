import { useCallback, useEffect, useState } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { shuffle } from "../../shuffle";

interface Props {
  onExit: () => void;
}

const EVENTS = [
  { id: "birth", icon: "🪷", title: "Krishna is born in Mathura" },
  { id: "gokula", icon: "🌊", title: "Vasudeva carries Krishna to Gokula" },
  { id: "putana", icon: "👶", title: "Baby Krishna defeats Putana" },
  { id: "kaliya", icon: "🐍", title: "Krishna dances on Kaliya" },
  { id: "govardhan", icon: "⛰️", title: "Krishna lifts Govardhan Hill" },
  { id: "kamsa", icon: "🏹", title: "Krishna defeats Kamsa" },
];

const GAME_DURATION_MS = 75_000;
const COMPLETION_REVEAL_MS = 4_000;

function shuffledEvents() {
  const events = shuffle(EVENTS);
  return events.every((event, index) => event.id === EVENTS[index].id) ? events.reverse() : events;
}

export function SequenceGame({ onExit }: Props) {
  const [events, setEvents] = useState(shuffledEvents);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [swappedIndexes, setSwappedIndexes] = useState<number[]>([]);
  const [timedOut, setTimedOut] = useState(false);
  const [showCompleteResult, setShowCompleteResult] = useState(false);

  const correctCount = events.filter((event, index) => event.id === EVENTS[index].id).length;
  const isComplete = correctCount === EVENTS.length;
  const isFinished = isComplete || timedOut;
  const showResult = showCompleteResult || timedOut;

  useEffect(() => {
    if (!isComplete || timedOut) return;
    const timeout = window.setTimeout(() => setShowCompleteResult(true), COMPLETION_REVEAL_MS);
    return () => window.clearTimeout(timeout);
  }, [isComplete, timedOut]);

  useEffect(() => {
    if (swappedIndexes.length === 0) return;
    const timeout = window.setTimeout(() => setSwappedIndexes([]), 600);
    return () => window.clearTimeout(timeout);
  }, [swappedIndexes]);

  const handleDrop = (targetIndex: number) => {
    if (draggingIndex === null || draggingIndex === targetIndex || isFinished) return;
    setSwappedIndexes([draggingIndex, targetIndex]);
    setEvents((current) => {
      const next = [...current];
      [next[draggingIndex], next[targetIndex]] = [next[targetIndex], next[draggingIndex]];
      return next;
    });
    setDraggingIndex(null);
    setHoveredIndex(null);
  };

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    setDraggingIndex(null);
    setHoveredIndex(null);
  }, []);

  if (showResult) {
    return (
      <GameResultScreen
        title={isComplete ? "Perfect Sequence!" : "Time's Up!"}
        score={`${correctCount} / ${EVENTS.length}`}
        message={isComplete ? "Hare Krishna! Every event is in order." : "Events placed in the correct position."}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-8 pt-10 relative bg-game-bg text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={isFinished} />
      </div>

      <header className="text-center shrink-0">
        <h1 className="text-5xl font-extrabold text-game-accent">Krishna-lila Sequence</h1>
        <p className="text-xl text-slate-300 mt-1">Drag an event onto another to swap them along Krishna's path.</p>
      </header>

      <main className="relative flex-1 min-h-0 max-h-[38rem] w-full max-w-[90rem] mx-auto my-auto px-24 py-3">
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          className={`absolute inset-y-3 left-24 right-24 w-[calc(100%-12rem)] h-[calc(100%-1.5rem)] transition-colors duration-500 ${
            isComplete
              ? "drop-glow-correct text-game-correct"
              : "drop-glow-accent text-game-accent"
          }`}
          aria-hidden="true"
        >
          <defs>
            <marker
              id="path-arrow"
              viewBox="0 0 28 24"
              markerWidth="32"
              markerHeight="28"
              refX="26"
              refY="12"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M0,0 L28,12 L0,24 Z" fill="currentColor" />
            </marker>
          </defs>
          <path
            d="M 0 125 H 865 Q 980 125 980 220 V 280 Q 980 375 865 375 H 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeOpacity={isComplete ? 1 : 0.75}
            strokeLinecap="round"
            strokeDasharray="14 12"
            markerEnd="url(#path-arrow)"
          />
        </svg>

        <span className="absolute left-0 top-[calc(25%+0.375rem)] -translate-y-1/2 rounded-full border border-game-correct/40 bg-game-correct/10 px-3 py-1 text-base font-extrabold tracking-wider text-game-correct-soft">
          START
        </span>
        <span className="absolute left-0 bottom-[calc(25%+0.375rem)] translate-y-1/2 rounded-full border border-game-accent/40 bg-game-accent/10 px-3 py-1 text-base font-extrabold tracking-wider text-game-accent-soft">
          FINISH
        </span>

        <div className="relative h-full grid grid-cols-3 grid-rows-2 gap-x-16 gap-y-10">
          {events.map((event, index) => (
            <button
              key={event.id}
              draggable={!isFinished}
              onDragStart={(dragEvent) => {
                dragEvent.dataTransfer.effectAllowed = "move";
                dragEvent.dataTransfer.setData("text/plain", String(index));
                setDraggingIndex(index);
              }}
              onDragEnter={() => setHoveredIndex(index)}
              onDragOver={(dragEvent) => dragEvent.preventDefault()}
              onDrop={(dragEvent) => {
                dragEvent.preventDefault();
                handleDrop(index);
              }}
              onDragEnd={() => {
                setDraggingIndex(null);
                setHoveredIndex(null);
              }}
              disabled={isFinished}
              tabIndex={-1}
              style={{
                gridColumn: index < 3 ? index + 1 : 6 - index,
                gridRow: index < 3 ? 1 : 2,
              }}
              className={`
                relative w-full h-full max-w-64 max-h-64 place-self-center overflow-hidden rounded-3xl border-2 p-5 flex flex-col items-center justify-center text-center transition-all shadow-xl
                ${isComplete
                  ? "glow-correct border-game-correct bg-game-panel"
                  : swappedIndexes.includes(index)
                    ? "swap-pop border-game-accent bg-game-accent/20"
                  : draggingIndex === index
                  ? "opacity-40 border-game-accent bg-game-accent/10 scale-95"
                  : hoveredIndex === index && draggingIndex !== null
                    ? "glow-accent border-game-accent bg-game-accent/20 scale-[1.04]"
                    : "border-slate-700 bg-game-panel hover:border-game-accent hover:bg-game-panel-hover hover:-translate-y-1"
                }
              `}
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-game-accent/70 to-transparent" />
              <span className="absolute left-4 top-4 w-11 h-11 rounded-full bg-game-bg border-2 border-game-accent flex items-center justify-center text-xl font-extrabold text-game-accent shadow-md">
                {index + 1}
              </span>
              <span className="text-6xl leading-none drop-shadow-lg" aria-hidden="true">{event.icon}</span>
              <span className="mt-4 px-5 text-2xl leading-tight font-extrabold">{event.title}</span>
              <span className="absolute right-4 top-4 text-slate-500 text-lg" aria-hidden="true">⠿</span>
            </button>
          ))}
        </div>
      </main>

      <p className={`shrink-0 text-center text-lg font-semibold tracking-wide ${isComplete ? "text-game-correct-soft" : "text-slate-500"}`}>
        {isComplete
          ? "Perfect! Enjoy the completed Krishna-lila journey."
          : <>Follow the path from <span className="text-game-correct-soft">START</span> to <span className="text-game-accent-soft">FINISH</span></>
        }
      </p>

    </div>
  );
}
