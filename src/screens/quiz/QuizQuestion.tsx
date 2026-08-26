import { useCallback, type CSSProperties } from "react";
import { Timer } from "../../components/Timer";
import type { Question } from "../../types";

const TIME_PER_QUESTION_MS = 15000;

interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number | null) => void;
  answered: boolean;
  selectedIndex: number | null;
  imageSrc?: string;
}

const LABELS = ["A", "B", "C", "D"];

export function QuizQuestion({ question, questionNumber, totalQuestions, onAnswer, answered, selectedIndex, imageSrc }: Props) {
  const handleExpire = useCallback(() => { if (!answered) onAnswer(null); }, [answered, onAnswer]);

  const timedOut = answered && selectedIndex === null;
  const gotItRight = answered && selectedIndex === question.correctIndex;

  const optionStyle = (index: number) => {
    const base = "game-card group relative flex cursor-pointer items-center gap-5 overflow-hidden rounded-[2rem] border p-6 text-left text-3xl font-semibold transition-all duration-300";
    if (timedOut) return `${base} border-white/5 text-krishna-cream/35`;
    if (answered) {
      if (index === question.correctIndex) {
        return gotItRight
          ? `${base} reveal-pop pop-correct border-game-correct text-game-correct-soft`
          : `${base} border-game-correct/60 text-game-correct-soft`;
      }
      if (index === selectedIndex) return `${base} reveal-pop pop-wrong border-game-wrong text-game-wrong-soft`;
      return `${base} border-white/5 text-krishna-cream/35`;
    }
    return `${base} border-white/10 text-krishna-cream hover:-translate-y-2 hover:border-krishna-green`;
  };

  return (
    <div className="festival-stage relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-10 text-game-text">
      {imageSrc && (
        <div
          className="quiz-art"
          style={{ "--quiz-art": `url("${imageSrc}")` } as CSSProperties}
        />
      )}

      <div className="absolute inset-x-0 top-0 z-20">
        <Timer
          key={question.question}
          durationMs={TIME_PER_QUESTION_MS}
          onExpire={handleExpire}
          paused={answered}
        />
      </div>

      <div
        key={questionNumber}
        className={`relative z-10 flex w-full flex-col items-center ${answered ? "quiz-slide-leaving" : "quiz-slide"}`}
      >
        <div className="rounded-full border border-white/10 bg-game-panel/70 px-8 py-2 text-xl font-bold uppercase tracking-widest text-game-accent shadow-lg">
          Question {questionNumber} of {totalQuestions}
        </div>

        <div className="game-card relative mt-8 w-full max-w-[88rem] overflow-hidden rounded-[2rem] border border-white/10 p-10">
          <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-game-accent to-transparent" />
          <h2 className="text-center text-5xl font-extrabold leading-tight text-krishna-cream">
            {question.question}
          </h2>
        </div>

        <div className="mt-28 grid w-full max-w-[88rem] grid-cols-2 gap-6">
          {question.options.map((option, index) => {
            const revealed = answered && !timedOut && index === question.correctIndex;
            return (
              <button
                key={index}
                className={optionStyle(index)}
                onClick={() => !answered && onAnswer(index)}
                disabled={answered}
                tabIndex={-1}
              >
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-3xl font-extrabold ring-1 transition-transform duration-300 group-hover:scale-110 ${
                    revealed
                      ? "bg-game-correct/25 text-game-correct-soft ring-game-correct/50"
                      : "bg-white/5 text-game-accent ring-white/10"
                  }`}
                >
                  {revealed ? "✓" : LABELS[index]}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        <div
          className={`mt-10 rounded-full border border-game-wrong/40 bg-game-panel/70 px-10 py-3 text-2xl font-bold uppercase tracking-widest text-game-wrong-soft shadow-lg ${
            timedOut ? "animate-pulse" : "invisible"
          }`}
        >
          Time's up
        </div>
      </div>
    </div>
  );
}
