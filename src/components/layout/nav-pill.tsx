import { useLayoutEffect, useRef, useState } from "react";

/**
 * The sliding active indicator, ported from `JadalBottomNavBar`.
 *
 * One element positioned absolutely inside the nav list and translated to the
 * active item's offset — not a class toggled on each row. That's the whole
 * reason it *slides* instead of blinking.
 *
 * For a vertical list the travel is on Y, which is direction-agnostic, and the
 * pill's inline inset is logical — so RTL needs no sign flip. (The mobile
 * source carries a comment about exactly this bug on its horizontal bar.)
 */
export function NavPill({
  containerRef,
  activeKey,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  /** Changes whenever the active route changes, re-triggering measurement. */
  activeKey: string;
}) {
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  const raf = useRef<number>(0);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const active = container.querySelector<HTMLElement>(
        '[data-nav-active="true"]',
      );
      if (!active) {
        setBox(null);
        return;
      }
      const cRect = container.getBoundingClientRect();
      const aRect = active.getBoundingClientRect();
      setBox({ top: aRect.top - cRect.top, height: aRect.height });
    };

    // Wait a frame so collapsible submenus have settled before measuring.
    raf.current = requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, activeKey]);

  if (!box) return null;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-0 rounded-full"
      style={{
        insetInlineStart: 4,
        insetInlineEnd: 4,
        top: 0,
        height: box.height,
        transform: `translateY(${box.top}px)`,
        transition: "transform 260ms cubic-bezier(.22,.61,.36,1)",
        background:
          "linear-gradient(90deg, rgba(245,154,74,.26) 0%, rgba(245,154,74,.14) 100%)",
        boxShadow: "0 6px 18px -8px rgba(245,154,74,.45)",
      }}
    />
  );
}
