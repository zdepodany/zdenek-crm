import { getSupabase } from "./supabase";
import {
  toWebsite,
  toWebEvent,
  type Website,
  type WebsiteWithClient,
  type WebEvent,
} from "./database";

type WebsiteRowWithClient = {
  id: string;
  client_id: string;
  creation_price: number | null;
  hosting: string;
  domain_provider: string;
  url: string;
  github_repo: string;
  updated_at: string;
  clients: { name: string } | null;
};

type WebsiteRefRow = { id: string; url: string; clients: { name: string } | { name: string }[] | null };

/** Lean select – jen ID, URL a jméno klienta. Vhodné pro rozbalovací seznamy. */
export async function getWebsiteRefs(): Promise<
  { id: string; url: string; clientName: string }[]
> {
  const { data, error } = await getSupabase()
    .from("websites")
    .select("id, url, clients(name)");
  if (error) throw error;
  return (data ?? []).map((row) => {
    const r = row as unknown as WebsiteRefRow;
    const clientsField = r.clients;
    const clientName = Array.isArray(clientsField)
      ? (clientsField[0]?.name ?? "")
      : (clientsField?.name ?? "");
    return { id: r.id, url: r.url, clientName };
  });
}

export async function getWebsiteCount(): Promise<number> {
  const { count, error } = await getSupabase()
    .from("websites")
    .select("id", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

/** Součet pouze z akcí „Fakturace“ na webech (ne z ceny vytvoření webu). */
export async function getTotalEarnings(): Promise<number> {
  const { data, error } = await getSupabase()
    .from("web_events")
    .select("amount")
    .eq("type", "billing");

  if (error) throw error;

  let total = 0;
  for (const row of data ?? []) {
    const amount = (row as { amount: number | null }).amount;
    if (amount != null) total += Number(amount);
  }
  return total;
}

export type WebsiteSortField = "updated_at" | "created_at";

export async function getWebsites(
  sortBy: WebsiteSortField = "updated_at",
  sortOrder: "asc" | "desc" = "desc"
): Promise<WebsiteWithClient[]> {
  const { data, error } = await getSupabase()
    .from("websites")
    .select("*, clients(name)")
    .order(sortBy, {
      ascending: sortOrder === "asc",
      nullsFirst: false,
    });

  if (error) throw error;
  return (data ?? []).map((row: WebsiteRowWithClient) =>
    toWebsite(row, row.clients?.name ?? "")
  ) as WebsiteWithClient[];
}

export async function getWebsiteById(id: string): Promise<(Website & { clientName: string }) | null> {
  const { data, error } = await getSupabase()
    .from("websites")
    .select("*, clients(name)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  if (!data) return null;
  const row = data as WebsiteRowWithClient;
  return toWebsite(row, row.clients?.name ?? "") as Website & { clientName: string };
}

export async function getWebsitesByClientId(clientId: string): Promise<Website[]> {
  const { data, error } = await getSupabase()
    .from("websites")
    .select("*")
    .eq("client_id", clientId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => toWebsite(row as Parameters<typeof toWebsite>[0]) as Website);
}

export async function getWebEvents(webId: string): Promise<WebEvent[]> {
  const { data, error } = await getSupabase()
    .from("web_events")
    .select("*")
    .eq("web_id", webId)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => toWebEvent(row as Parameters<typeof toWebEvent>[0]));
}
