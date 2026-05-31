export function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-[var(--content-x)] py-8">
      <div className="mx-auto flex w-full max-w-[var(--content-max)] flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="font-terminal text-sm text-white">ChainOpt</span>
          <nav className="flex gap-6" aria-label="Footer">
            <a
              href="#"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Docs
            </a>
          </nav>
        </div>
        <p className="text-xs text-zinc-600">
          Built by an independent developer. Not affiliated with LangChain or any
          LLM provider.
        </p>
      </div>
    </footer>
  );
}
