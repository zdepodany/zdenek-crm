import Link from "next/link";
import { notFound } from "next/navigation";
import { getWebsiteById } from "@/lib/websites";
import { WebsiteForm } from "@/components/WebsiteForm";
import { getClients } from "@/lib/clients";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditWebsitePage({ params }: PageProps) {
  const { id } = await params;
  const [website, clients] = await Promise.all([
    getWebsiteById(id),
    getClients(),
  ]);

  if (!website) notFound();

  return (
    <div>
      <Link
        href={`/websites/${website.id}`}
        className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
      >
        ← Zpět na {website.url ? website.url.replace(/^https?:\/\//, "") : "web"}
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Upravit web
      </h1>
      <p className="mb-10 text-sm text-slate-500 dark:text-slate-400">
        Aktualizujte informace o webu
      </p>
      <div className="rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <WebsiteForm website={website} clients={clients} />
      </div>
    </div>
  );
}
