interface Props {
  title: string;
  description: string;
  emoji?: string;
  imageSrc?: string;
  onClick: () => void;
}

export function GameCard({ title, description, emoji, imageSrc, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      tabIndex={-1}
      className="game-card group relative flex h-full min-h-0 w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-[2rem] border border-white/10 p-4 text-center transition-all duration-300 hover:-translate-y-2 hover:border-krishna-green"
    >
      <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-game-accent to-transparent" />
      {imageSrc ? (
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <img src={imageSrc} alt="" className="h-14 w-14 object-contain drop-shadow-[0_8px_18px_rgba(255,200,87,0.3)]" />
        </span>
      ) : (
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-5xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">{emoji}</span>
      )}
      <h2 className="text-2xl font-extrabold text-krishna-cream">{title}</h2>
      <p className="text-lg leading-snug text-krishna-cream/60">{description}</p>
      <span className="text-game-accent text-base font-bold uppercase tracking-widest">Play now →</span>
    </button>
  );
}
