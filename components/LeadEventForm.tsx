"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLeadEvent, type LeadEventFormData } from "@/lib/actions";
import {
  LEAD_EVENT_TYPES,
  LEAD_EVENT_CONTACT_METHODS,
} from "@/lib/constants";
import type { WebsiteWithClient } from "@/lib/database";
import type { Client } from "@/lib/database";

type LeadEventFormProps = {
  leadId: string;
  websites: WebsiteWithClient[];
  clients: Client[];
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500";

export function LeadEventForm({ leadId, websites, clients }: LeadEventFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [eventType, setEventType] = useState<string>("contact_initiated");

  const currentType = LEAD_EVENT_TYPES.find((t) => t.value === eventType);
  const hasMethod = currentType?.fields.includes("method");
  const hasWeb = currentType?.fields.includes("web");
  const hasClient = currentType?.fields.includes("client");

  async function handleSubmit(formData: FormData) {
    const data: LeadEventFormData = {
      type: formData.get("type") as string,
      date: formData.get("date") as string,
      method: formData.get("method") as string,
      note: formData.get("note") as string,
      webId: formData.get("webId") as string,
      clientId: formData.get("clientId") as string,
    };

    await createLeadEvent(leadId, data);
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    try {
      await handleSubmit(new FormData(e.currentTarget));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="eventType"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Typ akce
          </label>
          <select
            id="eventType"
            name="type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className={inputClass}
          >
            {LEAD_EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="eventDate"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Datum
          </label>
          <input
            type="date"
            id="eventDate"
            name="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
        </div>
      </div>

      {hasMethod && (
        <div>
          <label
            htmlFor="eventMethod"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Způsob
          </label>
          <select id="eventMethod" name="method" className={inputClass}>
            {LEAD_EVENT_CONTACT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {hasWeb && (
        <div>
          <label
            htmlFor="eventWeb"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Web
          </label>
          <select id="eventWeb" name="webId" className={inputClass}>
            <option value="">— Vyberte web</option>
            {websites.map((w) => (
              <option key={w.id} value={w.id}>
                {w.url ? w.url.replace(/^https?:\/\//, "") : "(bez adresy)"} – {w.clientName}
              </option>
            ))}
          </select>
        </div>
      )}

      {hasClient && (
        <div>
          <label
            htmlFor="eventClient"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Klient
          </label>
          <select id="eventClient" name="clientId" className={inputClass}>
            <option value="">— Vyberte klienta</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="eventNote"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Poznámka
        </label>
        <textarea
          id="eventNote"
          name="note"
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:opacity-70"
      >
        {isPending ? "Přidávám…" : "Přidat akci"}
      </button>
    </form>
  );
}
