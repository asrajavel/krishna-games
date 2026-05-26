import { useState, useEffect, useCallback } from "react";

interface Props {
  onExit: () => void;
}

const STAGES = [
  {
    id: 0,
    chapterTitle: "Chapter 1: Arjuna's Grief",
    teaching:
      "Arjuna's heart breaks as he sees his teachers, uncles, and brothers arrayed for battle. His bow slips from his hands.",
    arjuna: "slumped" as const,
    krishnaVisible: false,
    skyTop: "#0b0e17",
    skyBottom: "#1a1225",
    accent: "#64748b",
  },
  {
    id: 1,
    chapterTitle: "Chapter 2: The Eternal Soul",
    teaching:
      '"The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being." — 2.20',
    arjuna: "listening" as const,
    krishnaVisible: true,
    skyTop: "#0d0b2a",
    skyBottom: "#1e1b4b",
    accent: "#818cf8",
  },
  {
    id: 2,
    chapterTitle: "Chapter 18: The Final Surrender",
    teaching:
      '"Abandon all varieties of dharma and just surrender unto Me. I shall protect you from all sinful reactions; do not fear." — 18.66',
    arjuna: "rising" as const,
    krishnaVisible: true,
    skyTop: "#1c0a00",
    skyBottom: "#431407",
    accent: "#fb923c",
  },
];

