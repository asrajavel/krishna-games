import { GameCard } from "../components/GameCard";

interface Props {
  onStartQuiz: () => void;
  onStartDasavatar: () => void;
  onStartMemory: () => void;
  onStartSequence: () => void;
  onStartPuzzle: () => void;
  onStartOddOneOut: () => void;
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const duration = Math.random() * 8 + 6;
  return {
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    duration,
    delay: -(Math.random() * duration),
    color: Math.random() > 0.5 ? "rgba(245,158,11,0.65)" : "rgba(148,163,184,0.45)",
  };
});

export function HomeScreen({ onStartQuiz, onStartDasavatar, onStartMemory, onStartSequence, onStartPuzzle, onStartOddOneOut }: Props) {
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
          imageSrc="./quiz/quiz-icon.svg"
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
        <GameCard
          title="Memory Match"
          description="Flip cards to find pairs"
          imageSrc="./memory/memory-icon.svg"
          available={true}
          onClick={onStartMemory}
        />
        <GameCard
          title="Lila Sequence"
          description="Put Krishna's pastimes in order"
          imageSrc="./sequence/sequence-icon.svg"
          available={true}
          onClick={onStartSequence}
        />
        <GameCard
          title="Picture Puzzle"
          description="Reassemble Krishna's picture"
          imageSrc="./puzzle/yashoda-krishna.jpg"
          available={true}
          onClick={onStartPuzzle}
        />
        <GameCard
          title="Odd One Out"
          description="Find what does not belong"
          emoji="🔍"
          available={true}
          onClick={onStartOddOneOut}
        />
      </div>
    </div>
  );
}
