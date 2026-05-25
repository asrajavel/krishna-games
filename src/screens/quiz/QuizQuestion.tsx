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
    const base = "w-full py-5 px-8 rounded-xl text-2xl font-semibold text-left transition-all duration-200";
    if (answered) {
      if (index === question.correctIndex) return `${base} bg-krishna-correct text-white`;
      if (index === selectedIndex) return `${base} bg-krishna-wrong text-white`;
      return `${base} bg-gray-700/50 text-gray-400`;
    }
    if (index === highlightedIndex) return `${base} bg-krishna-gold/30 border-2 border-krishna-gold text-krishna-cream`;
    return `${base} bg-gray-700/50 border-2 border-transparent text-krishna-cream hover:bg-krishna-gold/20`;
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
      {answered && (
        <div className="text-3xl font-bold">
          {selectedIndex === question.correctIndex ? (
            <span className="text-krishna-correct">Correct!</span>
          ) : selectedIndex === null ? (
            <span className="text-krishna-wrong">Time's up!</span>
          ) : (
            <span className="text-krishna-wrong">Wrong! Answer: {question.options[question.correctIndex]}</span>
          )}
        </div>
      )}
    </div>
  );
}