function ArjunaSVG({ state }: { state: "slumped" | "listening" | "rising" }) {
  const color = "#f59e0b";
  const glow = "rgba(245,158,11,0.25)";

  if (state === "slumped") {
    return (
      <svg viewBox="0 0 160 320" width="140" aria-hidden="true">
        {/* glow behind */}
        <ellipse cx="80" cy="280" rx="50" ry="12" fill={glow} />
        {/* head bowed forward */}
        <circle cx="68" cy="72" r="24" fill={color} />
        {/* neck + torso leaning forward */}
        <path d="M72 95 Q65 140 70 200" stroke={color} strokeWidth="22" fill="none" strokeLinecap="round" />
        {/* left arm drooping down */}
        <path d="M68 120 Q45 160 38 210" stroke={color} strokeWidth="13" fill="none" strokeLinecap="round" />
        {/* right arm drooping, bow dragging */}
        <path d="M72 120 Q88 165 85 215" stroke={color} strokeWidth="13" fill="none" strokeLinecap="round" />
        {/* bow on ground */}
        <path d="M60 215 Q80 230 100 215" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* legs */}
        <path d="M68 195 Q58 240 55 285" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M72 195 Q82 240 85 285" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (state === "listening") {
    return (
      <svg viewBox="0 0 160 320" width="140" aria-hidden="true">
        <ellipse cx="80" cy="290" rx="50" ry="12" fill={glow} />
        {/* head upright */}
        <circle cx="80" cy="60" r="24" fill={color} />
        {/* torso straight */}
        <path d="M80 84 L80 195" stroke={color} strokeWidth="22" fill="none" strokeLinecap="round" />
        {/* left arm raised slightly — receptive gesture */}
        <path d="M80 115 Q55 145 50 175" stroke={color} strokeWidth="13" fill="none" strokeLinecap="round" />
        {/* right arm holding bow upright */}
        <path d="M80 115 Q108 130 112 165" stroke={color} strokeWidth="13" fill="none" strokeLinecap="round" />
        {/* bow vertical */}
        <path d="M112 145 Q120 180 112 215" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* bowstring */}
        <line x1="112" y1="145" x2="112" y2="215" stroke={color} strokeWidth="2" opacity="0.5" />
        {/* legs */}
        <path d="M76 192 Q66 240 63 285" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M84 192 Q94 240 97 285" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // rising — bow raised high
  return (
    <svg viewBox="0 0 160 320" width="140" aria-hidden="true">
      <ellipse cx="80" cy="295" rx="55" ry="14" fill={glow} />
      {/* aura ring */}
      <circle cx="80" cy="60" r="34" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
      {/* head proud */}
      <circle cx="80" cy="55" r="24" fill={color} />
      {/* torso upright, taller */}
      <path d="M80 79 L80 185" stroke={color} strokeWidth="22" fill="none" strokeLinecap="round" />
      {/* left arm raised with fist */}
      <path d="M80 110 Q50 80 42 55" stroke={color} strokeWidth="13" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="52" r="8" fill={color} />
      {/* right arm raising bow high */}
      <path d="M80 110 Q115 85 120 50" stroke={color} strokeWidth="13" fill="none" strokeLinecap="round" />
      {/* bow raised */}
      <path d="M120 30 Q132 55 120 80" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
      <line x1="120" y1="30" x2="120" y2="80" stroke={color} strokeWidth="2" opacity="0.5" />
      {/* legs sturdy */}
      <path d="M76 182 Q64 235 60 285" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M84 182 Q96 235 100 285" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function KrishnaSVG({ cosmic }: { cosmic: boolean }) {
  const body = "#1d4ed8";
  const crown = "#f59e0b";
  const feather = "#0d9488";
  const glow = "rgba(99,102,241,0.3)";

  return (
    <svg viewBox="0 0 160 340" width="130" aria-hidden="true">
      {cosmic && (
        <>
          <circle cx="80" cy="80" r="70" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.4" />
          <circle cx="80" cy="80" r="90" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.2" />
        </>
      )}
      <ellipse cx="80" cy="300" rx="45" ry="11" fill={glow} />
      {/* peacock feather */}
      <path d="M80 18 Q74 6 78 0 Q82 6 88 2 Q84 10 80 18" fill={feather} />
      <circle cx="80" cy="20" r="5" fill={crown} opacity="0.9" />
      {/* crown */}
      <path d="M60 42 L65 30 L72 40 L80 26 L88 40 L95 30 L100 42 Z" fill={crown} />
      {/* head */}
      <circle cx="80" cy="62" r="22" fill={body} />
      {/* torso */}
      <path d="M80 84 L80 190" stroke={body} strokeWidth="20" fill="none" strokeLinecap="round" />
      {/* left arm — flute */}
      <path d="M80 105 Q58 118 50 130" stroke={body} strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* right arm — flute */}
      <path d="M80 105 Q105 115 115 125" stroke={body} strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* flute */}
      <path d="M48 132 L118 122" stroke={crown} strokeWidth="4" strokeLinecap="round" />
      <circle cx="62" cy="129" r="2.5" fill={crown} opacity="0.7" />
      <circle cx="75" cy="127" r="2.5" fill={crown} opacity="0.7" />
      <circle cx="88" cy="125" r="2.5" fill={crown} opacity="0.7" />
      <circle cx="101" cy="123" r="2.5" fill={crown} opacity="0.7" />
      {/* dhoti drape */}
      <path d="M68 190 Q60 220 58 290" stroke={body} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M92 190 Q100 220 102 290" stroke={body} strokeWidth="14" fill="none" strokeLinecap="round" />
      {/* lotus at feet */}
      <path d="M75 295 Q70 285 75 280 Q80 290 85 280 Q90 285 85 295 Z" fill="#f9a8d4" opacity="0.8" />
    </svg>
  );
}

function Chariot() {
  return (
    <svg viewBox="0 0 260 100" width="240" aria-hidden="true">
      {/* chariot body */}
      <rect x="20" y="10" width="220" height="55" rx="8" fill="#92400e" opacity="0.85" />
      {/* gold trim */}
      <rect x="20" y="10" width="220" height="8" rx="4" fill="#f59e0b" opacity="0.7" />
      <rect x="20" y="57" width="220" height="8" rx="4" fill="#f59e0b" opacity="0.7" />
      {/* axle */}
      <line x1="50" y1="65" x2="210" y2="65" stroke="#78350f" strokeWidth="6" />
      {/* left wheel */}
      <circle cx="52" cy="78" r="22" fill="none" stroke="#f59e0b" strokeWidth="5" opacity="0.8" />
      <circle cx="52" cy="78" r="5" fill="#f59e0b" opacity="0.8" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1={52 + 5 * Math.cos((angle * Math.PI) / 180)}
          y1={78 + 5 * Math.sin((angle * Math.PI) / 180)}
          x2={52 + 17 * Math.cos((angle * Math.PI) / 180)}
          y2={78 + 17 * Math.sin((angle * Math.PI) / 180)}
          stroke="#f59e0b"
          strokeWidth="3"
          opacity="0.7"
        />
      ))}
      {/* right wheel */}
      <circle cx="208" cy="78" r="22" fill="none" stroke="#f59e0b" strokeWidth="5" opacity="0.8" />
      <circle cx="208" cy="78" r="5" fill="#f59e0b" opacity="0.8" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1={208 + 5 * Math.cos((angle * Math.PI) / 180)}
          y1={78 + 5 * Math.sin((angle * Math.PI) / 180)}
          x2={208 + 17 * Math.cos((angle * Math.PI) / 180)}
          y2={78 + 17 * Math.sin((angle * Math.PI) / 180)}
          stroke="#f59e0b"
          strokeWidth="3"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

