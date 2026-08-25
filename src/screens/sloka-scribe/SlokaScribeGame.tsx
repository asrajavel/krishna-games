import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { CelebrationRain } from "../../components/CelebrationRain";
import { GameResultScreen } from "../../components/GameResultScreen";
import { Timer } from "../../components/Timer";
import type { GameProps } from "../../games";

const COMPLETION_REVEAL_MS = 4_000;
const TIME_PER_SLOKA_MS = 60_000;
const STAGE_CLASS = "relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-10";
const ACTION_CLASS = "glow-accent rounded-[2rem] border-b-8 border-amber-700 bg-game-accent px-14 py-6 text-4xl font-black text-game-bg transition-transform hover:-translate-y-1 hover:bg-game-accent-soft active:translate-y-1 active:border-b-4";

const LEVELS = [
  {
    marqueeSeconds: 20,
    slokas: [
      {
        ref: "Bhagavad-gita 2.47",
        text: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
      },
      {
        ref: "Bhagavad-gita 18.66",
        text: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions.",
      },
      {
        ref: "Bhagavad-gita 9.26",
        text: "If one offers Me with love and devotion a leaf, a flower, a fruit or water, I will accept it.",
      },
    ],
  },
  {
    marqueeSeconds: 15,
    slokas: [
      {
        ref: "Bhagavad-gita 15.15",
        text: "I am seated in everyone's heart, and from Me come remembrance, knowledge and forgetfulness.",
      },
      {
        ref: "Bhagavad-gita 4.7",
        text: "Whenever there is a decline in religious practice and a predominant rise of irreligion, at that time I descend Myself.",
      },
      {
        ref: "Bhagavad-gita 3.21",
        text: "Whatever action a great man performs, common men follow, and whatever standards he sets by exemplary acts, all the world pursues.",
      },
    ],
  },
  {
    marqueeSeconds: 11,
    slokas: [
      {
        ref: "Bhagavad-gita 2.14",
        text: "The nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. One must learn to tolerate them without being disturbed.",
      },
      {
        ref: "Bhagavad-gita 2.62",
        text: "While contemplating the objects of the senses, a person develops attachment for them, and from such attachment lust develops, and from lust anger arises.",
      },
      {
        ref: "Bhagavad-gita 6.5",
        text: "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
      },
    ],
  },
] as const;

const DISTRACTIONS = [
  "peacock", "flute", "lotus", "cow", "butter",
  "conch", "tulsi", "govardhan", "krishna", "sudarshan",
  "lotus", "peacock",
].map((name, i) => ({
  src: `./memory/${name}.png`,
  top: `${(i * 17 + 3) % 82}%`,
  size: `${6 + (i % 4) * 2}rem`,
  duration: `${9 + (i % 6) * 3}s`,
  delay: `${-(i * 2.3) % 16}s`,
  driftY: `${((i % 5) - 2) * 7}rem`,
  spin: `${((i % 3) - 1) * 160}deg`,
  reverse: i % 3 === 0,
}));

function Distractions() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {DISTRACTIONS.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt=""
          className="sloka-distraction"
          style={{
            top: item.top,
            width: item.size,
            animationDuration: item.duration,
            animationDelay: item.delay,
            animationDirection: item.reverse ? "reverse" : undefined,
            "--drift-y": item.driftY,
            "--drift-spin": item.spin,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function SlokaScribeGame({ onExit }: GameProps) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [slokaIndex, setSlokaIndex] = useState(0);
  const [phase, setPhase] = useState<"writing" | "level-done" | "celebrating" | "results">("writing");
  const [flowed, setFlowed] = useState(false);

  const level = LEVELS[levelIndex];
  const sloka = level.slokas[slokaIndex];

  const advance = useCallback(() => {
    setFlowed(false);
    if (slokaIndex < level.slokas.length - 1) {
      setSlokaIndex((current) => current + 1);
    } else {
      setPhase(levelIndex === LEVELS.length - 1 ? "celebrating" : "level-done");
    }
  }, [level.slokas.length, levelIndex, slokaIndex]);

  useEffect(() => {
    if (phase !== "celebrating") return;
    const timeout = window.setTimeout(() => setPhase("results"), COMPLETION_REVEAL_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  if (phase === "results") {
    return (
      <GameResultScreen
        title="Hare Krishna!"
        score={`Learnt ${(levelIndex + 1) * level.slokas.length} slokas`}
        message="Every sloka is in your notebook!"
        onExit={onExit}
      />
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-game-bg p-8 pt-10 text-game-text">
      <Distractions />

      {phase === "writing" && (
        <div className="absolute inset-x-0 top-0 z-20">
          <Timer
            key={`${levelIndex}-${slokaIndex}`}
            durationMs={TIME_PER_SLOKA_MS}
            onExpire={advance}
          />
        </div>
      )}

      <header className="relative z-10 shrink-0 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Write the Sloka</h1>
        <p className="mt-1 text-xl text-slate-300">
          Catch the flowing translation and write it in your notebook before time runs out.
        </p>
        {phase === "writing" && (
          <p className="mt-2 text-2xl font-bold text-krishna-green">
            Level {levelIndex + 1} · Sloka {slokaIndex + 1} of {level.slokas.length}
          </p>
        )}
      </header>

      {phase === "writing" ? (
        <main className={STAGE_CLASS}>
          <div className="rounded-full border border-game-accent/40 bg-game-panel/80 px-10 py-3 text-3xl font-bold text-game-accent shadow-xl">
            {sloka.ref}
          </div>

          <div className="relative h-64 w-full overflow-hidden">
            <span
              key={`${levelIndex}-${slokaIndex}`}
              className="sloka-marquee text-6xl font-extrabold text-game-text drop-shadow-lg"
              style={{ "--sloka-speed": `${level.marqueeSeconds}s` } as CSSProperties}
              onAnimationEnd={() => setFlowed(true)}
            >
              {sloka.text}
            </span>
          </div>

          {flowed && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-3xl font-bold text-slate-300">
                Done writing? Click the button below.
              </p>
              <button onClick={advance} tabIndex={-1} className={ACTION_CLASS}>
                Next Sloka →
              </button>
            </div>
          )}
        </main>
      ) : (
        <main className={STAGE_CLASS}>
          {phase === "celebrating" && <CelebrationRain />}
          <div className="game-card reveal-pop pop-correct reveal-once flex flex-col items-center gap-6 rounded-[2rem] border border-game-correct px-24 py-16">
            <h2 className="text-7xl font-black text-game-correct-soft">
              Level {levelIndex + 1} Complete!
            </h2>
          </div>

          {phase === "level-done" && (
            <div className="flex gap-10">
              <button
                onClick={() => {
                  setLevelIndex((current) => current + 1);
                  setSlokaIndex(0);
                  setPhase("writing");
                }}
                tabIndex={-1}
                className={ACTION_CLASS}
              >
                Continue to Level {levelIndex + 2} →
              </button>
              <button
                onClick={() => setPhase("results")}
                tabIndex={-1}
                className="rounded-[2rem] border-2 border-b-8 border-slate-600 bg-game-panel px-14 py-6 text-4xl font-extrabold text-slate-300 transition-transform hover:-translate-y-1 hover:bg-game-panel-hover active:translate-y-1 active:border-b-2"
              >
                Finish Here
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
