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
        group relative w-64 h-72 overflow-hidden rounded-[2rem] border flex flex-col items-center justify-center gap-4 p-6
        text-center transition-all duration-300
        ${available
          ? "game-card border-white/10 hover:border-krishna-green hover:-translate-y-2 cursor-pointer"
          : "border-white/5 bg-game-panel opacity-40 cursor-not-allowed"
        }
      `}
    >
      <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-game-accent to-transparent" />
      {imageSrc ? (
        <span className="flex h-28 w-28 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <img src={imageSrc} alt="" className="w-20 h-20 object-contain drop-shadow-[0_8px_18px_rgba(255,200,87,0.3)]" />
        </span>
      ) : (
        <span className="flex h-28 w-28 items-center justify-center rounded-full bg-white/5 text-6xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">{emoji}</span>
      )}
      <h2 className="text-2xl font-extrabold text-krishna-cream">{title}</h2>
      <p className="text-lg leading-snug text-krishna-cream/60">{description}</p>
      {available ? (
        <span className="text-game-accent text-base font-bold uppercase tracking-widest">Play now →</span>
      ) : (
        <span className="text-gray-500 text-lg">🔒 Locked</span>
      )}
    </button>
  );
}