function BattlefieldHorizon() {
  return (
    <svg viewBox="0 0 1000 90" preserveAspectRatio="none" width="100%" height="90" aria-hidden="true">
      {/* ground */}
      <rect x="0" y="60" width="1000" height="30" fill="#1c1008" opacity="0.8" />
      {/* tent / camp silhouettes */}
      <polygon points="50,60 80,20 110,60" fill="#0f0a05" />
      <polygon points="140,60 165,28 190,60" fill="#0f0a05" />
      <polygon points="250,60 285,15 320,60" fill="#0f0a05" />
      <polygon points="400,60 420,32 440,60" fill="#0f0a05" />
      <polygon points="550,60 590,10 630,60" fill="#0f0a05" />
      <polygon points="700,60 725,25 750,60" fill="#0f0a05" />
      <polygon points="820,60 850,18 880,60" fill="#0f0a05" />
      <polygon points="920,60 945,30 970,60" fill="#0f0a05" />
      {/* spear tips */}
      {[30, 95, 180, 310, 370, 460, 520, 645, 690, 760, 810, 890, 960].map((x) => (
        <polygon key={x} points={`${x},60 ${x + 3},38 ${x + 6},60`} fill="#374151" opacity="0.8" />
      ))}
      {/* flags */}
      <path d="M80 20 L80 5 L95 12 Z" fill="#b45309" opacity="0.7" />
      <path d="M285 15 L285 0 L300 7 Z" fill="#b45309" opacity="0.7" />
      <path d="M590 10 L590 -5 L605 2 Z" fill="#991b1b" opacity="0.7" />
    </svg>
  );
}

