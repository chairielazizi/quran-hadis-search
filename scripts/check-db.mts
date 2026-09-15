import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  const { count, error } = await supabase
    .from("hadith_entries")
    .select("*", { count: "exact", head: true });
  
  if (error) {
    console.error("Error checking DB:", error);
  } else {
    console.log(`Total Semua Hadis Dalam Pangkalan Data: ${count}`);
  }
}

checkDb();
