# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Krishna-themed web games for an ISKCON Krishna Janmashtami festival stall. Runs on a **Pi Zero 2 W** in Chromium kiosk mode (`file://` protocol) on a large monitor. Visitors cycle through quickly — UX must be dead simple with no login, auto-reset between players.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check (`tsc -b`) + production build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

## Deployment

Build locally, copy `dist/` to Pi, open with `chromium-browser --kiosk file:///path/to/dist/index.html`. Vite `base: "./"` ensures relative asset paths work over `file://`.

## Architecture

Single-page React app with useState-based screen switching (no router). Screen state is `"home" | "quiz"` in `App.tsx`.

**Screen flow:** HomeScreen → QuizGame → QuizQuestion (×5) → QuizResult → auto-reset to Home (5s)

**Input:** `useInput` hook normalizes keyboard (arrows, WASD, Enter/Space) and gamepad (d-pad, analog stick, buttons) into `onUp`/`onDown`/`onSelect` callbacks with 200ms debounce. Quiz options are both tappable and keyboard-navigable.



## Tailwind CSS v4

Uses `@theme` block in `src/index.css` to define colors as `--color-krishna-`* custom properties. Reference in classes as `text-krishna-gold`, `bg-krishna-bg`, etc. Custom animations (shimmer, float-up, pulse-glow) are plain CSS keyframes in the same file — not in a Tailwind config.

**Key gotcha:** Tailwind v4 CSS Cascade Layers — non-layered styles (like `body {}`) beat `@layer` styles. When overriding Tailwind utilities in plain CSS, keep this in mind.

## Constraints

- No backend, no audio, no server on the Pi
- Large text sizes throughout — readable from 3+ feet away
- `overflow: hidden` and `user-select: none` on body for kiosk use