export function KurukshetraDemo({ onExit }: Props) {
  const [stageIndex, setStageIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);

  const stage = STAGES[stageIndex];

  const advance = useCallback(() => {
    if (done) { onExit(); return; }
    if (stageIndex >= STAGES.length - 1) {
      setDone(true);
      return;
    }
    // cross-fade transition
    setVisible(false);
    setTimeout(() => {
      setStageIndex((i) => i + 1);
      setVisible(true);
    }, 500);
  }, [stageIndex, done, onExit]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["Enter", " ", "ArrowRight", "ArrowUp", "ArrowDown", "Escape"].includes(e.key)) {
        if (e.key === "Escape") { onExit(); return; }
        advance();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advance, onExit]);

  // gamepad polling
  useEffect(() => {
    let animId: number;
    let lastPress = 0;
    const poll = () => {
      const pads = navigator.getGamepads?.();
      if (pads) {
        for (const pad of pads) {
          if (!pad) continue;
          const anyPressed = pad.buttons.some((b) => b.pressed);
          const now = Date.now();
          if (anyPressed && now - lastPress > 400) {
            lastPress = now;
            advance();
          }
        }
      }
      animId = requestAnimationFrame(poll);
    };
    animId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(animId);
  }, [advance]);

  if (done) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-8"
        style={{ background: `linear-gradient(180deg, #1c0a00 0%, #0b0e17 100%)` }}
      >
        <div className="text-8xl">🙏</div>
        <h2 className="shimmer-text text-6xl font-extrabold text-center">Jai Shri Krishna!</h2>
        <p className="text-krishna-cream/70 text-2xl text-center max-w-lg leading-relaxed">
          Arjuna rose from grief to glory, guided by the Lord's eternal wisdom.
        </p>
        <p className="text-krishna-cream/40 text-lg tracking-widest uppercase mt-4">
          — To be continued —
        </p>
        <button
          onClick={onExit}
          className="mt-8 px-10 py-4 border border-krishna-gold/40 text-krishna-gold rounded-xl text-xl hover:bg-krishna-gold/10 transition-colors"
        >
          Back to Home
        </button>
        <p className="text-krishna-cream/30 text-sm">Press Enter or A</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${stage.skyTop} 0%, ${stage.skyBottom} 60%, #0b0e17 100%)`,
        transition: "background 0.8s ease",
      }}
    >
      {/* stars */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 23 + 5) % 45}%`,
            width: i % 4 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 3 : 2,
            background: "white",
            opacity: 0.3 + (i % 5) * 0.1,
          }}
        />
      ))}

      {/* dust/fog particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${(i * 13 + 5) % 100}%`,
            width: 3,
            height: 3,
            backgroundColor: `rgba(${stage.accent.slice(1).match(/../g)?.map(h => parseInt(h, 16)).join(",")},0.6)`,
            animationDuration: `${8 + i * 2}s`,
            animationDelay: `${-i * 1.5}s`,
          }}
        />
      ))}

      {/* stage content — fades on transition */}
      <div
        className="w-full h-full flex flex-col"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        {/* top: chapter info panel */}
        <div className="flex-1 flex items-start justify-start p-10 pt-12">
          <div
            className="max-w-xl rounded-2xl p-8 border"
            style={{
              background: "rgba(0,0,0,0.55)",
              borderColor: `${stage.accent}44`,
              backdropFilter: "blur(8px)",
            }}
          >
            {/* progress dots */}
            <div className="flex gap-2 mb-5">
              {STAGES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === stageIndex ? 24 : 8,
                    height: 8,
                    background: i <= stageIndex ? stage.accent : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            <h2
              className="font-extrabold text-4xl mb-4 leading-tight"
              style={{ color: stage.accent }}
            >
              {stage.chapterTitle}
            </h2>
            <p className="text-krishna-cream/85 text-xl leading-relaxed">
              {stage.teaching}
            </p>
          </div>
        </div>

        {/* bottom: characters + chariot + horizon */}
        <div className="relative flex items-end justify-center pb-0">
          {/* horizon */}
          <div className="absolute bottom-0 left-0 right-0">
            <BattlefieldHorizon />
          </div>

          {/* chariot + Arjuna */}
          <div className="relative z-10 flex flex-col items-center" style={{ marginBottom: 22 }}>
            <div style={{ marginBottom: -28 }}>
              <ArjunaSVG state={stage.arjuna} />
            </div>
            <Chariot />
          </div>

          {/* Krishna */}
          {stage.krishnaVisible && (
            <div
              className="relative z-10"
              style={{
                marginBottom: 58,
                marginLeft: 48,
                filter: stage.id === 2 ? "drop-shadow(0 0 18px rgba(251,146,60,0.6))" : "drop-shadow(0 0 12px rgba(99,102,241,0.5))",
              }}
            >
              <KrishnaSVG cosmic={stage.id === 2} />
            </div>
          )}
        </div>
      </div>

      {/* continue prompt */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
        style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
      >
        <p className="text-krishna-cream/50 text-lg tracking-widest uppercase">
          {stageIndex < STAGES.length - 1 ? "Press A · Enter · Any key" : "Press to finish"}
        </p>
        <div
          className="mx-auto mt-2 h-0.5 rounded-full"
          style={{
            width: `${((stageIndex + 1) / STAGES.length) * 120}px`,
            background: stage.accent,
            transition: "width 0.6s ease, background 0.8s ease",
          }}
        />
      </div>

      {/* escape hint */}
      <div className="absolute top-4 right-6 text-krishna-cream/20 text-sm">
        ESC to exit
      </div>
    </div>
  );
}
