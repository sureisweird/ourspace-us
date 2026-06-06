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
import MusicLetterFooter, { SONG_SRC } from "@/components/MusicLetterFooter";
import FloralDecor from "@/components/FloralDecor";
import AmbientPetals from "@/components/AmbientPetals";
import PolaroidCard from "@/components/PolaroidCard";

type AppStage = "pin" | "gift" | "main";

export default function Home() {
  const [stage, setStage] = useState<AppStage>("pin");
  const [giftTransitionComplete, setGiftTransitionComplete] = useState(false);
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
          // PENTING: hapus transform sisa setelah animasi.
          // GSAP meninggalkan `transform: translate(0px,0px)` inline di <main>,
          // yang membuat containing block untuk descendant `position: fixed`.
          // Akibatnya pin GSAP pada kolom bouquet (SplitContent) ter-posisi relatif
          // terhadap <main>, bukan viewport → kolom "hilang" saat di-scroll dan baru
          // muncul lagi di akhir section. clearProps mengembalikan fixed → viewport.
          clearProps: "all",
          onComplete: () => {
            gsap.set(mainContentRef.current, { clearProps: "all" });
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

      // Polaroid ambient float (R9.3)
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReduced) {
        gsap.to(".hero-polaroid", {
          y: "+=8",
          x: "+=4",
          rotation: "+=1.5",
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { dependencies: [stage] }
  );

  return (
    <div className="relative min-h-dvh selection:bg-accent/30 selection:text-foreground bg-linear-to-tr from-background via-surface to-accent/5">
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
      {(stage === "gift" || (stage === "main" && !giftTransitionComplete)) && (
        <GiftBoxHero
          onOpenComplete={() => setStage("main")}
          onTransitionComplete={() => setGiftTransitionComplete(true)}
          isTransitioning={stage === "main"}
          audioRef={audioRef}
        />
      )}

      {/* Stage 3: Konten utama */}
      {stage === "main" && (
        <>
          {/* Ambient floating petals - GSAP Multi-Directional */}
          <AmbientPetals />

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
            {/* Hero Intro - Split Layout */}
            <section className="w-full h-dvh min-h-[550px] flex flex-col justify-center px-6 md:px-12 relative overflow-hidden">
              <FloralDecor />

              <div
                className="absolute top-12 left-12 text-accent/40 animate-pulse-slow z-10 pointer-events-none hidden lg:block"
                aria-hidden="true"
              >
                <SparkleIcon size={32} weight="fill" />
              </div>

              <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Kolom Kiri: Teks & CTAs */}
                <div className="lg:col-span-7 flex flex-col text-left items-start">
                  <h1 className="text-display font-sans font-bold tracking-tight text-balance text-foreground mb-block text-left">
                    Celebrating our beautiful <br />
                    <span className="font-cursive font-normal text-6xl md:text-8xl text-accent">odyssey of love.</span>
                  </h1>

                  <p className="text-body text-foreground/75 max-w-[50ch] font-light mb-block text-left">
                    A digital garden containing the milestones, memories, and songs that have woven our hearts together. Welcome to our space.
                  </p>

                  <div className="flex flex-wrap gap-4">
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

                {/* Kolom Kanan: Polaroid Portrait 8.9x12.7 & Overlapping Flowers */}
                <div className="lg:col-span-5 flex justify-center items-center relative py-6 w-full">
                  {/* Dedaunan dasar di belakang polaroid */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/hibiscus_flower/leaf_2.svg"
                    alt=""
                    className="absolute -top-6 right-[15%] w-24 sm:w-28 h-auto rotate-40 opacity-90 z-0 pointer-events-none animate-sway [animation-delay:0.5s]"
                    aria-hidden="true"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/hibiscus_flower/leaf_3.svg"
                    alt=""
                    className="absolute bottom-10 left-[10%] w-20 sm:w-24 h-auto rotate-[-35deg] opacity-85 z-0 pointer-events-none animate-sway [animation-delay:1.2s]"
                    aria-hidden="true"
                  />

                  {/* Polaroid Card (Rasio Aspek 8.9 / 12.7) */}
                  <PolaroidCard
                    localUrl="/images/memory-1.jpg"
                    caption="Together is my favorite place."
                    date="Est. June 14, 2023"
                    className="hero-polaroid w-[250px] sm:w-[280px] md:w-[300px] relative z-10 transform -rotate-3 hover:rotate-0 hover:scale-102 hover:shadow-elevation-3 select-none cursor-pointer"
                    aspectRatioClass="aspect-[8.9/12.7]"
                    variant="hero"
                  />

                  {/* Bunga utama & kuncup di depan polaroid */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/hibiscus_flower/flower_medium_3.svg"
                    alt=""
                    className="absolute -bottom-6 right-[10%] w-20 h-auto -rotate-12 z-20 pointer-events-none animate-sway [animation-delay:0.8s]"
                    aria-hidden="true"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/hibiscus_flower/petal_3.svg"
                    alt=""
                    className="absolute top-1/3 left-[5%] w-8 sm:w-10 h-auto rotate-45 z-20 pointer-events-none animate-pulse-slow"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </section>

            <MemoryLane />
            <SplitContent />
            <MusicLetterFooter audioRef={audioRef} />
            <div className="py-12 border-t border-foreground/10 text-center font-mono text-[10px] text-foreground/50 tracking-widest uppercase">
              <span>Made with love &copy; {new Date().getFullYear()}</span>
            </div>
          </main>
        </>
      )}
    </div>
  );
}