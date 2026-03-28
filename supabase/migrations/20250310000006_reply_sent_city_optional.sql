-- Město u poptávky nepovinné
ALTER TABLE leads ALTER COLUMN city DROP NOT NULL;

-- Nový typ akce u poptávky: odpověděl jsem
ALTER TABLE lead_events DROP CONSTRAINT IF EXISTS lead_events_type_check;
ALTER TABLE lead_events ADD CONSTRAINT lead_events_type_check CHECK (type IN (
  'contact_initiated',
  'contact_received',
  'reply_received',
  'reply_sent',
  'proposal_sent',
  'rejected',
  'completed'
));
