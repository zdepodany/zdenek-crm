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
  clients: { name: string } | null;
};

export async function getWebsiteCount(): Promise<number> {
  const { count, error } = await getSupabase()
    .from("websites")
    .select("id", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

export async function getTotalEarnings(): Promise<number> {
  const db = getSupabase();

  const [creationRes, billingRes] = await Promise.all([
    db.from("websites").select("creation_price"),
    db.from("web_events").select("amount").eq("type", "billing"),
  ]);

  let total = 0;
  for (const row of creationRes.data ?? []) {
    const price = (row as { creation_price: number | null }).creation_price;
    if (price != null) total += Number(price);
  }
  for (const row of billingRes.data ?? []) {
    const amount = (row as { amount: number | null }).amount;
    if (amount != null) total += Number(amount);
  }
  return total;
}

export async function getWebsites(): Promise<WebsiteWithClient[]> {
  const { data, error } = await getSupabase()
    .from("websites")
    .select("*, clients(name)")
    .order("updated_at", { ascending: false });

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
