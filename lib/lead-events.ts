import { getSupabase } from "./supabase";
import { toLeadEvent, type LeadEvent } from "./database";

export async function getLeadEvents(leadId: string): Promise<LeadEvent[]> {
  const { data, error } = await getSupabase()
    .from("lead_events")
    .select("*")
    .eq("lead_id", leadId)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => toLeadEvent(row as Parameters<typeof toLeadEvent>[0]));
}
