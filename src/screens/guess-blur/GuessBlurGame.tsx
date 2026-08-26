import { useCallback, useEffect, useRef, useState } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { REVEAL_HOLD_MS } from "../../feedback";
import type { GameProps } from "../../games";
import { shuffle } from "../../shuffle";
import { playSound } from "../../soundEffects";

const TIME_PER_ROUND_MS = 15_000;
const COMPLETION_REVEAL_MS = 4_000;
const LEAVE_MS = 350;
const ROUND_COUNT = 3;
const MAX_HINTS = 2;
const POINTS = [3, 2, 1];
const PIXEL_BLOCKS = [50, 30, 1];
const LABELS = ["A", "B", "C", "D"];

const IMAGES = [
  { src: "./puzzle/radha-krishna-swing.png", label: "Radha Krishna Swing" },
  { src: "./puzzle/kaliya.jpg", label: "Kaliya Daman" },
  { src: "./puzzle/yashoda-krishna.jpg", label: "Yashoda and Krishna" },
  { src: "./puzzle/rasa-lila.jpg", label: "Rasa Lila" },
] as const;

function makeRounds() {
  return shuffle(IMAGES).slice(0, ROUND_COUNT).map((answer) => ({
    answer,
    options: shuffle(IMAGES.map((item) => item.label)),
  }));
}

function PixelatedImage({
  src,
  blocks,
  children,
}: {
  src: string;
  blocks: number;
  children?: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = new Image();
    image.src = src;
    image.onload = () => {
      canvas.parentElement?.style.setProperty(
        "aspect-ratio",
        `${image.naturalWidth} / ${image.naturalHeight}`,
      );
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawContained = (target: CanvasRenderingContext2D, width: number, height: number) => {
        const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        target.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      };

      if (blocks <= 1) {
        ctx.imageSmoothingEnabled = true;
        drawContained(ctx, canvas.width, canvas.height);
        return;
      }

      const smallW = Math.max(1, Math.round(rect.width / blocks));
      const smallH = Math.max(1, Math.round(rect.height / blocks));
      const offscreen = document.createElement("canvas");
      offscreen.width = smallW;
      offscreen.height = smallH;
      const off = offscreen.getContext("2d");
      if (!off) return;
      off.imageSmoothingEnabled = false;
      drawContained(off, smallW, smallH);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
    };
  }, [src, blocks]);

  return (
    <div className="relative h-full max-w-full overflow-hidden rounded-[2rem] border border-white/10 bg-game-panel shadow-xl">
      <canvas ref={canvasRef} className="h-full w-full" />
      {children}
    </div>
  );
}

export function GuessBlurGame({ onExit }: GameProps) {
  const [rounds] = useState(makeRounds);
  const [roundIndex, setRoundIndex] = useState(0);
  const [hints, setHints] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const round = rounds[roundIndex];
  const correctIndex = round.options.indexOf(round.answer.label);
  const answered = selectedIndex !== null;
  const timedOut = selectedIndex === -1;
  const isLastRound = roundIndex === rounds.length - 1;
  const maxScore = rounds.length * POINTS[0];
  const pixelBlocks = answered && !timedOut ? 1 : PIXEL_BLOCKS[hints];

  const handleExpire = useCallback(() => setSelectedIndex(-1), []);

  useEffect(() => {
    if (!answered) return;
    const delay = isLastRound ? COMPLETION_REVEAL_MS : REVEAL_HOLD_MS + LEAVE_MS;
    const timeout = window.setTimeout(() => {
      if (isLastRound) {
        setShowResult(true);
      } else {
        setRoundIndex((current) => current + 1);
        setHints(0);
        setSelectedIndex(null);
      }
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [answered, isLastRound]);

  const handlePick = (index: number) => {
    if (answered) return;
    playSound(index === correctIndex ? "correct" : "wrong");
    setSelectedIndex(index);
    if (index === correctIndex) setScore((current) => current + POINTS[hints]);
  };

  if (showResult) {
    return (
      <GameResultScreen
        title="Guess Complete!"
        score={`${score} / ${maxScore}`}
        message={score === maxScore ? "Hare Krishna! Perfect vision!" : "Well played! Jai Shri Krishna!"}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden bg-game-bg p-8 pt-10 text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer
          key={roundIndex}
          durationMs={TIME_PER_ROUND_MS}
          onExpire={handleExpire}
          paused={answered}
        />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Guess the Picture</h1>
        <p className="mt-1 text-xl text-slate-300">Look through the pixels and pick the matching name.</p>
        <p className="mt-2 text-xl font-semibold text-game-accent">
          Picture {roundIndex + 1} of {rounds.length} · Score {score} / {maxScore}
        </p>
      </header>

      <main
        key={roundIndex}
        className={`flex min-h-0 w-full flex-1 items-center justify-center gap-10 pt-6 ${
          answered && !isLastRound ? "quiz-slide-leaving" : "quiz-slide"
        }`}
      >
        <div className="flex h-full min-w-0 flex-1 items-center justify-center">
          <PixelatedImage src={round.answer.src} blocks={pixelBlocks}>
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              {hints < MAX_HINTS && !answered && (
                <button
                  onClick={() => {
                    playSound("select");
                    setHints((current) => current + 1);
                  }}
                  tabIndex={-1}
                  className="rounded-xl border border-game-accent bg-game-panel/90 px-8 py-4 text-2xl font-bold text-game-accent shadow-xl backdrop-blur-sm hover:bg-game-panel-hover"
                >
                  Reveal a bit more  (−1 point)
                </button>
              )}
              {timedOut && (
                <div className="animate-pulse rounded-full border border-game-wrong/40 bg-game-panel/85 px-10 py-3 text-2xl font-bold uppercase tracking-widest text-game-wrong-soft shadow-xl backdrop-blur-sm">
                  Time&apos;s up
                </div>
              )}
            </div>
          </PixelatedImage>
        </div>

        <div className="flex w-[38rem] shrink-0 flex-col gap-5">
          {round.options.map((option, index) => {
            const base = "game-card relative flex cursor-pointer items-center gap-5 rounded-[2rem] border p-6 text-left text-3xl font-semibold transition-all duration-300";
            const style = timedOut
              ? `${base} border-white/5 text-krishna-cream/35`
              : answered
              ? index === correctIndex
                ? `${base} reveal-pop pop-correct border-game-correct text-game-correct-soft`
                : index === selectedIndex
                  ? `${base} reveal-pop pop-wrong border-game-wrong text-game-wrong-soft`
                  : `${base} border-white/5 text-krishna-cream/35`
              : `${base} border-white/10 text-krishna-cream hover:-translate-y-2 hover:border-krishna-green`;

            return (
              <button
                key={option}
                className={style}
                onClick={() => handlePick(index)}
                disabled={answered}
                tabIndex={-1}
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/5 text-3xl font-extrabold text-game-accent ring-1 ring-white/10">
                  {answered && !timedOut && index === correctIndex ? "✓" : LABELS[index]}
                </span>
                {option}
                {selectedIndex === index && index === correctIndex && (
                  <strong className="absolute right-4 top-4 text-3xl font-black text-game-correct-soft drop-shadow-lg">
                    +{POINTS[hints]}
                  </strong>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
