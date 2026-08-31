import { useCallback, useEffect, useMemo, useState } from "react";
import { CelebrationRain } from "../../components/CelebrationRain";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { DASAVATAR_ITEMS, type DasavatarItem } from "../../data/dasavatar-match";
import type { GameProps } from "../../games";
import { usePointerDrag } from "../../pointerDrag";
import { shuffle } from "../../shuffle";
import { playSound } from "../../soundEffects";

function Token({ avatar, useClues }: { avatar: DasavatarItem; useClues: boolean }) {
  if (!useClues) return avatar.name;
  return <img src={`./dasavatar-match/clues/${avatar.id}.png`} alt="" draggable={false} className="h-full w-full object-cover" />;
}

const GAME_DURATION_MS = 60000;
const COMPLETION_REVEAL_MS = 4_000;
const TOTAL_AVATARS = DASAVATAR_ITEMS.length;
const CLUE_TILE = "h-24 w-44 overflow-hidden p-0";

export function DasavatarMatchGame({ onExit, variantId }: GameProps) {
  const useClues = variantId === "adults";
  const [tokens] = useState(() => shuffle(DASAVATAR_ITEMS));
  const [targets] = useState(() => shuffle(DASAVATAR_ITEMS));
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [showCompleteResult, setShowCompleteResult] = useState(false);

  const placedIds = useMemo(() => new Set(Object.values(placements)), [placements]);
  const matchedCount = placedIds.size;
  const isComplete = matchedCount === TOTAL_AVATARS;
  const isTimedOut = timedOut && !isComplete;
  const isGameActive = !isComplete && !isTimedOut;

  const handleDrop = useCallback((droppedId: string, targetId: string | null) => {
    if (!isGameActive || !targetId || placedIds.has(droppedId)) return;

    if (droppedId === targetId) {
      playSound("correct");
      setPlacements((prev) => ({ ...prev, [targetId]: droppedId }));
      return;
    }

    playSound("wrong");
    setWrongId(droppedId);
    window.setTimeout(() => setWrongId(null), 500);
  }, [isGameActive, placedIds]);

  const {
    item: draggingId,
    position: dragPosition,
    hoveredTarget: hoveredTargetId,
    start,
    cancel,
  } = usePointerDrag<string>("data-avatar-target", handleDrop);
  const draggingAvatar = tokens.find((avatar) => avatar.id === draggingId);

  const handleDragStart = useCallback((event: React.PointerEvent<HTMLButtonElement>, avatarId: string) => {
    if (!isGameActive || placedIds.has(avatarId)) return;
    setWrongId(null);
    start(event, avatarId);
  }, [isGameActive, placedIds, start]);

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    cancel();
  }, [cancel]);

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
    <div
      className="w-full h-full flex flex-col gap-5 p-8 pt-10 relative bg-game-bg text-game-text"
      data-dragging={draggingId === null ? undefined : ""}
    >
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
        {targets.map((avatar) => {
          const matchedName = placements[avatar.id] ? avatar.name : null;
          const isHovered = hoveredTargetId === avatar.id && !matchedName && !!draggingId;

          return (
            <div
              key={avatar.id}
              data-avatar-target={avatar.id}
              className={`
                rounded-2xl border-2 bg-game-panel p-3 flex flex-col min-h-0 transition-all shadow-xl
                ${matchedName
                  ? "glow-correct border-game-correct"
                  : isHovered
                      ? "glow-accent scale-[1.03] border-game-accent bg-game-panel-hover"
                      : "border-slate-700 hover:border-game-accent hover:bg-game-panel-hover"
                }
              `}
            >
              <div className="flex-1 min-h-0 w-full rounded-xl bg-game-text p-2">
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  draggable={false}
                  className="h-full w-full object-contain"
                />
              </div>
              <div
                className={`
                  mt-3 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold
                  ${matchedName
                    ? "border-game-correct bg-game-correct/15 text-game-correct-soft"
                    : isHovered
                        ? "border-game-accent bg-game-accent/15 text-game-accent-soft"
                    : "border-slate-600 bg-game-bg text-slate-400"
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
                rounded-xl border-2 text-2xl font-extrabold transition-all shadow-sm touch-none disabled:pointer-events-none
                ${useClues ? CLUE_TILE : "px-6 py-3"}
                ${isPlaced
                  ? "opacity-25 border-slate-700 bg-game-panel text-slate-400"
                  : `${draggingId === avatar.id ? "opacity-40" : ""} border-slate-600 bg-game-panel text-game-text hover:border-game-accent hover:bg-game-panel-hover hover:text-game-accent-soft hover:scale-105`
                }
                ${wrongId === avatar.id ? "shake border-game-wrong bg-game-wrong/20 text-game-wrong-soft" : ""}
              `}
            >
              <Token avatar={avatar} useClues={useClues} />
            </button>
          );
        })}
      </section>

      {draggingAvatar && (
        <div
          className={`fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-game-accent bg-game-panel text-game-accent-soft text-2xl font-extrabold shadow-lg ${useClues ? CLUE_TILE : "px-6 py-3"}`}
          style={{ left: dragPosition.x, top: dragPosition.y }}
        >
          <Token avatar={draggingAvatar} useClues={useClues} />
        </div>
      )}

    </div>
  );
}
