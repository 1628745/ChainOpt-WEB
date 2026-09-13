import { cn } from "@/lib/utils";

/**
 * The brand mark: the cut-edge glyph plus the ChainOpt wordmark.
 *
 * The mark used to be a filled dot joined to two outlined dots, which is the
 * share icon every operating system ships, and the wordmark was set lowercase
 * in mono while every other mention of the product on the site, in the title
 * bar and in the social cards read "ChainOpt". Both are fixed here: the glyph
 * now draws two inputs converging on one node with one of the two edges cut,
 * which is the thing the product does and nothing else's icon; the wordmark is
 * set in the site's own display face at the name's real casing.
 *
 * The three hex values below are part of the mark and are deliberately NOT
 * palette tokens. If the site's palette ever changes, these stay exactly as
 * they are.
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
        {/* The kept edge, drawn through. */}
        <path
          d="M7.6 7.9 15.6 10.8"
          stroke={TEAL}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* The cut edge: the same run, with the middle taken out. */}
        <path
          d="M7.6 16.1 9.9 15.3M13.4 14.0 15.6 13.2"
          stroke={GRAY}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="5" cy="6.6" r="2.6" stroke={TEAL} strokeWidth="1.6" />
        <circle cx="5" cy="17.4" r="2.6" stroke={GRAY} strokeWidth="1.6" />
        <circle cx="19" cy="12" r="3" fill={AMBER} />
      </svg>
      <span className="text-[1.02rem] font-bold tracking-[-0.02em] text-text">
        ChainOpt
      </span>
    </span>
  );
}
