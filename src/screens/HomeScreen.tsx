import { GameCard } from "../components/GameCard";

interface Props {
  onStartQuiz: () => void;
  onStartDasavatar: () => void;
  onStartMemory: () => void;
  onStartSequence: () => void;
  onStartPuzzle: () => void;
  onStartOddOneOut: () => void;
  onStartMatchPairs: () => void;
  onStartWhackTarget: () => void;
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const duration = Math.random() * 8 + 6;
  return {
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    duration,
    delay: -(Math.random() * duration),
    color: Math.random() > 0.5 ? "rgba(255,200,87,0.65)" : "rgba(31,199,182,0.5)",
  };
});

export function HomeScreen({ onStartQuiz, onStartDasavatar, onStartMemory, onStartSequence, onStartPuzzle, onStartOddOneOut, onStartMatchPairs, onStartWhackTarget }: Props) {
  return (
    <div className="festival-stage relative flex h-full w-full flex-col items-center justify-center gap-6 p-6">
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
      <header className="relative z-10 text-center">
        <p className="mb-3 text-lg font-bold uppercase tracking-[0.55em] text-krishna-green">
          Enter the world of
        </p>
        <h1 className="shimmer-text text-8xl font-black tracking-tight drop-shadow-lg">
          Krishna Leela
        </h1>
        <p className="mt-3 text-xl tracking-[0.2em] text-krishna-cream/55">
          Eight joyful challenges · One divine adventure
        </p>
      </header>
      <div className="relative z-10 grid h-[34rem] max-h-full w-full max-w-[64rem] grid-cols-4 grid-rows-2 gap-8">
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
        <GameCard
          title="Match the Pairs"
          description="Connect characters and symbols"
          emoji="🔗"
          available={true}
          onClick={onStartMatchPairs}
        />
        <GameCard
          title="Krishna's Favorites"
          description="Catch Krishna's favorite things"
          emoji="🧈"
          available={true}
          onClick={onStartWhackTarget}
        />
      </div>
    </div>
  );
}
