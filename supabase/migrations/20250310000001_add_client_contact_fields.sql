-- Add contact person and phone to clients
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS contact_person TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '';
