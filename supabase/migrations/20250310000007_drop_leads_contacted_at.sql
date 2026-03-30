-- Kontakty se evidují v lead_events; sloupce contacted_at už nepotřebujeme
ALTER TABLE leads DROP COLUMN IF EXISTS contacted_at;
