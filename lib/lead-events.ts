import { getSupabase } from "./supabase";
import { toLeadEvent, type LeadEvent } from "./database";

/** Nejnovější datum akce u poptávky (všechny typy akcí = poslední kontakt v přehledu). */
export async function getLastContactDates(
  leadIds: string[]
): Promise<Record<string, Date>> {
  if (leadIds.length === 0) return {};

  const { data, error } = await getSupabase()
    .from("lead_events")
    .select("lead_id, date")
    .in("lead_id", leadIds)
    .order("date", { ascending: false });

  if (error) throw error;

  const result: Record<string, Date> = {};
  for (const row of data ?? []) {
    const r = row as { lead_id: string; date: string };
    if (!result[r.lead_id]) {
      result[r.lead_id] = new Date(r.date);
    }
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
  return (data ?? []).map((row) => toLeadEvent(row as Parameters<typeof toLeadEvent>[0]));
}
