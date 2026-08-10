---
name: add-krishna-game
description: Adds a game to the Krishna festival stall app using its existing React screen flow, home card, assets, theme, and player reset conventions. Use when creating, scaffolding, or integrating a new game in this repository.
---

# Add a Krishna Game

Build the smallest complete game that matches the existing app.

## Inspect only what is needed

Read:

- `src/App.tsx`
- `src/types.ts`
- `src/screens/HomeScreen.tsx`
- `src/components/Timer.tsx` and `GameCard.tsx`
- One existing game closest to the requested interaction

Do not inspect unrelated games or search the web unless required content cannot be produced locally.

## Establish the game

Determine from the request:

- Game ID: lowercase folder/screen value such as `memory`
- Component name: such as `MemoryGame`
- Home-card title, description, and icon
- Rules, input method, completion condition, score, and timeout
- Required content and assets

Infer sensible details and proceed without questions unless implementation is impossible without a user decision. Keep the interaction mouse-driven and readable from 3+ feet away.

Defaults unless the request requires otherwise:

- Keep the game and small datasets in one component file.
- Use a 75-second game timer.
- On success, freeze and highlight the completed board for 4 seconds before showing results.
- Show results for 10 seconds, then call `onExit`.
- Create or download assets if required, or use emojis. Dont worry about copyright images, we will replace all images at the end.

## Implement

1. Create `src/screens/<game-id>/<GameName>Game.tsx`.
   - Export the root component.
   - Accept `onExit: () => void`.
   - Keep game state local so remounting starts a fresh session.
   - Keep simple games in one file; split phases or results only when that makes the code clearer.
2. Add static content to `src/data/<game-id>.ts` only when separating it improves readability.
3. Put the icon and game assets in `public/<game-id>/`.
   - Reference them with relative paths such as `./<game-id>/icon.svg`.
4. Add the game ID to the `Screen` union in `src/types.ts`.
5. Wire the game into `src/App.tsx`.
   - Import the root component.
   - Add a launch callback.
   - Pass the callback to `HomeScreen`.
   - Render the game for an explicit screen value and pass `onExit={goHome}`.
   - Do not rely on a final fallback branch to identify a particular game.
6. Update `src/screens/HomeScreen.tsx`.
   - Add the launch callback prop.
   - Add an available `GameCard` with title, description, icon, and click handler.

Complete one working implementation before visual verification. Do not take intermediate screenshots.

## Stall requirements

- After completion or timeout, show the result and automatically call `onExit` after 10 seconds.
- Reuse `GameCard`, `Timer`, and existing components when they fit.
- Use existing theme tokens from `src/index.css`; add a named token only if necessary.
- Preserve the full-screen layout, `overflow: hidden`, and `user-select: none`.
- Use large controls and labels; set `tabIndex={-1}` on stall buttons.
- Do not add routing, persistence, backend services, audio, dependencies, or speculative abstractions.
- Do not modify unrelated or pre-existing user changes.

## Verify

After implementation is complete, run once:

```sh
npm run lint
npm run build
```

Use Playwright against the running app at 1920×1080. Use browser scripting to reach timed states instead of waiting through timers. Take one final screenshot and verify:

- Home card launches the game.
- A new session starts cleanly.
- One happy-path interaction behaves as designed.
- Completion and timeout both reach a result state.
- The completed board remains visible for 4 seconds before results.
- The 10-second automatic reset returns home.
- The layout fits a fullscreen monitor without scrolling.

Do not add a test framework solely for the game. Add a small test only if the new game contains non-trivial pure logic that benefits from one and the repository already supports running it.