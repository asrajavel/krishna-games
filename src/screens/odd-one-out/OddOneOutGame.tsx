import { useCallback, useEffect, useState } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import { REVEAL_HOLD_MS } from "../../feedback";

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
const LEAVE_MS = 350;
const POSITIONS = [
  "col-start-2 row-start-1",
  "col-start-1 row-start-2",
  "col-start-3 row-start-2",
  "col-start-2 row-start-3",
];

export function OddOneOutGame({ onExit }: Props) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"playing" | "result">("playing");
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
    }, isLastRound ? 4000 : REVEAL_HOLD_MS + LEAVE_MS);

    return () => clearTimeout(timeout);
  }, [isLastRound, phase, selectedIndex]);

  const handlePick = (index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    if (index === round.oddIndex) setScore((current) => current + 1);
  };

  if (phase === "result") {
    return (
      <GameResultScreen
        title="Odd One Out Complete!"
        score={`${score} / ${ROUNDS.length}`}
        message={score === ROUNDS.length ? "Perfect! You know Krishna's pastimes!" : "Well played! Keep learning about Krishna!"}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-game-bg p-8 pt-10 text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer durationMs={GAME_TIME_MS} onExpire={handleExpire} />
      </div>

      <header className="shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Pick the Odd One Out</h1>
        <p className="mt-1 text-xl text-slate-300">Choose the item that does not belong.</p>
      </header>

      <main
        key={roundIndex}
        className={`flex flex-1 flex-col items-center justify-center gap-6 ${
          selectedIndex !== null && !isLastRound ? "quiz-slide-leaving" : "quiz-slide"
        }`}
      >
        <h2 className="text-center text-3xl font-bold">{round.prompt}</h2>
        <div className="grid w-full max-w-4xl grid-cols-3 grid-rows-3 gap-2">
          {round.items.map((item, index) => {
            const isOdd = index === round.oddIndex;
            const isSelected = index === selectedIndex;
            const revealed = selectedIndex !== null;
            const style = revealed
              ? isOdd && isSelected
                ? "reveal-pop pop-correct border-game-correct"
                : isOdd
                  ? "border-game-correct/60 bg-game-correct/15"
                  : isSelected
                    ? "reveal-pop pop-wrong border-game-wrong"
                    : "border-slate-800 bg-slate-900 opacity-45"
              : "border-slate-600 bg-game-panel group-hover:border-game-accent group-hover:bg-game-panel-hover group-hover:scale-110";

            return (
              <button
                key={item.label}
                onClick={() => handlePick(index)}
                disabled={revealed}
                tabIndex={-1}
                className={`group flex flex-col items-center justify-center gap-3 ${POSITIONS[index]}`}
              >
                <span className={`flex h-52 w-52 items-center justify-center rounded-full border-4 text-8xl shadow-xl transition-all duration-300 ${style}`}>
                  {item.icon}
                </span>
                <span className="text-2xl font-extrabold leading-snug text-game-text transition-colors group-hover:text-game-accent">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
