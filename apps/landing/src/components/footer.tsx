import Link from "next/link";

import { Wordmark } from "@/components/wordmark";
import { contactEmail, githubUrl } from "@/lib/site";

/**
 * One entry per page, and the label each page's own call to action uses. The
 * footer said "Early access" while every button on the site said "Request
 * access", and carried a second entry for the FAQ that landed halfway down the
 * pricing page, so four links pointed at three places under two names.
 */
const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/early-access", label: "Request access" },
];

export function Footer() {
  return (
    <footer className="py-12">
      <div className="wrap flex flex-col gap-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label="ChainOpt home">
            <Wordmark size={18} />
          </Link>

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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          {/* First person, like the rest of the site. It used to switch to the
              third person here, so the page introduced itself as one developer
              and then described that developer as someone else. */}
          <p className="max-w-[56ch] text-[0.85rem] text-muted">
            I build ChainOpt on my own. It is not affiliated with LangChain,
            OpenAI, Anthropic, or any other provider named on this site.
          </p>

          {/* Rendered only when configured, so there is never a contact link
              pointing nowhere. */}
          {contactEmail || githubUrl ? (
            <p className="flex flex-wrap gap-5 text-[0.85rem]">
              {contactEmail ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="rounded-sm text-muted transition-colors duration-150 ease-out hover:text-text"
                >
                  Email
                </a>
              ) : null}
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-sm text-muted transition-colors duration-150 ease-out hover:text-text"
                >
                  GitHub
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
