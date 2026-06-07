"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SparkleIcon } from "@phosphor-icons/react";
import AmbientPetals from "./AmbientPetals";
import { CONFIG_MILESTONES } from "@/config/textConfig";

gsap.registerPlugin(ScrollTrigger);

interface GreetingCardItem {
  year: string;
  milestone: string;
  title: string;
  message: string;
}

// CARDS array has been refactored into src/config/textConfig.ts

const ASSET_BASE = "/assets/hibiscus_flower";

const BOUQUET_LAYERS: { src: string; className: string; layer: "back" | "front" }[] = [
  // Daun (lapisan belakang) — leaf_1..3
  { src: "leaf_3.svg", className: "w-28 left-[6%] top-[14%] -rotate-[28deg] opacity-90", layer: "back" },
  { src: "leaf_2.svg", className: "w-28 right-[4%] top-[18%] rotate-[34deg] opacity-90", layer: "back" },
  { src: "leaf_1.svg", className: "w-24 left-[30%] top-[4%] -rotate-[6deg] opacity-95", layer: "back" },
  // Bunga medium mengelilingi pusat — flower_medium_1..3
  { src: "flower_medium_1.svg", className: "w-24 left-[4%] top-[30%] -rotate-12", layer: "front" },
  { src: "flower_medium_2.svg", className: "w-24 right-[4%] top-[34%] rotate-12", layer: "front" },
  { src: "flower_medium_3.svg", className: "w-20 left-[34%] top-[12%]", layer: "front" },
  // Bunga besar di pusat — flower_big_1
  { src: "flower_big_1.svg", className: "w-36 left-1/2 top-[26%] -translate-x-1/2", layer: "front" },
  // Benang sari sebagai aksen — stamen_1..4
  { src: "stamen_1.svg", className: "w-12 left-[20%] top-[44%] -rotate-[18deg]", layer: "front" },
  { src: "stamen_2.svg", className: "w-12 right-[20%] top-[46%] rotate-[18deg]", layer: "front" },
  { src: "stamen_3.svg", className: "w-10 left-[42%] top-[40%]", layer: "front" },
  { src: "stamen_4.svg", className: "w-10 right-[34%] top-[30%] rotate-[8deg]", layer: "front" },
];

