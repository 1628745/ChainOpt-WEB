import { createServerClient } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

/**
 * Per-instance rate limit. A serverless deployment runs several instances, so
 * this raises the cost of casual scripting rather than providing a hard cap.
 * Move to a shared store (Upstash, Redis) if the endpoint is ever targeted.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });

    if (hits.size > 5_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }

    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (rateLimited(clientKey(request))) {
    return Response.json(
      { error: "Too many attempts. Wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const record = typeof body === "object" && body !== null ? body : {};

  // Honeypot: a hidden field no person fills in. Accept silently so a bot
  // cannot tell the submission was discarded.
  if ("company_website" in record && record.company_website) {
    return Response.json({ success: true });
  }

  const email =
    "email" in record && typeof record.email === "string"
      ? record.email.trim().toLowerCase()
      : "";

  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return Response.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  let supabase;
  try {
    supabase = createServerClient();
  } catch {
    // Missing or malformed Supabase credentials in this environment.
    console.error("waitlist: Supabase client could not be created");
    return Response.json(
      { error: "The waitlist is unavailable right now. Try again later." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: "That address is already on the list." },
        { status: 409 },
      );
    }

    // Log the failure without the submitted address.
    console.error("waitlist insert failed", {
      code: error.code,
      message: error.message,
    });

    return Response.json(
      { error: "Could not add you to the list. Try again later." },
      { status: 500 },
    );
  }

  return Response.json({ success: true });
}
