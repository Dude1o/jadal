import { useEffect, useMemo, useRef, useState } from "react";

export function useCountUp(target: number, duration = 1000, active = true) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  // Automatically detect decimal precision of the target value
  const decimals = useMemo(() => {
    const parts = target.toString().split(".");
    return parts[1] ? parts[1].length : 0;
  }, [target]);

  useEffect(() => {
    if (!active) {
      setCount(target);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Clean cubic-ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;

      setCount(Number(val.toFixed(decimals)));

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, active, decimals]);

  return count;
}
