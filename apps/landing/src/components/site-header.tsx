"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { btn } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

/**
 * The FAQ lives at the foot of the pricing page rather than on a route of its
 * own -- the questions people ask are mostly about cost and about what leaves
 * their machine, so they belong next to the prices. The nav still names it,
 * because that is what people scan for.
 */
const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/pricing#questions", label: "FAQ" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-nav backdrop-blur-[12px]">
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="rounded-sm" aria-label="chainopt home">
          <Wordmark size={20} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 sm:flex">
          {links.map((link) => {
            // `/pricing#questions` and `/pricing` are the same page; only the
            // bare route claims the current-page marker, so the two never both
            // light up.
            const current = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "rounded-sm text-[0.9rem] transition-colors duration-150 ease-out hover:text-text",
                  current ? "text-text" : "text-muted",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/early-access" className={btn({ size: "sm" })}>
          Request access
        </Link>
      </div>
    </header>
  );
}
