import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/leads";
import { LeadForm } from "@/components/LeadForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditLeadPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) notFound();

  return (
    <div>
      <Link
        href={`/leads/${lead.id}`}
        className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
      >
        ← Zpět na {lead.companyName}
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Upravit poptávku
      </h1>
      <p className="mb-10 text-sm text-slate-500 dark:text-slate-400">
        Aktualizujte informace o poptávce
      </p>
      <div className="rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <LeadForm lead={lead} />
      </div>
    </div>
  );
}
