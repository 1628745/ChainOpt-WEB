"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { btn } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

/**
 * One entry per destination. The FAQ sits at the foot of the pricing page --
 * the questions people ask are mostly about cost and about what leaves their
 * machine -- and it briefly had a nav entry of its own pointing there. Two
 * tabs that land on the same page promise two places and deliver one, so the
 * duplicate is gone. The footer still deep-links to it, where a list of links
 * reads as a list rather than as a set of destinations.
 */
const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
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
