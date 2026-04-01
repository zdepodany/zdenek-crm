import { getSupabase } from "./supabase";
import { toLeadEvent, type LeadEvent, type LeadEventRow } from "./database";

/**
 * Nejnovější datum akce per poptávka přes SQL MAX GROUP BY (RPC).
 * Volitelně filtrováno dle leadIds – bez parametru vrátí vše najednou.
 */
export async function getLastContactDates(
  leadIds?: string[]
): Promise<Record<string, Date>> {
  if (leadIds !== undefined && leadIds.length === 0) return {};

  const { data, error } = await getSupabase().rpc("get_last_contact_dates", {
    filter_lead_ids: leadIds ?? null,
  });

  if (error) throw error;

  const result: Record<string, Date> = {};
  for (const row of (data ?? []) as { lead_id: string; last_date: string }[]) {
    result[row.lead_id] = new Date(row.last_date);
  }
  return result;
}

export async function getLeadEvents(leadId: string): Promise<LeadEvent[]> {
  const { data, error } = await getSupabase()
    .from("lead_events")
    .select("*")
    .eq("lead_id", leadId)
    .order("sort_order", { ascending: true })
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => toLeadEvent(row as LeadEventRow));
}
