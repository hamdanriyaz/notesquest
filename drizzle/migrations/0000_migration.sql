CREATE TABLE public.leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 30),
  major text NOT NULL CHECK (char_length(btrim(major)) BETWEEN 1 AND 40),
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100000),
  accuracy integer NOT NULL CHECK (accuracy BETWEEN 0 AND 100),
  topic text NOT NULL CHECK (char_length(topic) <= 80),
  won boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.leaderboard TO anon, authenticated;
GRANT ALL ON public.leaderboard TO service_role;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit a score" ON public.leaderboard FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX leaderboard_score_idx ON public.leaderboard (score DESC);