import { useCallback, useEffect, useState } from "react";
import { CelebrationRain } from "../../components/CelebrationRain";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { usePointerDrag } from "../../pointerDrag";
import { shuffle } from "../../shuffle";
import { playSound } from "../../soundEffects";

interface Props {
  onExit: () => void;
}

const PIECES = [0, 1, 2, 3, 4, 5];
const GAME_DURATION_MS = 75_000;
const COMPLETION_REVEAL_MS = 4_000;
const BOARD_MAX_HEIGHT_REM = 46;
const BOARD_MAX_WIDTH_REM = 54;

interface DraggedPiece {
  piece: number;
  slot: number | null;
}

const PUZZLES = [
  "./puzzle/yashoda-krishna.jpg",
  "./puzzle/rasa-lila.jpg",
  "./puzzle/kaliya.jpg",
  "./puzzle/bala-krishna.png",
  "./puzzle/krishna-calf.jpg",
  "./puzzle/radha-krishna-swing.png",
];

function shuffledPieces() {
  const pieces = shuffle(PIECES);
  return pieces.every((piece, index) => piece === index) ? pieces.reverse() : pieces;
}

export function PuzzleGame({ onExit }: Props) {
  const [src] = useState(() => PUZZLES[Math.floor(Math.random() * PUZZLES.length)]);
  const [aspect, setAspect] = useState(0);
  const [pieces] = useState(shuffledPieces);
  const [board, setBoard] = useState<(number | null)[]>(() => PIECES.map(() => null));
  const [selectedPiece, setSelectedPiece] = useState<DraggedPiece | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [showCompleteResult, setShowCompleteResult] = useState(false);

  const correctCount = board.filter((piece, index) => piece === index).length;
  const isComplete = correctCount === PIECES.length;
  const isFinished = isComplete || timedOut;
  const showResult = timedOut || showCompleteResult;

  const columns = aspect > 1 ? 3 : 2;
  const rows = aspect > 1 ? 2 : 3;
  const boardHeight = Math.min(BOARD_MAX_HEIGHT_REM, BOARD_MAX_WIDTH_REM / aspect);
  const pieceStyle = (piece: number) => ({
    backgroundImage: `url('${src}')`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: `${((piece % columns) * 100) / (columns - 1)}% ${
      (Math.floor(piece / columns) * 100) / (rows - 1)
    }%`,
  });

  useEffect(() => {
    const image = new Image();
    image.onload = () => setAspect(image.naturalWidth / image.naturalHeight);
    image.src = src;
  }, [src]);

  useEffect(() => {
    if (!isComplete || timedOut) return;
    const timeout = window.setTimeout(() => setShowCompleteResult(true), COMPLETION_REVEAL_MS);
    return () => window.clearTimeout(timeout);
  }, [isComplete, timedOut]);

  const placePiece = useCallback((piece: number, sourceSlot: number | null, targetSlot: number) => {
    if (isFinished) return;
    playSound("drop");
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
  }, [isFinished]);

  const handleDrop = useCallback((dragged: DraggedPiece, targetSlot: string | null) => {
    if (targetSlot !== null) placePiece(dragged.piece, dragged.slot, Number(targetSlot));
  }, [placePiece]);

  const { item: dragging, position, hoveredTarget, start, cancel } = usePointerDrag<DraggedPiece>(
    "data-slot",
    handleDrop,
  );

  const handleExpire = useCallback(() => {
    setTimedOut(true);
    setSelectedPiece(null);
    cancel();
  }, [cancel]);

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

  if (!aspect) return <div className="h-full w-full bg-game-bg" />;

  return (
    <div
      className="relative flex h-full w-full flex-col bg-game-bg p-8 pt-10 text-game-text"
      data-dragging={dragging ? "" : undefined}
    >
      {isComplete && <CelebrationRain />}
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_DURATION_MS} onExpire={handleExpire} paused={isFinished} />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Krishna Picture Puzzle</h1>
        <p className="mt-1 text-xl text-slate-300">Drag each loose piece into its matching place.</p>
      </header>

      <main className="my-auto flex min-h-0 flex-1 items-center justify-center gap-12 py-4">
        <div
          style={{ height: `${boardHeight}rem`, width: `${boardHeight * aspect}rem` }}
          className={`grid shrink-0 overflow-hidden rounded-2xl border-4 bg-game-panel shadow-2xl transition-all ${
            aspect > 1 ? "grid-cols-3 grid-rows-2" : "grid-cols-2 grid-rows-3"
          } ${
            isComplete
              ? "glow-correct gap-0 border-game-correct"
              : "gap-1 border-slate-700"
          }`}
        >
          {board.map((piece, slot) => {
            return (
              <button
                key={slot}
                data-slot={slot}
                disabled={isFinished}
                tabIndex={-1}
                aria-label={piece === null ? "Empty puzzle position" : "Placed puzzle piece"}
                onClick={() => {
                  if (selectedPiece) placePiece(selectedPiece.piece, selectedPiece.slot, slot);
                  else if (piece !== null) setSelectedPiece({ piece, slot });
                }}
                onPointerDown={(event) => {
                  if (piece !== null) start(event, { piece, slot });
                }}
                className={`touch-none bg-no-repeat ${
                  dragging && hoveredTarget === String(slot)
                    ? "ring-8 ring-inset ring-game-accent"
                    : ""
                } ${
                  piece === null
                    ? "bg-slate-900 hover:bg-slate-800"
                    : selectedPiece?.slot === slot
                      ? "scale-95 ring-8 ring-inset ring-game-accent"
                      : dragging?.slot === slot
                        ? "opacity-40"
                        : "hover:brightness-110"
                }`}
                style={piece !== null ? pieceStyle(piece) : undefined}
              />
            );
          })}
        </div>

        <aside className="w-[48rem] rounded-3xl border border-slate-700 bg-game-panel p-6 text-center shadow-xl">
          <div className="mb-5 flex items-center justify-center">
            <img
              src={src}
              alt=""
              className="h-52 rounded-xl border-2 border-slate-600"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {pieces.map((piece) => {
              const isPlaced = board.includes(piece);
              return (
                <button
                  key={piece}
                  disabled={isPlaced || isFinished}
                  tabIndex={-1}
                  aria-label="Loose puzzle piece"
                  onClick={() => setSelectedPiece(selectedPiece?.piece === piece ? null : { piece, slot: null })}
                  onPointerDown={(event) => start(event, { piece, slot: null })}
                  className={`touch-none bg-no-repeat transition-all ${
                    isPlaced
                      ? "pointer-events-none opacity-0"
                      : selectedPiece?.piece === piece
                        ? "scale-95 rounded-lg ring-8 ring-game-accent"
                        : dragging?.piece === piece
                          ? "opacity-40"
                          : "rounded-lg shadow-lg hover:scale-[1.03] hover:brightness-110"
                  }`}
                  style={{ ...pieceStyle(piece), aspectRatio: (aspect * rows) / columns }}
                />
              );
            })}
          </div>
        </aside>
      </main>

      {dragging && (
        <div
          className="pointer-events-none fixed z-50 w-56 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-game-accent bg-no-repeat shadow-lg"
          style={{
            ...pieceStyle(dragging.piece),
            aspectRatio: (aspect * rows) / columns,
            left: position.x,
            top: position.y,
          }}
        />
      )}
    </div>
  );
}
