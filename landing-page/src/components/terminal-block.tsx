import { cn } from "@/lib/utils";

function TerminalLine({ command }: { command: string }) {
  return (
    <div className="flex gap-3 font-terminal text-sm leading-6">
      <span className="shrink-0 text-emerald-500 select-none" aria-hidden>
        $
      </span>
      <code className="text-white">{command}</code>
    </div>
  );
}

type TerminalBlockProps = {
  commands: string | string[];
  className?: string;
};

export function TerminalBlock({ commands, className }: TerminalBlockProps) {
  const lines = typeof commands === "string" ? [commands] : commands;

  return (
    <div
      className={cn(
        "w-full space-y-2 border border-zinc-800 bg-[#111111] px-5 py-4",
        className,
      )}
    >
      {lines.map((command) => (
        <TerminalLine key={command} command={command} />
      ))}
    </div>
  );
}
