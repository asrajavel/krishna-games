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
    <div className="w-full h-full flex flex-col gap-6 p-8 relative">
      <header className="flex items-start justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold text-krishna-gold">Match the Dasavatar</h1>
          <p className="text-xl text-krishna-cream/70 mt-1 mb-4">Drag each name to the correct picture.</p>
          <div className="w-full max-w-2xl">
            <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={!isGameActive} />
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={onExit}
            className="px-5 py-2 rounded-xl border border-krishna-gold/60 text-krishna-gold text-lg hover:bg-krishna-gold/10"
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
                rounded-2xl border-2 bg-white/5 p-2 flex flex-col min-h-0 transition-all
                ${matchedName
                  ? "border-krishna-correct shadow-[0_0_18px_rgba(0,255,136,0.35)]"
                  : isHovered
                      ? "scale-[1.03] border-krishna-gold bg-krishna-gold/10 shadow-[0_0_26px_rgba(0,212,255,0.45)]"
                      : "border-krishna-gold/35 hover:border-krishna-gold"
                }
              `}
            >
              <img
                src={avatar.image}
                alt={avatar.name}
                draggable={false}
                className="w-full flex-1 min-h-0 object-contain rounded-xl bg-black/20"
              />
              <div
                className={`
                  mt-2 h-12 rounded-xl border flex items-center justify-center text-2xl font-bold
                  ${matchedName
                    ? "border-krishna-correct bg-krishna-correct/15 text-krishna-correct"
                    : isHovered
                        ? "border-krishna-gold bg-krishna-gold/20 text-krishna-gold"
                    : "border-dashed border-krishna-cream/35 text-krishna-cream/45"
                  }
                `}
              >
                {matchedName ?? "Drop name here"}
              </div>
            </div>
          );
        })}
      </main>

      <section className="min-h-30 rounded-2xl border-2 border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-center gap-3">
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
                px-6 py-3 rounded-2xl border-2 text-2xl font-extrabold transition-all
                ${wrongId === avatar.id ? "shake border-krishna-wrong bg-krishna-wrong/20 text-white" : ""}
                ${isPlaced
                  ? "opacity-20 border-white/10 bg-white/5 text-krishna-cream"
                  : "cursor-grab active:cursor-grabbing border-krishna-gold bg-krishna-gold/15 text-krishna-cream hover:bg-krishna-gold/25 hover:scale-105"
                }
              `}
            >
              {avatar.name}
            </button>
          );
        })}
      </section>

      {(isComplete || isTimedOut) && (
        <div className="absolute inset-0 bg-krishna-bg flex flex-col items-center justify-center gap-8 p-8 text-center">
          <h2 className="text-5xl font-bold text-krishna-gold">
            {isComplete ? "Dasavatar Complete!" : "Time's Up!"}
          </h2>
          <div className="text-8xl font-bold text-krishna-cream">{matchedCount} / {TOTAL_AVATARS}</div>
          <p className="text-3xl text-krishna-cream/80">
            {isComplete ? "Hare Krishna! Perfect match!" : "Try again and match all avatars!"}
          </p>
          <div className="text-xl text-krishna-cream/50 mt-8">
            Next player in {countdown}...
          </div>
          <button
            onClick={onExit}
            className="mt-4 px-8 py-4 bg-krishna-gold/10 border-2 border-krishna-gold rounded-xl text-krishna-gold text-xl hover:bg-krishna-gold/20 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
