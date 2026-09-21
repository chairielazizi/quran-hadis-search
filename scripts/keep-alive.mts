import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function keepAlive() {
  console.log("Membina sambungan ke Supabase untuk mengelakkan auto-pause...");
  
  // Melakukan operasi GET sebenar, bukan sekadar HEAD request
  const { data, error } = await supabase
    .from("hadith_entries")
    .select("id")
    .limit(1);
    
  if (error) {
    console.error("❌ Ralat ketika ping Supabase:", error.message);
    process.exit(1);
  } else {
    console.log("✅ Supabase berjaya dipanggil. Pangkalan data aktif!");
    console.log("Data diterima:", data);
  }
}

keepAlive();
