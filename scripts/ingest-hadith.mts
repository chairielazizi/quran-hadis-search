import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const geminiApiKey = process.env.GEMINI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

async function fetchJSON(url: string) {
  const res = await fetch(url);
  return res.json();
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("📥 Memuat turun data Hadis Bukhari (Arab, Inggeris & Indonesia/Melayu)...");

  try {
    const [arabicData, englishData, malayData] = await Promise.all([
      fetchJSON("https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json"),
      fetchJSON("https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.json"),
      fetchJSON("https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ind-bukhari.json")
    ]);

    const hadithArabic = arabicData.hadiths;
    const hadithEnglish = englishData.hadiths;
    const hadithMalay = malayData.hadiths; // Indonesian used as Malay

    console.log(`✅ Berjaya memuat turun ${hadithArabic.length} hadis Bukhari.`);

    console.log("🔍 Menyemak pangkalan data untuk hadis yang telah diproses...");
    
    let allExistingData: any[] = [];
    let from = 0;
    const pageSize = 1000;

    while (true) {
      const { data, error: fetchError } = await supabase
        .from("hadith_entries")
        .select("collection_name, hadith_number")
        .eq("collection_name", "bukhari")
        .range(from, from + pageSize - 1);

      if (fetchError) {
        throw new Error(`Gagal menyemak pangkalan data: ${fetchError.message}`);
      }

      if (!data || data.length === 0) break;
      
      allExistingData.push(...data);
      if (data.length < pageSize) break;
      from += pageSize;
    }

    const existingHadiths = new Set(allExistingData.map((h) => `${h.collection_name}:${h.hadith_number}`));
    console.log(`✅ Terdapat ${existingHadiths.size} hadis Bukhari unik yang sudah siap diproses.`);

    const batchSize = 100;
    const limitHadith = hadithArabic.length;

    console.log(`⏳ Memulakan sambungan proses Vector Embeddings untuk hadis yang belum siap...`);

    for (let i = 0; i < limitHadith; i += batchSize) {
      const batchArabic = hadithArabic.slice(i, i + batchSize);
      const batchEnglish = hadithEnglish.slice(i, i + batchSize);
      const batchMalay = hadithMalay.slice(i, i + batchSize);

      const hadithsToProcess = [];
      for (let j = 0; j < batchArabic.length; j++) {
        if (!existingHadiths.has(`bukhari:${batchArabic[j].hadithnumber}`)) {
          hadithsToProcess.push({ 
            arabic: batchArabic[j], 
            english: batchEnglish[j],
            malay: batchMalay[j] 
          });
        }
      }

      if (hadithsToProcess.length === 0) continue;

      console.log(`🤖 Menjana embedding secara pukal (Batching) untuk ${hadithsToProcess.length} hadis...`);

      // Menggunakan teks terjemahan untuk menjana vektor, kerana ia lebih berkesan untuk carian
      const requests = hadithsToProcess.map(h => ({
        content: { role: "user", parts: [{ text: `Hadis Bukhari ${h.arabic.hadithnumber}: ${h.malay.text}` }] }
      }));

      let retries = 168; // 7 hari
      while (retries > 0) {
        try {
          const result = await model.batchEmbedContents({ requests });
          
          const hadithsToInsert = hadithsToProcess.map((h, idx) => ({
            collection_name: "bukhari",
            hadith_number: String(h.arabic.hadithnumber),
            text_arabic: h.arabic.text,
            translation_ms: h.malay.text,
            translation_en: h.english.text,
            embedding: result.embeddings[idx].values,
          }));

          console.log(`💾 Menyimpan ${hadithsToInsert.length} hadis ke dalam Supabase...`);
          const { error } = await supabase
            .from("hadith_entries")
            .insert(hadithsToInsert);

          if (error) {
            console.error("❌ Ralat menyimpan ke Supabase:", error);
          } else {
            console.log(`✅ Berjaya menyimpan batch hadis ${i + 1} - ${i + batchArabic.length}`);
          }

          console.log("⏳ Berehat 60 saat untuk mematuhi had laju API per minit...");
          await delay(60000);
          break;
        } catch (error: any) {
          retries--;
          const errorMessage = error.message || "";
          console.error(`⚠️ Ralat Batching:`, errorMessage);
          
          if (errorMessage.includes("PerMinute")) {
            console.log(`⏳ Quota minit tamat. Sistem akan berehat selama 60 saat sebelum mencuba lagi...`);
            await delay(60000);
          } else if (errorMessage.includes("PerDay") || errorMessage.includes("Quota exceeded")) {
            console.log(`⏳ Quota harian Gemini telah tamat. Sistem akan berehat selama 1 jam sebelum mencuba lagi... (Baki cubaan: ${retries} jam)`);
            await delay(60 * 60 * 1000); // Tunggu 1 jam
          } else {
            console.log(`⏳ Ralat rangkaian. Sistem akan berehat 5 saat sebelum mencuba lagi...`);
            await delay(5000);
          }

          if (retries === 0) {
            throw new Error(`❌ Gagal sepenuhnya untuk batch hadis ini selepas maksimum percubaan (7 hari).`);
          }
        }
      }
    }

    console.log("🎉 Proses Ingestion Hadis Bukhari Selesai!");
  } catch (error) {
    console.error("❌ Ralat:", error);
  }
}

main();
