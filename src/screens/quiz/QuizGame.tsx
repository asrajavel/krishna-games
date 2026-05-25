import { useState, useCallback } from "react";
import { pickRandomQuestions } from "../../data/questions";
import type { QuizState } from "../../types";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResult } from "./QuizResult";

const QUESTIONS_PER_ROUND = 5;

interface Props {
  onExit: () => void;
}

export function QuizGame({ onExit }: Props) {
  const [state, setState] = useState<QuizState>(() => ({
    questions: pickRandomQuestions(QUESTIONS_PER_ROUND),
    currentIndex: 0,
    score: 0,
    answered: false,
    selectedIndex: null,
  }));
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = state.questions[state.currentIndex];

  const handleAnswer = useCallback((selectedIndex: number | null) => {
    const isCorrect = selectedIndex !== null && selectedIndex === currentQuestion.correctIndex;
    setState((prev) => ({ ...prev, answered: true, selectedIndex, score: isCorrect ? prev.score + 1 : prev.score }));

    setTimeout(() => {
      setState((prev) => {
        const nextIndex = prev.currentIndex + 1;
        if (nextIndex >= QUESTIONS_PER_ROUND) {
          setShowResult(true);
          return prev;
        }
        return { ...prev, currentIndex: nextIndex, answered: false, selectedIndex: null };
      });
    }, 1500);
  }, [currentQuestion]);

  if (showResult) {
    return <QuizResult score={state.score} total={QUESTIONS_PER_ROUND} onDone={onExit} />;
  }

  return (
    <QuizQuestion
      question={currentQuestion}
      questionNumber={state.currentIndex + 1}
      totalQuestions={QUESTIONS_PER_ROUND}
      onAnswer={handleAnswer}
      answered={state.answered}
      selectedIndex={state.selectedIndex}
    />
  );
}
