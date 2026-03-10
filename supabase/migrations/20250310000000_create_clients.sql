-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT NOT NULL DEFAULT '',
  web TEXT NOT NULL DEFAULT '',
  ico TEXT NOT NULL DEFAULT '',
  cooperation_start_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS - service role key bypasses RLS for admin operations
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow all operations (simple single-user app; use service role key for server)
CREATE POLICY "Allow all" ON clients FOR ALL USING (true) WITH CHECK (true);
