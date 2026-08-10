import { useCallback, useEffect, useState } from "react";
import { Timer } from "../../components/Timer";

interface Props {
  onExit: () => void;
}

const ROUNDS = [
  {
    prompt: "Which symbol is not associated with Krishna?",
    items: [
      { icon: "🪈", label: "Flute" },
      { icon: "🦚", label: "Peacock feather" },
      { icon: "🪷", label: "Lotus" },
      { icon: "🔱", label: "Trident" },
    ],
    oddIndex: 3,
  },
  {
    prompt: "Which pastime does not belong to Krishna?",
    items: [
      { icon: "⛰️", label: "Lifted Govardhan Hill" },
      { icon: "🐍", label: "Danced on Kaliya" },
      { icon: "🌉", label: "Built a bridge to Lanka" },
      { icon: "🧈", label: "Stole butter" },
    ],
    oddIndex: 2,
  },
  {
    prompt: "Who does not belong among Krishna's friends and devotees?",
    items: [
      { icon: "🏹", label: "Arjuna" },
      { icon: "👑", label: "Ravana" },
      { icon: "🤝", label: "Sudama" },
      { icon: "🌸", label: "Radha" },
    ],
    oddIndex: 1,
  },
  {
    prompt: "Which place is not closely connected to Krishna's life?",
    items: [
      { icon: "🏞️", label: "Vrindavan" },
      { icon: "🏰", label: "Mathura" },
      { icon: "🏹", label: "Ayodhya" },
      { icon: "🌊", label: "Dwarka" },
    ],
    oddIndex: 2,
  },
  {
    prompt: "Which festival does not celebrate Krishna?",
    items: [
      { icon: "🪔", label: "Janmashtami" },
      { icon: "⛰️", label: "Govardhan Puja" },
      { icon: "🏹", label: "Rama Navami" },
      { icon: "🌕", label: "Rasa Purnima" },
    ],
    oddIndex: 2,
  },
] as const;

const GAME_TIME_MS = 75_000;

export function OddOneOutGame({ onExit }: Props) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const [countdown, setCountdown] = useState(10);
  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;

  const handleExpire = useCallback(() => setPhase("result"), []);

  useEffect(() => {
    if (phase !== "playing" || selectedIndex === null) return;

    const timeout = setTimeout(() => {
      if (isLastRound) {
        setPhase("result");
      } else {
        setRoundIndex((current) => current + 1);
        setSelectedIndex(null);
      }
    }, isLastRound ? 4000 : 1400);

    return () => clearTimeout(timeout);
  }, [isLastRound, phase, selectedIndex]);

  useEffect(() => {
    if (phase !== "result") return;

    const interval = setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);
    const timeout = setTimeout(onExit, 10_000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onExit, phase]);

  const handlePick = (index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    if (index === round.oddIndex) setScore((current) => current + 1);
  };

  if (phase === "result") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-game-bg p-8 text-game-text">
        <div className="rounded-3xl border border-slate-700 bg-game-panel p-12 text-center shadow-2xl">
          <div className="text-7xl">🔍</div>
          <h2 className="mt-5 text-5xl font-extrabold text-game-accent">Odd One Out Complete!</h2>
          <div className="mt-8 text-8xl font-bold">{score} / {ROUNDS.length}</div>
          <p className="mt-6 text-3xl text-slate-300">
            {score === ROUNDS.length ? "Perfect! You know Krishna's pastimes!" : "Well played! Keep learning about Krishna!"}
          </p>
        </div>
        <p className="text-xl text-slate-500">Next player in {countdown}...</p>
        <button
          onClick={onExit}
          tabIndex={-1}
          className="rounded-xl border border-game-accent bg-game-panel px-8 py-4 text-xl text-game-accent shadow-lg hover:bg-game-panel-hover"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-game-bg p-8 pt-10 text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_TIME_MS} onExpire={handleExpire} variant="edge" />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Pick the Odd One Out</h1>
      </header>

      <main className="pointer-events-none absolute inset-0">
        <h2 className="absolute inset-x-0 top-1/2 -translate-y-56 text-center text-3xl font-bold">{round.prompt}</h2>
        <div className="pointer-events-auto absolute left-1/2 top-1/2 grid w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 grid-cols-4 gap-6">
          {round.items.map((item, index) => {
            const isOdd = index === round.oddIndex;
            const isSelected = index === selectedIndex;
            const revealed = selectedIndex !== null;
            const style = revealed
              ? isOdd
                ? "border-game-correct bg-game-correct/15 text-game-correct-soft scale-105"
                : isSelected
                  ? "border-game-wrong bg-game-wrong/15 text-game-wrong-soft"
                  : "border-slate-800 bg-slate-900 text-slate-500"
              : "border-slate-700 bg-game-panel hover:border-game-accent hover:bg-game-panel-hover hover:scale-105";

            return (
              <button
                key={item.label}
                onClick={() => handlePick(index)}
                disabled={revealed}
                tabIndex={-1}
                className={`flex h-80 flex-col items-center justify-center gap-6 rounded-3xl border-2 p-6 text-center shadow-xl transition-all duration-300 ${style}`}
              >
                <span className="text-8xl">{item.icon}</span>
                <span className="text-3xl font-extrabold leading-snug">{item.label}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
