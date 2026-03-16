import Link from "next/link";
import { getWebsites } from "@/lib/websites";
import { HOSTING_OPTIONS, DOMAIN_PROVIDERS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WebsitesPage() {
  const websites = await getWebsites();

  const getHostingLabel = (value: string) =>
    HOSTING_OPTIONS.find((h) => h.value === value)?.label ?? value;
  const getDomainProviderLabel = (value: string) =>
    DOMAIN_PROVIDERS.find((p) => p.value === value)?.label ?? (value || "—");

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Spuštěné weby
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Celkem {websites.length}{" "}
            {websites.length === 1
              ? "web"
              : websites.length >= 2 && websites.length <= 4
                ? "weby"
                : "webů"}
          </p>
        </div>
        <Link
          href="/websites/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Nový web
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-700/80">
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Adresa webu
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Klient
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Hosting
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Poskytovatel domény
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Cena vytvoření
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {websites.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    Žádné weby.{" "}
                    <Link
                      href="/websites/new"
                      className="font-medium text-slate-900 underline-offset-4 hover:underline dark:text-slate-200 dark:hover:text-slate-100"
                    >
                      Přidejte první web
                    </Link>
                  </td>
                </tr>
              ) : (
                websites.map((web) => (
                  <tr
                    key={web.id}
                    className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4">
                      {web.url ? (
                        <Link
                          href={`/websites/${web.id}`}
                          className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
                        >
                          {web.url.replace(/^https?:\/\//, "")}
                        </Link>
                      ) : (
                        <Link
                          href={`/websites/${web.id}`}
                          className="font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                        >
                          (bez adresy)
                        </Link>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      <Link
                        href={`/clients/${web.clientId}`}
                        className="hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        {web.clientName}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {getHostingLabel(web.hosting)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {getDomainProviderLabel(web.domainProvider)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatCurrency(web.creationPrice)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link
                        href={`/websites/${web.id}`}
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
