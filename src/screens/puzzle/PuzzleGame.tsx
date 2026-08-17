import { useCallback, useEffect, useState } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { shuffle } from "../../shuffle";

interface Props {
  onExit: () => void;
}

const PIECES = [0, 1, 2, 3, 4, 5];
const GAME_DURATION_MS = 75_000;
const COMPLETION_REVEAL_MS = 4_000;

function shuffledPieces() {
  const pieces = shuffle(PIECES);
  return pieces.every((piece, index) => piece === index) ? pieces.reverse() : pieces;
}

export function PuzzleGame({ onExit }: Props) {
  const [pieces] = useState(shuffledPieces);
  const [board, setBoard] = useState<(number | null)[]>(() => PIECES.map(() => null));
  const [selectedPiece, setSelectedPiece] = useState<{ piece: number; slot: number | null } | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [draggingSlot, setDraggingSlot] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [showCompleteResult, setShowCompleteResult] = useState(false);

  const correctCount = board.filter((piece, index) => piece === index).length;
  const isComplete = correctCount === PIECES.length;
  const isFinished = isComplete || timedOut;
  const showResult = timedOut || showCompleteResult;

  useEffect(() => {
    if (!isComplete || timedOut) return;
    const timeout = window.setTimeout(() => setShowCompleteResult(true), COMPLETION_REVEAL_MS);
    return () => window.clearTimeout(timeout);
  }, [isComplete, timedOut]);

  const placePiece = (piece: number, sourceSlot: number | null, targetSlot: number) => {
    if (isFinished) return;
    setBoard((current) => {
      const next = [...current];
      if (sourceSlot === null) {
        next[targetSlot] = piece;
      } else {
        [next[sourceSlot], next[targetSlot]] = [next[targetSlot], next[sourceSlot]];
      }
      return next;
    });
    setSelectedPiece(null);
    setDraggingPiece(null);
    setDraggingSlot(null);
  };

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    setSelectedPiece(null);
    setDraggingPiece(null);
    setDraggingSlot(null);
  }, []);

  if (showResult) {
    return (
      <GameResultScreen
        title={isComplete ? "Puzzle Complete!" : "Time's Up!"}
        score={`${correctCount} / ${PIECES.length}`}
        message={isComplete ? "Hare Krishna! You restored the picture." : "Pieces placed correctly."}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-game-bg p-8 pt-10 text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={isFinished} />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Krishna Picture Puzzle</h1>
        <p className="mt-1 text-xl text-slate-300">Drag each loose piece into its matching place.</p>
      </header>

      <main className="my-auto flex min-h-0 flex-1 items-center justify-center gap-12 py-4">
        <div
          className={`grid h-[46rem] w-[34.5rem] grid-cols-2 grid-rows-3 overflow-hidden rounded-2xl border-4 bg-game-panel shadow-2xl transition-all ${
            isComplete
              ? "glow-correct gap-0 border-game-correct"
              : "gap-1 border-slate-700"
          }`}
        >
          {board.map((piece, slot) => {
            const column = piece === null ? 0 : piece % 2;
            const row = piece === null ? 0 : Math.floor(piece / 2);
            return (
              <button
                key={slot}
                draggable={piece !== null && !isFinished}
                disabled={isFinished}
                tabIndex={-1}
                aria-label={piece === null ? "Empty puzzle position" : "Placed puzzle piece"}
                onClick={() => {
                  if (selectedPiece) placePiece(selectedPiece.piece, selectedPiece.slot, slot);
                  else if (piece !== null) setSelectedPiece({ piece, slot });
                }}
                onDragStart={(event) => {
                  if (piece === null) return;
                  event.dataTransfer.effectAllowed = "move";
                  setDraggingPiece(piece);
                  setDraggingSlot(slot);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggingPiece !== null) placePiece(draggingPiece, draggingSlot, slot);
                }}
                onDragEnd={() => {
                  setDraggingPiece(null);
                  setDraggingSlot(null);
                }}
                className={`bg-no-repeat ${
                  piece === null
                    ? "bg-slate-900 hover:bg-slate-800"
                    : selectedPiece?.slot === slot
                      ? "scale-95 ring-8 ring-inset ring-game-accent"
                      : "hover:brightness-110"
                }`}
                style={piece !== null ? {
                  backgroundImage: "url('./puzzle/yashoda-krishna.jpg')",
                  backgroundSize: "200% 300%",
                  backgroundPosition: `${column * 100}% ${row * 50}%`,
                } : undefined}
              />
            );
          })}
        </div>

        <aside className="w-[48rem] rounded-3xl border border-slate-700 bg-game-panel p-6 text-center shadow-xl">
          <div className="mb-5 flex items-center justify-center gap-5">
            <img
              src="./puzzle/yashoda-krishna.jpg"
              alt="Yashoda holding baby Krishna"
              className="h-52 rounded-xl border-2 border-slate-600"
            />
            <div>
              <p className="text-2xl font-bold text-game-accent-soft">Mother Yashoda and Baby Krishna</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {pieces.map((piece) => {
              const column = piece % 2;
              const row = Math.floor(piece / 2);
              const isPlaced = board.includes(piece);
              return (
                <button
                  key={piece}
                  draggable={!isPlaced && !isFinished}
                  disabled={isPlaced || isFinished}
                  tabIndex={-1}
                  aria-label="Loose puzzle piece"
                  onClick={() => setSelectedPiece(selectedPiece?.piece === piece ? null : { piece, slot: null })}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    setDraggingPiece(piece);
                    setDraggingSlot(null);
                  }}
                  onDragEnd={() => {
                    setDraggingPiece(null);
                    setDraggingSlot(null);
                  }}
                  className={`h-[11.5rem] bg-no-repeat transition-all ${
                    isPlaced
                      ? "pointer-events-none opacity-0"
                      : selectedPiece?.piece === piece
                        ? "scale-95 rounded-lg ring-8 ring-game-accent"
                        : draggingPiece === piece
                          ? "opacity-40"
                          : "rounded-lg shadow-lg hover:scale-[1.03] hover:brightness-110"
                  }`}
                  style={{
                    backgroundImage: "url('./puzzle/yashoda-krishna.jpg')",
                    backgroundSize: "200% 300%",
                    backgroundPosition: `${column * 100}% ${row * 50}%`,
                  }}
                />
              );
            })}
          </div>
        </aside>
      </main>

    </div>
  );
}
