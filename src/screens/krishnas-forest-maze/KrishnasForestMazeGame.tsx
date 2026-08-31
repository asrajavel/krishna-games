import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { CelebrationRain } from "../../components/CelebrationRain";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import type { GameProps } from "../../games";
import { playSound } from "../../soundEffects";

type Cell = { row: number; col: number };
type Phase = "playing" | "complete" | "result";
type Outcome = "complete" | "timeout";
type Maze = readonly (readonly number[])[];

const NORTH = 1;
const EAST = 2;
const SOUTH = 4;
const WEST = 8;
const KIDS_MAZE = [
  [4, 6, 12, 6, 14, 10, 10, 10, 10, 8],
  [5, 5, 5, 1, 3, 10, 14, 10, 10, 12],
  [3, 9, 3, 10, 10, 12, 7, 10, 8, 5],
  [6, 8, 6, 10, 10, 9, 1, 6, 12, 5],
  [7, 12, 5, 2, 10, 10, 14, 9, 5, 5],
  [1, 3, 11, 10, 10, 10, 9, 2, 11, 9],
] as const;

const KIDS = { maze: KIDS_MAZE, rows: 6, cols: 10, start: { row: 0, col: 0 }, target: { row: 0, col: 9 } };

// Hand-tuned from the generated layout: 60-step solution with a wrong turn available
// at 34 of those cells. The removed walls open loops, so more than one route works.
const ADULTS_MAZE = [
  [4, 4, 4, 4, 6, 14, 10, 10, 10, 12, 6, 10, 10, 10, 14, 10, 10, 8, 4, 6, 8, 6, 10, 8],
  [3, 11, 15, 15, 9, 3, 8, 2, 10, 15, 9, 2, 12, 2, 11, 10, 14, 14, 11, 11, 10, 9, 2, 12],
  [2, 10, 9, 7, 8, 2, 10, 14, 12, 1, 6, 8, 7, 12, 2, 10, 9, 7, 10, 8, 4, 6, 10, 13],
  [4, 6, 12, 7, 14, 8, 2, 9, 5, 6, 11, 10, 13, 5, 4, 6, 8, 3, 14, 10, 11, 9, 4, 1],
  [7, 13, 1, 5, 3, 8, 4, 6, 15, 9, 4, 4, 5, 5, 7, 15, 8, 4, 5, 6, 12, 6, 9, 4],
  [1, 3, 10, 11, 14, 8, 3, 13, 5, 4, 3, 11, 13, 3, 13, 3, 12, 7, 15, 9, 3, 11, 8, 5],
  [2, 12, 6, 10, 13, 4, 4, 5, 5, 3, 12, 2, 9, 2, 9, 2, 13, 1, 1, 4, 6, 10, 14, 9],
  [2, 15, 11, 12, 5, 3, 11, 9, 7, 8, 3, 14, 8, 6, 14, 14, 11, 10, 14, 15, 9, 2, 15, 8],
  [4, 5, 4, 5, 3, 10, 8, 2, 15, 12, 6, 9, 4, 5, 5, 7, 14, 12, 5, 1, 2, 10, 13, 4],
  [7, 15, 13, 7, 14, 12, 4, 2, 13, 1, 7, 12, 5, 1, 5, 1, 5, 1, 3, 8, 6, 8, 7, 9],
  [1, 5, 1, 1, 5, 1, 7, 10, 15, 8, 5, 3, 13, 2, 15, 8, 1, 2, 10, 14, 13, 4, 3, 12],
  [2, 11, 10, 10, 11, 10, 11, 8, 3, 10, 9, 2, 9, 2, 11, 10, 10, 10, 8, 1, 3, 11, 10, 9],
] as const;

const ADULTS = { maze: ADULTS_MAZE, rows: 12, cols: 24, start: { row: 0, col: 0 }, target: { row: 11, col: 23 } };

const isSameCell = (a: Cell, b: Cell) => a.row === b.row && a.col === b.col;

