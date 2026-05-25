import { useState, useCallback, useEffect } from "react";
import type { Question } from "../../types";
import { Timer } from "../../components/Timer";
import { useInput } from "../../hooks/useInput";

const TIME_PER_QUESTION_MS = 10000;

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
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [question.id]);

  const handleUp = useCallback(() => setHighlightedIndex((p) => (p > 0 ? p - 1 : 3)), []);
  const handleDown = useCallback(() => setHighlightedIndex((p) => (p < 3 ? p + 1 : 0)), []);
  const handleSelect = useCallback(() => { if (!answered) onAnswer(highlightedIndex); }, [answered, highlightedIndex, onAnswer]);

  useInput({ onUp: handleUp, onDown: handleDown, onSelect: handleSelect, enabled: !answered });

  const handleExpire = useCallback(() => { if (!answered) onAnswer(null); }, [answered, onAnswer]);

  const optionStyle = (index: number) => {
    const base = "w-full py-6 px-12 rounded-xl text-2xl font-semibold text-left transition-colors duration-300 border-2";
    if (answered) {
      if (index === question.correctIndex) return `${base} bg-krishna-correct/20 border-krishna-correct text-krishna-correct`;
      if (index === selectedIndex) return `${base} bg-krishna-wrong/20 border-krishna-wrong text-krishna-wrong`;
      return `${base} bg-white/5 border-white/10 text-krishna-cream/40`;
    }
    if (index === highlightedIndex) return `${base} bg-krishna-gold/15 border-krishna-gold text-krishna-cream shadow-[0_0_20px_rgba(0,212,255,0.3)]`;
    return `${base} bg-white/5 border-white/10 text-krishna-cream hover:bg-krishna-gold/10`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-8">
      <div className="text-krishna-gold text-2xl font-semibold">
        Question {questionNumber} of {totalQuestions}
      </div>
      <div className="w-full max-w-2xl">
        <Timer key={question.id} durationMs={TIME_PER_QUESTION_MS} onExpire={handleExpire} paused={answered} />
      </div>
      <h2 className="text-4xl font-bold text-krishna-cream text-center max-w-3xl leading-tight">
        {question.question}
      </h2>
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={optionStyle(index)}
            onClick={() => !answered && onAnswer(index)}
            disabled={answered}
          >
            <span className="text-krishna-gold mr-4">{LABELS[index]}.</span>
            {option}
          </button>
        ))}
      </div>
      <div className="text-3xl font-bold h-20 flex flex-col items-center justify-center">
        {answered && (
          selectedIndex === question.correctIndex ? (
            <span className="text-krishna-correct">Correct!</span>
          ) : selectedIndex === null ? (
            <span className="text-krishna-wrong">Time's up!</span>
          ) : (
            <>
              <span className="text-krishna-wrong">Wrong!</span>
              <span className="text-krishna-correct text-2xl">Correct: {question.options[question.correctIndex]}</span>
            </>
          )
        )}
      </div>
    </div>
  );
}
