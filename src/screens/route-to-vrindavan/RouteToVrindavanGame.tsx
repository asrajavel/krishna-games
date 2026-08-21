import { useCallback, useState } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";

interface Props {
  onExit: () => void;
}

type Phase = "playing" | "driving" | "result";
type Outcome = "complete" | "lost" | "timeout";

const ROUTES = [
  { from: "Bangalore", options: ["Tumkur", "Kolar"], correct: 0 },
  { from: "Tumkur", options: ["Kundapura", "Chitradurga"], correct: 1 },
  { from: "Chitradurga", options: ["Vijayapura", "Raichur"], correct: 0 },
  { from: "Vijayapura", options: ["Pune", "Sholapur"], correct: 1 },
  { from: "Sholapur", options: ["Sambhajinagar", "Nashik"], correct: 0 },
  { from: "Sambhajinagar", options: ["Indore", "Nagpur"], correct: 0 },
  { from: "Indore", options: ["Udaipur", "Kota"], correct: 1 },
  { from: "Kota", options: ["Jaipur", "Agra"], correct: 0 },
  { from: "Jaipur", options: ["Delhi", "Agra"], correct: 1 },
  { from: "Agra", options: ["Faridabad", "Mathura"], correct: 1 },
  { from: "Mathura", options: ["Govardhan", "Vrindavan"], correct: 1 },
] as const;

export function RouteToVrindavanGame({ onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("playing");
  const [routeIndex, setRouteIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<Outcome>("complete");
  const route = ROUTES[routeIndex];

  const finish = useCallback((result: Outcome) => {
    setOutcome(result);
    setPhase("result");
  }, []);

  const handleChoice = (choice: number) => {
    if (phase !== "playing" || selected !== null) return;
    setSelected(choice);

    if (choice !== route.correct) {
      const remainingLives = lives - 1;
      setLives(remainingLives);
      setTimeout(() => remainingLives === 0 ? finish("lost") : setSelected(null), 2000);
      return;
    }

    setPhase("driving");
    setTimeout(() => {
      if (routeIndex === ROUTES.length - 1) {
        finish("complete");
      } else {
        setRouteIndex((index) => index + 1);
        setSelected(null);
        setPhase("playing");
      }
    }, 5000);
  };

  if (phase === "result") {
    const completed = outcome === "complete" ? ROUTES.length : routeIndex;
    return (
      <GameResultScreen
        title={outcome === "complete" ? "Welcome to Vrindavan!" : outcome === "lost" ? "Journey Paused" : "Time's Up!"}
        score={`${completed} / ${ROUTES.length}`}
        message={outcome === "complete" ? "Hare Krishna! You reached Vrindavan." : "A fresh journey begins shortly."}
        onExit={onExit}
      />
    );
  }

  const isCorrect = selected === route.correct;
  const choseWrong = selected !== null && !isCorrect;

  return (
    <main className="route-game relative flex h-full flex-col overflow-hidden">
      <Timer durationMs={150000} onExpire={() => finish("timeout")} paused={phase !== "playing"} />
      {choseWrong && (
        <div className="route-life-lost pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div>
            <strong>Wrong Turn!</strong>
            <span>{lives} {lives === 1 ? "chance" : "chances"} left</span>
          </div>
        </div>
      )}

      {phase === "playing" ? (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center px-10 pb-7 pt-6">
          <header className="shrink-0 text-center">
            <h1 className="text-5xl font-extrabold text-game-accent">Route to Vrindavan</h1>
            <p className="mt-1 text-xl text-slate-100">Choose the road that takes the pilgrims closer to Vrindavan</p>
          </header>

          <div className="mt-5 flex w-full max-w-[76rem] items-center justify-between rounded-2xl bg-game-panel/90 px-7 py-4 shadow-xl">
            <div>
              <p className="text-lg font-bold uppercase tracking-[.2em] text-krishna-green">Current stop</p>
              <p className="text-3xl font-black text-game-text">{route.from}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-300">Turn {routeIndex + 1} of {ROUTES.length}</p>
              <div className="mt-2 flex gap-2">
                {ROUTES.map((_, index) => (
                  <span key={index} className={`h-2 w-8 rounded-full ${index <= routeIndex ? "bg-game-accent" : "bg-white/15"}`} />
                ))}
              </div>
            </div>
            <p aria-label={`${lives} chances remaining`} className={`text-4xl tracking-[.18em] ${choseWrong ? "route-lives-hit" : ""}`}>
              {Array.from({ length: 3 }, (_, index) => <span key={index} className={index < lives ? "" : "opacity-20"}>♥</span>)}
            </p>
          </div>

          <h2 className="mt-6 shrink-0 text-4xl font-extrabold text-game-text">Which way should the bus go?</h2>

          <div className="flex min-h-0 w-full flex-1 items-center justify-between px-6">
            {route.options.map((option, index) => {
              const wrong = selected === index && !isCorrect;
              return (
                <button
                  key={option}
                  onClick={() => handleChoice(index)}
                  disabled={selected !== null}
                  tabIndex={-1}
                  className={`relative w-[28rem] transition-transform duration-200 hover:scale-105 disabled:hover:scale-100 ${wrong ? "shake" : ""}`}
                >
                  <img src="./vrindavan-highway-sign.webp" alt="" className={`w-full drop-shadow-2xl ${wrong ? "brightness-75 saturate-150" : ""}`} />
                  <span className={`absolute left-[6%] top-[8%] flex h-[34%] w-[88%] items-center justify-center text-4xl font-black uppercase text-white ${wrong ? "text-game-wrong-soft" : ""}`}>
                    {index === 0 ? "← " : ""}{option}{index === 1 ? " →" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="route-drive-scene absolute inset-0">
          <div className="route-road" />
          <div className="route-drive-message">
            Correct! Onward to {route.options[route.correct]} ✓
          </div>
          <div className="route-passing-sign">
            <img src="./vrindavan-highway-sign.webp" alt="" />
            <strong>{route.options[route.correct]} ↑</strong>
          </div>
          <img className="route-bus" src="./vrindavan-pilgrimage-bus.webp" alt="Pilgrimage bus travelling toward Vrindavan" />
        </div>
      )}
    </main>
  );
}
