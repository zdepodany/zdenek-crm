import Link from "next/link";
import { getClients } from "@/lib/clients";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Klienti
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Celkem {clients.length}{" "}
            {clients.length === 1
              ? "klient"
              : clients.length >= 2 && clients.length <= 4
                ? "klienti"
                : "klientů"}
          </p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Nový klient
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-700/80">
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Jméno
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Kontaktní email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Web
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  IČO
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Začátek spolupráce
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    Žádní klienti.{" "}
                    <Link
                      href="/clients/new"
                      className="font-medium text-slate-900 underline-offset-4 hover:underline dark:text-slate-200 dark:hover:text-slate-100"
                    >
                      Přidejte prvního klienta
                    </Link>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {client.contactEmail || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {client.web ? (
                        <a
                          href={client.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          {client.web.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {client.ico || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(client.cooperationStartDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link
                        href={`/clients/${client.id}`}
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
