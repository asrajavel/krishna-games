# Krishna Games — Game Design Reference

> Auto-generated from source. No question content — only mechanics, timing, effects, and UX per game.

---

## Shared Infrastructure

| Concern | Detail |
|---|---|
| **Timer bar** | Full-width colored bar at top. Gold → Green → Red as time depletes. Shows remaining seconds badge. All games except Sloka Scribe use it. |
| **Reveal hold** | 2s — how long correct/wrong feedback is shown before advancing. |
| **Result screen** | Centered title (text-6xl), score (text-8xl), message (text-3xl), "Back to Home" button. Auto-returns to menu after 120s. |
| **Celebration rain** | 28 confetti petals (pink/gold/red/yellow gradients) falling with drift + spin, fullscreen overlay, z-50. |
| **Sound effects** | `correct`, `wrong`, `select`, `click`, `drop`, `timeout` — played via `playSound()`. |
| **Drag system** | Custom `usePointerDrag` hook — touch-native, no external libraries. |
| **Question shuffle** | Fisher-Yates via `shuffle()`. Guards against accidental correct-order shuffles. |

---

## Game 1: Krishna Quiz (`quiz`)

| Aspect | Detail |
|---|---|
| **Format** | MCQ — single correct answer from multiple options |
| **Variants** | 5 topics: Krishna Lila (kids), Bhagavad-gita, Mahabharata, Srimad-Bhagavatam, General Trivia |
| **Timer** | 15s per question via Timer component in QuizQuestion |
| **Pacing** | After answer: 2s reveal hold + 0.35s leave animation → next question. Or 15s timer expire → skip as unanswered. |
| **Answer feedback** | Sound + visual highlight on selected option |
| **Scoring** | +1 per correct. Score shown only on result screen. |
| **End screen** | Title: "Quiz Complete!" · Score: `score / total` |
| **Messages** | Perfect → "Hare Krishna! Perfect!" · ≥60% → "Well played! Jai Shri Krishna!" · <60% → "Keep learning about Krishna!" |
| **Graphics** | Sub-component `QuizQuestion` renders option cards with variant image |
| **Effects** | Slide-in + slide-out animation per question (`quiz-slide` / `quiz-slide-leaving`) |
| **Component** | `QuizGame.tsx` + `QuizQuestion.tsx` |

---

## Game 2: Dasavatar Match (`dasavatar`)

| Aspect | Detail |
|---|---|
| **Format** | Drag-and-drop matching — drag tokens (names or clue images) onto 10 avatar targets |
| **Variants** | Kids: match names · Adults: match clue images |
| **Timer** | 60s shared timer |
| **Pacing** | Real-time drag-and-drop. On completion: 4s celebration delay → result screen |
| **Answer feedback** | Correct drop: green glow + "glow-correct". Wrong drop: shake animation + red glow (0.5s). Dragging shows a floating clone following pointer. |
| **Scoring** | `matchedCount / 10` |
| **End screen** | Title: "Dasavatar Complete!" or "Time's Up!" |
| **Messages** | Complete → "Hare Krishna! Perfect match!" · Timeout → "Try again and match all avatars!" |
| **Graphics** | 5×2 grid of avatar images with name/placeholder slots below each. Bottom tray of drag tokens. |
| **Effects** | CelebrationRain on completion before result. Glow/hover states on targets. Floating drag preview. |
| **Grid** | 5 columns × 2 rows of target cards |
| **Component** | `DasavatarGame.tsx` |

---

## Game 3: Memory Match (`memory`)

| Aspect | Detail |
|---|---|
| **Format** | Card-flip matching — flip two cards, find pairs |
| **Variants** | Kids: 6 pairs · Adults: 10 pairs |
| **Timer** | 75s shared countdown |
| **Pacing** | Two-card selected state shown 0.8s, then hide if not matched. No per-turn timeout. |
| **Answer feedback** | Match: green border + image stays face-up. Mismatch: wrong sound, cards flip back after 0.8s. |
| **Scoring** | `matched / total` + moves counter displayed during game |
| **End screen** | Title: "All Pairs Found!" or "Time's Up!" |
| **Messages** | Complete → "Hare Krishna! Completed in N moves." · Timeout → "Good try! Find all the pairs next time." |
| **Graphics** | Card grid: face-down shows "?" + "FLIP" label. Face-up shows image + name. Images from `./memory/`. |
| **Effects** | Face-up/matched/hover card border transitions. Scale on hover. |
| **Grid** | Kids: 4×3 · Adults: 5×4 |
| **Component** | `MemoryGame.tsx` |

---

## Game 4: Lila Sequence (`sequence`)

