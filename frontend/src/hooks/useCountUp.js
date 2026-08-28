import { useEffect, useRef, useState } from "react";

/**
 * Animates a number counting up from 0 to `target` over `duration` ms.
 * Used on the dashboard so stats feel alive instead of just appearing.
 */
export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (typeof target !== "number" || Number.isNaN(target)) return;
    startRef.current = null;

    let frameId;
    function step(timestamp) {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    }
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
}