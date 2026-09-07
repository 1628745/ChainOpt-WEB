"use client";

import { SectionGlow } from "@/components/section-glow";
import { type FormEvent, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";
import { btn } from "@/components/ui/button";
import { bookingUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function CtaWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [botField, setBotField] = useState("");
  const inputId = useId();
  const messageId = useId();

  const pending = status === "loading";
  const done = status === "success";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company_website: botField }),
      });

      const data: { error?: string } = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "That didn't go through. Try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list. I'll be in touch soon.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("That didn't go through. Check your connection and try again.");
    }
  }

  return (
    <section id="early-access" className="section relative isolate overflow-x-clip border-b border-line">
      <div className="wrap">
        <SectionGlow />
        <div className="max-w-[720px] rounded-feature border border-line panel-surface p-8 sm:p-10">
          <Kicker>early access</Kicker>
          <h2 className="mt-5">ChainOpt is in private beta</h2>

          <p className="mt-5 max-w-[58ch] text-[0.98rem] text-muted">
            I&apos;m looking for a small group of testers to run the analysis
            engine against real pipelines before a wider release. If your LLM
            bill is large enough to be worth reducing, put your email in and
            I&apos;ll get you set up.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <label htmlFor={inputId} className="sr-only">
              Work email
            </label>

            <div
              aria-hidden
              className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
            >
              <label htmlFor={`${inputId}-hp`}>Company website</label>
              <input
                id={`${inputId}-hp`}
                type="text"
                name="company_website"
                value={botField}
                onChange={(event) => setBotField(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id={inputId}
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
                disabled={pending || done}
                aria-describedby={message ? messageId : undefined}
                aria-invalid={status === "error" || undefined}
                className={cn(
                  "min-w-0 flex-1 rounded-btn border border-line-strong bg-ink px-4 py-[13px] text-[0.95rem] text-text",
                  "placeholder:text-muted",
                  "transition-colors duration-150 ease-out focus:border-amber",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  status === "error" && "border-amber",
                )}
              />
              <Button type="submit" disabled={pending || done}>
                {pending ? "Sending" : done ? "Sent" : "Request access"}
              </Button>
            </div>
          </form>

          <p className="mt-4 font-mono text-[0.74rem] text-muted">
            no newsletter · no sharing your address · replies are personal
          </p>

          {/*
            For a tool at this stage every qualified visitor is worth a
            conversation, and some people would rather talk than wait for a
            reply. Absent entirely when no link is configured -- an "or" with
            nothing after it is worse than no branch at all.

            Linked, not embedded: a scheduling iframe is a large third-party
            bundle and a tracker on a page whose whole argument is that
            ChainOpt does not phone home.
          */}
          {bookingUrl ? (
            <>
              <div
                aria-hidden
                className="my-7 flex items-center gap-4 font-mono text-[0.74rem] text-muted"
              >
                <span className="h-px flex-1 bg-line" />
                or
                <span className="h-px flex-1 bg-line" />
              </div>

              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={btn({ variant: "ghost" })}
              >
                Book a 20-min walkthrough
              </a>
            </>
          ) : null}

          <p
            id={messageId}
            role={status === "error" ? "alert" : "status"}
            aria-live={status === "error" ? "assertive" : "polite"}
            className={cn(
              "mt-4 font-mono text-[0.8rem]",
              !message && "sr-only",
              status === "error" ? "text-amber" : "text-teal",
            )}
          >
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
