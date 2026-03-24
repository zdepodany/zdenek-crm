ALTER TABLE lead_events ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Backfill: stabilní pořadí podle data vytvoření (nejstarší = menší sort_order)
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (PARTITION BY lead_id ORDER BY created_at ASC, id ASC) - 1 AS rn
  FROM lead_events
)
UPDATE lead_events le
SET sort_order = ranked.rn
FROM ranked
WHERE le.id = ranked.id;
