import { Wordmark } from "@/components/wordmark";

export function Footer() {
  return (
    <footer className="py-10">
      <div className="wrap flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Wordmark size={18} />

        <p className="max-w-[52ch] font-mono text-[0.72rem] leading-relaxed text-muted">
          built by an independent developer · not affiliated with langchain,
          openai, anthropic, or any other provider named on this page
        </p>
      </div>
    </footer>
  );
}
