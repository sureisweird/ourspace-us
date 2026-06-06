"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SparkleIcon } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

interface GreetingCardItem {
  year: string;
  milestone: string;
  title: string;
  message: string;
}

const CARDS: GreetingCardItem[] = [
  {
    year: "Year 1",
    milestone: "The Spark",
    title: "Finding You in the Noise",
    message: "It felt like the stars aligned in perfect unison. A simple conversation bloomed into hours, then days, and eventually, the baseline of our shared reality. We learned the shape of each other's laughter and decided we never wanted to forget it.",
  },
  {
    year: "Year 2",
    milestone: "The Roots",
    title: "Building Our Shared Language",
    message: "Beyond the initial magic lay the beautiful work of growing together. We built inside jokes, memorized coffee orders, and discovered that love is found in quiet Tuesday nights, cooking together, and simply being in the same room.",
  },
  {
    year: "Year 3",
    milestone: "The Canopy",
    title: "Through Weather and Sunshine",
    message: "Life brought its storms and its gold seasons. With every challenge, we discovered that holding hands was not just a gesture, but a promise. We learned to support, to heal, and to look at the future with a single unified gaze.",
  },
  {
    year: "Eternity",
    milestone: "The Horizon",
    title: "To All Our Unwritten Pages",
    message: "Here we stand today, stronger and more in love than ever. Every year is a chapter, but our book is far from finished. I look forward to every sunrise, every adventure, and every single quiet moment with you by my side.",
  },
];

const ASSET_BASE = "/assets/hibiscus_flower";

/**
 * Komposisi bouquet dari Aset_Bunga (R7.5 / R13.3). Disusun berlapis:
 * daun di belakang, bunga medium mengelilingi, bunga besar di pusat,
 * dan benang sari sebagai aksen. Tiap layer dirender sebagai <img>
 * dekoratif (pointer-events-none, aria-hidden) — lihat BouquetAsset.
 * Posisi memakai persentase agar skala mengikuti `.bouquet-wrap`.
 */
const BOUQUET_LAYERS: { src: string; className: string }[] = [
  // Daun (lapisan belakang) — leaf_1..3
  { src: "leaf_3.svg", className: "w-28 left-[6%] top-[14%] -rotate-[28deg] opacity-90" },
  { src: "leaf_2.svg", className: "w-28 right-[4%] top-[18%] rotate-[34deg] opacity-90" },
  { src: "leaf_1.svg", className: "w-24 left-[30%] top-[4%] -rotate-[6deg] opacity-95" },
  // Bunga medium mengelilingi pusat — flower_medium_1..3
  { src: "flower_medium_1.svg", className: "w-24 left-[4%] top-[30%] -rotate-12" },
  { src: "flower_medium_2.svg", className: "w-24 right-[4%] top-[34%] rotate-12" },
  { src: "flower_medium_3.svg", className: "w-20 left-[34%] top-[12%]" },
  // Bunga besar di pusat — flower_big_1
  { src: "flower_big_1.svg", className: "w-36 left-1/2 top-[26%] -translate-x-1/2" },
  // Benang sari sebagai aksen — stamen_1..4
  { src: "stamen_1.svg", className: "w-12 left-[20%] top-[44%] -rotate-[18deg]" },
  { src: "stamen_2.svg", className: "w-12 right-[20%] top-[46%] rotate-[18deg]" },
  { src: "stamen_3.svg", className: "w-10 left-[42%] top-[40%]" },
  { src: "stamen_4.svg", className: "w-10 right-[34%] top-[30%] rotate-[8deg]" },
];

/**
 * Aset bouquet dekoratif. Graceful degradation (R13.6): bila aset gagal
 * dimuat, sembunyikan elemen tanpa merusak tata letak (kontainer tetap
 * pointer-events-none + aria-hidden).
 */
