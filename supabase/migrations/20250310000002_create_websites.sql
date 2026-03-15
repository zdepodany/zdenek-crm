-- Create websites table
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  creation_price DECIMAL(12, 2),
  hosting TEXT NOT NULL DEFAULT 'github_pages' CHECK (hosting IN ('github_pages', 'hukot_cz')),
  url TEXT NOT NULL DEFAULT '',
  github_repo TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create web_events table
CREATE TABLE IF NOT EXISTS web_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  web_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('launch', 'edit', 'shutdown', 'handover', 'billing')),
  date DATE NOT NULL,
  link TEXT,
  note TEXT,
  amount DECIMAL(12, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_web_events_web_id ON web_events(web_id);
CREATE INDEX IF NOT EXISTS idx_web_events_date ON web_events(date DESC);
CREATE INDEX IF NOT EXISTS idx_websites_client_id ON websites(client_id);

ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all websites" ON websites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all web_events" ON web_events FOR ALL USING (true) WITH CHECK (true);
