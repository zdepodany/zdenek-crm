import Link from "next/link";
import { getLeadCounts } from "@/lib/leads";
import { getWebsiteCount, getTotalEarnings } from "@/lib/websites";
import { STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PIPELINE_STATUS_VALUES = [
  "new",
  "contacted",
  "replied",
  "proposal_sent",
  "negotiation",
  "inactive",
] as const;

const PIPELINE_CARD_STYLES: Record<string, string> = {
  new: "border-sky-200/90 bg-white hover:border-sky-300 hover:bg-sky-50/80 dark:border-sky-800 dark:bg-slate-900 dark:hover:border-sky-700 dark:hover:bg-sky-950/40",
  contacted:
    "border-amber-200/90 bg-white hover:border-amber-300 hover:bg-amber-50/80 dark:border-amber-900/60 dark:bg-slate-900 dark:hover:border-amber-800 dark:hover:bg-amber-950/25",
  replied:
    "border-emerald-200/90 bg-white hover:border-emerald-300 hover:bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-slate-900 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/25",
  proposal_sent:
    "border-violet-200/90 bg-white hover:border-violet-300 hover:bg-violet-50/80 dark:border-violet-900/50 dark:bg-slate-900 dark:hover:border-violet-800 dark:hover:bg-violet-950/25",
  negotiation:
    "border-orange-200/90 bg-white hover:border-orange-300 hover:bg-orange-50/80 dark:border-orange-900/50 dark:bg-slate-900 dark:hover:border-orange-800 dark:hover:bg-orange-950/25",
  inactive:
    "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800/80",
};

export default async function DashboardPage() {
  const [metrics, websiteCount, totalEarnings] = await Promise.all([
    getLeadCounts(),
    getWebsiteCount(),
    getTotalEarnings(),
  ]);

  const won = metrics.won ?? 0;
  const lost = metrics.lost ?? 0;
  const closedTotal = won + lost;
  const successRate =
    closedTotal > 0 ? Math.round((won / closedTotal) * 100) : null;

  const pipelineStatuses = PIPELINE_STATUS_VALUES.map((value) => {
    const s = STATUSES.find((x) => x.value === value)!;
    return {
      value: s.value,
      label: s.label,
      count: metrics[s.value] ?? 0,
      style: PIPELINE_CARD_STYLES[value] ?? PIPELINE_CARD_STYLES.inactive,
    };
  });

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Přehled
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Stav poptávek, výsledky obchodů a rychlý přístup k webům a příjmům.
        </p>
      </header>

      {/* Výsledky – zvýrazněné */}
      <section aria-labelledby="dashboard-outcomes-heading">
        <h2
          id="dashboard-outcomes-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
        >
          Výsledky
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Link
            href="/leads?status=won"
            className="group relative overflow-hidden rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-teal-600/20 p-6 shadow-md shadow-emerald-900/5 transition-all hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-900/10 dark:border-emerald-500/35 dark:from-emerald-500/25 dark:via-green-600/15 dark:to-teal-900/30 dark:shadow-black/20 dark:hover:border-emerald-400/50"
          >
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl dark:bg-emerald-400/10" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200/90">
                  Hotovo
                </p>
                <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-emerald-950 dark:text-emerald-50">
                  {won}
                </p>
                <p className="mt-2 text-sm text-emerald-800/80 dark:text-emerald-200/70">
                  Vyhrané poptávky · zobrazit v seznamu
                </p>
              </div>
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/25 text-emerald-800 ring-2 ring-emerald-400/30 dark:bg-emerald-500/20 dark:text-emerald-100 dark:ring-emerald-400/20"
                aria-hidden
              >
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
          </Link>

          <Link
            href="/leads?status=lost"
            className="group relative overflow-hidden rounded-2xl border-2 border-rose-400/40 bg-gradient-to-br from-rose-500/12 via-red-500/8 to-orange-900/10 p-6 shadow-md shadow-rose-900/5 transition-all hover:border-rose-400/70 hover:shadow-lg hover:shadow-rose-900/10 dark:border-rose-500/35 dark:from-rose-600/20 dark:via-red-900/20 dark:to-orange-950/25 dark:shadow-black/20 dark:hover:border-rose-400/50"
          >
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-rose-400/15 blur-2xl dark:bg-rose-500/10" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-rose-900 dark:text-rose-200/90">
                  Odmítnuto
                </p>
                <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-rose-950 dark:text-rose-50">
                  {lost}
                </p>
                <p className="mt-2 text-sm text-rose-800/85 dark:text-rose-200/65">
                  Uzavřené bez dohody · zobrazit v seznamu
                </p>
              </div>
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-900 ring-2 ring-rose-400/25 dark:bg-rose-500/15 dark:text-rose-100 dark:ring-rose-400/20"
                aria-hidden
              >
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
          </Link>
        </div>
        {successRate !== null && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Z uzavřených poptávek je úspěšných{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              {successRate} %
            </span>{" "}
            ({won} z {closedTotal}).
          </p>
        )}
      </section>

      {/* Celkem + pipeline */}
      <section aria-labelledby="dashboard-pipeline-heading" className="space-y-4">
        <h2
          id="dashboard-pipeline-heading"
          className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
        >
          Pipeline
        </h2>
        <Link
          href="/leads"
          className="flex flex-wrap items-baseline justify-between gap-3 rounded-xl border border-slate-200/90 bg-gradient-to-r from-slate-50 to-white px-5 py-4 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/80 dark:hover:border-slate-600"
        >
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Celkem poptávek
          </span>
          <span className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {metrics.total}
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Stav v procesu
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pipelineStatuses.map((s) => (
              <Link
                key={s.value}
                href={`/leads?status=${s.value}`}
                className={`rounded-xl border px-4 py-3 shadow-sm transition-all hover:shadow-md ${s.style}`}
              >
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {s.label}
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {s.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Weby & výdělek */}
      <section aria-labelledby="dashboard-assets-heading">
        <h2
          id="dashboard-assets-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
        >
          Weby a příjmy
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/websites"
            className="group flex items-center gap-4 rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/90 to-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-slate-900 dark:hover:border-indigo-700"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-200"
              aria-hidden
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-600/80 dark:text-indigo-300/80">
                Spuštěné weby
              </p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {websiteCount}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white p-5 shadow-sm dark:border-amber-900/40 dark:from-amber-950/30 dark:to-slate-900">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200"
              aria-hidden
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-800/80 dark:text-amber-300/80">
                Celkem z fakturace
              </p>
              <p className="mt-0.5 text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {formatCurrency(totalEarnings)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
