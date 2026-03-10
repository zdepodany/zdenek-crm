import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/clients";
import { ClientForm } from "@/components/ClientForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditClientPage({ params }: PageProps) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) notFound();

  return (
    <div>
      <Link
        href={`/clients/${client.id}`}
        className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
      >
        ← Zpět na {client.name}
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Upravit klienta
      </h1>
      <p className="mb-10 text-sm text-slate-500 dark:text-slate-400">
        Aktualizujte informace o klientovi
      </p>
      <div className="rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <ClientForm client={client} />
      </div>
    </div>
  );
}
