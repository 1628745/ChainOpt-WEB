"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

export function CtaWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: { error?: string } = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list. I'll be in touch soon.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <section
      id="early-access"
      className="border-t border-zinc-800 px-[var(--content-x)] py-24"
    >
      <div className="mx-auto w-full max-w-[var(--content-max)]">
        <h2 className="max-w-2xl text-2xl font-medium tracking-tight text-white">
          ChainOpt is in private beta
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
          I&apos;m working with a small group of developers to validate the
          analysis engine on real pipelines before a wider release. If you&apos;re
          spending meaningfully on LLM API costs and want early access, reach
          out.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
            disabled={status === "loading" || status === "success"}
            className={cn(
              "h-11 min-w-0 flex-1 border border-zinc-700 bg-zinc-900 px-4 font-sans text-sm text-white",
              "placeholder:text-zinc-500",
              "outline-none focus-visible:border-[#3b82f6] focus-visible:ring-1 focus-visible:ring-[#3b82f6]",
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="h-11 shrink-0 rounded-none px-6 text-sm font-medium sm:w-auto"
          >
            {status === "loading" ? "Sending…" : "Request Access"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-zinc-500">
          No spam. I&apos;ll reply personally within a few days.
        </p>

        {message ? (
          <p
            className={cn(
              "mt-3 text-sm",
              status === "success" ? "text-zinc-300" : "text-red-400",
            )}
            role="status"
          >
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
