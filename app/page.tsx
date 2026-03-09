import Link from "next/link";
import { getLeadCounts } from "@/lib/leads";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await getLeadCounts();

  const cards = [
    { label: "Celkem poptávek", value: metrics.total, href: "/leads" },
    {
      label: "Kontaktováno",
      value: metrics.contacted,
      href: "/leads?status=contacted",
    },
    {
      label: "Odpovědělo",
      value: metrics.replied,
      href: "/leads?status=replied",
    },
    {
      label: "Vyhrané obchody",
      value: metrics.won,
      href: "/leads?status=won",
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-slate-300/80 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900 dark:hover:border-slate-600/80"
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
