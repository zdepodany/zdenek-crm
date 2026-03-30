function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-10">
      <div className="space-y-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-52" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-14 rounded-xl" />
        <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800 sm:p-5">
          <Skeleton className="mb-3 h-3 w-28" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
