---
name: add-krishna-game
description: Adds a game to the Krishna festival stall app using its existing React screen flow, home card, assets, theme, and player reset conventions. Use when creating, scaffolding, or integrating a new game in this repository.
---

# Add a Krishna Game

Build the smallest complete game that matches the existing app. Inspect the current files before editing because the game list and patterns may have changed.

## Establish the game

Determine from the request:

- Game ID: lowercase folder/screen value such as `memory`
- Component name: such as `MemoryGame`
- Home-card title, description, and icon
- Rules, input method, completion condition, score, and timeout
- Required content and assets

Ask only for details that materially change the game and cannot be inferred. Keep the interaction mouse-driven and readable from 3+ feet away.

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

## Stall requirements

- After completion or timeout, show the result and automatically call `onExit` after 10 seconds.
- Reuse `GameCard`, `Timer`, and existing components when they fit.
- Use existing theme tokens from `src/index.css`; add a named token only if necessary.
- Preserve the full-screen layout, `overflow: hidden`, and `user-select: none`.
- Use large controls and labels; set `tabIndex={-1}` on stall buttons.
- Do not add routing, persistence, backend services, audio, dependencies, or speculative abstractions.
- Do not modify unrelated or pre-existing user changes.

## Verify

Run:

```sh
npm run lint
npm run build
```

Manually verify:

- Home card launches the game.
- A new session starts cleanly.
- Correct and incorrect interactions behave as designed.
- Completion and timeout both reach a result state.
- The 10-second automatic reset returns home.
- The layout fits a fullscreen monitor without scrolling.

Do not add a test framework solely for the game. Add a small test only if the new game contains non-trivial pure logic that benefits from one and the repository already supports running it.
