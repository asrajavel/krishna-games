import { useCallback } from "react";
import { GameCard } from "../components/GameCard";
import { useInput } from "../hooks/useInput";

interface Props {
  onStartQuiz: () => void;
  onStartDasavatar: () => void;
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const duration = Math.random() * 8 + 6;
  return {
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    duration,
    delay: -(Math.random() * duration),
    color: Math.random() > 0.5 ? "rgba(0,212,255,0.9)" : "rgba(123,97,255,0.9)",
  };
});

export function HomeScreen({ onStartQuiz, onStartDasavatar }: Props) {
  const noop = useCallback(() => {}, []);
  useInput({ onUp: noop, onDown: noop, onSelect: onStartQuiz });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 p-8 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      <h1 className="shimmer-text text-9xl font-extrabold tracking-wide text-center drop-shadow-lg">
        Krishna Leela Games
      </h1>
      <p className="text-xl text-krishna-cream/50 -mt-6 tracking-widest uppercase">
        Test your knowledge of Lord Krishna
      </p>
      <div className="flex gap-8 flex-wrap justify-center">
        <GameCard
          title="Krishna Quiz"
          description="Test your knowledge!"
          emoji="🪷"
          available={true}
          onClick={onStartQuiz}
        />
        <GameCard
          title="Dasavatar Match"
          description="Drag names to pictures"
          imageSrc="./dasavatar/dasavatar-icon.svg"
          available={true}
          onClick={onStartDasavatar}
        />
      </div>
    </div>
  );
}
