"""
ChainOpt — Supabase Connection Test
------------------------------------
1. pip install supabase
2. Fill in your SUPABASE_URL and SUPABASE_ANON_KEY below
3. Run: python test_supabase.py

What this script does:
  - Connects to your Supabase project
  - Inserts one fake pipeline_calls row
  - Reads it back to confirm it was written
  - Deletes it so your table stays clean
  - Prints a clear pass/fail at each step
"""

import sys
import uuid
from datetime import datetime, timezone

from supabase import create_client, Client

# ── ✏️  Fill these in ────────────────────────────────────────────────────────
SUPABASE_URL  = "_insert_here_"
SUPABASE_ANON_KEY = "_insert_here_"

# For this test we also need a real user_id, because pipeline_calls.user_id
# references auth.users and RLS is enabled.
#
# Option A (easiest): go to Supabase dashboard → Authentication → Users →
#   "Add user" → create a test user → copy their UUID here.
#
# Option B: use your service_role key instead of the anon key above.
#   The service_role key bypasses RLS so you don't need a real user.
#   Find it in: Supabase dashboard → API → service_role (secret).
#   ⚠️  Never ship the service_role key in client code. Test use only.
TEST_USER_ID = "_insert_here_"
# ── ─────────────────────────────────────────────────────────────────────────


def banner(text: str) -> None:
    print(f"\n{'─' * 50}")
    print(f"  {text}")
    print(f"{'─' * 50}")


def check(label: str, condition: bool) -> None:
    icon = "✅" if condition else "❌"
    print(f"  {icon}  {label}")
    if not condition:
        print("\nTest failed. Fix the issue above and re-run.")
        sys.exit(1)


def main() -> None:
    # ── 1. Connect ────────────────────────────────────────────────────────────
    banner("Step 1: Connecting to Supabase")

    if "YOUR_PROJECT_ID" in SUPABASE_URL or "your-anon-key" in SUPABASE_ANON_KEY:
        print("  ❌  You haven't filled in SUPABASE_URL / SUPABASE_ANON_KEY yet.")
        sys.exit(1)

    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        print("  ✅  Client created successfully")
    except Exception as e:
        print(f"  ❌  Failed to create client: {e}")
        sys.exit(1)

    # ── 2. Insert a fake row ──────────────────────────────────────────────────
    banner("Step 2: Inserting a test row into pipeline_calls")

    test_session_id = f"test-session-{uuid.uuid4().hex[:8]}"

    fake_row = {
        "user_id":           TEST_USER_ID,
        "session_id":        test_session_id,
        "call_order":        1,
        "model":             "gpt-4o-mini",
        "provider":          "openai",
        "prompt_tokens":     120,
        "completion_tokens": 45,
        "cost_usd":          0.000210,
        "latency_ms":        843,
        "raw_prompt":        "Summarize the following text in one sentence: ...",
        "raw_response":      "The text discusses the importance of testing.",
        "inferred_purpose":  "summarization",
    }

    try:
        result = supabase.table("pipeline_calls").insert(fake_row).execute()
        inserted = result.data
        check("Insert returned data", bool(inserted))
        inserted_id = inserted[0]["id"]
        print(f"       Inserted row id: {inserted_id}")
        print(f"       Session id:      {test_session_id}")
    except Exception as e:
        print(f"  ❌  Insert failed: {e}")
        print("""
  Common reasons:
    - TEST_USER_ID doesn't exist in auth.users  →  create a test user in the
      Supabase dashboard (Authentication → Users → Add user)
    - RLS is blocking the insert               →  use the service_role key
      instead of the anon key for this test
    - Table doesn't exist yet                  →  run the schema SQL first
        """)
        sys.exit(1)

    # ── 3. Read it back ───────────────────────────────────────────────────────
    banner("Step 3: Reading the row back")

    try:
        read_result = (
            supabase.table("pipeline_calls")
            .select("*")
            .eq("id", inserted_id)
            .execute()
        )
        rows = read_result.data
        check("Row found in database",        len(rows) == 1)
        row = rows[0]
        check("model field correct",          row["model"] == "gpt-4o-mini")
        check("provider field correct",       row["provider"] == "openai")
        check("prompt_tokens correct",        row["prompt_tokens"] == 120)
        check("cost_usd stored correctly",    float(row["cost_usd"]) == 0.000210)
        check("latency_ms correct",           row["latency_ms"] == 843)
        check("raw_prompt stored",            "Summarize" in row["raw_prompt"])
        check("inferred_purpose correct",     row["inferred_purpose"] == "summarization")
        check("created_at auto-populated",    row["created_at"] is not None)
        print(f"\n  Row contents:")
        for k, v in row.items():
            if k not in ("prompt_embedding", "response_embedding"):  # skip null vectors
                print(f"    {k:<28} {v}")
    except Exception as e:
        print(f"  ❌  Read failed: {e}")
        sys.exit(1)

    # ── 4. Clean up ───────────────────────────────────────────────────────────
    banner("Step 4: Cleaning up test row")

    try:
        supabase.table("pipeline_calls").delete().eq("id", inserted_id).execute()
        # Verify deletion
        verify = supabase.table("pipeline_calls").select("id").eq("id", inserted_id).execute()
        check("Row successfully deleted", len(verify.data) == 0)
    except Exception as e:
        print(f"  ❌  Cleanup failed: {e}")
        print(f"       You can manually delete row {inserted_id} in the Table Editor.")
        sys.exit(1)

    # ── Done ──────────────────────────────────────────────────────────────────
    banner("All tests passed ✅")
    print("""
  Your Supabase project is correctly set up and your schema is working.
  The pipeline_calls table accepted a write and returned it accurately.

  Next step: build the httpx transport interceptor that writes real
  LLM call data to this table automatically.
    """)


if __name__ == "__main__":
    main()