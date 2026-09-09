"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A section heading that lights its own corner the first time it is read.
 *
 * Amber is the finding colour, so the glow is kept far below the threshold
 * where it reads as a colour at all -- 7% at the centre, blurred across 40px.
 * It should register as the section coming forward, not as the page being
 * tinted. If you can name the colour, it is too strong.
 *
 * Fires once. Scrolling back up does not switch it off again: a section that
 * blinks on every pass is a section arguing with the reader.
 */
export function SectionGlow({ className }: { className?: string }) {
  const [lit, setLit] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLit(true);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={host}
      aria-hidden
      className={cn("section-glow", lit && "is-lit", className)}
    />
  );
}
