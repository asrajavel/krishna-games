import { useCallback, useEffect, useMemo, useState } from "react";
import { Timer } from "../../components/Timer";
import { DASAVATAR_ITEMS, shuffleDasavatarItems } from "../../data/dasavatar";

interface Props {
  onExit: () => void;
}

const GAME_DURATION_SECONDS = 60;
const GAME_DURATION_MS = GAME_DURATION_SECONDS * 1000;
const AUTO_RESET_SECONDS = 10;
const TOTAL_AVATARS = DASAVATAR_ITEMS.length;

export function DasavatarGame({ onExit }: Props) {
  const [nameCards] = useState(() => shuffleDasavatarItems());
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);

  const placedIds = useMemo(() => new Set(Object.values(placements)), [placements]);
  const matchedCount = placedIds.size;
  const isComplete = matchedCount === TOTAL_AVATARS;
  const isTimedOut = timedOut && !isComplete;
  const isGameActive = !isComplete && !isTimedOut;

  useEffect(() => {
    if (!isComplete && !isTimedOut) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete, isTimedOut, onExit]);

  const handleDragStart = useCallback((event: React.DragEvent<HTMLButtonElement>, avatarId: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", avatarId);
    setDraggingId(avatarId);
    setWrongId(null);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault();

    const droppedId = event.dataTransfer.getData("text/plain") || draggingId;
    setDraggingId(null);
    setHoveredTargetId(null);

    if (!isGameActive || !droppedId || placedIds.has(droppedId)) return;

    if (droppedId === targetId) {
      setPlacements((prev) => ({ ...prev, [targetId]: droppedId }));
      return;
    }

    setWrongId(droppedId);
    window.setTimeout(() => setWrongId(null), 500);
  }, [draggingId, isGameActive, placedIds]);

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    setDraggingId(null);
    setHoveredTargetId(null);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-8 relative bg-game-bg text-game-text">
      <header className="flex items-start justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold text-game-accent">Match the Dasavatar</h1>
          <p className="text-xl text-slate-300 mt-1 mb-4">Drag each name to the correct picture.</p>
          <div className="w-full max-w-2xl">
            <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={!isGameActive} />
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={onExit}
            className="px-5 py-2 rounded-xl border border-slate-600 bg-slate-800/80 text-slate-200 text-lg shadow-sm hover:border-game-accent hover:text-game-accent"
          >
            Home
          </button>
        </div>
      </header>

      <main className="grid grid-cols-5 grid-rows-2 gap-3 flex-1 min-h-0">
        {DASAVATAR_ITEMS.map((avatar) => {
          const matchedName = placements[avatar.id] ? avatar.name : null;
          const isHovered = hoveredTargetId === avatar.id && !matchedName && !!draggingId;

          return (
            <div
              key={avatar.id}
              onDrop={(event) => handleDrop(event, avatar.id)}
              onDragEnter={() => setHoveredTargetId(avatar.id)}
              onDragLeave={() => setHoveredTargetId((current) => current === avatar.id ? null : current)}
              onDragOver={(event) => {
                event.preventDefault();
                setHoveredTargetId(avatar.id);
              }}
              className={`
                rounded-2xl border bg-game-panel p-3 flex flex-col min-h-0 transition-all shadow-lg
                ${matchedName
                  ? "border-game-correct shadow-[0_12px_28px_rgba(34,197,94,0.2)]"
                  : isHovered
                      ? "scale-[1.03] border-game-accent bg-game-panel-hover shadow-[0_16px_36px_rgba(245,158,11,0.22)]"
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
                {matchedName ?? "Drop name here"}
              </div>
            </div>
          );
        })}
      </main>

      <section className="min-h-30 rounded-2xl border border-slate-700 bg-game-panel p-4 flex flex-wrap items-center justify-center gap-3 shadow-lg">
        {nameCards.map((avatar) => {
          const isPlaced = placedIds.has(avatar.id);

          return (
            <button
              key={avatar.id}
              draggable={!isPlaced && isGameActive}
              onDragStart={(event) => handleDragStart(event, avatar.id)}
              onDragEnd={() => {
                setDraggingId(null);
                setHoveredTargetId(null);
              }}
              disabled={isPlaced || !isGameActive}
              className={`
                px-6 py-3 rounded-xl border text-2xl font-extrabold transition-all shadow-sm
                ${wrongId === avatar.id ? "shake border-game-wrong bg-game-wrong/20 text-white" : ""}
                ${isPlaced
                  ? "opacity-25 border-slate-700 bg-slate-900 text-slate-400"
                  : "cursor-grab active:cursor-grabbing border-slate-500 bg-slate-800 text-slate-100 hover:border-game-accent hover:bg-game-panel-hover hover:text-game-accent-soft hover:scale-105"
                }
              `}
            >
              {avatar.name}
            </button>
          );
        })}
      </section>

      {(isComplete || isTimedOut) && (
        <div className="absolute inset-0 bg-game-bg flex flex-col items-center justify-center gap-8 p-8 text-center">
          <h2 className="text-5xl font-bold text-game-accent">
            {isComplete ? "Dasavatar Complete!" : "Time's Up!"}
          </h2>
          <div className="text-8xl font-bold text-game-text">{matchedCount} / {TOTAL_AVATARS}</div>
          <p className="text-3xl text-slate-300">
            {isComplete ? "Hare Krishna! Perfect match!" : "Try again and match all avatars!"}
          </p>
          <div className="text-xl text-slate-500 mt-8">
            Next player in {countdown}...
          </div>
          <button
            onClick={onExit}
            className="mt-4 px-8 py-4 bg-slate-800 border border-game-accent rounded-xl text-game-accent text-xl hover:bg-game-panel-hover shadow-lg"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
