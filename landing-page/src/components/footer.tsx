export function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-[var(--content-x)] py-8">
      <div className="mx-auto flex w-full max-w-[var(--content-max)] flex-col gap-4">
        <span className="font-terminal text-sm text-white">ChainOpt</span>
        <p className="text-xs text-zinc-600">
          Built by an independent developer. Not affiliated with LangChain or any
          LLM provider.
        </p>
      </div>
    </footer>
  );
}
