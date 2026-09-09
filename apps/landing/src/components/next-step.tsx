import Link from "next/link";

import { btn } from "@/components/ui/button";

/**
 * The hand-off at the foot of a page.
 *
 * A page that ends in a footer is a dead end. On a site split across routes,
 * every page except the last one owes the reader the obvious next move, or
 * they have to go back up to the nav to find it themselves.
 */
export function NextStep({
  line,
  primary,
  secondary,
}: {
  line: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="border-b border-line py-14">
      <div className="wrap flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[46ch] text-[1.05rem] text-text">{line}</p>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={primary.href} className={btn()}>
            {primary.label}
          </Link>
          {secondary ? (
            <Link href={secondary.href} className={btn({ variant: "ghost" })}>
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
