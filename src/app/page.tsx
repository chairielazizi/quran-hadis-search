"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, BookOpen, Sparkles, Loader2 } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e?: React.FormEvent, predefinedQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = predefinedQuery || query;
    if (!searchQuery.trim()) return;

    if (predefinedQuery) setQuery(predefinedQuery);

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal melakukan carian.");
      }

      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight">Quran<span className="text-secondary">Context</span></span>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-16 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten" />

        <div className="w-full max-w-3xl space-y-8 text-center transition-all duration-500 ease-in-out" style={{ marginTop: results.length > 0 ? '0' : '10vh' }}>
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Enjin Carian Semantik AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent pb-2">
              Cari Berdasarkan Maksud.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground opacity-90 max-w-2xl mx-auto">
              Tanya apa sahaja soalan atau situasi kehidupan, sistem AI kami akan mencari ayat Al-Quran yang paling menepati konteks tersebut.
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
                placeholder="Contoh: Apakah sifat orang bertakwa?"
                autoComplete="off"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="h-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex-shrink-0 disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Cari"}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-sm pb-8">
            <span className="text-muted-foreground">Pencarian Popular:</span>
            <span onClick={() => handleSearch(undefined, "Petunjuk jalan yang lurus")} className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 cursor-pointer hover:bg-secondary/20 transition-colors">Jalan yang lurus</span>
            <span onClick={() => handleSearch(undefined, "Kisah kesesatan kaum dahulu")} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 cursor-pointer hover:bg-accent/20 transition-colors">Kaum yang sesat</span>
            <span onClick={() => handleSearch(undefined, "Sifat-sifat orang beriman dan bertakwa")} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">Orang beriman</span>
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="w-full max-w-3xl p-4 mt-8 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="w-full max-w-3xl mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Hasil Carian Al-Quran</h2>
            </div>

            <div className="space-y-6">
              {results.map((verse) => (
                <div key={verse.id} className="group relative bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <BookOpen className="w-24 h-24 text-primary" />
                  </div>

                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold tracking-wider shadow-sm">
                        SURAH {verse.surah_id} : AYAT {verse.verse_id}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium bg-background px-2 py-1 rounded-md border border-border/50">
                        Padanan: {Math.round(verse.similarity * 100)}%
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-6">
                      <div className="text-right">
                        <p className="text-3xl md:text-4xl leading-[2.5] tracking-wide text-foreground font-bold" style={{ fontFamily: "'Amiri', serif" }} dir="rtl">
                          {verse.text_arabic}
                        </p>
                      </div>
                      <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      <div>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                          "{verse.translation_ms}"
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

      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground bg-card/50">
        <p>Data Al-Quran diambil dari sumber terbuka untuk ujian. Tiada tafsiran AI digunakan pada teks asal.</p>
      </footer>
    </div>
  );
}
