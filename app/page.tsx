import Link from "next/link";
import { getLeadCounts } from "@/lib/leads";
import { getWebsiteCount, getTotalEarnings } from "@/lib/websites";
import { STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const DASHBOARD_CARD_COLORS: Record<string, string> = {
  total: "border-slate-200/80 dark:border-slate-700/80",
  new: "border-sky-300/60 dark:border-sky-700/60",
  contacted: "border-amber-300/60 dark:border-amber-700/60",
  replied: "border-emerald-300/60 dark:border-emerald-700/60",
  proposal_sent: "border-violet-300/60 dark:border-violet-700/60",
  negotiation: "border-orange-300/60 dark:border-orange-700/60",
  won: "border-green-300/60 dark:border-green-700/60",
  lost: "border-red-300/60 dark:border-red-700/60",
  inactive: "border-slate-300/60 dark:border-slate-700/60",
};

export default async function DashboardPage() {
  const [metrics, websiteCount, totalEarnings] = await Promise.all([
    getLeadCounts(),
    getWebsiteCount(),
    getTotalEarnings(),
  ]);

  const totalCard = {
    label: "Celkem poptávek",
    value: metrics.total,
    href: "/leads",
    color: DASHBOARD_CARD_COLORS.total,
  };

  const statusCards = STATUSES.map((s) => ({
    label: s.label,
    value: metrics[s.value] ?? 0,
    href: `/leads?status=${s.value}`,
    color: DASHBOARD_CARD_COLORS[s.value] ?? DASHBOARD_CARD_COLORS.total,
  }));

  const cards = [totalCard, ...statusCards];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Přehled
      </h1>
      <p className="mb-10 text-sm text-slate-500 dark:text-slate-400">
        Přehled vašeho pipeline poptávek
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group rounded-lg border bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 ${card.color}`}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {card.label}
            </p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 group-hover:text-slate-700 dark:text-slate-100 dark:group-hover:text-slate-300">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <hr className="my-8 border-slate-200 dark:border-slate-700" />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/websites"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Spuštěné weby
          </span>
          <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {websiteCount}
          </span>
        </Link>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-4 py-3 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Celkový výdělek
          </span>
          <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {formatCurrency(totalEarnings)}
          </span>
        </div>
      </div>
    </div>
  );
}
