import { getSupabase } from "./supabase";
import { toLeadEvent, type LeadEvent } from "./database";

/**
 * Nejnovější datum akce per poptávka.
 * Bez argumentu (nebo s undefined) vrátí data pro VŠECHNY poptávky – vhodné pro
 * paralelní volání, kdy ID nejsou předem known.
 */
export async function getLastContactDates(
  leadIds?: string[]
): Promise<Record<string, Date>> {
  if (leadIds !== undefined && leadIds.length === 0) return {};

  let query = getSupabase()
    .from("lead_events")
    .select("lead_id, date")
    .order("date", { ascending: false });

  if (leadIds !== undefined) {
    query = query.in("lead_id", leadIds);
  }

  const { data, error } = await query;

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
