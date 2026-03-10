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
  web: string;
  ico: string;
  cooperationStartDate: Date | null;
};

export function toClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    contactEmail: row.contact_email,
    web: row.web,
    ico: row.ico,
    cooperationStartDate: row.cooperation_start_date
      ? new Date(row.cooperation_start_date)
      : null,
  };
}
