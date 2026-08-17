# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Krishna-themed web games for an ISKCON Krishna Janmashtami festival stall. Runs on a laptop connected to a large monitor. Visitors cycle through quickly — UX must be dead simple with no login, auto-reset between players.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check (`tsc -b`) + production build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

## Running at the Stall

Run `npm run build`, then `npm run preview` and open the local URL in a fullscreen browser.

## Architecture

Single-page React app with `useState`-based screen switching (no router). `src/games.ts` is the game registry and derives the `GameId` screen type. Registering a game there adds it to the home screen and makes its component launchable from `App.tsx`.

**Screen flow:** HomeScreen → selected game component → GameResultScreen → auto-reset to Home (10s)

**Input:** Stall UI is mouse driven only. No need to add keyboard navigation

## Tailwind CSS v4

Uses `@theme` block in `src/index.css` to define colors as custom properties. Reference in classes as `text-krishna-gold`, `bg-game-panel`, etc. Custom animations (shimmer, float-up, shake) are plain CSS keyframes in the same file — not in a Tailwind config.

Keep colors centralized in `src/index.css`. Prefer named theme tokens like `bg-game-bg`, `bg-game-panel`, `text-game-accent`, `border-game-correct` over repeated arbitrary hex classes in components.

Visual direction is a professional game UI: dark slate backgrounds, raised dark panels/cards, amber accent, subtle shadows.

**Key gotcha:** Tailwind v4 CSS Cascade Layers — non-layered styles (like `body {}`) beat `@layer` styles. When overriding Tailwind utilities in plain CSS, keep this in mind.

## Responsive scaling

The UI is designed at 1920×1080 and scales through `html { font-size: min(1.4815vh, 0.8333vw) }`. Use `rem` for component dimensions, offsets, motion distances, and SVG stroke widths so Full HD and 4K keep the same proportions. Percentage positioning is fine inside a scaled container.

`npm run lint` rejects `px`, `vw`, `vh`, non-scaling SVG strokes, and numeric inline width/height values in TSX. Keep legitimate viewport-filling shells, pointer coordinates, hairlines, shadows, and full-screen decorative animation in shared CSS.

## Constraints

- No backend or audio
- Large text sizes throughout — readable from 3+ feet away
- `overflow: hidden` and `user-select: none` on body for stall use
- Keep the project small. Prefer simple local state and small focused components over adding abstractions early.