| Aspect | Detail |
|---|---|
| **Format** | Drag-and-drop sequence — arrange 6 Krishna-lila events in correct chronological order |
| **Variants** | None |
| **Timer** | 75s |
| **Pacing** | Real-time swaps. Swap feedback (orange glow) visible 600ms. On completion: 4s celebration → result screen. |
| **Answer feedback** | Each correct-position event counts. Completion triggers green glow on all tiles + SVG path. Swap pairs get a swap-pop animation. |
| **Scoring** | `correctCount / 6` |
| **End screen** | Title: "Perfect Sequence!" or "Time's Up!" |
| **Messages** | Complete → "Hare Krishna! Every event is in order." · Timeout → "Events placed in the correct position." |
| **Graphics** | 6 illustrated event cards on a 3×2 grid positioned along an SVG U-shaped path with arrow marker. START/FINISH badges. |
| **Effects** | CelebrationRain, SVG path color transition (accent → correct green), glow-correct on completion. Floating drag preview. |
| **Layout** | S-shaped path: top row left-to-right, bottom row right-to-left |
| **Component** | `SequenceGame.tsx` |

---

## Game 5: Picture Puzzle (`puzzle`)

| Aspect | Detail |
|---|---|
| **Format** | Jigsaw puzzle — drag pieces from tray into correct board slots |
| **Variants** | None (random puzzle image chosen from 6 options each play) |
| **Timer** | 75s |
| **Pacing** | Real-time placement. On completion: 4s celebration → result screen. |
| **Answer feedback** | Correct: piece stays in slot. Pieces can be swapped between board and tray, or board-to-board. Ring highlight on hovered slot. Active piece gets scale-95 + ring. |
| **Scoring** | `correctCount / 6` |
| **End screen** | Title: "Puzzle Complete!" or "Time's Up!" |
| **Messages** | Complete → "Hare Krishna! You restored the picture." · Timeout → "Pieces placed correctly." |
| **Graphics** | Puzzle image sliced into 6 pieces via CSS background-position. Left: board grid (2×3 or 3×2 based on image aspect). Right: reference image + piece tray. |
| **Effects** | CelebrationRain. Board grows green border on completion. Dragging piece has floating preview. |
| **Puzzles** | 6 Krishna-themed images: Yashoda-Krishna, Rasa Lila, Kaliya, Bala Krishna, Krishna-Calf, Radha-Krishna Swing |
| **Component** | `PuzzleGame.tsx` |

---

## Game 6: Odd One Out (`odd-one-out`)

| Aspect | Detail |
|---|---|
| **Format** | MCQ — pick the item that doesn't belong from 4 options per round |
| **Variants** | None |
| **Timer** | 75s shared (not per-round) |
| **Pacing** | After answer: 2000ms reveal hold + 350ms leave animation (last round: 4000ms) |
| **Answer feedback** | Correct: green border + pop-correct. Wrong: red border + pop-wrong. Non-selected fade to 45% opacity. |
| **Scoring** | +1 per round. `score / 5` |
| **End screen** | Title: "Odd One Out Complete!" |
| **Messages** | Perfect → "Perfect! You know Krishna's pastimes!" · Not perfect → "Well played! Keep learning about Krishna!" |
| **Graphics** | 4 large emoji circles in a diamond layout (3×3 CSS grid). Current round prompt above. |
| **Effects** | Slide animation per round (`quiz-slide`). Reveal-pop on answer selection. |
| **Rounds** | 5 rounds, hardcoded |
| **Component** | `OddOneOutGame.tsx` |

---

## Game 7: Guess the Picture (`guess-blur`)

| Aspect | Detail |
|---|---|
| **Format** | MCQ — identify a pixelated/blurred Krishna image from 4 text labels |
| **Variants** | None |
| **Timer** | 15s per round |
| **Pacing** | After answer: 2000ms + 350ms (last round: 4000ms) |
| **Answer feedback** | Correct: green card + "✓" + points badge (+3/+2/+1). Wrong: red card. Timed out: "Time's up" pulsing banner. |
| **Scoring** | 3 points (no hints), 2 points (1 hint), 1 point (2 hints). `score / maxScore` |
| **End screen** | Title: "Guess Complete!" |
| **Messages** | Perfect → "Hare Krishna! Perfect vision!" · Not perfect → "Well played! Jai Shri Krishna!" |
| **Graphics** | Canvas-rendered pixelated image (50px blocks → 30px → 1px with hints). Option cards with letter badges (A/B/C/D). "Reveal a bit more (−1 point)" button. |
| **Effects** | Canvas pixelation via offscreen scaling. Slide animation per round. |
| **Rounds** | 3 random rounds from 4-image pool |
| **Component** | `GuessBlurGame.tsx` |

---

## Game 8: Match the Pairs (`match-pairs`)

