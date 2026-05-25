interface Props {
  title: string;
  description: string;
  emoji: string;
  available: boolean;
  onClick: () => void;
}

export function GameCard({ title, description, emoji, available, onClick }: Props) {
  return (
    <button
      onClick={available ? onClick : undefined}
      disabled={!available}
      className={`
        w-64 h-72 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 p-6
        text-center transition-all duration-200
        ${available
          ? "border-krishna-gold bg-krishna-gold/10 hover:bg-krishna-gold/20 hover:scale-105 cursor-pointer"
          : "border-gray-600 bg-gray-800/30 opacity-50 cursor-not-allowed"
        }
      `}
    >
      <span className="text-6xl">{emoji}</span>
      <h2 className="text-2xl font-bold text-krishna-cream">{title}</h2>
      <p className="text-lg text-krishna-cream/70">{description}</p>
      {available ? (
        <span className="text-krishna-gold text-lg font-semibold">▶ Tap to Play</span>
      ) : (
        <span className="text-gray-500 text-lg">🔒 Locked</span>
      )}
    </button>
  );
}
