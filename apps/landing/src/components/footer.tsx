import Link from "next/link";

import { Wordmark } from "@/components/wordmark";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/early-access", label: "Early access" },
];

export function Footer() {
  return (
    <footer className="py-12">
      <div className="wrap flex flex-col gap-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label="chainopt home">
            <Wordmark size={18} />
          </Link>

          {/* The nav hides below 640px, so the footer is where a phone gets
              its way around the site. */}
          <nav aria-label="Footer" className="flex flex-wrap gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm text-[0.9rem] text-muted transition-colors duration-150 ease-out hover:text-text"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="max-w-[52ch] font-mono text-[0.72rem] leading-relaxed text-muted">
          built by an independent developer · not affiliated with langchain,
          openai, anthropic, or any other provider named on this page
        </p>
      </div>
    </footer>
  );
}
