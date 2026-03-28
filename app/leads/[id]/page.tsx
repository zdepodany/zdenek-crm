import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/leads";
import { getLeadEvents } from "@/lib/lead-events";
import { getWebsites } from "@/lib/websites";
import { getClients } from "@/lib/clients";
import { DeleteLeadButton } from "@/components/DeleteLeadButton";
import { LeadEventForm } from "@/components/LeadEventForm";
import { LeadEventsSortableList } from "@/components/LeadEventsSortableList";
import { STATUSES, CONTACT_CHANNELS, getStatusColor } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [lead, events, websites, clients] = await Promise.all([
    getLeadById(id),
    getLeadEvents(id),
    getWebsites(),
    getClients(),
  ]);

  if (!lead) notFound();

  const getStatusLabel = (value: string) =>
    STATUSES.find((s) => s.value === value)?.label ?? value;
  const getChannelLabel = (value: string) =>
    CONTACT_CHANNELS.find((c) => c.value === value)?.label ?? value;
  const eventListItems = events.map((e) => ({
    id: e.id,
    type: e.type,
    date: e.date.toISOString().slice(0, 10),
    method: e.method,
    note: e.note,
    webId: e.webId,
    clientId: e.clientId,
  }));
  const websiteRefs = websites.map((w) => ({
    id: w.id,
    url: w.url,
    clientName: w.clientName,
  }));
  const clientRefs = clients.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/leads"
            className="mb-2 inline-block text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            ← Zpět na poptávky
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {lead.companyName}
          </h1>
          {lead.city ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lead.city}</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/leads/${lead.id}/edit`}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Upravit
          </Link>
          <DeleteLeadButton leadId={lead.id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
          <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Informace o poptávce
          </h2>
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Firma</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                {lead.companyName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Město</dt>
              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {lead.city ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Web</dt>
              <dd className="mt-1 text-sm">
                {lead.website ? (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {lead.website}
                  </a>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Kontakt</dt>
              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {lead.contact || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Kontaktní kanál
              </dt>
              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {getChannelLabel(lead.contactChannel)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Stav</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${getStatusColor(lead.status)}`}
                >
                  {getStatusLabel(lead.status)}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Kontaktován dne
              </dt>
              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {formatDate(lead.contactedAt)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
          <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Poznámky
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {lead.notes || "Zatím žádné poznámky."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900 lg:col-span-2">
          <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Přidat akci
          </h2>
          <LeadEventForm leadId={lead.id} websites={websites} clients={clients} />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Historie akcí
        </h2>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Zatím žádné akce. Přidejte první akci výše.
          </p>
        ) : (
          <LeadEventsSortableList
            leadId={lead.id}
            initialEvents={eventListItems}
            websites={websiteRefs}
            clients={clientRefs}
          />
        )}
      </div>
    </div>
  );
}
