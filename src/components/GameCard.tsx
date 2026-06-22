interface Props {
  title: string;
  description: string;
  emoji?: string;
  imageSrc?: string;
  available: boolean;
  onClick: () => void;
}

export function GameCard({ title, description, emoji, imageSrc, available, onClick }: Props) {
  return (
    <button
      onClick={available ? onClick : undefined}
      disabled={!available}
      tabIndex={-1}
      className={`
        w-64 h-72 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 p-6
        text-center transition-all duration-200
        ${available
          ? "border-slate-700 bg-game-panel hover:border-game-accent hover:bg-game-panel-hover hover:scale-105 cursor-pointer shadow-lg"
          : "border-slate-800 bg-slate-900 opacity-40 cursor-not-allowed"
        }
      `}
    >
      {imageSrc ? (
        <img src={imageSrc} alt="" className="w-20 h-20 object-contain drop-shadow-[0_8px_18px_rgba(245,158,11,0.25)]" />
      ) : (
        <span className="text-6xl">{emoji}</span>
      )}
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
