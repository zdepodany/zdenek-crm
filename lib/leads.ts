import { getSupabase } from "./supabase";
import { toLead, type Lead } from "./database";

export type LeadSortField = "updated_at" | "last_contact";

export async function getLeads(
  statusFilter?: string,
  sortBy: LeadSortField = "updated_at",
  sortOrder: "asc" | "desc" = "desc"
): Promise<Lead[]> {
  let query = getSupabase().from("leads").select("*");

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const dbSortBy = sortBy === "last_contact" ? "updated_at" : sortBy;
  query = query.order(dbSortBy, {
    ascending: sortOrder === "asc",
    nullsFirst: false,
  });

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

/** SQL GROUP BY přes RPC – agregace proběhne v DB, vrátí jen výsledný objekt. */
export async function getLeadCounts(): Promise<
  Record<string, number> & { total: number }
> {
  const { data, error } = await getSupabase().rpc("get_lead_counts");
  if (error) throw error;
  return (data ?? { total: 0 }) as Record<string, number> & { total: number };
}
