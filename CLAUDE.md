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

Single-page React app with useState-based screen switching (no router). Screen state is `"home" | "quiz" | "dasavatar"` in `App.tsx`.

**Screen flow:** HomeScreen → QuizGame → QuizQuestion (×5) → QuizResult → auto-reset to Home (10s)

**Input:** Stall UI is mouse driven only. No need to add keyboard navigation

## Tailwind CSS v4

Uses `@theme` block in `src/index.css` to define colors as custom properties. Reference in classes as `text-krishna-gold`, `bg-game-panel`, etc. Custom animations (shimmer, float-up, shake) are plain CSS keyframes in the same file — not in a Tailwind config.

Keep colors centralized in `src/index.css`. Prefer named theme tokens like `bg-game-bg`, `bg-game-panel`, `text-game-accent`, `border-game-correct` over repeated arbitrary hex classes in components.

Visual direction is a professional game UI: dark slate backgrounds, raised dark panels/cards, amber accent, subtle shadows.

**Key gotcha:** Tailwind v4 CSS Cascade Layers — non-layered styles (like `body {}`) beat `@layer` styles. When overriding Tailwind utilities in plain CSS, keep this in mind.

## Constraints

- No backend or audio
- Large text sizes throughout — readable from 3+ feet away
- `overflow: hidden` and `user-select: none` on body for stall use
- Keep the project small. Prefer simple local state and small focused components over adding abstractions early.