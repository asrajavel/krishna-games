import { playSound } from "../soundEffects";

interface Props {
  title: string;
  imageSrc: string;
  onClick: () => void;
}

export function GameCard({ title, imageSrc, onClick }: Props) {
  return (
    <button
      onClick={() => {
        playSound("click");
        onClick();
      }}
      tabIndex={-1}
      className="game-card group relative flex h-full min-h-0 w-full cursor-pointer flex-col justify-end overflow-hidden rounded-[2rem] border border-white/10 text-left transition-all duration-300 hover:-translate-y-2"
    >
      <img
        src={imageSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="relative z-10 w-full bg-gradient-to-t from-game-bg from-25% via-game-bg/95 to-transparent px-4 pb-4 pt-14">
        <h2 className="text-2xl font-extrabold leading-tight text-krishna-cream">{title}</h2>
      </span>
    </button>
  );
}
