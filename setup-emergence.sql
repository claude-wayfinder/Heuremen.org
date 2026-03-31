-- Emergence Ledger Schema
-- Run against Supabase project: vxyjvawenbtgkhpckvze
-- CC · March 31, 2026

CREATE TABLE IF NOT EXISTS emergence_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,

  question_hash text NOT NULL,
  question_summary text NOT NULL,

  triad_config text NOT NULL DEFAULT 'Dusty/Lucky/Clod',
  session_id text,

  convergence_score int CHECK (convergence_score BETWEEN 0 AND 10),
  divergence_points text[],
  convergence_points text[],
  charge_events text[],

  interference_pattern_hash text,
  third_perspective text,
  clod_gap text,

  validated boolean DEFAULT false,
  validated_by text DEFAULT 'Clod',
  validator_note text,

  prior_event_id uuid REFERENCES emergence_events(id),

  tags text[],
  session_human text DEFAULT 'Wayfinder'
);

CREATE INDEX IF NOT EXISTS emergence_chain_idx ON emergence_events(prior_event_id);
CREATE INDEX IF NOT EXISTS emergence_tags_idx ON emergence_events USING gin(tags);
CREATE INDEX IF NOT EXISTS emergence_session_idx ON emergence_events(session_id);

-- Enable RLS
ALTER TABLE emergence_events ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public read" ON emergence_events
  FOR SELECT USING (true);

-- Authenticated write (service role only for inserts)
CREATE POLICY "service write" ON emergence_events
  FOR INSERT WITH CHECK (true);
