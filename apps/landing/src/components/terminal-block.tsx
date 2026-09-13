"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type Line = { command: string; output?: string[] };

type TerminalBlockProps = {
  /** One command, or a sequence of commands with the output each produced. */
  lines: string | Line[];
  className?: string;
};

function normalize(lines: string | Line[]): Line[] {
  return typeof lines === "string" ? [{ command: lines }] : lines;
}

/**
 * A quoted terminal session.
 *
 * One copy button per command, on every command. A single button per block
 * meant that a block with two commands copied both of them at once and a block
 * with none looked broken, so which line you could take away depended on how
 * the block happened to be authored.
 */
export function TerminalBlock({ lines, className }: TerminalBlockProps) {
  const rows = normalize(lines);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(command: string) {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(command);
      window.setTimeout(
        () => setCopied((c) => (c === command ? null : c)),
        1800,
      );
    } catch {
      // Clipboard unavailable (insecure origin, denied permission). The text
      // is selectable, so stay silent rather than raising an error.
    }
  }

  return (
    <div
      className={cn(
        "rounded-term border border-line bg-surface px-4 py-3.5 font-mono text-[0.8rem] leading-[1.7] sm:text-[0.85rem]",
        className,
      )}
    >
      {rows.map((row) => (
        <div key={row.command}>
          <p className="flex items-baseline gap-2.5">
            <span aria-hidden className="shrink-0 select-none text-teal">
              $
            </span>
            <code className="min-w-0 flex-1 text-text">{row.command}</code>
            <button
              type="button"
              onClick={() => copy(row.command)}
              className="shrink-0 rounded-inner border border-line px-2 py-0.5 text-[0.7rem] text-muted transition-colors duration-150 ease-out hover:border-amber hover:text-amber"
            >
              {copied === row.command ? "copied" : "copy"}
              <span className="sr-only"> {row.command}</span>
            </button>
          </p>
          {row.output?.map((line) => (
            <p key={line} className="pl-[1.4em] whitespace-pre-wrap text-muted">
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