| Aspect | Detail |
|---|---|
| **Format** | Two-column matching — pick left item, then its match on the right |
| **Variants** | None |
| **Timer** | 75s |
| **Pacing** | After wrong pair: 2000ms shake → clear. After all matched: 4s celebration → result screen. |
| **Answer feedback** | Match: green border + connecting SVG line drawn between columns. Mismatch: red shake on both items. |
| **Scoring** | `matched / 6` |
| **End screen** | Title: "Perfect Match!" or "Time's Up!" |
| **Messages** | Timeout → "Good try! Match every character next time." · Complete → "Hare Krishna! You connected every pair." |
| **Graphics** | Three-column layout. Left: 6 character cards (emoji + name). Center: animated SVG connecting lines for matched pairs. Right: 6 shuffled match cards (emoji + name). |
| **Effects** | CelebrationRain during celebration phase. Reveal-pop on matches. SVG line rendering for connections. |
| **Content** | 6 pairs: Krishna↔Flute, Radha↔Vrindavan, Balarama↔Plough, Mother Yashoda↔Butter Pot, Arjuna↔Bhagavad Gita, Sudama↔Flattened Rice |
| **Component** | `MatchPairsGame.tsx` |

---

## Game 9: Krishna's Favorites (`whack-target`)

| Aspect | Detail |
|---|---|
| **Format** | Whack-a-mole — mouse-hover over falling items. Tap favorites, avoid distractors. |
| **Variants** | None |
| **Timer** | 75s |
| **Pacing** | Continuous falling items. Spawned every 700ms. After timer: 4s freeze → result screen. |
| **Answer feedback** | Hit favorite: green ring + "+10" badge. Hit distractor: shake + red ring + "−5" badge. All falling items pause on hit or game end. |
| **Scoring** | +10 per favorite hit, −5 per distractor hit. Running score display. Score shown alone on result screen (no fraction). |
| **End screen** | Title: "Time's Up!" · Score: number only |
| **Messages** | "You found Krishna's favorites!" |
| **Graphics** | 5 vertical lanes (20% each). Items fall with drift animation (CSS `favorite-fall` keyframes). Speeds up as time runs out (5.5s → 3.5s fall duration). Circular item containers. |
| **Effects** | Falling animation, hit pause, feedback badges, shake on wrong. Lane cooldown (1.8s between spawns in same lane). 65% chance favorite spawn. |
| **Component** | `WhackTargetGame.tsx` |

---

## Game 10: Route to Vrindavan (`route-to-vrindavan`)

| Aspect | Detail |
|---|---|
| **Format** | MCQ — choose correct city at each junction on the pilgrimage route |
| **Variants** | None |
| **Timer** | 150s (2.5 minutes) — longest timer of all games |
| **Pacing** | Correct: 5s "driving" interlude scene → next turn. Wrong: 2s shake + life lost, then retry same turn. |
| **Answer feedback** | Correct: driving scene (bus on road, sign passing by). Wrong: fullscreen "Wrong Turn!" overlay with shake + remaining hearts. |
| **Scoring** | `completedTurns / 11`. Also: 3 lives (♥ system). Score = turns completed so far on game-over. |
| **End screen** | Title: "Welcome to Vrindavan!" / "Journey Paused" / "Time's Up!" |
| **Messages** | Complete → "Hare Krishna! You reached Vrindavan." · Fail → "A fresh journey begins shortly." |
| **Graphics** | Highway sign image buttons as option cards. Progress bar with dots for each of 11 turns. Hearts display (3 ♥). Driving scene with bus image and road background. |
| **Effects** | "Driving" phase for the bus animation scene. Life-lost overlay with fade. Turn progress dots. |
| **Route** | 11 stops: Bangalore → Tumkur → Chitradurga → Vijayapura → Sholapur → Sambhajinagar → Indore → Kota → Jaipur → Agra → Mathura → Vrindavan |
| **Component** | `RouteToVrindavanGame.tsx` |

---

## Game 11: Write the Sloka (`sloka-scribe`)

| Aspect | Detail |
|---|---|
| **Format** | Read-and-write — a sloka translation scrolls across screen (marquee). Player writes it in a notebook (physical). |
| **Variants** | None |
| **Timer** | 60s per sloka |
| **Pacing** | Each sloka scrolls once. When animation ends, "Next Sloka →" button appears. Player clicks when done writing. After 3 slokas: level complete screen → next level or finish. |
| **Answer feedback** | No auto-grading. Player self-assesses. Timer expiry auto-advances (acts as skip). |
| **Scoring** | Progress-based: "Learnt N slokas" (not correctness-based). |
| **End screen** | Title: "Hare Krishna!" |
| **Messages** | "Every sloka is in your notebook!" |
| **Graphics** | Marquee text scrolls left across center of screen. Verse reference in a pill badge above. Background: floating distraction images (peacock, flute, lotus, etc.) drifting with opacity 0.32. Level-complete card with "Level N Complete!". |
| **Effects** | Distraction images floating in background with drift, spin, and reverse animations. CSS marquee animation (scroll-left). CelebrationRain on final completion. |
| **Levels** | 3 levels, 3 slokas each (9 total). Speed increases: 50 → 75 → 100 rem/s. |
| **Component** | `SlokaScribeGame.tsx` |

