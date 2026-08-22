import { useCallback, useEffect, useMemo, useState } from "react";
import { CelebrationRain } from "../../components/CelebrationRain";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { DASAVATAR_ITEMS, type DasavatarItem } from "../../data/dasavatar";
import type { GameProps } from "../../games";
import { shuffle } from "../../shuffle";

function targetAtPoint(x: number, y: number) {
  return document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-avatar-target]")?.dataset.avatarTarget ?? null;
}

function Token({ avatar, useClues }: { avatar: DasavatarItem; useClues: boolean }) {
  if (!useClues) return avatar.name;
  return <img src={`./dasavatar/clues/${avatar.id}.png`} alt="" draggable={false} className="h-full w-full object-cover" />;
}

const GAME_DURATION_MS = 60000;
const COMPLETION_REVEAL_MS = 4_000;
const TOTAL_AVATARS = DASAVATAR_ITEMS.length;
const CLUE_TILE = "h-24 w-44 overflow-hidden p-0";

export function DasavatarGame({ onExit, variantId }: GameProps) {
  const useClues = variantId === "adults";
  const [tokens] = useState(() => shuffle(DASAVATAR_ITEMS));
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [showCompleteResult, setShowCompleteResult] = useState(false);

  const placedIds = useMemo(() => new Set(Object.values(placements)), [placements]);
  const matchedCount = placedIds.size;
  const isComplete = matchedCount === TOTAL_AVATARS;
  const isTimedOut = timedOut && !isComplete;
  const isGameActive = !isComplete && !isTimedOut;
  const draggingAvatar = tokens.find((avatar) => avatar.id === draggingId);

  const handleDragStart = useCallback((event: React.PointerEvent<HTMLButtonElement>, avatarId: string) => {
    event.preventDefault();
    setDragPosition({ x: event.clientX, y: event.clientY });
    setDraggingId(avatarId);
    setWrongId(null);
  }, []);

  const handleDrop = useCallback((droppedId: string, targetId: string | null) => {
    setDraggingId(null);
    setHoveredTargetId(null);

    if (!isGameActive || !targetId || placedIds.has(droppedId)) return;

    if (droppedId === targetId) {
      setPlacements((prev) => ({ ...prev, [targetId]: droppedId }));
      return;
    }

    setWrongId(droppedId);
    window.setTimeout(() => setWrongId(null), 500);
  }, [isGameActive, placedIds]);

  useEffect(() => {
    if (!draggingId) return;

    const handlePointerMove = (event: PointerEvent) => {
      setDragPosition({ x: event.clientX, y: event.clientY });
      setHoveredTargetId(targetAtPoint(event.clientX, event.clientY));
    };
    const handlePointerUp = (event: PointerEvent) => {
      handleDrop(draggingId, targetAtPoint(event.clientX, event.clientY));
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp, { once: true });
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingId, handleDrop]);

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    setDraggingId(null);
    setHoveredTargetId(null);
  }, []);

  useEffect(() => {
    if (!isComplete || timedOut) return;
    const timeout = window.setTimeout(() => setShowCompleteResult(true), COMPLETION_REVEAL_MS);
    return () => window.clearTimeout(timeout);
  }, [isComplete, timedOut]);

  if (showCompleteResult || isTimedOut) {
    return (
      <GameResultScreen
        title={isComplete ? "Dasavatar Complete!" : "Time's Up!"}
        score={`${matchedCount} / ${TOTAL_AVATARS}`}
        message={isComplete ? "Hare Krishna! Perfect match!" : "Try again and match all avatars!"}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 p-8 pt-10 relative bg-game-bg text-game-text">
      {isComplete && <CelebrationRain />}
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer
          durationMs={GAME_DURATION_MS}
          onExpire={handleExpire}
          paused={!isGameActive}
        />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Match the Dasavatar</h1>
        <p className="mt-1 text-xl text-slate-300">
          {useClues ? "Drag each clue to the correct avatar." : "Drag each name to the correct picture."}
        </p>
      </header>

      <main className="grid grid-cols-5 grid-rows-2 gap-3 flex-1 min-h-0">
        {DASAVATAR_ITEMS.map((avatar) => {
          const matchedName = placements[avatar.id] ? avatar.name : null;
          const isHovered = hoveredTargetId === avatar.id && !matchedName && !!draggingId;

          return (
            <div
              key={avatar.id}
              data-avatar-target={avatar.id}
              className={`
                rounded-2xl border bg-game-panel p-3 flex flex-col min-h-0 transition-all shadow-lg
                ${matchedName
                  ? "glow-correct border-game-correct"
                  : isHovered
                      ? "glow-accent scale-[1.03] border-game-accent bg-game-panel-hover"
                      : "border-slate-700 hover:border-slate-500"
                }
              `}
            >
              <img
                src={avatar.image}
                alt={avatar.name}
                draggable={false}
                className="w-full flex-1 min-h-0 object-contain rounded-xl bg-game-bg shadow-inner"
              />
              <div
                className={`
                  mt-3 h-12 rounded-xl border flex items-center justify-center text-2xl font-bold
                  ${matchedName
                    ? "border-game-correct bg-game-correct/15 text-game-correct-soft"
                    : isHovered
                        ? "border-game-accent bg-game-accent/15 text-game-accent-soft"
                    : "border-slate-700 bg-game-bg text-slate-400"
                  }
                `}
              >
                {matchedName ?? (useClues ? "Drop clue here" : "Drop name here")}
              </div>
            </div>
          );
        })}
      </main>

      <section className="min-h-32 rounded-2xl border border-slate-700 bg-game-panel p-4 flex flex-wrap items-center justify-center gap-2 shadow-lg">
        {tokens.map((avatar) => {
          const isPlaced = placedIds.has(avatar.id);

          return (
            <button
              key={avatar.id}
              onPointerDown={(event) => handleDragStart(event, avatar.id)}
              disabled={isPlaced || !isGameActive}
              tabIndex={-1}
              className={`
                rounded-xl border text-2xl font-extrabold transition-all shadow-sm touch-none
                ${useClues ? CLUE_TILE : "px-6 py-3"}
                ${wrongId === avatar.id ? "shake border-game-wrong bg-game-wrong/20 text-white" : ""}
                ${isPlaced
                  ? "opacity-25 border-slate-700 bg-slate-900 text-slate-400"
                  : `${draggingId === avatar.id ? "opacity-40" : ""} border-slate-500 bg-slate-800 text-slate-100 hover:border-game-accent hover:bg-game-panel-hover hover:text-game-accent-soft hover:scale-105`
                }
              `}
            >
              <Token avatar={avatar} useClues={useClues} />
            </button>
          );
        })}
      </section>

      {draggingAvatar && (
        <div
          className={`fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-xl border border-game-accent bg-slate-800 text-game-accent-soft text-2xl font-extrabold shadow-lg ${useClues ? CLUE_TILE : "px-6 py-3"}`}
          style={{ left: dragPosition.x, top: dragPosition.y }}
        >
          <Token avatar={draggingAvatar} useClues={useClues} />
        </div>
      )}

    </div>
  );
}
