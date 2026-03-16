import Link from "next/link";

type SortableHeaderProps = {
  label: string;
  href: string;
  isActive: boolean;
  order: "asc" | "desc";
};

export function SortableHeader({ label, href, isActive, order }: SortableHeaderProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-1 text-left text-xs font-medium tracking-wider text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
    >
      {label}
      <span
        className={`inline-flex transition-opacity ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
        }`}
      >
        {order === "asc" ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    </Link>
  );
}
