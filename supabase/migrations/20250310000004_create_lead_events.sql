-- Create lead_events table
CREATE TABLE IF NOT EXISTS lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'contact_initiated', 'contact_received', 'reply_received',
    'proposal_sent', 'rejected', 'completed'
  )),
  date DATE NOT NULL,
  method TEXT CHECK (method IN ('osobne', 'email', 'sms', 'telefonicky', 'instagram', 'facebook')),
  note TEXT,
  web_id UUID REFERENCES websites(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_events_date ON lead_events(date DESC);

ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all lead_events" ON lead_events FOR ALL USING (true) WITH CHECK (true);
