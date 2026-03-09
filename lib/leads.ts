import { getSupabase } from "./supabase";
import { toLead, type Lead } from "./database";

export async function getLeads(statusFilter?: string): Promise<Lead[]> {
  let query = getSupabase()
    .from("leads")
    .select("*")
    .order("updated_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toLead);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const { data, error } = await getSupabase()
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? toLead(data) : null;
}

export async function getLeadCounts(): Promise<{
  total: number;
  contacted: number;
  replied: number;
  won: number;
}> {
  const db = getSupabase();
  const [totalRes, contactedRes, repliedRes, wonRes] = await Promise.all([
    db.from("leads").select("id", { count: "exact", head: true }),
    db.from("leads").select("id", { count: "exact", head: true }).eq("status", "contacted"),
    db.from("leads").select("id", { count: "exact", head: true }).eq("status", "replied"),
    db.from("leads").select("id", { count: "exact", head: true }).eq("status", "won"),
  ]);

  return {
    total: totalRes.count ?? 0,
    contacted: contactedRes.count ?? 0,
    replied: repliedRes.count ?? 0,
    won: wonRes.count ?? 0,
  };
}
