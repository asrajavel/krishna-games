import { useCallback } from "react";
import type { Question } from "../../types";
import { Timer } from "../../components/Timer";

const TIME_PER_QUESTION_MS = 15000;

interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number | null) => void;
  answered: boolean;
  selectedIndex: number | null;
}

const LABELS = ["A", "B", "C", "D"];

export function QuizQuestion({ question, questionNumber, totalQuestions, onAnswer, answered, selectedIndex }: Props) {
  const handleExpire = useCallback(() => { if (!answered) onAnswer(null); }, [answered, onAnswer]);

  const optionStyle = (index: number) => {
    const base = "w-full py-6 px-10 rounded-2xl text-2xl font-semibold text-left transition-all duration-300 border shadow-sm";
    if (answered) {
      if (index === question.correctIndex) return `${base} bg-game-correct/15 border-game-correct text-game-correct-soft`;
      if (index === selectedIndex) return `${base} bg-game-wrong/15 border-game-wrong text-game-wrong-soft`;
      return `${base} bg-slate-900 border-slate-800 text-slate-500`;
    }
    return `${base} bg-game-panel border-slate-700 text-game-text hover:border-slate-500 hover:bg-game-panel-hover`;
  };

  return (
    <div className="w-full h-full flex bg-game-bg text-game-text relative">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer
          key={question.question}
          durationMs={TIME_PER_QUESTION_MS}
          onExpire={handleExpire}
          paused={answered}
        />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-6">
        <div className="text-game-accent text-2xl font-semibold">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-game-panel p-8 shadow-xl">
          <h2 className="text-4xl font-bold text-center leading-tight">
            {question.question}
          </h2>
        </div>
        <div className="w-full max-w-2xl flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/30 p-4 shadow-lg">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={optionStyle(index)}
              onClick={() => !answered && onAnswer(index)}
              disabled={answered}
              tabIndex={-1}
            >
              <span className="text-game-accent mr-4">{LABELS[index]}.</span>
              {option}
            </button>
          ))}
        </div>
        <div className="w-full max-w-2xl h-20 flex flex-col items-center justify-center gap-1">
          <div className="text-3xl font-bold flex flex-col items-center gap-1">
            {answered && (
              selectedIndex === question.correctIndex ? (
                <span className="text-game-correct-soft">Correct!</span>
              ) : selectedIndex === null ? (
                <span className="text-game-wrong-soft">Time's up!</span>
              ) : (
                <>
                  <span className="text-game-wrong-soft">Wrong!</span>
                  <span className="text-game-correct-soft text-2xl">Correct: {question.options[question.correctIndex]}</span>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