---

## Game 12: Krishna's Forest Maze (`maze`)

| Aspect | Detail |
|---|---|
| **Format** | Pointer-drag maze — drag Krishna through open passages to reach the cows |
| **Variants** | Kids: 6×10 maze · Adults: 12×24 maze |
| **Timer** | 75s |
| **Pacing** | Real-time dragging. On reaching target: 4s celebration → result screen. |
| **Answer feedback** | Path drawn as dual SVG polyline (thick dim + thin bright). Wall bump: wrong sound + red flash on cell (300ms). Backtracking: drag backward through path removes steps. |
| **Scoring** | No score for completion. Timeout shows path length (steps taken). |
| **End screen** | Title: "Maze Complete!" or "Time's Up!" |
| **Messages** | Complete → "Krishna found his cows!" · Timeout → "The cows are still waiting." |
| **Graphics** | Grid-based maze walls (thin lines). Garden background image. Krishna token (circular, ring-glow). Cow goal token (pulsing on completion). Dual-layer SVG path trace. |
| **Effects** | CelebrationRain. Path color transitions from accent to correct-green. Wall bump red flash. Cow token pulses on completion. Maze border goes green. |
| **Generation** | Pre-built maze bitmask walls. Adults maze has alternate routes (hand-tuned). |
| **Component** | `MazeGame.tsx` |

---

## Quick Reference Table

| # | Game | Format | Timer | Pacing | Score Type | Celebration | Variants |
|---|---|---|---|---|---|---|---|
| 1 | Krishna Quiz | MCQ | 15s/question | 2.35s reveal delay | correct/total | No | 5 topics |
| 2 | Dasavatar Match | Drag-drop | 60s | Real-time | correct/10 | Yes (4s delay) | 2 |
| 3 | Memory Match | Card flip | 75s | Real-time | correct/total + moves | No | 2 |
| 4 | Lila Sequence | Drag-swap | 75s | Real-time | correct/6 | Yes (4s delay) | None |
| 5 | Picture Puzzle | Jigsaw drag | 75s | Real-time | correct/6 | Yes (4s delay) | None |
| 6 | Odd One Out | MCQ | 75s shared | 2.35s reveal delay | correct/5 | No | None |
| 7 | Guess the Picture | MCQ | 15s/round | 2.35s reveal delay | points/max (3/2/1) | No | None |
| 8 | Match the Pairs | Two-col pick | 75s | Real-time | correct/6 | Yes (4s delay) | None |
| 9 | Krishna's Favorites | Whack-a-mole | 75s | Continuous | raw score | No | None |
| 10 | Route to Vrindavan | MCQ + lives | 150s | 5s drive scene | correct/11 | No | None |
| 11 | Write the Sloka | Self-paced | 60s/sloka | Manual advance | progress count | Yes (final) | None |
| 12 | Forest Maze | Pointer-drag | 75s | Real-time | steps (on timeout) | Yes (4s delay) | 2 |

---

## Timing Summary

| Pattern | Games using it |
|---|---|
| **75s shared timer** | Memory, Sequence, Puzzle, Odd One Out, Match Pairs, Whack Target, Maze |
| **60s shared timer** | Dasavatar |
| **150s shared timer** | Route to Vrindavan |
| **15s per-round timer** | Guess the Picture |
| **60s per-sloka timer** | Sloka Scribe |
| **No timer (question-paced)** | — |
| **15s per-question timer** | Krishna Quiz |
| **Completion celebration delay** | 4s (Dasavatar, Sequence, Puzzle, Match Pairs, Maze, Guess-last-round, Sloka-final) |

---

## Effects Summary

| Effect | Games using it |
|---|---|
| **CelebrationRain** | Dasavatar, Sequence, Puzzle, Match Pairs, Sloka Scribe, Maze |
| **Floating drag preview** | Dasavatar, Sequence, Puzzle |
| **SVG path/line draw** | Sequence (U-path), Match Pairs (connecting lines), Maze (path trace) |
| **Slide animation between questions** | Quiz, Odd One Out, Guess the Picture |
| **Reveal-pop animation** | Quiz, Odd One Out, Guess the Picture, Match Pairs |
| **Shake animation (wrong)** | Dasavatar, Match Pairs, Whack Target, Route to Vrindavan |
| **Glow effects** | Dasavatar, Sequence, Puzzle |
| **Pixelation (canvas)** | Guess the Picture |
| **Falling/float animations** | Whack Target (fall), Sloka Scribe (distraction drift) |
| **Driving/road scene** | Route to Vrindavan |
| **End-screen auto-return** | All games (120s timeout) |
