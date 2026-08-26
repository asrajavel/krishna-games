import { useCallback, useEffect, useState } from "react";

function targetAt(x: number, y: number, attribute: string) {
  return document.elementFromPoint(x, y)?.closest<HTMLElement>(`[${attribute}]`)?.getAttribute(attribute) ?? null;
}

/**
 * Pointer-driven drag. Native HTML5 drag-and-drop hands cursor rendering to the
 * OS, so the themed stall cursor cannot survive a `draggable` drag.
 */
export function usePointerDrag<T>(attribute: string, onDrop: (item: T, target: string | null) => void) {
  const [item, setItem] = useState<T | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);

  const start = useCallback((event: React.PointerEvent, dragged: T) => {
    setPosition({ x: event.clientX, y: event.clientY });
    setItem(dragged);
  }, []);

  const cancel = useCallback(() => {
    setItem(null);
    setHoveredTarget(null);
  }, []);

  useEffect(() => {
    if (item === null) return;

    const handleMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setHoveredTarget(targetAt(event.clientX, event.clientY, attribute));
    };
    const handleUp = (event: PointerEvent) => {
      cancel();
      onDrop(item, targetAt(event.clientX, event.clientY, attribute));
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp, { once: true });
    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
    };
  }, [item, attribute, cancel, onDrop]);

  return { item, position, hoveredTarget, start, cancel };
}
