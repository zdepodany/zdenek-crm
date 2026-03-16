/** Formátuje datum v českém formátu DD/MM/YYYY */
export function formatDate(date: Date | null): string {
  if (!date) return "—";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Vrátí počet dní mezi datem a dneškem (0 = dnes, 1 = včera, 2+ = před X dny) */
export function daysAgo(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

/** Formátuje "X dnů dozadu" v češtině */
export function formatDaysAgo(days: number): string {
  if (days === 0) return "dnes";
  if (days === 1) return "včera";
  if (days >= 2 && days <= 4) return `před ${days} dny`;
  return `před ${days} dní`;
}

/** Formátuje částku v CZK */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
  }).format(Number(amount));
}
