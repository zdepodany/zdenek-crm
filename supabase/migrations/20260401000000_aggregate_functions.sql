-- Aggregate PostgreSQL funkce – nahrazují full-table scany v Node.js
-- Každá funkce provádí agregaci přímo v DB a vrací pouze výsledek.

-- 1. Počty poptávek per status + celkový součet
--    Nahrazuje: SELECT status FROM leads  →  stahuje každý řádek jen kvůli počítání
CREATE OR REPLACE FUNCTION get_lead_counts()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    jsonb_object_agg(status, cnt) || jsonb_build_object('total', SUM(cnt)::int),
    '{"total": 0}'::jsonb
  )
  FROM (
    SELECT status, COUNT(*)::int AS cnt
    FROM leads
    GROUP BY status
  ) t;
$$;

-- 2. Celkový součet z fakturace
--    Nahrazuje: SELECT amount FROM web_events WHERE type='billing'  →  stahuje všechny částky
CREATE OR REPLACE FUNCTION get_total_earnings()
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM web_events
  WHERE type = 'billing' AND amount IS NOT NULL;
$$;

-- 3. Nejnovější datum akce per poptávka (volitelně filtrováno dle ID)
--    Nahrazuje: SELECT lead_id, date FROM lead_events ORDER BY date DESC  →  stahuje všechny řádky
CREATE OR REPLACE FUNCTION get_last_contact_dates(filter_lead_ids uuid[] DEFAULT NULL)
RETURNS TABLE(lead_id uuid, last_date date)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lead_id, MAX(date) AS last_date
  FROM lead_events
  WHERE filter_lead_ids IS NULL OR lead_id = ANY(filter_lead_ids)
  GROUP BY lead_id;
$$;

-- 4. Bulk update pořadí akcí poptávky v jednom dotazu
--    Nahrazuje: N × UPDATE lead_events SET sort_order = X WHERE id = Y
CREATE OR REPLACE FUNCTION reorder_lead_events(updates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item jsonb;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(updates)
  LOOP
    UPDATE lead_events
    SET sort_order = (item->>'sort_order')::int
    WHERE id = (item->>'id')::uuid
      AND lead_id = (item->>'lead_id')::uuid;
  END LOOP;
END;
$$;

-- Složený index pro efektivní MAX(date) GROUP BY lead_id
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id_date
  ON lead_events(lead_id, date DESC);
