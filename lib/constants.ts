export const CONTACT_CHANNELS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "phone", label: "Telefon" },
] as const;

export const STATUSES = [
  { value: "new", label: "Nové" },
  { value: "contacted", label: "Čekám na odpověď" },
  { value: "replied", label: "Čekají na odpověď" },
  { value: "proposal_sent", label: "Návrh odeslán" },
  { value: "negotiation", label: "Práce probíhá" },
  { value: "won", label: "Hotovo" },
  { value: "lost", label: "Odmítnuto" },
  { value: "inactive", label: "Neaktivní" },
] as const;

export const STATUS_COLORS: Record<
  (typeof STATUSES)[number]["value"],
  string
> = {
  new: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  contacted: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  replied: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  proposal_sent: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  negotiation: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  won: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

/** Barvy pro aktivní filtr stavů (plné pozadí) */
export const STATUS_FILTER_COLORS: Record<
  (typeof STATUSES)[number]["value"],
  string
> = {
  new: "border border-transparent bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600",
  contacted: "border border-transparent bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600",
  replied: "border border-transparent bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
  proposal_sent: "border border-transparent bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600",
  negotiation: "border border-transparent bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600",
  won: "border border-transparent bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
  lost: "border border-transparent bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
  inactive: "border border-transparent bg-slate-600 text-white hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600",
};

/** Barvy pro neaktivní filtr stavů (jemný okraj) */
export const STATUS_FILTER_INACTIVE: Record<
  (typeof STATUSES)[number]["value"],
  string
> = {
  new: "border-sky-300 text-sky-600 hover:border-sky-400 hover:bg-sky-50 dark:border-sky-600 dark:text-sky-400 dark:hover:bg-sky-900/30",
  contacted: "border-amber-300 text-amber-600 hover:border-amber-400 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/30",
  replied: "border-emerald-300 text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/30",
  proposal_sent: "border-violet-300 text-violet-600 hover:border-violet-400 hover:bg-violet-50 dark:border-violet-600 dark:text-violet-400 dark:hover:bg-violet-900/30",
  negotiation: "border-orange-300 text-orange-600 hover:border-orange-400 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/30",
  won: "border-green-300 text-green-600 hover:border-green-400 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/30",
  lost: "border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/30",
  inactive: "border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-900/30",
};

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] ?? STATUS_COLORS.inactive;
}

export type ContactChannel = (typeof CONTACT_CHANNELS)[number]["value"];
export type Status = (typeof STATUSES)[number]["value"];

export const HOSTING_OPTIONS = [
  { value: "github_pages", label: "Github Pages" },
  { value: "hukot_cz", label: "Hukot.cz" },
  { value: "vercel", label: "Vercel" },
] as const;

export const DOMAIN_PROVIDERS = [
  { value: "", label: "—" },
  { value: "wedos", label: "Wedos" },
  { value: "forpsi", label: "Forpsi" },
  { value: "hukot", label: "Hukot" },
] as const;

export const WEB_EVENT_TYPES: {
  value: string;
  label: string;
  fields: string[];
}[] = [
  { value: "launch", label: "Spuštění webu", fields: ["date", "link"] },
  { value: "edit", label: "Úprava webu", fields: ["date", "note"] },
  { value: "shutdown", label: "Vypnutí webu", fields: ["date", "note"] },
  { value: "handover", label: "Předání webu", fields: ["date", "note"] },
  { value: "billing", label: "Fakturace", fields: ["date", "amount", "note"] },
];

export type HostingOption = (typeof HOSTING_OPTIONS)[number]["value"];
export type WebEventType = (typeof WEB_EVENT_TYPES)[number]["value"];

export const LEAD_EVENT_CONTACT_METHODS = [
  { value: "osobne", label: "Osobně" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "telefonicky", label: "Telefonicky" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
] as const;

export const LEAD_EVENT_TYPES: {
  value: string;
  label: string;
  fields: string[];
}[] = [
  { value: "contact_initiated", label: "Kontaktoval jsem je", fields: ["date", "method", "note"] },
  { value: "contact_received", label: "Kontaktovali mě", fields: ["date", "method", "note"] },
  { value: "reply_received", label: "Odpověděli mi", fields: ["date", "method", "note"] },
  { value: "proposal_sent", label: "Poslal jsem návrh", fields: ["date", "note"] },
  { value: "rejected", label: "Odmítli mě", fields: ["date", "note"] },
  { value: "completed", label: "Dokončili jsme poptávku", fields: ["date", "web", "client", "note"] },
];
