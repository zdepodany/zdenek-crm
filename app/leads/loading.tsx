function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

export default function LeadsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-900">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-700/80">
              {["Firma", "Web", "Stav", "Poslední kontakt", ""].map((h) => (
                <th key={h} className="px-6 py-4 text-left">
                  <Skeleton className="h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-36" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-5 w-24 rounded-md" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="px-6 py-4 text-right">
                  <Skeleton className="ml-auto h-4 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
