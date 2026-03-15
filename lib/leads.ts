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

export async function getLeadCounts(): Promise<
  Record<string, number> & { total: number }
> {
  const db = getSupabase();
  const statuses = [
    "new",
    "contacted",
    "replied",
    "proposal_sent",
    "negotiation",
    "won",
    "lost",
    "inactive",
  ];

  const [totalRes, ...statusRes] = await Promise.all([
    db.from("leads").select("id", { count: "exact", head: true }),
    ...statuses.map((s) =>
      db.from("leads").select("id", { count: "exact", head: true }).eq("status", s)
    ),
  ]);

  const counts: Record<string, number> = {
    total: totalRes.count ?? 0,
  };
  statuses.forEach((s, i) => {
    counts[s] = statusRes[i].count ?? 0;
  });

  return counts as Record<string, number> & { total: number };
}
