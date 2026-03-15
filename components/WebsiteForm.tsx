"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createWebsite,
  updateWebsite,
  type WebsiteFormData,
} from "@/lib/actions";
import { HOSTING_OPTIONS } from "@/lib/constants";
import type { Client } from "@/lib/database";

type WebsiteForForm = {
  id: string;
  clientId: string;
  creationPrice: number | null;
  hosting: string;
  url: string;
  githubRepo: string;
};

type WebsiteFormProps = {
  website?: WebsiteForForm | null;
  clients: Client[];
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500";

export function WebsiteForm({ website, clients }: WebsiteFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!website;

  async function handleSubmit(formData: FormData) {
    const data: WebsiteFormData = {
      clientId: formData.get("clientId") as string,
      creationPrice: formData.get("creationPrice") as string,
      hosting: formData.get("hosting") as string,
      url: formData.get("url") as string,
      githubRepo: formData.get("githubRepo") as string,
    };

    if (isEditing && website) {
      await updateWebsite(website.id, data);
      router.push(`/websites/${website.id}`);
    } else {
      await createWebsite(data);
      router.push("/websites");
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
      <div>
        <label
          htmlFor="clientId"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Klient
        </label>
        <select
          id="clientId"
          name="clientId"
          required
          defaultValue={website?.clientId}
          className={inputClass}
        >
          <option value="">Vyberte klienta</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="creationPrice"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Cena vytvoření (Kč)
          </label>
          <input
            type="number"
            id="creationPrice"
            name="creationPrice"
            min="0"
            step="0.01"
            defaultValue={website?.creationPrice ?? ""}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="hosting"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Hosting
          </label>
          <select
            id="hosting"
            name="hosting"
            defaultValue={website?.hosting ?? "github_pages"}
            className={inputClass}
          >
            {HOSTING_OPTIONS.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="url"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Adresa webu
        </label>
        <input
          type="url"
          id="url"
          name="url"
          defaultValue={website?.url}
          placeholder="https://"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="githubRepo"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Odkaz na Github repo
        </label>
        <input
          type="url"
          id="githubRepo"
          name="githubRepo"
          defaultValue={website?.githubRepo}
          placeholder="https://github.com/..."
          className={inputClass}
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
            "Přidat web"
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
