"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type Line = { command: string; output?: string[] };

type TerminalBlockProps = {
  /** One command, or a sequence of commands with the output each produced. */
  lines: string | Line[];
  className?: string;
  /** Static terminals (illustrations) drop the copy affordance. */
  copyable?: boolean;
};

function normalise(lines: string | Line[]): Line[] {
  return typeof lines === "string" ? [{ command: lines }] : lines;
}

export function TerminalBlock({
  lines,
  className,
  copyable = true,
}: TerminalBlockProps) {
  const rows = normalise(lines);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        rows.map((row) => row.command).join("\n"),
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (insecure origin, denied permission). The text
      // is selectable, so stay silent rather than raising an error.
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-term border border-line bg-surface px-4 py-3.5 font-mono text-[0.85rem] leading-[1.7]",
        className,
      )}
    >
      {copyable ? (
        <button
          type="button"
          onClick={copy}
          className="absolute top-2.5 right-2.5 rounded-inner border border-line px-2 py-1 font-mono text-[0.72rem] text-muted transition-colors duration-150 hover:border-amber hover:text-amber"
        >
          {copied ? "copied" : "copy"}
        </button>
      ) : null}

      <div className={cn("min-w-0", copyable && "pr-16")}>
        {rows.map((row) => (
          <div key={row.command}>
            <p className="flex gap-2.5">
              <span aria-hidden className="shrink-0 select-none text-teal">
                $
              </span>
              <code className="min-w-0 text-text">{row.command}</code>
            </p>
            {row.output?.map((line) => (
              <p key={line} className="pl-[1.4em] text-muted">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
