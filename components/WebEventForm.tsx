"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWebEvent, type WebEventFormData } from "@/lib/actions";
import { WEB_EVENT_TYPES } from "@/lib/constants";

type WebEventFormProps = {
  webId: string;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500";

export function WebEventForm({ webId }: WebEventFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [eventType, setEventType] = useState<string>("launch");

  const currentType = WEB_EVENT_TYPES.find((t) => t.value === eventType);

  async function handleSubmit(formData: FormData) {
    const data: WebEventFormData = {
      type: formData.get("type") as string,
      date: formData.get("date") as string,
      link: formData.get("link") as string,
      note: formData.get("note") as string,
      amount: formData.get("amount") as string,
    };

    await createWebEvent(webId, data);
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
            Typ události
          </label>
          <select
            id="eventType"
            name="type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className={inputClass}
          >
            {WEB_EVENT_TYPES.map((t) => (
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

      {currentType?.fields.includes("link") && (
        <div>
          <label
            htmlFor="eventLink"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Odkaz
          </label>
          <input
            type="url"
            id="eventLink"
            name="link"
            placeholder="https://"
            className={inputClass}
          />
        </div>
      )}

      {currentType?.fields.includes("amount") && (
        <div>
          <label
            htmlFor="eventAmount"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Částka (Kč)
          </label>
          <input
            type="number"
            id="eventAmount"
            name="amount"
            min="0"
            step="0.01"
            placeholder="0"
            className={inputClass}
          />
        </div>
      )}

      {(currentType?.fields.includes("note") || currentType?.fields.includes("amount")) && (
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
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:opacity-70"
      >
        {isPending ? "Přidávám…" : "Přidat událost"}
      </button>
    </form>
  );
}
