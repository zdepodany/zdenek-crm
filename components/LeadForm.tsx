"use client";

import { useRouter } from "next/navigation";
import { createLead, updateLead, type LeadFormData } from "@/lib/actions";
import { CONTACT_CHANNELS, STATUSES } from "@/lib/constants";

type LeadForForm = {
  id: string;
  companyName: string;
  city: string;
  website: string;
  contact: string;
  contactChannel: string;
  status: string;
  contactedAt: Date | null;
  notes: string;
};

type LeadFormProps = {
  lead?: LeadForForm | null;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500";

export function LeadForm({ lead }: LeadFormProps) {
  const router = useRouter();
  const isEditing = !!lead;

  async function handleSubmit(formData: FormData) {
    const data: LeadFormData = {
      companyName: formData.get("companyName") as string,
      city: formData.get("city") as string,
      website: formData.get("website") as string,
      contact: formData.get("contact") as string,
      contactChannel: formData.get("contactChannel") as string,
      status: formData.get("status") as string,
      contactedAt: formData.get("contactedAt") as string,
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

  return (
    <form action={handleSubmit} className="space-y-6">
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
            Město
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            defaultValue={lead?.city}
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

      <div className="grid gap-6 sm:grid-cols-2">
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
            className={inputClass}
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
            htmlFor="contactedAt"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Kontaktován dne
          </label>
          <input
            type="date"
            id="contactedAt"
            name="contactedAt"
            defaultValue={
              lead?.contactedAt
                ? new Date(lead.contactedAt).toISOString().split("T")[0]
                : ""
            }
            className={inputClass}
          />
        </div>
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
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {isEditing ? "Uložit změny" : "Vytvořit poptávku"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
