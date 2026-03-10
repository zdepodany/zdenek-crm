import Link from "next/link";
import { getLeadCounts } from "@/lib/leads";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await getLeadCounts();

  const cards = [
    {
      label: "Celkem poptávek",
      value: metrics.total,
      href: "/leads",
      color: "border-slate-200/80 dark:border-slate-700/80",
    },
    {
      label: "Kontaktováno",
      value: metrics.contacted,
      href: "/leads?status=contacted",
      color: "border-amber-300/60 dark:border-amber-700/60",
    },
    {
      label: "Čeká na odpověď",
      value: metrics.waitingForReply,
      href: "/leads?status=replied",
      color: "border-emerald-300/60 dark:border-emerald-700/60",
    },
    {
      label: "Odesláno nabídek",
      value: metrics.proposalSent,
      href: "/leads?status=proposal_sent",
      color: "border-violet-300/60 dark:border-violet-700/60",
    },
    {
      label: "Vyhrané obchody",
      value: metrics.won,
      href: "/leads?status=won",
      color: "border-green-300/60 dark:border-green-700/60",
    },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Přehled
      </h1>
      <p className="mb-10 text-sm text-slate-500 dark:text-slate-400">
        Přehled vašeho pipeline poptávek
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 ${card.color}`}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 group-hover:text-slate-700 dark:text-slate-100 dark:group-hover:text-slate-300">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
