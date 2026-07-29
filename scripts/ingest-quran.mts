import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

// Muat pembolehubah dari .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
// Menggunakan model embedding dari Gemini
const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

async function fetchJSON(url: string) {
  const res = await fetch(url);
  return res.json();
}

// Fungsi bantu untuk lengah (delay) bagi mengelakkan limit API Gemini (Rate Limit)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("📥 Memuat turun data Al-Quran (Arab & Melayu)...");

  try {
    // Sumber terbuka dari fawazahmed0/quran-api (menggunakan cdn.jsdelivr.net/gh/)
    const [arabicData, malayData] = await Promise.all([
      fetchJSON("https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmanihaf.json"),
      fetchJSON("https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/msa-abdullahmuhamma.json")
    ]);

    const quranArabic = arabicData.quran;
    const quranMalay = malayData.quran;

    console.log(`✅ Berjaya memuat turun ${quranArabic.length} ayat.`);

    // 1. Dapatkan senarai ayat yang sudah ada di dalam pangkalan data untuk mengelakkan duplikasi
    console.log("🔍 Menyemak pangkalan data untuk ayat yang telah diproses...");
    
    let allExistingData: any[] = [];
    let from = 0;
    const pageSize = 1000;

    while (true) {
      const { data, error: fetchError } = await supabase
        .from("quran_verses")
        .select("surah_id, verse_id")
        .range(from, from + pageSize - 1);

      if (fetchError) {
        throw new Error(`Gagal menyemak pangkalan data: ${fetchError.message}`);
      }

      if (!data || data.length === 0) break;
      
      allExistingData.push(...data);
      if (data.length < pageSize) break;
      from += pageSize;
    }

    const existingVerses = new Set(allExistingData.map((v) => `${v.surah_id}:${v.verse_id}`));
    console.log(`✅ Terdapat ${existingVerses.size} ayat unik yang sudah siap diproses.`);

    // proses secara berkumpulan (batch) untuk elak Limit API
    const batchSize = 90;
    const limitAyat = quranArabic.length;

    console.log(`⏳ Memulakan sambungan proses Vector Embeddings untuk ayat yang belum siap...`);

    for (let i = 0; i < limitAyat; i += batchSize) {
      const batchArabic = quranArabic.slice(i, i + batchSize);
      const batchMalay = quranMalay.slice(i, i + batchSize);

      // Filter out existing ones
      const versesToProcess = [];
      for (let j = 0; j < batchArabic.length; j++) {
        if (!existingVerses.has(`${batchArabic[j].chapter}:${batchArabic[j].verse}`)) {
          versesToProcess.push({ arabic: batchArabic[j], malay: batchMalay[j] });
        }
      }

      if (versesToProcess.length === 0) {
        continue;
      }

      console.log(`🤖 Menjana embedding secara pukal (Batching) untuk ${versesToProcess.length} ayat...`);

      const requests = versesToProcess.map(v => ({
        content: { parts: [{ text: `Surah ${v.arabic.chapter}, Ayat ${v.arabic.verse}: ${v.malay.text}` }] }
      }));

      let retries = 168; // Cuba selama 7 hari (1 jam sekali)
      while (retries > 0) {
        try {
          const result = await model.batchEmbedContents({ requests });

          const versesToInsert = versesToProcess.map((v, idx) => ({
            surah_id: v.arabic.chapter,
            verse_id: v.arabic.verse,
            text_arabic: v.arabic.text,
            translation_ms: v.malay.text,
            translation_en: null,
            embedding: result.embeddings[idx].values,
          }));

          console.log(`💾 Menyimpan ${versesToInsert.length} ayat ke dalam Supabase...`);
          const { error } = await supabase
            .from("quran_verses")
            .insert(versesToInsert);

          if (error) {
            console.error("❌ Error menyimpan ke Supabase:", error);
          } else {
            console.log(`✅ Berjaya menyimpan batch ayat ${i + 1} - ${i + batchArabic.length}`);
          }

          // Rehat 60 saat untuk melepasi kuota 100 RPM (Requests Per Minute)
          console.log("⏳ Berehat 60 saat untuk mematuhi had laju API per minit...");
          await delay(60000);
          break;
        } catch (error: any) {
          retries--;
          const errorMessage = error.message || "";
          console.error(`⚠️ Error Batching:`, errorMessage);

          if (errorMessage.includes("PerMinute")) {
            console.log(`⏳ Quota minit tamat. Sistem akan berehat selama 60 saat sebelum mencuba lagi...`);
            await delay(60000);
          } else if (errorMessage.includes("PerDay") || errorMessage.includes("Quota exceeded")) {
            console.log(`⏳ Quota harian Gemini telah tamat. Sistem akan berehat selama 1 jam sebelum mencuba lagi... (Baki cubaan: ${retries} jam)`);
            await delay(60 * 60 * 1000); // Tunggu 1 jam
          } else {
            console.log(`⏳ Error rangkaian. Sistem akan berehat 5 saat sebelum mencuba lagi...`);
            await delay(5000); // Tunggu 5 saat untuk error biasa
          }

          if (retries === 0) {
            throw new Error(`❌ Gagal sepenuhnya untuk batch ayat ini selepas maksimum percubaan (7 hari). Proses dihentikan untuk mengelakkan kehilangan data.`);
          }
        }
      }

    }

    console.log("🎉 Proses Ingestion Selesai!");

  } catch (error) {
    console.error("❌ Error utama:", error);
  }
}

main();
