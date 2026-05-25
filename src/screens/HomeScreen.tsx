import { GameCard } from "../components/GameCard";

interface Props {
  onStartQuiz: () => void;
}

export function HomeScreen({ onStartQuiz }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 p-8">
      <h1 className="text-6xl font-bold text-krishna-gold tracking-wide text-center">
        Krishna Leela Games
      </h1>
      <div className="flex gap-8 flex-wrap justify-center">
        <GameCard
          title="Krishna Quiz"
          description="Test your knowledge!"
          emoji="🪷"
          available={true}
          onClick={onStartQuiz}
        />
        <GameCard
          title="Coming Soon"
          description="More games coming!"
          emoji="🎴"
          available={false}
          onClick={() => {}}
        />
      </div>
      <p className="text-krishna-gold/60 text-xl">Jai Shri Krishna</p>
    </div>
  );
}
