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

export function TerminalBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-lg space-y-2 border border-zinc-800 bg-[#111111] px-5 py-4",
        className,
      )}
    >
      <TerminalLine command="pip install chainopt" />
      <TerminalLine command="chainopt analyze ./src" />
    </div>
  );
}
