"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "./supabase";

export type LeadFormData = {
  companyName: string;
  city: string;
  website: string;
  contact: string;
  contactChannel: string;
  status: string;
  notes: string;
};

export async function createLead(data: LeadFormData) {
  const city = data.city?.trim() || null;
  const { error } = await getSupabase().from("leads").insert({
    company_name: data.companyName,
    city,
    website: data.website,
    contact: data.contact,
    contact_channel: data.contactChannel,
    status: data.status,
    notes: data.notes,
  });

  if (error) throw error;
  revalidatePath("/leads");
  revalidatePath("/");
}

export async function updateLead(id: string, data: LeadFormData) {
  const city = data.city?.trim() || null;
  const { error } = await getSupabase()
    .from("leads")
    .update({
      company_name: data.companyName,
      city,
      website: data.website,
      contact: data.contact,
      contact_channel: data.contactChannel,
      status: data.status,
      notes: data.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  revalidatePath("/");
}

export async function deleteLead(id: string) {
  const { error } = await getSupabase().from("leads").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/leads");
  revalidatePath("/");
}

export async function deleteLeadAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await deleteLead(id);
}

// Client actions
export type ClientFormData = {
  name: string;
  contactEmail: string;
  contactPerson: string;
  phone: string;
  web: string;
  ico: string;
  cooperationStartDate: string;
};

export async function createClient(data: ClientFormData) {
  const { error } = await getSupabase().from("clients").insert({
    name: data.name,
    contact_email: data.contactEmail,
    contact_person: data.contactPerson,
    phone: data.phone,
    web: data.web,
    ico: data.ico,
    cooperation_start_date: data.cooperationStartDate || null,
  });

  if (error) throw error;
  revalidatePath("/clients");
}

export async function updateClient(id: string, data: ClientFormData) {
  const { error } = await getSupabase()
    .from("clients")
    .update({
      name: data.name,
      contact_email: data.contactEmail,
      contact_person: data.contactPerson,
      phone: data.phone,
      web: data.web,
      ico: data.ico,
      cooperation_start_date: data.cooperationStartDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
}

export async function deleteClient(id: string) {
  const { error } = await getSupabase().from("clients").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/clients");
}

export async function deleteClientAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await deleteClient(id);
}

// Website actions
export type WebsiteFormData = {
  clientId: string;
  creationPrice: string;
  hosting: string;
  domainProvider: string;
  url: string;
  githubRepo: string;
};

export async function createWebsite(data: WebsiteFormData) {
  const { error } = await getSupabase().from("websites").insert({
    client_id: data.clientId,
    creation_price: data.creationPrice ? parseFloat(data.creationPrice) : null,
    hosting: data.hosting,
    domain_provider: data.domainProvider || "",
    url: data.url,
    github_repo: data.githubRepo,
  });

  if (error) throw error;
  revalidatePath("/websites");
  revalidatePath("/clients");
}

export async function updateWebsite(id: string, data: WebsiteFormData) {
  const { error } = await getSupabase()
    .from("websites")
    .update({
      client_id: data.clientId,
      creation_price: data.creationPrice ? parseFloat(data.creationPrice) : null,
      hosting: data.hosting,
      domain_provider: data.domainProvider || "",
      url: data.url,
      github_repo: data.githubRepo,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/websites");
  revalidatePath(`/websites/${id}`);
  revalidatePath("/clients");
}

export async function deleteWebsite(id: string) {
  const { error } = await getSupabase().from("websites").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/websites");
  revalidatePath("/clients");
}

export async function deleteWebsiteAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await deleteWebsite(id);
}

// Web event actions
export type WebEventFormData = {
  type: string;
  date: string;
  link: string;
  note: string;
  amount: string;
};

export async function createWebEvent(webId: string, data: WebEventFormData) {
  const payload: Record<string, unknown> = {
    web_id: webId,
    type: data.type,
    date: data.date,
  };
  if (data.link) payload.link = data.link;
  if (data.note) payload.note = data.note;
  if (data.amount) payload.amount = parseFloat(data.amount);

  const { error } = await getSupabase().from("web_events").insert(payload);

  if (error) throw error;
  revalidatePath(`/websites/${webId}`);
  revalidatePath("/clients");
}

export async function deleteWebEvent(id: string, webId: string) {
  const { error } = await getSupabase().from("web_events").delete().eq("id", id);

  if (error) throw error;
  revalidatePath(`/websites/${webId}`);
  revalidatePath("/clients");
}

export async function deleteWebEventAction(formData: FormData) {
  const id = formData.get("id") as string;
  const webId = formData.get("webId") as string;
  if (id && webId) await deleteWebEvent(id, webId);
}

// Lead event actions
export type LeadEventFormData = {
  type: string;
  date: string;
  method: string;
  note: string;
  webId: string;
  clientId: string;
};

export async function createLeadEvent(leadId: string, data: LeadEventFormData) {
  const db = getSupabase();
  const { data: maxRow } = await db
    .from("lead_events")
    .select("sort_order")
    .eq("lead_id", leadId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = ((maxRow as { sort_order?: number } | null)?.sort_order ?? -1) + 1;

  const payload: Record<string, unknown> = {
    lead_id: leadId,
    type: data.type,
    date: data.date,
    sort_order: nextOrder,
  };
  if (data.method) payload.method = data.method;
  if (data.note) payload.note = data.note;
  if (data.webId) payload.web_id = data.webId;
  if (data.clientId) payload.client_id = data.clientId;

  const { error } = await db.from("lead_events").insert(payload);

  if (error) throw error;
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
}

export async function reorderLeadEvents(leadId: string, orderedEventIds: string[]) {
  const updates = orderedEventIds.map((id, index) => ({
    id,
    lead_id: leadId,
    sort_order: index,
  }));
  const { error } = await getSupabase().rpc("reorder_lead_events", {
    updates: JSON.stringify(updates),
  });
  if (error) throw error;
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
}

export async function deleteLeadEvent(id: string, leadId: string) {
  const { error } = await getSupabase().from("lead_events").delete().eq("id", id);

  if (error) throw error;
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
}

export async function deleteLeadEventAction(formData: FormData) {
  const id = formData.get("id") as string;
  const leadId = formData.get("leadId") as string;
  if (id && leadId) await deleteLeadEvent(id, leadId);
}
