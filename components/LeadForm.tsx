"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLead, updateLead, type LeadFormData } from "@/lib/actions";
import { CONTACT_CHANNELS, STATUSES } from "@/lib/constants";

type LeadForForm = {
  id: string;
  companyName: string;
  city: string | null;
  website: string;
  contact: string;
  contactChannel: string;
  status: string;
  notes: string;
};

type LeadFormProps = {
  lead?: LeadForForm | null;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500";

export function LeadForm({ lead }: LeadFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!lead;

  async function handleSubmit(formData: FormData) {
    const data: LeadFormData = {
      companyName: formData.get("companyName") as string,
      city: formData.get("city") as string,
      website: formData.get("website") as string,
      contact: formData.get("contact") as string,
      contactChannel: formData.get("contactChannel") as string,
      status: formData.get("status") as string,
      notes: formData.get("notes") as string,
    };

    if (isEditing && lead) {
      await updateLead(lead.id, data);
      router.push(`/leads/${lead.id}`);
    } else {
      await createLead(data);
      router.push("/leads");
    }
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="companyName"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Název firmy
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            required
            defaultValue={lead?.companyName}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Město <span className="font-normal text-slate-400">(nepovinné)</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            defaultValue={lead?.city ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="website"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Web
        </label>
        <input
          type="url"
          id="website"
          name="website"
          defaultValue={lead?.website}
          placeholder="https://"
          className={inputClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Kontakt
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            defaultValue={lead?.contact}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="contactChannel"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Kontaktní kanál
          </label>
          <select
            id="contactChannel"
            name="contactChannel"
            defaultValue={lead?.contactChannel ?? "email"}
            className={inputClass}
          >
            {CONTACT_CHANNELS.map((ch) => (
              <option key={ch.value} value={ch.value}>
                {ch.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Stav
        </label>
        <select
          id="status"
          name="status"
          defaultValue={lead?.status ?? "new"}
          className={`${inputClass} max-w-md`}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Poznámky
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={lead?.notes ?? ""}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:opacity-70"
        >
          {isPending ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {isEditing ? "Ukládám…" : "Vytvářím…"}
            </>
          ) : isEditing ? (
            "Uložit změny"
          ) : (
            "Vytvořit poptávku"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:disabled:opacity-70"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
