"use client";

import { useRouter } from "next/navigation";
import { deleteLeadAction } from "@/lib/actions";

type DeleteLeadButtonProps = {
  leadId: string;
};

export function DeleteLeadButton({ leadId }: DeleteLeadButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Opravdu chcete smazat tuto poptávku?")) return;
    const formData = new FormData();
    formData.set("id", leadId);
    await deleteLeadAction(formData);
    router.push("/leads");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-slate-700 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-900/20"
    >
      Smazat
    </button>
  );
}