function BouquetAsset({ src, className }: { src: string; className: string }) {
  return (
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

        // 3D Parallax Sway: Lapisan belakang daun bergoyang lebih lambat dan sempit.
        gsap.fromTo(
          ".bouquet-sway-back",
          { rotation: -1.5, y: 0 },
          {
            rotation: 1.5,
            y: -4,
            duration: 8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );

        // 3D Parallax Sway: Lapisan depan bunga & aksen bergoyang lebih cepat dan lebar.
        gsap.fromTo(
          ".bouquet-sway-front",
          { rotation: -3.5, y: 0 },
          {
            rotation: 3.5,
            y: -10,
            duration: 5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );
      });

      // Gerak tereduksi: tampilkan keadaan akhir statis, tanpa animasi ambient.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".greeting-card", { opacity: 1, y: 0 });
        gsap.set(".bouquet-sway-back", { rotation: 0, y: 0 });
        gsap.set(".bouquet-sway-front", { rotation: 0, y: 0 });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="milestones"
      className="cv-gate py-32 px-6 w-full relative overflow-hidden z-10"
      style={{ containIntrinsicSize: "auto 1600px" }}
    >
      {/* Background Decorative Flowers/Leaves (pointer-events-none, aria-hidden, menumpuk padat hampir memenuhi latar belakang, solid) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden hidden lg:block" aria-hidden="true">
        {/* Kiri - Tumpukan padat melimpah meluas ke tengah, diletakkan mulai dari top-[32%] ke bawah agar tidak menutupi teks Heading Chapter II */}
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute -left-16 top-[32%] w-56 h-auto -rotate-12"
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[4%] top-[38%] w-60 h-auto rotate-45"
        />
        <img
          src="/assets/hibiscus_flower/leaf_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[10%] top-[44%] w-52 h-auto -rotate-30"
        />
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[16%] top-[50%] w-48 h-auto rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[22%] top-[56%] w-56 h-auto -rotate-45"
        />
        <img
          src="/assets/hibiscus_flower/leaf_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[28%] top-[62%] w-52 h-auto rotate-30"
        />
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[34%] top-[68%] w-44 h-auto -rotate-12"
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[40%] top-[74%] w-40 h-auto rotate-25"
        />
        <img
          src="/assets/hibiscus_flower/leaf_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[44%] top-[80%] w-36 h-auto -rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[46%] top-[86%] w-32 h-auto rotate-12"
        />

        {/* Bunga Besar Solid */}
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute -left-12 top-[35%] w-64 h-auto rotate-12 animate-pulse-solid"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[6%] top-[48%] w-60 h-auto -rotate-12 animate-pulse-solid [animation-delay:1.5s]"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[18%] top-[60%] w-64 h-auto rotate-25 animate-pulse-solid [animation-delay:0.8s]"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[30%] top-[72%] w-56 h-auto -rotate-20 animate-pulse-solid [animation-delay:1.9s]"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[42%] top-[84%] w-50 h-auto rotate-15 animate-pulse-solid [animation-delay:1.1s]"
        />

        {/* Bunga Medium Solid */}
        <img
          src="/assets/hibiscus_flower/flower_medium_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[8%] top-[32%] w-44 h-auto rotate-45"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[12%] top-[42%] w-48 h-auto -rotate-12"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[24%] top-[52%] w-40 h-auto rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[32%] top-[64%] w-44 h-auto -rotate-30"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[38%] top-[76%] w-38 h-auto rotate-10"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[44%] top-[88%] w-36 h-auto -rotate-15"
        />

        {/* Benang Sari */}
        <img
          src="/assets/hibiscus_flower/stamen_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[10%] top-[36%] w-12 h-auto rotate-20"
        />
        <img
          src="/assets/hibiscus_flower/stamen_4.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[20%] top-[54%] w-14 h-auto -rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/stamen_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[30%] top-[70%] w-11 h-auto rotate-10"
        />
        <img
          src="/assets/hibiscus_flower/stamen_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute left-[38%] top-[82%] w-10 h-auto -rotate-25"
        />

        {/* Kelopak Melayang Bebas (GSAP Ambient Petals - Solid) */}
        <AmbientPetals solid={true} />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-stretch">

        {/* Left Column - Sticky Flower Bouquet */}
        <div className="lg:col-span-5 relative w-full">
          <div className="lg:sticky lg:top-24 h-fit flex flex-col items-center w-full">

            {/* Visual Heading for Column */}
            <div className="text-center lg:text-left w-full mb-8">
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-foreground/65 block mb-2">
                {CONFIG_MILESTONES.chapter}
              </span>
              <h2 className="text-subheading font-sans font-light tracking-tight text-foreground">
                {CONFIG_MILESTONES.titleLine1} <br />
                <span className="font-cursive text-4xl text-accent">{CONFIG_MILESTONES.titleHighlight}</span>
              </h2>
            </div>

            {/* Bouquet Card Container */}
            <div className="relative w-72 h-96 group/bouquet">
              {/* Ambient Glow Orb behind the card */}
              <div 
                className="absolute -inset-4 bg-radial from-accent/20 via-[#FFC8DD]/10 to-transparent rounded-[3rem] blur-2xl opacity-80 pointer-events-none group-hover/bouquet:opacity-100 transition-opacity duration-700" 
                aria-hidden="true" 
              />
              
              {/* Main Card Element */}
              <div className="absolute inset-0 rounded-card glass-surface shadow-elevation-2 border border-foreground/5 overflow-hidden transition-all duration-500 hover:shadow-elevation-3 hover:border-accent/20">
                <div className="relative w-full h-full flex items-center justify-center p-6">
                  {/* Lapisan aset bouquet (dekoratif, pointer-events-none + aria-hidden) */}
                  <div className="absolute inset-6 pointer-events-none" aria-hidden="true">
                    {BOUQUET_LAYERS.map((layer) => (
                      <BouquetAsset 
                        key={layer.src} 
                        src={layer.src} 
                        className={`${layer.className} ${
                          layer.layer === "back" ? "bouquet-sway-back" : "bouquet-sway-front"
                        }`} 
                      />
                    ))}

                    {/* Pembungkus bouquet — tint dari Token_Desain (R13.9) */}
                    <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-24 h-24 rounded-b-[3rem] rounded-t-inner bg-surface/90 border border-foreground/5 shadow-inner" />
                    <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 w-32 h-3 rounded-pill bg-accent/70 shadow-xs" />
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

          </div>
        </div>

        {/* Right Column - Scrolling Milestone Cards */}
        <div ref={rightColRef} className="lg:col-span-7 flex flex-col gap-12 lg:gap-16">
          {CONFIG_MILESTONES.cards.map((card, idx) => (
            <div
              key={idx}
              className="greeting-card bg-surface p-8 md:p-12 rounded-card shadow-elevation-1 border border-foreground/5 hover:shadow-elevation-2 hover:-translate-y-1.5 transition-all duration-500 transition-spring relative overflow-hidden group"
            >
              {/* Subtle top indicator line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-linear-to-r from-accent/40 via-accent to-accent/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 transition-spring origin-left" />

              {/* Subtle background color hue pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-accent/10 to-transparent opacity-60 rounded-bl-full pointer-events-none transition-transform transition-spring group-hover:scale-110" />

              {/* Card Meta */}
              <div className="flex justify-between items-center mb-8">
                <span className="font-mono text-xs text-accent tracking-[0.2em] font-semibold uppercase">
                  {card.year}
                </span>
                <span className="font-mono text-[10px] text-foreground/55 tracking-wider uppercase border border-foreground/10 px-3 py-1 rounded-pill bg-background/80 backdrop-blur-xs">
                  {card.milestone}
                </span>
              </div>

              {/* Card Headline */}
              <h3 className="text-2xl md:text-3xl font-sans font-light text-foreground tracking-tight mb-4 group-hover:text-accent-strong transition-colors duration-300">
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
      </div>
    </section>
  );
}
