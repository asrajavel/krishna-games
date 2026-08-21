import { useState, useCallback } from "react";
import { GameResultScreen } from "../../components/GameResultScreen";
import { getQuestions, QUESTION_POOLS, type QuizTopic } from "../../data/questions";
import type { GameProps } from "../../games";
import { QuizQuestion } from "./QuizQuestion";

export function QuizGame({ onExit, variantId }: GameProps) {
  const topic: QuizTopic = variantId && variantId in QUESTION_POOLS
    ? variantId as QuizTopic
    : "krishna-lila-kids";
  const [state, setState] = useState(() => ({
    questions: getQuestions(topic),
    currentIndex: 0,
    score: 0,
    answered: false,
    selectedIndex: null as number | null,
  }));
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = state.questions[state.currentIndex];

  const handleAnswer = useCallback((selectedIndex: number | null) => {
    const isCorrect = selectedIndex !== null && selectedIndex === currentQuestion.correctIndex;
    setState((prev) => ({ ...prev, answered: true, selectedIndex, score: isCorrect ? prev.score + 1 : prev.score }));

    setTimeout(() => {
      setState((prev) => {
        const nextIndex = prev.currentIndex + 1;
        if (nextIndex >= prev.questions.length) {
          setShowResult(true);
          return prev;
        }
        return { ...prev, currentIndex: nextIndex, answered: false, selectedIndex: null };
      });
    }, 2000);
  }, [currentQuestion]);

  if (showResult) {
    const totalQuestions = state.questions.length;
    const message = state.score === totalQuestions
      ? "Hare Krishna! Perfect!"
      : state.score >= totalQuestions * 0.6
        ? "Well played! Jai Shri Krishna!"
        : "Keep learning about Krishna!";
    return (
      <GameResultScreen
        title="Quiz Complete!"
        score={`${state.score} / ${totalQuestions}`}
        message={message}
        onExit={onExit}
      />
    );
  }

  return (
    <QuizQuestion
      question={currentQuestion}
      questionNumber={state.currentIndex + 1}
      totalQuestions={state.questions.length}
      onAnswer={handleAnswer}
      answered={state.answered}
      selectedIndex={state.selectedIndex}
    />
  );
}
