"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createClient,
  updateClient,
  type ClientFormData,
} from "@/lib/actions";

type ClientForForm = {
  id: string;
  name: string;
  contactEmail: string;
  web: string;
  ico: string;
  cooperationStartDate: Date | null;
};

type ClientFormProps = {
  client?: ClientForForm | null;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500";

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!client;

  async function handleSubmit(formData: FormData) {
    const data: ClientFormData = {
      name: formData.get("name") as string,
      contactEmail: formData.get("contactEmail") as string,
      web: formData.get("web") as string,
      ico: formData.get("ico") as string,
      cooperationStartDate: formData.get("cooperationStartDate") as string,
    };

    if (isEditing && client) {
      await updateClient(client.id, data);
      router.push(`/clients/${client.id}`);
    } else {
      await createClient(data);
      router.push("/clients");
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
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Jméno
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={client?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="contactEmail"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Kontaktní email
        </label>
        <input
          type="email"
          id="contactEmail"
          name="contactEmail"
          defaultValue={client?.contactEmail}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="web"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Web
        </label>
        <input
          type="url"
          id="web"
          name="web"
          defaultValue={client?.web}
          placeholder="https://"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="ico"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          IČO
        </label>
        <input
          type="text"
          id="ico"
          name="ico"
          defaultValue={client?.ico}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="cooperationStartDate"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Datum začátku spolupráce
        </label>
        <input
          type="date"
          id="cooperationStartDate"
          name="cooperationStartDate"
          defaultValue={
            client?.cooperationStartDate
              ? new Date(client.cooperationStartDate).toISOString().split("T")[0]
              : ""
          }
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
            "Přidat klienta"
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
