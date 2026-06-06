"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HeartIcon, SparkleIcon, CalendarIcon } from "@phosphor-icons/react";

import PinGate from "@/components/PinGate";
import GiftBoxHero from "@/components/GiftBoxHero";
import MemoryLane from "@/components/MemoryLane";
import SplitContent from "@/components/SplitContent";
import RetroIpodFooter, { SONG_SRC } from "@/components/RetroIpodFooter";
import FloralDecor from "@/components/FloralDecor";

type AppStage = "pin" | "gift" | "main";

export default function Home() {
  const [stage, setStage] = useState<AppStage>("pin");
  const mainContentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useGSAP(
    () => {
      if (stage !== "main") return;
      const prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.1,
          onComplete: () => {
            document.body.style.overflow = prevBodyOverflow;
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
            });
          },
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
    <div className="relative min-h-dvh overflow-hidden selection:bg-accent/30 selection:text-foreground bg-linear-to-tr from-background via-surface to-accent/5">
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
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
            <div className="absolute animate-leaf bg-accent/10 rounded-full" style={{ left: "10%", width: "24px", height: "18px", animationDelay: "0s", animationDuration: "16s" }} />
            <div className="absolute animate-leaf bg-accent/15 rounded-full" style={{ left: "40%", width: "16px", height: "12px", animationDelay: "4s", animationDuration: "20s" }} />
            <div className="absolute animate-leaf bg-accent-strong/10 rounded-full" style={{ left: "70%", width: "20px", height: "22px", animationDelay: "2s", animationDuration: "14s" }} />
            <div className="absolute animate-leaf bg-accent/12 rounded-full" style={{ left: "85%", width: "14px", height: "16px", animationDelay: "8s", animationDuration: "18s" }} />
            <div className="absolute animate-leaf bg-accent/10 rounded-full" style={{ left: "25%", width: "22px", height: "20px", animationDelay: "10s", animationDuration: "22s" }} />
          </div>

          {/* Navigation Header — absolute transparent */}
          <header
            ref={headerRef}
            className="absolute top-0 left-0 z-40 w-full bg-transparent"
          >
            <div className="h-20 w-full px-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-2">
                <HeartIcon size={20} weight="fill" className="text-accent" />
                <span className="font-sans font-light text-sm tracking-[0.2em] uppercase text-foreground">
                  OUR SPACE
                </span>
              </div>

              <nav className="hidden md:flex items-center gap-10 text-xs font-mono text-foreground/70 tracking-wider">
                <a
                  href="#memories"
                  className="focus-ring rounded-inner transition-colors duration-300 ease-spring hover:text-accent"
                >
                  01 / MEMORIES
                </a>
                <a
                  href="#milestones"
                  className="focus-ring rounded-inner transition-colors duration-300 ease-spring hover:text-accent"
                >
                  02 / MILESTONES
                </a>
                <a
                  href="#letter"
                  className="focus-ring rounded-inner transition-colors duration-300 ease-spring hover:text-accent"
                >
                  03 / LETTER
                </a>
              </nav>

              <div className="flex items-center gap-2 border border-foreground/10 bg-surface/70 px-4 py-2 rounded-full shadow-elevation-1 text-xs font-mono text-foreground/80">
                <CalendarIcon size={14} weight="regular" className="text-accent" />
                <span>Est. June 14</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main ref={mainContentRef} className="relative z-10">
            {/* Hero Intro */}
            <section className="w-full h-dvh min-h-[550px] flex flex-col justify-center items-center px-6 md:px-12 relative overflow-hidden">
              <FloralDecor />

              <div
                className="absolute top-12 left-1/2 -translate-x-1/2 text-accent/40 animate-pulse-slow z-10 pointer-events-none"
                aria-hidden="true"
              >
                <SparkleIcon size={32} weight="fill" />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                <h1 className="text-display font-sans font-bold tracking-tight text-balance text-foreground mb-block">
                  Celebrating our beautiful <br />
                  <span className="font-cursive font-normal text-6xl md:text-8xl text-accent">odyssey of love</span>.
                </h1>

                <p className="text-body text-foreground/75 max-w-[60ch] mx-auto font-light mb-block">
                  A digital garden containing the milestones, memories, and songs that have woven our hearts together. Welcome to our space.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="#memories"
                    className="focus-ring rounded-pill bg-accent hover:bg-accent-strong text-surface font-mono text-xs font-medium tracking-wider px-8 py-3.5 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 ease-spring hover:-translate-y-0.5 active:scale-95"
                  >
                    EXPLORE ARCHIVES
                  </a>
                  <a
                    href="#letter"
                    className="focus-ring rounded-pill border border-accent/30 hover:border-accent bg-surface/80 text-foreground/80 hover:text-foreground font-mono text-xs font-medium tracking-wider px-8 py-3.5 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 ease-spring hover:-translate-y-0.5 active:scale-95"
                  >
                    READ LETTER
                  </a>
                </div>
              </div>
            </section>

            <MemoryLane />
            <SplitContent />
            <RetroIpodFooter audioRef={audioRef} />
            <div className="py-12 border-t border-foreground/10 text-center font-mono text-[10px] text-foreground/50 tracking-widest uppercase">
              <span>Made with love &copy; {new Date().getFullYear()}</span>
            </div>
          </main>
        </>
      )}
    </div>
  );
}