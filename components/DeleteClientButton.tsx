"use client";

import { useRouter } from "next/navigation";
import { deleteClientAction } from "@/lib/actions";

type DeleteClientButtonProps = {
  clientId: string;
};

export function DeleteClientButton({ clientId }: DeleteClientButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Opravdu chcete smazat tohoto klienta?")) return;
    const formData = new FormData();
    formData.set("id", clientId);
    await deleteClientAction(formData);
    router.push("/clients");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-slate-700 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-900/20"
    >
      Smazat
    </button>
  );
}
