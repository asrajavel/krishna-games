import { useEffect } from "react";
import type { GameVariant } from "../games";
import { playSound } from "../soundEffects";

interface Props {
  gameTitle: string;
  variants: readonly GameVariant[];
  onSelect: (variantId: string) => void;
  onExit: () => void;
}

const AUTO_RESET_MS = 120000;

export function GameVariantScreen({ gameTitle, variants, onSelect, onExit }: Props) {
  useEffect(() => {
    const timeout = window.setTimeout(onExit, AUTO_RESET_MS);
    return () => window.clearTimeout(timeout);
  }, [onExit]);

  return (
    <main className="festival-stage flex h-full w-full flex-col items-center justify-center gap-6 p-6 text-center">
      <header>
        <h1 className="shimmer-text text-7xl font-black">
          {gameTitle}
        </h1>
        <p className="mt-3 text-3xl font-bold text-krishna-green">
          Choose a Variant
        </p>
      </header>

      <div className="flex w-full max-w-[106rem] flex-wrap justify-center gap-5">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => {
              playSound("click");
              onSelect(variant.id);
            }}
            tabIndex={-1}
            className="game-card group relative flex min-h-[17rem] w-[32rem] cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[2rem] border border-white/10 p-4 text-center transition-all duration-300 hover:-translate-y-2 hover:border-krishna-green"
          >
            <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-game-accent to-transparent" />

            {variant.imageSrc && (
              <img src={variant.imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            )}

            <span className="relative z-10 flex flex-col items-center gap-2 rounded-2xl bg-game-panel/80 px-5 py-4 shadow-xl">
              <span className="text-3xl font-extrabold text-krishna-cream">
                {variant.title}
              </span>
              <span className="text-xl font-bold text-game-accent">
                {variant.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
