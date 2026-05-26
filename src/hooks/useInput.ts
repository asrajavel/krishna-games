import { useEffect, useCallback, useRef } from "react";

interface UseInputOptions {
  onUp: () => void;
  onDown: () => void;
  onSelect: () => void;
  enabled?: boolean;
}

export function useInput({ onUp, onDown, onSelect, enabled = true }: UseInputOptions) {
  const lastInputTime = useRef(Date.now());
  const DEBOUNCE_MS = 200;

  const debounced = useCallback((fn: () => void) => {
    const now = Date.now();
    if (now - lastInputTime.current < DEBOUNCE_MS) return;
    lastInputTime.current = now;
    fn();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          debounced(onUp);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          debounced(onDown);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          debounced(onSelect);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUp, onDown, onSelect, enabled, debounced]);

  useEffect(() => {
    if (!enabled) return;
    let rafId: number;
    const gp0 = navigator.getGamepads()[0];
    let prevButtons: boolean[] = gp0 ? gp0.buttons.map((b) => b.pressed) : [];
    let prevAxes: number[] = gp0 ? [...gp0.axes] : [];

    const poll = () => {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        const upPressed = gp.buttons[12]?.pressed || gp.axes[1] < -0.5;
        const downPressed = gp.buttons[13]?.pressed || gp.axes[1] > 0.5;
        const selectPressed = gp.buttons[0]?.pressed;
        const wasUp = prevButtons[12] || (prevAxes[1] ?? 0) < -0.5;
        const wasDown = prevButtons[13] || (prevAxes[1] ?? 0) > 0.5;
        const wasSelect = prevButtons[0];
        if (upPressed && !wasUp) debounced(onUp);
        if (downPressed && !wasDown) debounced(onDown);
        if (selectPressed && !wasSelect) debounced(onSelect);
        prevButtons = gp.buttons.map((b) => b.pressed);
        prevAxes = [...gp.axes];
      }
      rafId = requestAnimationFrame(poll);
    };

    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, [onUp, onDown, onSelect, enabled, debounced]);
}
