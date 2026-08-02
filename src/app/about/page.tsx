"use client";

import { useLanguage } from "@/components/language-provider";
import { Mail, ExternalLink, Heart, Coffee } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col flex-1 w-full items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background elements to match homepage theme */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten" />

      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-4">
            {language === "ms" ? "Kenali Pembangun" : "About the Dev"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "ms"
              ? "Ketahui lebih lanjut mengenai pembangun di sebalik QuranContext."
              : "Learn more about the developer behind QuranContext."}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-3xl p-8 sm:p-12 shadow-xl border border-border/50 relative overflow-hidden backdrop-blur-sm group">
          <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
            {/* Avatar */}
            <div className="w-40 h-40 rounded-full bg-muted border-4 border-background shadow-lg overflow-hidden shrink-0 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <Image
                src="/dev_pic.jpg"
                alt="Chairiel Azizi"
                fill
                sizes="160px"
                className="object-cover scale-[1.6] origin-[40%_55%]"
              />
            </div>

            <div className="text-center md:text-left space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Chairiel Azizi</h2>
              <p className="text-primary font-medium tracking-wide uppercase text-sm">
                {language === "ms" ? "Pembangun Perisian" : "Software Developer"}
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {language === "ms"
                  ? "Seorang Pembangun Perisian yang bermotivasi tinggi dengan pengalaman praktikal dalam membangunkan aplikasi web menggunakan teknologi seperti Java, C#, ASP.NET, dan kerangka PHP Laravel berserta Vue JS. Berpangkalan di Malaysia, Truly Asia."
                  : "A highly motivated Software Developer with hands-on experience in developing web applications, using technologies such as Java, C#, ASP.NET, and PHP Laravel framework with Vue JS. Based in Malaysia, truly Asia."}
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <a
                  href="https://aku.airiel.space/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Portfolio
                </a>
                <a
                  href="https://github.com/chairielazizi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors cursor-pointer border border-secondary/20"
                  title="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/chairielazizi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer border border-accent/20"
                  title="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
                <a
                  href="mailto:chairielazizi@gmail.com"
                  className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer border border-primary/20"
                  title="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-12 bg-card rounded-3xl p-8 border border-border shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 text-primary/10">
            <Heart className="w-24 h-24 rotate-12" />
          </div>

          <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <Coffee className="w-6 h-6 text-amber-500" />
            {language === "ms" ? "Sokong Pembangun" : "Support the Developer"}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            {language === "ms"
              ? "Jika aplikasi ini bermanfaat untuk anda, anda boleh memberikan sumbangan ikhlas bagi menyokong kos penyelenggaraan pelayan."
              : "If you find this application helpful, consider buying me a coffee to support server maintenance costs."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-48 h-48 bg-white p-2 rounded-2xl shadow-inner border border-zinc-200 relative overflow-hidden group">
              <Image
                src="/qr_code.JPG"
                alt="DuitNow QR Code"
                fill
                sizes="192px"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {language === "ms" ? "Imbas QR DuitNow" : "Scan DuitNow QR"}
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-xs">
              (140164310320 TNG E-Wallet)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
