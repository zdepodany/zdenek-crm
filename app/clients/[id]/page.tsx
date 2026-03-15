import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/clients";
import { getWebsitesByClientId } from "@/lib/websites";
import { DeleteClientButton } from "@/components/DeleteClientButton";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [client, websites] = await Promise.all([
    getClientById(id),
    getWebsitesByClientId(id),
  ]);

  if (!client) notFound();

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/clients"
            className="mb-2 inline-block text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            ← Zpět na klienty
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {client.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/clients/${client.id}/edit`}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Upravit
          </Link>
          <DeleteClientButton clientId={client.id} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Informace o klientovi
        </h2>
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Jméno
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
              {client.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Kontaktní email
            </dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              {client.contactEmail || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Kontaktní osoba
            </dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              {client.contactPerson || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Telefonní číslo
            </dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              {client.phone ? (
                <a
                  href={`tel:${client.phone}`}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {client.phone}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Web
            </dt>
            <dd className="mt-1 text-sm">
              {client.web ? (
                <a
                  href={client.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {client.web}
                </a>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">—</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              IČO
            </dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              {client.ico || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Datum začátku spolupráce
            </dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              {formatDate(client.cooperationStartDate)}
            </dd>
          </div>
        </dl>
      </div>

      {websites.length > 0 && (
        <div className="mt-8 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
          <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Spuštěné weby
          </h2>
          <ul className="space-y-2">
            {websites.map((web) => (
              <li key={web.id}>
                <Link
                  href={`/websites/${web.id}`}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {web.url ? web.url.replace(/^https?:\/\//, "") : "(bez adresy)"}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
