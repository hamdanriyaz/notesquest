import { supabase } from "@/integrations/supabase/client";
export interface Entry { id?: string; name: string; major: string; score: number; accuracy: number; topic: string; won?: boolean; }
/** Global board shared by every player. Starts empty; only real submitted runs. */
export async function getBoard(limit = 50): Promise<Entry[]> {
  const { data, error } = await supabase.from("leaderboard").select("id,name,major,score,accuracy,topic,won").order("score", { ascending: false }).limit(limit);
  if (error) throw error;
  return data ?? [];
}
export async function addEntry(e: Entry): Promise<Entry> {
  const { data, error } = await supabase.from("leaderboard").insert({ name: e.name.trim().slice(0, 30), major: e.major.trim().slice(0, 40), score: Math.round(e.score), accuracy: e.accuracy, topic: e.topic.slice(0, 80), won: !!e.won }).select("id,name,major,score,accuracy,topic,won").single();
  if (error) throw error;
  return data;
}
