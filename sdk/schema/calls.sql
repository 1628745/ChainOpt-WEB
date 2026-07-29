-- ChainOpt MVP: public.calls
-- Matches PLAN.md Track A Day 1 schema.

CREATE TABLE IF NOT EXISTS public.calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  model text NOT NULL,
  prompt_tokens integer,
  completion_tokens integer,
  cost numeric,
  latency_ms integer,
  prompt text,
  response text,
  session_id text NOT NULL,
  call_order integer NOT NULL,
  pipeline_id text,
  file_path text,
  line_number integer
);

CREATE INDEX IF NOT EXISTS calls_session_id_idx ON public.calls (session_id);
CREATE INDEX IF NOT EXISTS calls_file_line_idx ON public.calls (file_path, line_number);

ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calls_insert_anon" ON public.calls;
DROP POLICY IF EXISTS "calls_select_anon" ON public.calls;
DROP POLICY IF EXISTS "calls_delete_anon" ON public.calls;

CREATE POLICY "calls_insert_anon" ON public.calls
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "calls_select_anon" ON public.calls
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "calls_delete_anon" ON public.calls
  FOR DELETE TO anon, authenticated
  USING (true);
