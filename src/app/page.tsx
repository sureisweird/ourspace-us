"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Heart, Sparkle, Calendar } from "@phosphor-icons/react";

import PinGate from "@/components/PinGate";
import GiftBoxHero from "@/components/GiftBoxHero";
import MemoryLane from "@/components/MemoryLane";
import SplitContent from "@/components/SplitContent";
import RetroIpodFooter, { SONG_SRC } from "@/components/RetroIpodFooter";
import FloralDecor from "@/components/FloralDecor";

// FIX #6: Urutan akses:
//   1. PinGate  → user memasukkan PIN
//   2. GiftBoxHero → animasi buka kado
//   3. Konten utama website
type AppStage = "pin" | "gift" | "main";

export default function Home() {
  const [stage, setStage] = useState<AppStage>("pin");
  const mainContentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useGSAP(
    () => {
      if (stage !== "main") return;

      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.1,
          // FIX: setelah konten utama selesai masuk, layout sudah final.
          // Refresh ScrollTrigger agar posisi trigger kartu milestone dihitung
          // ulang dan tidak ada kartu yang tertinggal di opacity:0.
          onComplete: () => ScrollTrigger.refresh(),
        }
      );

      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
    },
    { dependencies: [stage] }
  );

  return (
    <div className="relative min-h-dvh overflow-x-hidden selection:bg-[#FFD1DC] selection:text-[#2A1F1D] bg-linear-to-tr from-[#FFF7F6] via-[#FFFDF9] to-[#FFF5F2]">
      <audio
        ref={audioRef}
        src={SONG_SRC}
        preload="metadata"
        aria-hidden="true"
      />

      {/* Stage 1: PIN Gate */}
      {stage === "pin" && (
        <PinGate onUnlocked={() => setStage("gift")} />
      )}

      {/* Stage 2: Gift Box intro */}
      {stage === "gift" && (
        <GiftBoxHero onOpenComplete={() => setStage("main")} audioRef={audioRef} />
      )}

      {/* Stage 3: Konten utama */}
      {stage === "main" && (
        <>
          {/* Ambient floating petals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute animate-leaf bg-[#FFA2B6]/10 rounded-full" style={{ left: "10%", width: "24px", height: "18px", animationDelay: "0s", animationDuration: "16s" }} />
            <div className="absolute animate-leaf bg-[#FFC8DD]/15 rounded-full" style={{ left: "40%", width: "16px", height: "12px", animationDelay: "4s", animationDuration: "20s" }} />
            <div className="absolute animate-leaf bg-[#FFE5D9]/20 rounded-full" style={{ left: "70%", width: "20px", height: "22px", animationDelay: "2s", animationDuration: "14s" }} />
            <div className="absolute animate-leaf bg-[#FFA2B6]/12 rounded-full" style={{ left: "85%", width: "14px", height: "16px", animationDelay: "8s", animationDuration: "18s" }} />
            <div className="absolute animate-leaf bg-[#FFCAD4]/10 rounded-full" style={{ left: "25%", width: "22px", height: "20px", animationDelay: "10s", animationDuration: "22s" }} />
          </div>

          {/* Navigation Header */}
          <header
            ref={headerRef}
            className="h-24 w-full px-6 md:px-12 flex items-center justify-between z-40 relative max-w-7xl mx-auto"
          >
            <div className="flex items-center gap-2">
              <Heart size={20} weight="fill" className="text-[#E5989B]" />
              <span className="font-sans font-light text-sm tracking-[0.2em] uppercase text-[#2A1F1D]">
                OUR SPACE
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-10 text-xs font-mono text-[#2A1F1D]/70 tracking-wider">
              <a href="#memories" className="hover:text-[#E5989B] transition-colors">
                01 / MEMORIES
              </a>
              <a href="#milestones" className="hover:text-[#E5989B] transition-colors">
                02 / MILESTONES
              </a>
              <a href="#letter" className="hover:text-[#E5989B] transition-colors">
                03 / LETTER
              </a>
            </nav>

            <div className="flex items-center gap-2 border border-[#F2E5E3] bg-[#FFFBF9]/80 px-4 py-2 rounded-full shadow-sm text-xs font-mono text-[#2A1F1D]/80">
              <Calendar size={14} className="text-[#E5989B]" />
              <span>Est. June 14</span>
            </div>
          </header>

          {/* Main Content */}
          <main ref={mainContentRef} className="relative z-10">
            {/* Hero Intro */}
            <section className="pt-16 pb-24 px-6 max-w-5xl mx-auto text-center relative">
              <FloralDecor />

              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[#FFB7B2]/40 animate-pulse z-10">
                <Sparkle size={32} weight="fill" />
              </div>

              <h1 className="relative z-10 text-5xl md:text-7xl font-sans tracking-tight leading-[1.1] font-light text-[#2A1F1D] mb-8 max-w-4xl mx-auto">
                Celebrating our beautiful <br />
                <span className="font-cursive text-6xl md:text-8xl text-[#E5989B]">odyssey of love</span>.
              </h1>

              <p className="relative z-10 text-[#2A1F1D]/75 text-base md:text-lg leading-relaxed max-w-[60ch] mx-auto font-light mb-12">
                A digital garden containing the milestones, memories, and songs that have woven our hearts together. Welcome to our space.
              </p>

              <div className="relative z-10 flex justify-center gap-6">
                <a
                  href="#memories"
                  className="px-6 py-3 rounded-full bg-[#E5989B] hover:bg-[#B56576] text-white font-mono text-xs font-medium tracking-wider shadow-md active:scale-95 transition-all duration-300"
                >
                  EXPLORE ARCHIVES
                </a>
                <a
                  href="#letter"
                  className="px-6 py-3 rounded-full border border-[#E5989B]/30 hover:border-[#E5989B] bg-[#FFFBF9]/80 text-[#2A1F1D]/80 hover:text-[#2A1F1D] font-mono text-xs font-medium tracking-wider shadow-sm active:scale-95 transition-all duration-300"
                >
                  READ LETTER
                </a>
              </div>
            </section>

            <MemoryLane />
            <SplitContent />
            <RetroIpodFooter audioRef={audioRef} />
            <div className="py-12 border-t border-[#F2E5E3] text-center font-mono text-[10px] text-[#2A1F1D]/50 tracking-widest uppercase">
              <span>Made with love &copy; {new Date().getFullYear()}</span>
            </div>
          </main>
        </>
      )}
    </div>
  );
}