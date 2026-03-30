import Link from "next/link";
import { getLeads } from "@/lib/leads";
import { getLastContactDates } from "@/lib/lead-events";
import {
  STATUSES,
  getStatusColor,
  STATUS_FILTER_COLORS,
  STATUS_FILTER_INACTIVE,
} from "@/lib/constants";
import { formatDate, formatDaysAgo, daysAgo } from "@/lib/utils";
import { SortableHeader } from "@/components/SortableHeader";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ status?: string; sort?: string; order?: string }>;
};

function buildLeadsUrl(params: { status?: string; sort?: string; order?: string }) {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.sort) search.set("sort", params.sort);
  if (params.order) search.set("order", params.order);
  const q = search.toString();
  return `/leads${q ? `?${q}` : ""}`;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const { status, sort, order } = await searchParams;
  const statusFilter = status && status !== "all" ? status : undefined;
  const sortBy = (
    sort === "updated_at" || sort === "last_contact" ? sort : "last_contact"
  ) as "updated_at" | "last_contact";
  const sortOrder = order === "asc" ? "asc" : "desc";

  // Obě query běží paralelně – getLastContactDates bez filtru vrátí vše najednou
  let [leads, lastContact] = await Promise.all([
    getLeads(statusFilter, sortBy, sortOrder),
    getLastContactDates(),
  ]);

  if (sortBy === "last_contact") {
    leads = [...leads].sort((a, b) => {
      const dateA = lastContact[a.id]?.getTime() ?? 0;
      const dateB = lastContact[b.id]?.getTime() ?? 0;
      if (dateA === dateB) return 0;
      return sortOrder === "desc"
        ? dateB - dateA
        : dateA - dateB;
    });
  }

  const getStatusLabel = (value: string) =>
    STATUSES.find((s) => s.value === value)?.label ?? value;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Poptávky
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Celkem {leads.length}{" "}
            {leads.length === 1
              ? "poptávka"
              : leads.length >= 2 && leads.length <= 4
                ? "poptávky"
                : "poptávek"}
          </p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Nová poptávka
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        <Link
          href={buildLeadsUrl({ status: statusFilter, sort: sortBy, order: sortOrder })}
          className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
            !statusFilter
              ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          }`}
        >
          Vše
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s.value}
            href={buildLeadsUrl({ status: s.value, sort: sortBy, order: sortOrder })}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === s.value
                ? STATUS_FILTER_COLORS[s.value]
                : `border bg-white dark:bg-slate-900 ${STATUS_FILTER_INACTIVE[s.value]}`
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-700/80">
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Firma
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Web
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Stav
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  <SortableHeader
                    label="Poslední kontakt"
                    href={buildLeadsUrl({
                      status: statusFilter,
                      sort: "last_contact",
                      order:
                        sortBy === "last_contact" && sortOrder === "desc" ? "asc" : "desc",
                    })}
                    isActive={sortBy === "last_contact"}
                    order={sortBy === "last_contact" ? sortOrder : "desc"}
                  />
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    Žádné poptávky.{" "}
                    <Link
                      href="/leads/new"
                      className="font-medium text-slate-900 underline-offset-4 hover:underline dark:text-slate-200 dark:hover:text-slate-100"
                    >
                      Vytvořte první poptávku
                    </Link>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
                      >
                        {lead.companyName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {lead.website ? (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          {lead.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${getStatusColor(lead.status)}`}
                      >
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {lastContact[lead.id] ? (
                        <>
                          {formatDate(lastContact[lead.id])}{" "}
                          <span className="text-slate-400 dark:text-slate-500">
                            ({formatDaysAgo(daysAgo(lastContact[lead.id]))})
                          </span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200"
                      >
                        Zobrazit →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
