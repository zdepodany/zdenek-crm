"use client";

import { useRouter } from "next/navigation";
import { deleteLeadEventAction } from "@/lib/actions";

type DeleteLeadEventButtonProps = {
  eventId: string;
  leadId: string;
};

export function DeleteLeadEventButton({ eventId, leadId }: DeleteLeadEventButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Opravdu chcete smazat tuto akci?")) return;
    const formData = new FormData();
    formData.set("id", eventId);
    formData.set("leadId", leadId);
    await deleteLeadEventAction(formData);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-slate-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
      title="Smazat akci"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
}
