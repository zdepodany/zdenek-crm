import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });
config({ path: ".env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const leads = [
  {
    company_name: "Tech Solutions s.r.o.",
    city: "Praha",
    website: "https://techsolutions.cz",
    contact: "jan.novak@techsolutions.cz",
    contact_channel: "email",
    status: "contacted",
    notes: "Interested in enterprise plan. Follow up next week.",
  },
  {
    company_name: "Local Bakery",
    city: "Brno",
    website: "https://localbakery.cz",
    contact: "+420 123 456 789",
    contact_channel: "phone",
    status: "replied",
    notes: "Asked for pricing. Sent proposal.",
  },
  {
    company_name: "Fashion Store",
    city: "Ostrava",
    website: "https://fashionstore.cz",
    contact: "@fashionstore_cz",
    contact_channel: "instagram",
    status: "new",
    notes: "Found via Instagram. Need to reach out.",
  },
  {
    company_name: "Green Energy Ltd",
    city: "Plzeň",
    website: "https://greenenergy.cz",
    contact: "info@greenenergy.cz",
    contact_channel: "email",
    status: "proposal_sent",
    notes: "Proposal sent. Waiting for response.",
  },
  {
    company_name: "Coffee House",
    city: "Liberec",
    website: "https://coffeehouse.cz",
    contact: "Coffee House FB",
    contact_channel: "facebook",
    status: "won",
    notes: "Signed contract. Great customer!",
  },
  {
    company_name: "Startup Hub",
    city: "Praha",
    website: "https://startuphub.io",
    contact: "hello@startuphub.io",
    contact_channel: "email",
    status: "lost",
    notes: "Went with competitor. Budget constraints.",
  },
];

async function main() {
  console.log("Seeding database...");

  const { error } = await supabase.from("leads").insert(leads);

  if (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }

  console.log(`Created ${leads.length} leads.`);
}

main();
