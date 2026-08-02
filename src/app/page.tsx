"use client";

import { useState } from "react";
import { Search, BookOpen, Sparkles, Loader2, BookText } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState<"quran" | "hadith">("quran");
  const { language } = useLanguage();

  const texts = {
    ms: {
      title: "Cari Berdasarkan Maksud.",
      subtitle: "Tanya apa sahaja soalan atau situasi kehidupan, sistem AI kami akan mencari ayat Al-Quran atau Hadis yang paling menepati konteks tersebut.",
      placeholder: searchType === "quran" ? "Contoh: Apakah sifat orang bertakwa?" : "Contoh: Niat dan amalan",
      searchBtn: "Cari",
      quranTab: "Al-Quran",
      hadithTab: "Hadis",
      popular: "Pencarian Popular:",
      resultsTitle: searchType === "quran" ? "Hasil Carian Al-Quran" : "Hasil Carian Hadis",
      match: "Padanan",
      footer: "Data diambil dari sumber terbuka untuk ujian. Tiada tafsiran AI digunakan pada teks asal.",
    },
    en: {
      title: "Search by Meaning.",
      subtitle: "Ask any question or life situation, and our AI system will find the most contextually relevant Quranic verses or Hadith.",
      placeholder: searchType === "quran" ? "Example: What are the traits of the righteous?" : "Example: Intentions and deeds",
      searchBtn: "Search",
      quranTab: "Quran",
      hadithTab: "Hadith",
      popular: "Popular Searches:",
      resultsTitle: searchType === "quran" ? "Quran Search Results" : "Hadith Search Results",
      match: "Match",
      footer: "Data sourced from open-source APIs for testing. No AI interpretation is applied to original texts.",
    }
  };

  const t = texts[language];

  const handleSearch = async (e?: React.FormEvent, predefinedQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = predefinedQuery || query;
    if (!searchQuery.trim()) return;

    if (predefinedQuery) setQuery(predefinedQuery);

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, type: searchType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (language === "ms" ? "Gagal melakukan carian." : "Search failed."));
      }

      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full">

      <main className="flex-1 flex flex-col items-center py-12 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten" />

        <div className="w-full max-w-3xl space-y-8 text-center transition-all duration-500 ease-in-out" style={{ marginTop: results.length > 0 ? '0' : '5vh' }}>
          
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-secondary/10 p-1 rounded-2xl flex gap-1 border border-secondary/20">
              <button
                onClick={() => { setSearchType("quran"); setResults([]); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${searchType === "quran" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <BookOpen className="w-4 h-4" />
                {t.quranTab}
              </button>
              <button
                onClick={() => { setSearchType("hadith"); setResults([]); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${searchType === "hadith" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <BookText className="w-4 h-4" />
                {t.hadithTab}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-primary/10 text-primary mb-2 border border-primary/20 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">AI Semantic Search</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent pb-2">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground opacity-90 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto mt-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center w-full h-16 rounded-2xl bg-card border border-border overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
              <div className="pl-6 text-muted-foreground flex-shrink-0">
                <Search className="h-6 w-6 text-primary/70" />
              </div>
              <input
                className="w-full h-full px-4 text-lg bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.placeholder}
                autoComplete="off"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="h-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex-shrink-0 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t.searchBtn}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-sm pb-8">
            <span className="text-muted-foreground">{t.popular}</span>
            <span onClick={() => handleSearch(undefined, language === "ms" ? "Jalan yang lurus" : "The straight path")} className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 cursor-pointer hover:bg-secondary/20 transition-colors">{language === "ms" ? "Jalan yang lurus" : "Straight path"}</span>
            <span onClick={() => handleSearch(undefined, language === "ms" ? "Kisah umat terdahulu" : "Stories of the past nations")} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 cursor-pointer hover:bg-accent/20 transition-colors">{language === "ms" ? "Umat terdahulu" : "Past nations"}</span>
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="w-full max-w-3xl p-4 mt-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="w-full max-w-3xl mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              {searchType === "quran" ? <BookOpen className="h-5 w-5 text-primary" /> : <BookText className="h-5 w-5 text-primary" />}
              <h2 className="text-xl font-bold">{t.resultsTitle}</h2>
            </div>

            <div className="space-y-6">
              {results.map((item) => (
                <div key={item.id} className="group relative bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    {searchType === "quran" ? <BookOpen className="w-24 h-24 text-primary" /> : <BookText className="w-24 h-24 text-primary" />}
                  </div>

                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold tracking-wider shadow-sm uppercase">
                        {searchType === "quran" 
                          ? `SURAH ${item.surah_id} : ${language === "ms" ? "AYAT" : "VERSE"} ${item.verse_id}`
                          : `SAHIH ${item.collection_name} : ${language === "ms" ? "HADIS" : "HADITH"} ${item.hadith_number}`}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium bg-background px-2 py-1 rounded-md border border-border/50">
                        {t.match}: {Math.round(item.similarity * 100)}%
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-6">
                      <div className="text-right">
                        <p className="text-3xl md:text-4xl leading-[2.5] tracking-wide text-foreground font-bold" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
                          {item.text_arabic}
                        </p>
                      </div>
                      <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      <div>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                          "{language === "ms" ? item.translation_ms : (item.translation_en || item.translation_ms)}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground bg-card/50 mt-12">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
