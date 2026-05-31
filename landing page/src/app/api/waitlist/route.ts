import { createServerClient } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  if (!email || !EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: "This email is already on the waitlist." },
        { status: 409 },
      );
    }

    console.error("waitlist insert failed:", error);
    return Response.json(
      { error: "Could not add you to the waitlist. Try again later." },
      { status: 500 },
    );
  }

  return Response.json({ success: true });
}
