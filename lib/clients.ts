import { getSupabase } from "./supabase";
import { toClient, type Client } from "./database";

export type ClientSortField = "cooperation_start_date" | "updated_at";

export async function getClients(
  sortBy: ClientSortField = "cooperation_start_date",
  sortOrder: "asc" | "desc" = "desc"
): Promise<Client[]> {
  const { data, error } = await getSupabase()
    .from("clients")
    .select("*")
    .order(sortBy, {
      ascending: sortOrder === "asc",
      nullsFirst: false,
    });

  if (error) throw error;
  return (data ?? []).map(toClient);
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await getSupabase()
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? toClient(data) : null;
}
