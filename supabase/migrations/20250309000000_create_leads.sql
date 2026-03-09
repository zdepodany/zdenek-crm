-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT NOT NULL DEFAULT '',
  contact TEXT NOT NULL DEFAULT '',
  contact_channel TEXT NOT NULL DEFAULT 'email',
  status TEXT NOT NULL DEFAULT 'new',
  contacted_at TIMESTAMPTZ,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS - service role key bypasses RLS for admin operations
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow all operations (simple single-user app; use service role key for server)
CREATE POLICY "Allow all" ON leads FOR ALL USING (true) WITH CHECK (true);
