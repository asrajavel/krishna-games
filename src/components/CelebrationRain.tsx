import type { CSSProperties } from "react";

const COLORS = [
  "radial-gradient(circle at 30% 25%, #fff8e8, #ff6fb5 55%, #c81d6a)",
  "radial-gradient(circle at 30% 25%, #fff8e8, #ffc857 55%, #d97706)",
  "radial-gradient(circle at 30% 25%, #fff8e8, #fda4af 50%, #e11d48)",
  "radial-gradient(circle at 30% 25%, #fff8e8, #fde68a 55%, #f59e0b)",
];

const PETALS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  size: `${1.4 + (i % 5) * 0.35}rem`,
  duration: 2.6 + (i % 7) * 0.28,
  delay: (i % 10) * 0.16,
  drift: `${((i % 9) - 4) * 3.5}rem`,
  spin: `${220 + (i % 6) * 80}deg`,
  color: COLORS[i % COLORS.length],
}));

export function CelebrationRain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {PETALS.map((petal) => (
        <span
          key={petal.id}
          className="celebration-petal"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            background: petal.color,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            "--petal-drift": petal.drift,
            "--petal-spin": petal.spin,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
