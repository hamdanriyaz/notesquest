DROP POLICY IF EXISTS "Anyone can submit a score" ON public.leaderboard;
CREATE POLICY "Players can submit a valid score" ON public.leaderboard
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 30
  AND char_length(btrim(major)) BETWEEN 1 AND 40
  AND char_length(btrim(topic)) BETWEEN 1 AND 80
  AND score BETWEEN 0 AND 100000
  AND accuracy BETWEEN 0 AND 100
  AND created_at BETWEEN now() - interval '1 minute' AND now() + interval '1 minute'
);