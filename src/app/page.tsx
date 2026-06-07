"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SparkleIcon, CalendarIcon } from "@phosphor-icons/react";

import PinGate from "@/components/PinGate";
import GiftBoxHero from "@/components/GiftBoxHero";
import MemoryLane from "@/components/MemoryLane";
import SplitContent from "@/components/SplitContent";
import MusicLetterFooter from "@/components/MusicLetterFooter";
import { SONG_SRC, HERO_POLAROID, USE_API_PROXY } from "@/config/galleryConfig";
import { CONFIG_PAGE } from "@/config/textConfig";
import FloralDecor from "@/components/FloralDecor";
import AmbientPetals from "@/components/AmbientPetals";
import PolaroidCard from "@/components/PolaroidCard";

type AppStage = "pin" | "gift" | "main";

export default function Home() {
  const [stage, setStage] = useState<AppStage>("pin");
  const [giftTransitionComplete, setGiftTransitionComplete] = useState(false);
  const [readyToReveal, setReadyToReveal] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!giftTransitionComplete) {
      gsap.set([document.documentElement, document.body], {
        backgroundColor: "#170E0D",
      });
      document.body.classList.add("stage-dark");
    } else {
      document.body.classList.remove("stage-dark");
    }
  }, [giftTransitionComplete]);

  useEffect(() => {
    if (!readyToReveal) return;
    const tween = gsap.to([document.documentElement, document.body], {
      backgroundColor: "#FFFBF9",
      duration: 1.2,
      ease: "power2.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [readyToReveal]);

  useGSAP(
    () => {
      if (stage !== "main") return;
      const prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      gsap.fromTo(
        mainContentRef.current,
        { y: 40 },
        {
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          delay: 0.1,
          clearProps: "transform",
          onComplete: () => {
            gsap.set(mainContentRef.current, { clearProps: "all" });
            document.body.style.overflow = prevBodyOverflow;
            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
              requestAnimationFrame(() => setReadyToReveal(true));
            });
          },
        }
      );

      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.1, clearProps: "opacity" }
      );

      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.2 }
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
          isTransitioning={readyToReveal}
          audioRef={audioRef}
        />
      )}

      {/* Stage 3: Konten utama */}
      {stage === "main" && (
        <>
          {/* Ambient floating petals - GSAP Multi-Directional */}
          {giftTransitionComplete && <AmbientPetals />}

          {/* Navigation Header — absolute transparent */}
          <header
            ref={headerRef}
            className="absolute top-0 left-0 z-40 w-full bg-transparent pt-[env(safe-area-inset-top)]"
          >
            <div className="h-20 w-full px-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-2 border border-foreground/10 bg-surface/70 px-4 py-2 rounded-full shadow-elevation-1 backdrop-blur-md text-xs font-mono text-foreground/80">
                <img
                  src="/assets/hibiscus_flower/flower_big_1.svg"
                  alt=""
                  className="w-3.5 h-3.5 object-contain"
                  aria-hidden="true"
                />
                <span className="tracking-widest uppercase">
                  {CONFIG_PAGE.brandName}
                </span>
              </div>

              <nav className="hidden md:flex items-center gap-10 text-xs font-mono text-foreground/70 tracking-wider">
                {CONFIG_PAGE.navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.id}
                    className="focus-ring rounded-inner transition-colors duration-300 ease-spring hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-2 border border-foreground/10 bg-surface/70 px-4 py-2 rounded-full shadow-elevation-1 text-xs font-mono text-foreground/80 backdrop-blur-md">
                <CalendarIcon size={14} weight="regular" className="text-accent" />
                <span>{CONFIG_PAGE.dateEst}</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main ref={mainContentRef} className="relative z-10">
            {/* Hero Intro - Split Layout */}
            <section ref={heroRef} className="w-full min-h-dvh flex flex-col justify-center px-6 md:px-12 relative overflow-hidden pt-24 pb-12 lg:py-0">
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
                    {CONFIG_PAGE.heroTitleLine1} <br />
                    <span className="font-cursive font-normal text-6xl md:text-8xl text-accent">{CONFIG_PAGE.heroTitleHighlight}</span>
                  </h1>

                  <p className="text-body text-foreground/75 max-w-[50ch] font-light mb-block text-left">
                    {CONFIG_PAGE.heroDescription}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="#memories"
                      className="focus-ring rounded-pill bg-accent hover:bg-accent-strong text-surface font-mono text-xs font-medium tracking-wider px-8 py-3.5 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 ease-spring hover:-translate-y-0.5 active:scale-95"
                    >
                      {CONFIG_PAGE.heroButton1}
                    </a>
                    <a
                      href="#letter"
                      className="focus-ring rounded-pill border border-accent/30 hover:border-accent bg-surface/80 text-foreground/80 hover:text-foreground font-mono text-xs font-medium tracking-wider px-8 py-3.5 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 ease-spring hover:-translate-y-0.5 active:scale-95"
                    >
                      {CONFIG_PAGE.heroButton2}
                    </a>
                  </div>
                </div>

                {/* Kolom Kanan: Polaroid Portrait 8.9x12.7 & Overlapping Flowers */}
                <div className="lg:col-span-5 flex justify-center items-center relative py-6 w-full">
                  {/* Dedaunan dasar di belakang polaroid */}
                  <img
                    src="/assets/hibiscus_flower/leaf_2.svg"
                    alt=""
                    decoding="async"
                    className="decor-paint absolute -top-6 right-[15%] w-24 sm:w-28 h-auto rotate-40 opacity-90 z-0 pointer-events-none animate-sway [animation-delay:0.5s]"
                    aria-hidden="true"
                  />
                  <img
                    src="/assets/hibiscus_flower/leaf_3.svg"
                    alt=""
                    decoding="async"
                    className="decor-paint absolute bottom-10 left-[10%] w-20 sm:w-24 h-auto rotate-[-35deg] opacity-85 z-0 pointer-events-none animate-sway [animation-delay:1.2s]"
                    aria-hidden="true"
                  />

                  {/* Polaroid Card (Rasio Aspek 8.9 / 12.7) */}
                  <PolaroidCard
                    localUrl={USE_API_PROXY ? HERO_POLAROID.apiUrl : HERO_POLAROID.localUrl}
                    caption={HERO_POLAROID.caption}
                    date={HERO_POLAROID.date}
                    className="hero-polaroid w-[250px] sm:w-[280px] md:w-[300px] relative z-10 transform -rotate-3 hover:rotate-0 hover:scale-102 hover:shadow-elevation-3 select-none cursor-pointer"
                    aspectRatioClass="aspect-[8.9/12.7]"
                    variant="hero"
                  />

                  {/* Bunga utama & kuncup di depan polaroid */}
                  <img
                    src="/assets/hibiscus_flower/flower_medium_3.svg"
                    alt=""
                    decoding="async"
                    className="decor-paint absolute -bottom-6 right-[10%] w-20 h-auto -rotate-12 z-20 pointer-events-none animate-sway [animation-delay:0.8s]"
                    aria-hidden="true"
                  />
                  <img
                    src="/assets/hibiscus_flower/petal_3.svg"
                    alt=""
                    decoding="async"
                    className="decor-paint absolute top-1/3 left-[5%] w-8 sm:w-10 h-auto rotate-45 z-20 pointer-events-none animate-pulse-slow"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </section>

            <MemoryLane />
            <SplitContent />
            <MusicLetterFooter audioRef={audioRef} />
            <div className="relative w-full overflow-hidden">
              {/* Background Flowers at the bottom (tumpukan bunga melimpah di bagian paling bawah halaman, solid) */}
              {/* Dipindahkan ke luar <footer> agar tidak terpotong oleh paint containment (content-visibility: auto) pada footer */}
              <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block" aria-hidden="true">
                {/* Dedaunan dasar di sepanjang dasar halaman */}
                <img src="/assets/hibiscus_flower/leaf_1.svg" alt="" decoding="async" className="decor-paint absolute left-[5%] bottom-[-96px] w-48 h-auto rotate-12" />
                <img src="/assets/hibiscus_flower/leaf_1.svg" alt="" decoding="async" className="decor-paint absolute left-[12%] bottom-[-104px] w-52 h-auto rotate-35" />
                <img src="/assets/hibiscus_flower/leaf_2.svg" alt="" decoding="async" className="decor-paint absolute left-[20%] bottom-[-104px] w-52 h-auto -rotate-15" />
                <img src="/assets/hibiscus_flower/leaf_2.svg" alt="" decoding="async" className="decor-paint absolute left-[30%] bottom-[-112px] w-56 h-auto -rotate-40" />
                <img src="/assets/hibiscus_flower/leaf_3.svg" alt="" decoding="async" className="decor-paint absolute left-[40%] bottom-[-88px] w-44 h-auto rotate-45" />
                <img src="/assets/hibiscus_flower/leaf_3.svg" alt="" decoding="async" className="decor-paint absolute left-[55%] bottom-[-88px] w-44 h-auto rotate-25" />
                <img src="/assets/hibiscus_flower/leaf_1.svg" alt="" decoding="async" className="decor-paint absolute right-[35%] bottom-[-96px] w-48 h-auto -rotate-30" />
                <img src="/assets/hibiscus_flower/leaf_2.svg" alt="" decoding="async" className="decor-paint absolute right-[15%] bottom-[-112px] w-56 h-auto rotate-15" />
                <img src="/assets/hibiscus_flower/leaf_2.svg" alt="" decoding="async" className="decor-paint absolute right-[28%] bottom-[-96px] w-48 h-auto rotate-15" />
                <img src="/assets/hibiscus_flower/leaf_3.svg" alt="" decoding="async" className="decor-paint absolute -right-8 bottom-[-104px] w-52 h-auto -rotate-12" />
                <img src="/assets/hibiscus_flower/leaf_3.svg" alt="" decoding="async" className="decor-paint absolute right-[40%] bottom-[-104px] w-52 h-auto -rotate-15" />
                
                {/* Bunga-bunga Besar */}
                <img src="/assets/hibiscus_flower/flower_big_1.svg" alt="" decoding="async" className="decor-paint absolute left-[10%] bottom-[-128px] w-64 h-auto rotate-12 animate-pulse-solid" />
                <img src="/assets/hibiscus_flower/flower_big_1.svg" alt="" decoding="async" className="decor-paint absolute left-[25%] bottom-[-128px] w-64 h-auto rotate-15 animate-pulse-solid [animation-delay:1.1s]" />
                <img src="/assets/hibiscus_flower/flower_big_1.svg" alt="" decoding="async" className="decor-paint absolute right-[8%] bottom-[-128px] w-64 h-auto -rotate-12 animate-pulse-solid [animation-delay:1.5s]" />
                <img src="/assets/hibiscus_flower/flower_big_1.svg" alt="" decoding="async" className="decor-paint absolute right-[30%] bottom-[-128px] w-64 h-auto -rotate-25 animate-pulse-solid [animation-delay:0.4s]" />
                <img src="/assets/hibiscus_flower/flower_big_1.svg" alt="" decoding="async" className="decor-paint absolute left-[45%] bottom-[-120px] w-60 h-auto rotate-45 animate-pulse-solid [animation-delay:0.8s]" />
                <img src="/assets/hibiscus_flower/flower_big_1.svg" alt="" decoding="async" className="decor-paint absolute left-[60%] bottom-[-120px] w-60 h-auto rotate-30 animate-pulse-solid [animation-delay:1.6s]" />

                {/* Bunga-bunga Medium */}
                <img src="/assets/hibiscus_flower/flower_medium_2.svg" alt="" decoding="async" className="decor-paint absolute left-[28%] bottom-[-96px] w-48 h-auto -rotate-30" />
                <img src="/assets/hibiscus_flower/flower_medium_2.svg" alt="" decoding="async" className="decor-paint absolute -right-4 bottom-[-96px] w-48 h-auto -rotate-45" />
                <img src="/assets/hibiscus_flower/flower_medium_3.svg" alt="" decoding="async" className="decor-paint absolute right-[25%] bottom-[-88px] w-44 h-auto rotate-20" />
                <img src="/assets/hibiscus_flower/flower_medium_3.svg" alt="" decoding="async" className="decor-paint absolute right-[20%] bottom-[-96px] w-48 h-auto -rotate-15" />
                <img src="/assets/hibiscus_flower/flower_medium_1.svg" alt="" decoding="async" className="decor-paint absolute -left-8 bottom-[-96px] w-48 h-auto rotate-45" />
                <img src="/assets/hibiscus_flower/flower_medium_1.svg" alt="" decoding="async" className="decor-paint absolute left-[15%] bottom-[-96px] w-48 h-auto -rotate-12" />
                <img src="/assets/hibiscus_flower/flower_medium_2.svg" alt="" decoding="async" className="decor-paint absolute left-[35%] bottom-[-88px] w-44 h-auto rotate-45" />
                <img src="/assets/hibiscus_flower/flower_medium_2.svg" alt="" decoding="async" className="decor-paint absolute left-[50%] bottom-[-88px] w-44 h-auto -rotate-30" />
                <img src="/assets/hibiscus_flower/flower_medium_3.svg" alt="" decoding="async" className="decor-paint absolute right-[45%] bottom-[-80px] w-40 h-auto rotate-60" />

                {/* Benang Sari */}
                <img src="/assets/hibiscus_flower/stamen_1.svg" alt="" decoding="async" className="decor-paint absolute left-[18%] bottom-[-24px] w-12 h-auto rotate-10" />
                <img src="/assets/hibiscus_flower/stamen_2.svg" alt="" decoding="async" className="decor-paint absolute right-[18%] bottom-[-22px] w-11 h-auto -rotate-15" />
                <img src="/assets/hibiscus_flower/stamen_3.svg" alt="" decoding="async" className="decor-paint absolute left-[52%] bottom-[-20px] w-10 h-auto rotate-25" />
                <img src="/assets/hibiscus_flower/stamen_4.svg" alt="" decoding="async" className="decor-paint absolute left-[32%] bottom-[-24px] w-12 h-auto rotate-15" />
                <img src="/assets/hibiscus_flower/stamen_3.svg" alt="" decoding="async" className="decor-paint absolute right-[32%] bottom-[-22px] w-11 h-auto -rotate-20" />
                <img src="/assets/hibiscus_flower/stamen_1.svg" alt="" decoding="async" className="decor-paint absolute left-[62%] bottom-[-20px] w-10 h-auto rotate-10" />
              </div>

              <footer
                className="cv-gate relative pt-12 pb-32 max-w-5xl mx-auto w-full border-t border-foreground/10 px-6 md:px-12"
                style={{ containIntrinsicSize: "auto 700px" }}
              >
                <div className="text-center font-mono text-[10px] text-foreground/50 tracking-widest uppercase relative z-10">
                  <span>Made with love &copy; {new Date().getFullYear()}</span>
                </div>
              </footer>
            </div>
          </main>
        </>
      )}
    </div>
  );
}