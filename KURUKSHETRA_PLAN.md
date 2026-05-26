# Kurukshetra: Arjuna's Resolve — Implementation Plan

## Context

Adding a new story-driven game to the Krishna Games kiosk app. The game teaches the Bhagavad Gita through a visual narrative: Arjuna starts slumped in his chariot on the Kurukshetra battlefield, and as the player progresses through 6 stages (one per key Gita chapter), Arjuna visually rises and picks up his bow. Phase 1 is a pure animated story with "press any button to continue." Phase 2 (future) adds questions that gate each stage transition.

**New dependency:** `framer-motion` — handles stage cross-fades, character state animations, and text reveals. Integrates cleanly with React + Tailwind, lightweight (~50kb), GPU-composited animations suit Pi Zero 2 W.

---

## File Structure

```
src/
  types.ts                                  ← add "kurukshetra" to Screen
  App.tsx                                   ← add goKurukshetra, render branch
  screens/
    HomeScreen.tsx                          ← add Kurukshetra GameCard
    kurukshetra/
      data.ts                               ← 6 stage definitions + types
      KurukshetraGame.tsx                   ← orchestrator (state machine)
      BattlefieldScene.tsx                  ← full-screen scene + atmosphere
      CharacterLayer.tsx                    ← Arjuna + Krishna SVGs positioned
      StageOverlay.tsx                      ← chapter title + teaching text
      ContinuePrompt.tsx                    ← pulsing "Press A / Enter" prompt
      EndCard.tsx                           ← "To be continued" + auto-reset
      ArjunaSVG.tsx                         ← 3 visual states (slumped/listening/rising)
      KrishnaSVG.tsx                        ← 4 visual states (hidden/speaking/cosmic/serene)
```

---

## Data Structure (`data.ts`)

```typescript
export type ArjunaState = "slumped" | "listening" | "rising";
export type KrishnaState = "hidden" | "speaking" | "cosmic" | "serene";

export interface StageQuestion {           // Phase 2 slot — unused now
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface KurukshetraStage {
  id: number;
  chapterNumber: number;
  chapterTitle: string;
  teaching: string;
  arjunaState: ArjunaState;
  krishnaState: KrishnaState;
  atmosphereColor: string;               // Tailwind gradient class
  questions?: StageQuestion[];           // undefined in Phase 1
}
```

**6 Stages:**

| # | Chapter | Arjuna | Krishna | Teaching snippet |
|---|---------|--------|---------|-----------------|
| 0 | Ch 1 — Grief | slumped | hidden | Sees family across battlefield |
| 1 | Ch 2 — Eternal Soul | listening | speaking | "Soul is never born nor dies" |
| 2 | Ch 3 — Duty | listening | speaking | "Right to act, not to fruits" |
| 3 | Ch 11 — Cosmic Form | listening | cosmic | Vishwaroopa revealed |
| 4 | Ch 12 — Devotion | listening | serene | "Fix your mind on Me" |
| 5 | Ch 18 — Surrender | rising | serene | "Abandon all, surrender to Me" |

---

## Component Breakdown

### `KurukshetraGame.tsx` — Orchestrator
- State: `stageIndex`, `phase: "story" | "end"`
- `advance()`: increments stageIndex; sets phase="end" at TOTAL_STAGES
- Phase 2: adds `"question"` phase, `advance()` checks `stage.questions`
- Renders: `<AnimatePresence mode="wait">` wrapping `<BattlefieldScene>` keyed by `stageIndex`, or `<EndCard>`

### `BattlefieldScene.tsx`
- Full-screen container with atmospheric gradient bg + 12 fog particles
- Composes `<CharacterLayer>`, `<StageOverlay>`, `<ContinuePrompt>` as absolute layers
- Static battlefield horizon SVG (tent/spear silhouette) at 60% height
- Simple chariot SVG (rect + 2 circles) behind Arjuna for stages 0–2

### `CharacterLayer.tsx`
- Left: `<ArjunaSVG state={stage.arjunaState} />`
- Right: `<KrishnaSVG state={stage.krishnaState} />` (null when hidden)
- Each wrapped in `motion.div` with spring animation keyed to state

### `StageOverlay.tsx`
- Semi-transparent dark panel, top portion of screen
- Staggered text reveal: chapter title → teaching text (0.4s delay)
- Progress dots at bottom (`● ○ ○ ○ ○ ○`)
- Stage 5 title uses `shimmer-text` class

