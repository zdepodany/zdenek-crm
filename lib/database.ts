export type LeadRow = {
  id: string;
  company_name: string;
  city: string;
  website: string;
  contact: string;
  contact_channel: string;
  status: string;
  contacted_at: string | null;
  notes: string;
  created_at?: string;
  updated_at?: string;
};

export type Lead = {
  id: string;
  companyName: string;
  city: string;
  website: string;
  contact: string;
  contactChannel: string;
  status: string;
  contactedAt: Date | null;
  notes: string;
};

export function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    companyName: row.company_name,
    city: row.city,
    website: row.website,
    contact: row.contact,
    contactChannel: row.contact_channel,
    status: row.status,
    contactedAt: row.contacted_at ? new Date(row.contacted_at) : null,
    notes: row.notes,
  };
}

export type ClientRow = {
  id: string;
  name: string;
  contact_email: string;
  contact_person: string;
  phone: string;
  web: string;
  ico: string;
  cooperation_start_date: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Client = {
  id: string;
  name: string;
  contactEmail: string;
  contactPerson: string;
  phone: string;
  web: string;
  ico: string;
  cooperationStartDate: Date | null;
};

export function toClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    contactEmail: row.contact_email,
    contactPerson: row.contact_person ?? "",
    phone: row.phone ?? "",
    web: row.web,
    ico: row.ico,
    cooperationStartDate: row.cooperation_start_date
      ? new Date(row.cooperation_start_date)
      : null,
  };
}

export type WebsiteRow = {
  id: string;
  client_id: string;
  creation_price: number | null;
  hosting: string;
  url: string;
  github_repo: string;
  created_at?: string;
  updated_at?: string;
};

export type Website = {
  id: string;
  clientId: string;
  creationPrice: number | null;
  hosting: string;
  url: string;
  githubRepo: string;
};

export type WebsiteWithClient = Website & {
  clientName: string;
};

export function toWebsite(row: WebsiteRow, clientName?: string): Website | WebsiteWithClient {
  const base = {
    id: row.id,
    clientId: row.client_id,
    creationPrice: row.creation_price != null ? Number(row.creation_price) : null,
    hosting: row.hosting,
    url: row.url,
    githubRepo: row.github_repo,
  };
  if (clientName) {
    return { ...base, clientName };
  }
  return base;
}

export type WebEventRow = {
  id: string;
  web_id: string;
  type: string;
  date: string;
  link: string | null;
  note: string | null;
  amount: number | null;
  created_at?: string;
};

export type WebEvent = {
  id: string;
  webId: string;
  type: string;
  date: Date;
  link: string | null;
  note: string | null;
  amount: number | null;
};

export function toWebEvent(row: WebEventRow): WebEvent {
  return {
    id: row.id,
    webId: row.web_id,
    type: row.type,
    date: new Date(row.date),
    link: row.link,
    note: row.note,
    amount: row.amount != null ? Number(row.amount) : null,
  };
}
