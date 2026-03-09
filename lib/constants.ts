export const CONTACT_CHANNELS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "phone", label: "Telefon" },
] as const;

export const STATUSES = [
  { value: "new", label: "Nový" },
  { value: "contacted", label: "Kontaktován" },
  { value: "replied", label: "Odpověděl" },
  { value: "proposal_sent", label: "Nabídka odeslána" },
  { value: "negotiation", label: "Vyjednávání" },
  { value: "won", label: "Vyhráno" },
  { value: "lost", label: "Prohráno" },
  { value: "inactive", label: "Neaktivní" },
] as const;

export type ContactChannel = (typeof CONTACT_CHANNELS)[number]["value"];
export type Status = (typeof STATUSES)[number]["value"];