### `ContinuePrompt.tsx`
- Calls `useInput({ onUp: onAdvance, onDown: onAdvance, onSelect: onAdvance })`
- Any joystick direction or button press advances — appropriate for kiosk visitors
- Pulsing opacity animation (Framer Motion `animate={{ opacity: [0.4, 1, 0.4] }}`)

### `EndCard.tsx`
- Auto-reset after 15s (visitors may walk away)
- `useInput({ onSelect: onDone })` — deliberate button press only to go home
- "Jai Shri Krishna!" heading + "To be continued..." + countdown bar

### `ArjunaSVG.tsx`
- `viewBox="0 0 200 400"`, amber/gold fill (`#f59e0b`)
- 3 static `<g>` variants: `SlumpedArjuna`, `ListeningArjuna`, `RisingArjuna`
- Conditional render by state — no path morphing (Pi Zero friendly)

### `KrishnaSVG.tsx`
- `viewBox="0 0 200 440"`, deep blue fill (`#1e3a5f`) with indigo highlights
- `hidden` → returns null
- `cosmic` → wrapper has Framer `brightness` animation (radiance effect)
- Peacock feather crown, flute, lotus flower details as simple SVG paths

---

## Animation Strategy (Framer Motion)

```typescript
// Stage cross-fade — AnimatePresence in KurukshetraGame
{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.8 } }

// Character entrance — keyed by stageIndex, re-mounts each stage
{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { type: "spring", stiffness: 60, damping: 20 } }

// Arjuna state variants
{ slumped: { y: 30, scale: 0.85, rotate: -8 }, listening: { y: 10, scale: 0.9, rotate: 0 }, rising: { y: -20, scale: 1.05, rotate: 0 } }

// Text stagger in StageOverlay
container: { hidden: {}, visible: { transition: { staggerChildren: 0.4 } } }
item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

// Continue prompt pulse
{ animate: { opacity: [0.4, 1, 0.4] }, transition: { duration: 2, repeat: Infinity } }

// Krishna cosmic glow (finite repeat for Pi Zero)
{ animate: { filter: ["brightness(1)", "brightness(2.5)", "brightness(1.5)"] }, transition: { duration: 1.8, repeat: 6, repeatType: "mirror" } }
```

**Pi Zero safety:** `opacity` + `transform` only (GPU-composited). No `layout` prop. Fog particles capped at 12. Cosmic glow finite repeat.

---

## Existing File Changes

### `src/types.ts`
```typescript
export type Screen = "home" | "quiz" | "kurukshetra";
```

### `src/App.tsx`
- Import `KurukshetraGame`
- Add `goKurukshetra = useCallback(() => setScreen("kurukshetra"), [])`
- Pass `onStartKurukshetra={goKurukshetra}` to `HomeScreen`
- Add render branch: `{screen === "kurukshetra" && <KurukshetraGame onExit={goHome} />}`

### `src/screens/HomeScreen.tsx`
- Add `onStartKurukshetra` to Props
- Add GameCard: `title="Kurukshetra" description="Arjuna's Resolve" emoji="⚔️" available={true} onClick={onStartKurukshetra}`
- Existing `useInput` → `onSelect: onStartQuiz` stays unchanged (Enter/A still launches quiz from home)

---

## Phase 2 Extensibility

Zero restructuring needed. Phase 2 additions:
1. `KurukshetraGame` gains `"question"` phase state; `advance()` checks `stage.questions`
2. New `StageQuestionCard.tsx` component renders question + options (mirrors QuizQuestion, no timer)
3. `data.ts` stage objects get `questions: [...]` arrays populated
4. `EndCard` shows chapter completion stats

All existing Phase 1 components untouched.

---

## Dependency

```bash
npm install framer-motion
```

No vite.config.ts changes needed.

---

## Verification

1. `npm run dev` in `krishna-games/`
2. Home screen shows "Kurukshetra ⚔️" card alongside "Krishna Quiz"
3. Click/select Kurukshetra card → battlefield scene loads
4. Press Enter/Space/any arrow → stages advance (0 → 1 → ... → 5)
5. Each stage: new atmosphere color, Arjuna posture changes, text reveals with stagger
6. Stage 3: Krishna glows brighter (cosmic form)
7. Stage 5: Arjuna rises, chapter title shimmers
8. After stage 5 advance → EndCard shows with auto-reset countdown
9. Gamepad test: D-pad + A button advance stages correctly
