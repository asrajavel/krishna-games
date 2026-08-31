---
name: add-krishna-game
description: Adds a game to the Krishna festival stall app using its existing React screen flow, home card, assets, theme, and player reset conventions. Use when creating, scaffolding, or integrating a new game in this repository.
---

# Add a Krishna Game

Build the smallest complete game that matches the existing app.

## Understand the existing flow

Read:

- `src/games.ts`
- `src/screens/HomeScreen.tsx`
- One existing game closest to the requested interaction

Inspect the shared components, helpers, theme, and related games needed to understand the full registration, gameplay, result, and reset flow before implementing.

## Establish the game

Determine from the request:

- Game ID: lowercase folder/screen value such as `memory-match`
- Component name: such as `MemoryMatchGame`
- Home-card title, description, and icon
- Rules, input method, completion condition, score, and timeout
- Required content and assets

Infer sensible details and proceed without questions unless implementation is impossible without a user decision. Keep the interaction mouse-driven and readable from 3+ feet away.

Defaults unless the request requires otherwise:

- Keep the game and small datasets in one component file.
- Use a 75-second game timer.
- On success, freeze and highlight the completed board for 4 seconds before showing results.
- Show results with `GameResultScreen`; it returns home after 10 seconds.
- Create or download assets if required, or use emojis. Dont worry about copyright images, we will replace all images at the end.

## UI defaults

- Center the title block at the top with `shrink-0 text-center`.
- Use `text-5xl font-extrabold text-game-accent` for the game title.
- When instructions are needed, place them directly under the title with `mt-1 text-xl text-slate-300`.
- Center the game board.
- Put questions directly above the board and center them.
- Pass a title, optional score, and message to `GameResultScreen`; do not build a custom result layout.
- Do not show live scores or bottom feedback text.
- Show interaction feedback through the game elements themselves, such as border and background colors.

## Implement

1. Create `src/screens/<game-id>/<GameName>Game.tsx`.
   - Export the root component.
   - Accept `onExit: () => void`.
   - Keep game state local so remounting starts a fresh session.
   - Keep simple games in one file and reuse `GameResultScreen` for results.
   - Pass a stable `useCallback` handler to `Timer.onExpire`.
   - Reuse `src/shuffle.ts` when randomizing content.
2. Add static content to `src/data/<game-id>.ts` only when separating it improves readability.
3. Put the icon and game assets in `public/<game-id>/`.
   - Reference them with relative paths such as `./<game-id>/icon.svg`.
4. Add one entry to `GAMES` in `src/games.ts`.
   - Import the root component.
   - Add its ID, title, description, icon or emoji, and component.
   - Keep the entry in the intended home-screen order.

Complete one working implementation before visual verification. Do not take intermediate screenshots.

## Stall requirements

- Reuse `Timer` and `GameResultScreen`.
- Use large controls and labels; set `tabIndex={-1}` on stall buttons.
- Use `rem` for layout dimensions, gaps, and fixed component sizes. The root font size scales with the viewport, so fixed `px` dimensions break proportions between Full HD and 4K.
- Use percentages only relative to a scaled container; do not use `vw` or `vh` for component motion or sizing.
- Size SVG strokes in `rem`; do not use `non-scaling-stroke`.
- `npm run lint` enforces these rules in TSX. Pointer coordinates and full-screen decorative motion are valid exceptions and belong in shared CSS.
- Do not modify unrelated or pre-existing user changes.

## Verify

After implementation is complete, run once:

```sh
npm run lint && npm run build
```

Use one Playwright scripted session at 1366×768, 1920×1080, and 3840×2160. Accelerate timed states, avoid intermediate screenshots, and take one final screenshot. Verify:

- Playwright gotcha: use `page.clock.runFor()`, not `fastForward()`.
- Home card launches the game.
- A new session starts cleanly.
- One happy-path interaction behaves as designed.
- Completion and timeout both reach a result state.
- The completed board remains visible for 4 seconds before results.
- The 10-second automatic reset returns home.
- The layout fits a fullscreen monitor without scrolling.
- Cards, gaps, and typography keep the same relative proportions at all resolutions.

Do not add a test framework solely for the game. Add a small test only if the new game contains non-trivial pure logic that benefits from one and the repository already supports running it.

Keep the final response to two lines maximum.