function BouquetAsset({ src, className }: { src: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${ASSET_BASE}/${src}`}
      alt=""
      aria-hidden="true"
      draggable={false}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
      className={`absolute h-auto select-none ${className}`}
    />
  );
}

export default function SplitContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Gerak penuh: animasi masuk kartu + sway bouquet.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Animasi kartu meluncur masuk saat menggulir (easing ease-out/spring).
        const cards = gsap.utils.toArray<HTMLElement>(".greeting-card");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "top 55%",
                toggleActions: "play none none none",
                invalidateOnRefresh: true,
              },
            }
          );
        });

        // Sway gulir bouquet yang halus (animasi ambient → hanya saat gerak penuh).
        gsap.to(".bouquet-wrap", {
          rotation: 6,
          y: -15,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      // Gerak tereduksi: tampilkan keadaan akhir statis, tanpa animasi ambient.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".greeting-card", { opacity: 1, y: 0 });
        gsap.set(".bouquet-wrap", { rotation: 0, y: 0 });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="milestones"
      className="py-32 px-6 max-w-7xl mx-auto relative z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

        {/* Left Column - Sticky Flower Bouquet */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div ref={leftColRef} className="lg:sticky lg:top-24 h-fit flex flex-col items-center">

            {/* Visual Heading for Column */}
            <div className="text-center lg:text-left w-full mb-8">
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-foreground/65 block mb-2">
                Chapter II
              </span>
              <h2 className="text-subheading font-sans font-light tracking-tight text-foreground">
                A bouquet grown from <br />
                <span className="font-cursive text-4xl text-accent">years of affection</span>
              </h2>
            </div>

            {/* Bouquet composed from Aset_Bunga (R7.5 / R13.3) */}
            <div className="bouquet-wrap w-72 h-96 relative flex items-center justify-center drop-shadow-[0_15px_30px_rgba(229,152,155,0.15)] bg-surface/50 rounded-card p-6 border border-foreground/5">
              {/* Lapisan aset bouquet (dekoratif, pointer-events-none + aria-hidden) */}
              <div className="absolute inset-6 pointer-events-none" aria-hidden="true">
                {BOUQUET_LAYERS.map((layer) => (
                  <BouquetAsset key={layer.src} src={layer.src} className={layer.className} />
                ))}

                {/* Pembungkus bouquet — tint dari Token_Desain (R13.9) */}
                <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-24 h-24 rounded-b-[3rem] rounded-t-inner bg-surface/80 border border-foreground/5" />
                <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 w-32 h-3 rounded-pill bg-accent/60" />
              </div>

              {/* Floating micro sparks around bouquet (ambient — dimatikan saat reduced-motion via CSS) */}
              <div className="absolute top-8 left-8 text-accent/50 animate-bounce" aria-hidden="true">
                <SparkleIcon size={14} weight="fill" />
              </div>
              <div className="absolute bottom-16 right-8 text-accent/50 animate-bounce [animation-delay:1.5s]" aria-hidden="true">
                <SparkleIcon size={16} weight="fill" />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Scrolling Milestone Cards */}
        <div ref={rightColRef} className="lg:col-span-7 flex flex-col gap-12 lg:gap-16">
          {CARDS.map((card, idx) => (
            <div
              key={idx}
              className="greeting-card bg-surface p-8 md:p-12 rounded-card shadow-elevation-1 border border-foreground/5 hover:shadow-elevation-2 transition-shadow transition-spring relative overflow-hidden group"
            >
              {/* Subtle background color hue pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-accent/10 to-transparent opacity-60 rounded-bl-full pointer-events-none transition-transform transition-spring group-hover:scale-110" />

              {/* Card Meta */}
              <div className="flex justify-between items-center mb-8">
                <span className="font-mono text-xs text-accent tracking-[0.2em] font-semibold uppercase">
                  {card.year}
                </span>
                <span className="font-mono text-[10px] text-foreground/55 tracking-wider uppercase border border-foreground/10 px-3 py-1 rounded-pill bg-background">
                  {card.milestone}
                </span>
              </div>

              {/* Card Headline */}
              <h3 className="text-2xl md:text-3xl font-sans font-light text-foreground tracking-tight mb-4">
                {card.title}
              </h3>

              {/* Card Body */}
              <p className="text-foreground/75 text-sm md:text-base leading-relaxed">
                {card.message}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
