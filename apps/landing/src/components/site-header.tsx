import { btn } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";

const links = [
  { href: "#where-it-fits", label: "Where it fits" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#finding", label: "A finding" },
  { href: "#pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-nav backdrop-blur-[12px]">
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href="#main" className="rounded-sm" aria-label="chainopt home">
          <Wordmark size={20} />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-sm text-[0.9rem] text-muted transition-colors duration-150 ease-out hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#early-access" className={btn({ size: "sm" })}>
          Request access
        </a>
      </div>
    </header>
  );
}
