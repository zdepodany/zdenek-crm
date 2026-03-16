-- Add Vercel to hosting options
ALTER TABLE websites DROP CONSTRAINT IF EXISTS websites_hosting_check;
ALTER TABLE websites ADD CONSTRAINT websites_hosting_check
  CHECK (hosting IN ('github_pages', 'hukot_cz', 'vercel'));

-- Add domain provider column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS domain_provider TEXT NOT NULL DEFAULT '';
ALTER TABLE websites DROP CONSTRAINT IF EXISTS websites_domain_provider_check;
ALTER TABLE websites ADD CONSTRAINT websites_domain_provider_check
  CHECK (domain_provider IN ('', 'wedos', 'forpsi', 'hukot'));
