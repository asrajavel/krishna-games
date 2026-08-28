import { useCallback, useEffect, useState } from "react";
import { CelebrationRain } from "../../components/CelebrationRain";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import type { GameProps } from "../../games";
import { usePointerDrag } from "../../pointerDrag";
import { shuffle } from "../../shuffle";
import { playSound } from "../../soundEffects";

const KIDS_EVENTS = [
  { id: "birth", title: "Krishna is born in Mathura" },
  { id: "gokula", title: "Vasudeva carries Krishna to Gokula" },
  { id: "trinavarta", title: "Baby Krishna defeats Trinavarta" },
  { id: "kaliya", title: "Krishna dances on Kaliya" },
  { id: "govardhan", title: "Krishna lifts Govardhan Hill" },
  { id: "kamsa", title: "Krishna defeats Kamsa" },
];

const ADULT_EVENTS = [
  { id: "abhisheka", title: "Abhisheka of baby Krishna" },
  { id: "trinavarta", title: "Krishna defeats Trinavarta" },
  { id: "butter", title: "Krishna and Balarama steal butter" },
  { id: "brahmanda", title: "Universe in Krishna's mouth" },
  { id: "bakasura", title: "Krishna defeats Bakasura" },
  { id: "sankhachuda", title: "Krishna defeats Sankhachuda" },
  { id: "keshi", title: "Krishna defeats Keshi" },
  { id: "chanura", title: "Krishna wrestles Chanura" },
  { id: "sandipani", title: "Krishna and Sudama at Sandipani" },
  { id: "narakasura", title: "Krishna rescues 16,100 women" },
  { id: "gita", title: "Krishna speaks the Gita" },
];

const GAME_DURATION_MS = 75_000;
const COMPLETION_REVEAL_MS = 4_000;

function shuffledEvents(ordered: { id: string }[]) {
  const events = shuffle(ordered);
  return events.every((event, index) => event.id === ordered[index].id) ? events.reverse() : events;
}

export function SequenceGame({ onExit, variantId }: GameProps) {
  const adults = variantId === "adults";
  const src = (id: string) => (adults ? `./sequence/adults/${id}.jpg` : `./sequence/${id}.png`);
  const [ordered] = useState(() =>
    adults
      ? shuffle(ADULT_EVENTS).slice(0, 6).sort((a, b) => ADULT_EVENTS.indexOf(a) - ADULT_EVENTS.indexOf(b))
      : KIDS_EVENTS,
  );
  const [events, setEvents] = useState(() => shuffledEvents(ordered));
  const [swappedIndexes, setSwappedIndexes] = useState<number[]>([]);
  const [timedOut, setTimedOut] = useState(false);
  const [showCompleteResult, setShowCompleteResult] = useState(false);

  const correctCount = events.filter((event, index) => event.id === ordered[index].id).length;
  const isComplete = correctCount === ordered.length;
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

  const handleDrop = useCallback((fromIndex: number, target: string | null) => {
    if (target === null || isFinished) return;
    const targetIndex = Number(target);
    if (targetIndex === fromIndex) return;
    playSound("drop");
    setSwappedIndexes([fromIndex, targetIndex]);
    setEvents((current) => {
      const next = [...current];
      [next[fromIndex], next[targetIndex]] = [next[targetIndex], next[fromIndex]];
      return next;
    });
  }, [isFinished]);

  const { item: draggingIndex, position, hoveredTarget, start, cancel } = usePointerDrag<number>(
    "data-event-index",
    handleDrop,
  );
  const draggingEvent = draggingIndex === null ? null : events[draggingIndex];

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    cancel();
  }, [cancel]);

  if (showResult) {
    return (
      <GameResultScreen
        title={isComplete ? "Perfect Sequence!" : "Time's Up!"}
        score={`${correctCount} / ${ordered.length}`}
        message={isComplete ? "Hare Krishna! Every event is in order." : "Events placed in the correct position."}
        onExit={onExit}
      />
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col gap-4 p-8 pt-10 relative bg-game-bg text-game-text"
      data-dragging={draggingIndex === null ? undefined : ""}
    >
      {isComplete && <CelebrationRain />}
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
              data-event-index={index}
              onPointerDown={(pointerEvent) => start(pointerEvent, index)}
              disabled={isFinished}
              tabIndex={-1}
              style={{
                gridColumn: index < 3 ? index + 1 : 6 - index,
                gridRow: index < 3 ? 1 : 2,
              }}
              className={`
                relative w-full h-full max-w-72 place-self-center touch-none rounded-3xl border-2 p-3 flex flex-col text-center transition-all shadow-xl
                ${isComplete
                  ? "glow-correct border-game-correct bg-game-panel"
                  : swappedIndexes.includes(index)
                    ? "swap-pop border-game-accent bg-game-accent/20"
                  : draggingIndex === index
                  ? "opacity-40 border-game-accent bg-game-accent/10 scale-95"
                  : hoveredTarget === String(index) && draggingIndex !== null
                    ? "glow-accent border-game-accent bg-game-accent/20 scale-[1.04]"
                    : "border-slate-700 bg-game-panel hover:border-game-accent hover:bg-game-panel-hover hover:-translate-y-1"
                }
              `}
            >
              <span className="absolute left-3 top-3 w-11 h-11 rounded-full bg-game-bg border-2 border-game-accent flex items-center justify-center text-xl font-extrabold text-game-accent shadow-md">
                {index + 1}
              </span>
              <img src={src(event.id)} alt="" draggable={false} className="flex-1 min-h-0 w-full rounded-xl bg-game-text p-2 object-contain" />
              <span className="mt-2 shrink-0 text-2xl leading-tight font-extrabold">{event.title}</span>
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

      {draggingEvent && (
        <div
          className="pointer-events-none fixed z-50 w-64 -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-game-accent bg-game-panel p-3 text-center shadow-lg"
          style={{ left: position.x, top: position.y }}
        >
          <img src={src(draggingEvent.id)} alt="" className="h-36 w-full rounded-xl bg-game-text p-2 object-contain" />
          <span className="mt-2 block text-xl font-extrabold leading-tight">{draggingEvent.title}</span>
        </div>
      )}
    </div>
  );
}
