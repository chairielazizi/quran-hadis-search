import { ThemeToggle } from "@/components/theme-toggle";
import { Search, BookOpen, Sparkles, Moon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
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

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten" />

        <div className="w-full max-w-3xl space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Enjin Carian Semantik AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent pb-2">
              Cari Berdasarkan Maksud, Bukan Sekadar Kata Kunci.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground opacity-90 max-w-2xl mx-auto">
              Tanya apa sahaja soalan atau situasi kehidupan, sistem AI kami akan mencari ayat Al-Quran dan Hadis yang paling menepati konteks tersebut.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-2xl mx-auto mt-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center w-full h-16 rounded-2xl bg-card border border-border overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
              <div className="pl-6 text-muted-foreground flex-shrink-0">
                <Search className="h-6 w-6 text-primary/70" />
              </div>
              <input
                className="w-full h-full px-4 text-lg bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60"
                type="text"
                placeholder="Contoh: Bagaimana menguruskan tekanan dan kesedihan?"
                autoComplete="off"
              />
              <button className="h-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex-shrink-0">
                Cari
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 text-sm">
            <span className="text-muted-foreground">Pencarian Popular:</span>
            <span className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 cursor-pointer hover:bg-secondary/20 transition-colors">Adab berhutang</span>
            <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 cursor-pointer hover:bg-accent/20 transition-colors">Menjaga lisan</span>
            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">Ujian kehidupan</span>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground bg-card/50">
        <p>Data Al-Quran dan Hadis diambil dari sumber sahih dan disahkan.</p>
      </footer>
    </div>
  );
}
