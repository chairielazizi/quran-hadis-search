"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, UserCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "./language-provider";

export function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity cursor-pointer">
          <Image src="/logo.png" alt="QuranHadisContext Logo" width={48} height={48} className="rounded-md" />
          <span className="font-bold text-xl tracking-tight">Quran<span className="text-secondary">Hadis</span><span className="text-accent">Context</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 cursor-pointer"
            title={language === "ms" ? "Kenali Pembangun" : "About Developer"}
          >
            <UserCircle className="w-5 h-5" />
            <span className="hidden sm:inline-block">
              {language === "ms" ? "Kenali Pembangun" : "About the Dev"}
            </span>
          </Link>
          <button
            onClick={() => setLanguage(language === "ms" ? "en" : "ms")}
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors px-2 py-1 cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            {language === "ms" ? "BM" : "EN"}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
