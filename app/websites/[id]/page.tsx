import Link from "next/link";
import { notFound } from "next/navigation";
import { getWebsiteById, getWebEvents } from "@/lib/websites";
import { DeleteWebsiteButton } from "@/components/DeleteWebsiteButton";
import { WebEventForm } from "@/components/WebEventForm";
import { DeleteWebEventButton } from "@/components/DeleteWebEventButton";
import { HOSTING_OPTIONS, DOMAIN_PROVIDERS, WEB_EVENT_TYPES } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function WebsiteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [website, events] = await Promise.all([
    getWebsiteById(id),
    getWebEvents(id),
  ]);

  if (!website) notFound();

  const getHostingLabel = (value: string) =>
    HOSTING_OPTIONS.find((h) => h.value === value)?.label ?? value;
  const getDomainProviderLabel = (value: string) =>
    DOMAIN_PROVIDERS.find((p) => p.value === value)?.label ?? (value || "—");
  const getEventTypeLabel = (value: string) =>
    WEB_EVENT_TYPES.find((t) => t.value === value)?.label ?? value;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/websites"
            className="mb-2 inline-block text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            ← Zpět na weby
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {website.url ? (
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 dark:hover:text-slate-300"
              >
                {website.url.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              "Web bez adresy"
            )}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Klient:{" "}
            <Link
              href={`/clients/${website.clientId}`}
              className="font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              {website.clientName}
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/websites/${website.id}/edit`}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Upravit
          </Link>
          <DeleteWebsiteButton websiteId={website.id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
          <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Informace o webu
          </h2>
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Adresa webu
              </dt>
              <dd className="mt-1 text-sm">
                {website.url ? (
                  <a
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {website.url}
                  </a>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Klient
              </dt>
              <dd className="mt-1 text-sm">
                <Link
                  href={`/clients/${website.clientId}`}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {website.clientName}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Hosting
              </dt>
              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {getHostingLabel(website.hosting)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Poskytovatel domény
              </dt>
              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {getDomainProviderLabel(website.domainProvider)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Cena vytvoření
              </dt>
              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {formatCurrency(website.creationPrice)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Github repo
              </dt>
              <dd className="mt-1 text-sm">
                {website.githubRepo ? (
                  <a
                    href={website.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {website.githubRepo}
                  </a>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">—</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
          <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Přidat událost
          </h2>
          <WebEventForm webId={website.id} />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Historie událostí
        </h2>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Zatím žádné události. Přidejte první událost výše.
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {getEventTypeLabel(event.type)}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-sm text-slate-600 dark:text-slate-400">
                    {event.link && (
                      <p>
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          {event.link}
                        </a>
                      </p>
                    )}
                    {event.amount != null && (
                      <p className="font-medium">{formatCurrency(event.amount)}</p>
                    )}
                    {event.note && (
                      <p className="whitespace-pre-wrap">{event.note}</p>
                    )}
                  </div>
                </div>
                <DeleteWebEventButton eventId={event.id} webId={website.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
