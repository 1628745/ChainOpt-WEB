"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

import { btn } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

/**
 * One entry per destination. The FAQ sits at the foot of the pricing page, and
 * it briefly had a nav entry of its own pointing there. Two tabs that land on
 * the same page promise two places and deliver one, so the duplicate is gone.
 *
 * Below 640px these used to be hidden with nothing to open them, which left a
 * phone with a logo, a button, and no way to reach either other page except
 * the footer. They now live behind a menu that says so.
 */
const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

const CTA = { href: "/early-access", label: "Request access" };

export function SiteHeader() {
  const pathname = usePathname();
  const menuId = useId();
  /*
   * The menu remembers which page it was opened on rather than whether it is
   * open, so arriving anywhere else -- a link, the back button -- closes it
   * without an effect having to notice the route changed and correct the
   * state afterwards.
   */
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  /*
   * The header's own call to action is the only way in, so it is on every page
   * except the one it leads to. A button that reloads the page you are already
   * reading is a dead control in the most prominent slot on the site.
   */
  const onCta = pathname === CTA.href;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-nav backdrop-blur-[12px]">
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="rounded-sm" aria-label="ChainOpt home">
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

        {onCta ? null : (
          <Link
            href={CTA.href}
            className={cn(btn({ size: "sm" }), "hidden sm:inline-flex")}
          >
            {CTA.label}
          </Link>
        )}

        {/* The control names what it does: it opens the menu, then closes
            it. The current page is marked exactly as the desktop nav marks
            it, full brightness against muted; amber here would have made the
            page you are on look like a warning. */}
        <button
          type="button"
          onClick={() => setOpenFor(open ? null : pathname)}
          aria-expanded={open}
          aria-controls={menuId}
          className="-mr-1 flex items-center gap-2 rounded-btn border border-line-strong px-3 py-1.5 text-[0.85rem] text-text transition-colors duration-150 ease-out hover:border-amber hover:text-amber sm:hidden"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden>
            <path
              d={open ? "M2 2 12 10 M12 2 2 10" : "M1 2h12M1 6h12M1 10h12"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="border-t border-line bg-nav sm:hidden"
      >
        <nav aria-label="Main, mobile" className="wrap flex flex-col py-2">
          {links.map((link) => {
            const current = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "border-b border-line py-3 text-[0.95rem] transition-colors duration-150 ease-out hover:text-text",
                  current ? "text-text" : "text-muted",
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {onCta ? null : (
            <Link href={CTA.href} className={cn(btn(), "my-4")}>
              {CTA.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
