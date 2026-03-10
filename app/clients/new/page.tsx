import { ClientForm } from "@/components/ClientForm";

export default function NewClientPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Nový klient
      </h1>
      <p className="mb-10 text-sm text-slate-500 dark:text-slate-400">
        Přidejte nového klienta do evidence
      </p>
      <div className="rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <ClientForm />
      </div>
    </div>
  );
}