function canMove(maze: Maze, from: Cell, to: Cell) {
  const rowChange = to.row - from.row;
  const colChange = to.col - from.col;
  const passage = maze[from.row][from.col];

  if (rowChange === -1 && colChange === 0) return Boolean(passage & NORTH);
  if (rowChange === 1 && colChange === 0) return Boolean(passage & SOUTH);
  if (rowChange === 0 && colChange === 1) return Boolean(passage & EAST);
  if (rowChange === 0 && colChange === -1) return Boolean(passage & WEST);
  return false;
}

export function KrishnasForestMazeGame({ onExit, variantId }: GameProps) {
  const adults = variantId === "adults";
  const { maze, rows, cols, start, target } = adults ? ADULTS : KIDS;
  const [phase, setPhase] = useState<Phase>("playing");
  const [outcome, setOutcome] = useState<Outcome>("complete");
  const [path, setPath] = useState<Cell[]>([start]);
  const [bumpedCell, setBumpedCell] = useState<string | null>(null);
  const pathRef = useRef<Cell[]>([start]);
  const draggingRef = useRef(false);
  const bumpTimeoutRef = useRef<number | null>(null);
  const lastBumpRef = useRef<string | null>(null);

  const finish = useCallback((result: Outcome) => {
    draggingRef.current = false;
    setOutcome(result);
    setPhase(result === "complete" ? "complete" : "result");
  }, []);

  const handleExpire = useCallback(() => finish("timeout"), [finish]);

  useEffect(() => {
    if (phase !== "complete") return;
    const timeout = window.setTimeout(() => setPhase("result"), 4000);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => () => {
    if (bumpTimeoutRef.current !== null) window.clearTimeout(bumpTimeoutRef.current);
  }, []);

  const cellFromPointer = (event: PointerEvent<HTMLDivElement>): Cell => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      row: Math.min(rows - 1, Math.max(0, Math.floor(((event.clientY - bounds.top) / bounds.height) * rows))),
      col: Math.min(cols - 1, Math.max(0, Math.floor(((event.clientX - bounds.left) / bounds.width) * cols))),
    };
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (phase !== "playing") return;
    const current = pathRef.current[pathRef.current.length - 1];
    if (!isSameCell(cellFromPointer(event), current)) return;
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || phase !== "playing") return;

    const candidate = cellFromPointer(event);
    const previousPath = pathRef.current;
    const current = previousPath[previousPath.length - 1];
    const candidateKey = `${candidate.row}-${candidate.col}`;
    if (lastBumpRef.current !== candidateKey) lastBumpRef.current = null;
    if (isSameCell(candidate, current)) return;

    const secondLast = previousPath[previousPath.length - 2];
    if (secondLast && isSameCell(candidate, secondLast)) {
      const nextPath = previousPath.slice(0, -1);
      pathRef.current = nextPath;
      setPath(nextPath);
      return;
    }

    if (!canMove(maze, current, candidate)) {
      if (Math.abs(candidate.row - current.row) + Math.abs(candidate.col - current.col) !== 1) return;
      if (lastBumpRef.current !== candidateKey) {
        playSound("wrong");
        lastBumpRef.current = candidateKey;
      }
      setBumpedCell(candidateKey);
      if (bumpTimeoutRef.current !== null) window.clearTimeout(bumpTimeoutRef.current);
      bumpTimeoutRef.current = window.setTimeout(() => setBumpedCell(null), 300);
      return;
    }

    const nextPath = [...previousPath, candidate];
    pathRef.current = nextPath;
    setPath(nextPath);
    if (isSameCell(candidate, target)) finish("complete");
  };

  if (phase === "result") {
    return (
      <GameResultScreen
        title={outcome === "complete" ? "Maze Complete!" : "Time's Up!"}
        score={outcome === "timeout" ? path.length : undefined}
        message={outcome === "complete" ? "Krishna found his cows!" : "The cows are still waiting."}
        onExit={onExit}
      />
    );
  }

  const endpoint = path[path.length - 1];
  const pathPoints = path.map(({ row, col }) => `${col + 0.5},${row + 0.5}`).join(" ");
  const tokenSize = adults ? "h-[2.75rem] w-[2.75rem]" : "h-[4.25rem] w-[4.25rem]";
  const goalSize = adults ? "h-[2.9rem] w-[2.9rem]" : "h-[4.5rem] w-[4.5rem]";

  return (
    <main className={`relative flex h-full w-full flex-col overflow-hidden bg-game-bg pt-10 text-game-text ${adults ? "px-4 pb-4" : "p-8"}`}>
      {phase === "complete" && <CelebrationRain />}
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={75000} onExpire={handleExpire} paused={phase !== "playing"} />
      </div>
      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Krishna’s Forest Maze</h1>
        <p className="mt-1 text-xl text-slate-300">
          {phase === "complete" ? "You found the cows!" : "Drag Krishna through the paths to reach his cows"}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-center pt-5">
        <div
          className={`relative touch-none overflow-hidden rounded-3xl border-4 bg-game-panel shadow-2xl select-none ${
            adults ? "h-full w-full" : "h-[34rem] w-[56.67rem]"
          } ${phase === "complete" ? "border-game-correct shadow-game-correct/30" : "border-game-accent"}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={() => { draggingRef.current = false; }}
          onPointerCancel={() => { draggingRef.current = false; }}
        >
          <img
            src="./krishnas-forest-maze/garden-background.webp"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
          >
            {maze.flatMap((row, rowIndex) =>
              row.map((passages, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                return (
                  <div
                    key={cellKey}
                    className={`relative transition-colors duration-200 ${
                      bumpedCell === cellKey ? "bg-game-wrong/60" : ""
                    }`}
                  >
                    {!(passages & NORTH) && <span className="maze-wall maze-wall-top" />}
                    {!(passages & WEST) && <span className="maze-wall maze-wall-left" />}
                    {colIndex === cols - 1 && <span className="maze-wall maze-wall-right" />}
                    {rowIndex === rows - 1 && <span className="maze-wall maze-wall-bottom" />}
                  </div>
                );
              }),
            )}
          </div>

          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="none">
            <polyline
              points={pathPoints}
              fill="none"
              stroke="var(--color-game-panel-hover)"
              strokeOpacity="0.45"
              strokeWidth="0.34"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={pathPoints}
              fill="none"
              stroke={phase === "complete" ? "var(--color-game-correct-soft)" : "var(--color-game-accent-soft)"}
              strokeOpacity="0.85"
              strokeWidth="0.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div
            aria-label="Krishna"
            className={`pointer-events-none absolute z-10 ${tokenSize} -translate-x-1/2 -translate-y-1/2 rounded-full bg-game-bg/70 p-0.5 ring-2 ring-game-accent shadow-lg shadow-game-accent/70`}
            style={{ left: `${((endpoint.col + 0.5) / cols) * 100}%`, top: `${((endpoint.row + 0.5) / rows) * 100}%` }}
          >
            <img className="h-full w-full object-contain drop-shadow-2xl" src="./krishnas-forest-maze/krishna-token.webp" alt="" />
          </div>
          <div
            aria-label="Krishna's cows"
            className={`pointer-events-none absolute z-10 ${goalSize} -translate-x-1/2 -translate-y-1/2 rounded-full bg-game-bg/70 p-0.5 ring-2 shadow-lg ${
              phase === "complete"
                ? "animate-pulse ring-game-correct shadow-game-correct/70"
                : "ring-krishna-green shadow-krishna-green/70"
            }`}
            style={{ left: `${((target.col + 0.5) / cols) * 100}%`, top: `${((target.row + 0.5) / rows) * 100}%` }}
          >
            <img className="h-full w-full object-contain drop-shadow-2xl" src="./krishnas-forest-maze/cows-goal.webp" alt="" />
          </div>
        </div>
      </div>
    </main>
  );
}
