import { getSupabase } from "./supabase";
import { toClient, type Client } from "./database";

export type ClientSortField = "cooperation_start_date" | "updated_at";

/** Lean select – jen ID a název. Vhodné pro rozbalovací seznamy. */
export async function getClientRefs(): Promise<{ id: string; name: string }[]> {
  const { data, error } = await getSupabase().from("clients").select("id, name");
  if (error) throw error;
  return (data ?? []).map((row) => {
    const r = row as { id: string; name: string };
    return { id: r.id, name: r.name };
  });
}

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
