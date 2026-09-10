"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type EvidenceItem = {
  /** Which call this came from, e.g. `step 3 · sonnet`. */
  step: string;
  prompt: string;
  response: string;
};

/**
 * Findings are evidence-first, so the calls behind a claim are always one
 * click away, on every finding rather than on the first one.
 *
 * Prompt and response both, in full. The panel used to promise "the prompts
 * and responses it was drawn from" and then show two prompts with the ends
 * cut off, which is the one thing an evidence panel cannot do.
 *
 * Height is measured rather than guessed so the panel animates to its real
 * content height.
 */
export function Evidence({ items }: { items: EvidenceItem[] }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const body = useRef<HTMLDivElement>(null);

  // Re-measure while open so a reflow (window resize, font swap) does not
  // leave the panel clipped at its old height.
  useEffect(() => {
    if (!open || !body.current) return;

    const node = body.current;
    const observer = new ResizeObserver(() => setHeight(node.scrollHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, [open]);

  function toggle() {
    const next = !open;
    setHeight(next ? (body.current?.scrollHeight ?? 0) : 0);
    setOpen(next);
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 rounded-inner border border-line bg-surface-2 px-4 py-3 font-mono text-[0.82rem] text-muted transition-colors duration-150 ease-out hover:border-amber hover:text-amber"
      >
        {open ? "hide the evidence" : "show the evidence"}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={cn(
            "shrink-0 transition-transform duration-[250ms] ease-out",
            open && "rotate-90",
          )}
        >
          <path
            d="m4.5 2.5 3.5 3.5-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-[350ms] ease-out"
        style={{ maxHeight: open ? height : 0 }}
      >
        <div ref={body} className="space-y-5 pt-4">
          {items.map((item) => (
            <div key={item.step}>
              <p className="font-mono text-[0.78rem] text-teal">{item.step}</p>

              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="font-mono text-[0.72rem] text-muted">
                    prompt
                  </dt>
                  <dd className="mt-1 rounded-inner border border-line bg-ink px-3.5 py-2.5 font-mono text-[0.8rem] leading-relaxed text-text">
                    {item.prompt}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.72rem] text-muted">
                    response
                  </dt>
                  <dd className="mt-1 rounded-inner border border-line bg-ink px-3.5 py-2.5 font-mono text-[0.8rem] leading-relaxed text-muted">
                    {item.response}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
