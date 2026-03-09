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
  contactedAt: string;
  notes: string;
};

export async function createLead(data: LeadFormData) {
  const { error } = await getSupabase().from("leads").insert({
    company_name: data.companyName,
    city: data.city,
    website: data.website,
    contact: data.contact,
    contact_channel: data.contactChannel,
    status: data.status,
    contacted_at: data.contactedAt || null,
    notes: data.notes,
  });

  if (error) throw error;
  revalidatePath("/leads");
  revalidatePath("/");
}

export async function updateLead(id: string, data: LeadFormData) {
  const { error } = await getSupabase()
    .from("leads")
    .update({
      company_name: data.companyName,
      city: data.city,
      website: data.website,
      contact: data.contact,
      contact_channel: data.contactChannel,
      status: data.status,
      contacted_at: data.contactedAt || null,
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
  "use server";
  const id = formData.get("id") as string;
  if (id) await deleteLead(id);
}
