import { cn } from "@/lib/utils";

/**
 * The brand mark: the node glyph plus the `chainopt` wordmark in IBM Plex
 * Mono 600.
 *
 * The three hex values below are part of the mark and are deliberately NOT
 * palette tokens. If the site's palette ever changes, these stay exactly as
 * they are. Do not recolour, restroke, or regenerate this glyph.
 */
const AMBER = "#FFB224";
const GRAY = "#94A2BD";
const TEAL = "#3ADFC5";

export function Wordmark({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <path
          d="M7.7 10.4 16.3 6.6M7.7 13.6 16.3 17.4"
          stroke={GRAY}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="5" cy="12" r="3" fill={AMBER} />
        <circle cx="19" cy="5.5" r="2.75" stroke={TEAL} strokeWidth="1.5" />
        <circle cx="19" cy="18.5" r="2.75" stroke={GRAY} strokeWidth="1.5" />
      </svg>
      <span className="font-mono text-[0.95rem] font-semibold tracking-tight text-text">
        chainopt
      </span>
    </span>
  );
}
