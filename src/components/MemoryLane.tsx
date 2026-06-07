"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { HeartIcon, XIcon } from "@phosphor-icons/react";
import PolaroidCard from "./PolaroidCard";
import AmbientPetals from "./AmbientPetals";
import { MEMORIES, USE_API_PROXY } from "@/config/galleryConfig";
import type { PolaroidItem } from "@/config/galleryConfig";

// Bayangan berlapis (Token_Desain) sebagai literal agar dapat diinterpolasi GSAP.
// Mengacu pada --shadow-elevation-* di globals.css.
const SHADOW_REST =
  "0 4px 20px rgba(42, 31, 29, 0.06), 0 12px 40px rgba(42, 31, 29, 0.08)"; // elevation-2
const SHADOW_HOVER =
  "0 12px 32px rgba(42, 31, 29, 0.08), 0 32px 80px rgba(42, 31, 29, 0.12)"; // elevation-3

export default function MemoryLane() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lightbox: foto yang sedang dibuka besar (null = tertutup)
  const [selected, setSelected] = useState<PolaroidItem | null>(null);

  // Tutup dengan Escape + kunci scroll body selama lightbox terbuka
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".polaroid-card");

      // Hormati Gerak_Tereduksi: matikan float ambient berulang, tampilkan
      // keadaan akhir statis. Umpan balik elevation hover tetap dipertahankan.
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      cards.forEach((card) => {
        const initialRotation = gsap.utils.random(-5, 5);
        gsap.set(card, {
          rotation: initialRotation,
          transformOrigin: "center center",
          boxShadow: SHADOW_REST,
        });

        // Float ambient hanya saat gerak tidak direduksi (R9.3)
        const floatTween = prefersReduced
          ? null
          : gsap.to(card, {
              y: () => `+=${gsap.utils.random(-8, 8)}`,
              x: () => `+=${gsap.utils.random(-4, 4)}`,
              duration: gsap.utils.random(4, 6),
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });

        // Umpan balik kedalaman (elevation) saat hover ≤500ms (R6.2)
        card.addEventListener("mouseenter", () => {
          floatTween?.pause();
          gsap.to(card, {
            scale: 1.05,
            rotation: gsap.utils.random(-1, 1),
            z: 20,
            boxShadow: SHADOW_HOVER,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            rotation: initialRotation,
            z: 0,
            boxShadow: SHADOW_REST,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => floatTween?.resume(),
          });
        });
      });
    },
    { scope: containerRef }
  );
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block" aria-hidden="true">
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute -right-16 top-[10%] w-56 h-auto -rotate-12"
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[4%] top-[20%] w-60 h-auto rotate-45"
        />
        <img
          src="/assets/hibiscus_flower/leaf_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[10%] top-[30%] w-52 h-auto -rotate-30"
        />
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[16%] top-[40%] w-48 h-auto rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[22%] top-[50%] w-56 h-auto -rotate-45"
        />
        <img
          src="/assets/hibiscus_flower/leaf_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[28%] top-[60%] w-52 h-auto rotate-30"
        />
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[34%] top-[70%] w-44 h-auto -rotate-12"
        />
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[10%] top-[72%] w-56 h-auto rotate-45"
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[18%] top-[76%] w-48 h-auto -rotate-12"
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[40%] top-[80%] w-40 h-auto rotate-25"
        />
        <img
          src="/assets/hibiscus_flower/leaf_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[48%] top-[82%] w-52 h-auto rotate-30"
        />
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[26%] top-[85%] w-44 h-auto -rotate-45"
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute -right-8 top-[88%] w-52 h-auto rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/leaf_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[44%] top-[90%] w-36 h-auto -rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/leaf_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[32%] top-[92%] w-48 h-auto rotate-60"
        />

        {/* Bunga Besar Solid */}
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute -right-12 top-[15%] w-64 h-auto rotate-12 animate-pulse-solid"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[6%] top-[35%] w-60 h-auto -rotate-12 animate-pulse-solid [animation-delay:1.5s]"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[18%] top-[55%] w-64 h-auto rotate-25 animate-pulse-solid [animation-delay:0.8s]"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[30%] top-[75%] w-56 h-auto -rotate-20 animate-pulse-solid [animation-delay:1.9s]"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[5%] top-[82%] w-60 h-auto rotate-45 animate-pulse-solid [animation-delay:1.2s]"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[22%] top-[88%] w-64 h-auto -rotate-12 animate-pulse-solid [animation-delay:0.5s]"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute -right-4 top-[92%] w-56 h-auto rotate-25 animate-pulse-solid [animation-delay:1.7s]"
        />

        {/* Bunga Medium Solid */}
        <img
          src="/assets/hibiscus_flower/flower_medium_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[8%] top-[8%] w-44 h-auto rotate-45"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[12%] top-[28%] w-48 h-auto -rotate-12"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[24%] top-[48%] w-40 h-auto rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[32%] top-[68%] w-44 h-auto -rotate-30"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[14%] top-[70%] w-48 h-auto rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[44%] top-[78%] w-40 h-auto -rotate-30"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[12%] top-[86%] w-44 h-auto rotate-60"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[38%] top-[88%] w-38 h-auto rotate-10"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[36%] top-[94%] w-48 h-auto -rotate-15"
        />

        {/* Benang Sari */}
        <img
          src="/assets/hibiscus_flower/stamen_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[10%] top-[18%] w-12 h-auto rotate-20"
        />
        <img
          src="/assets/hibiscus_flower/stamen_4.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[20%] top-[38%] w-14 h-auto -rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/stamen_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[30%] top-[58%] w-11 h-auto rotate-10"
        />
        <img
          src="/assets/hibiscus_flower/stamen_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[16%] top-[74%] w-12 h-auto rotate-10"
        />
        <img
          src="/assets/hibiscus_flower/stamen_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[38%] top-[78%] w-10 h-auto -rotate-25"
        />
        <img
          src="/assets/hibiscus_flower/stamen_4.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[28%] top-[84%] w-14 h-auto -rotate-20"
        />
        <img
          src="/assets/hibiscus_flower/stamen_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[8%] top-[88%] w-10 h-auto rotate-35"
        />
        <img
          src="/assets/hibiscus_flower/stamen_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[42%] top-[91%] w-11 h-auto -rotate-10"
        />

        {/* Bunga menembus ke Chapter 2 (overlapping transition) */}
        <img
          src="/assets/hibiscus_flower/leaf_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[44%] top-[96%] w-48 h-auto rotate-12"
        />
        <img
          src="/assets/hibiscus_flower/stamen_3.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[38%] top-[101%] w-12 h-auto rotate-15"
        />
        <img
          src="/assets/hibiscus_flower/flower_big_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[36%] top-full w-60 h-auto -rotate-12 animate-pulse-solid [animation-delay:0.8s]"
        />
        <img
          src="/assets/hibiscus_flower/flower_medium_2.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[42%] top-[104%] w-44 h-auto rotate-30"
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          decoding="async"
          className="decor-paint absolute right-[30%] top-[108%] w-52 h-auto -rotate-45"
        />

        {/* Kelopak Melayang Bebas (GSAP Ambient Petals - Solid) */}
        <AmbientPetals solid={true} />
      </div>

      <section
        ref={containerRef}
        id="memories"
        className="cv-gate py-32 px-6 w-full relative z-10"
        style={{ containIntrinsicSize: "auto 1400px" }}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
      <div className="max-w-xl mb-24">
        <div className="flex items-center gap-2 mb-4">
          <HeartIcon size={16} weight="fill" className="text-accent" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-foreground/65">
            Chapter I
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-light mb-6 text-foreground leading-tight">
          A physical archive <br />
          of our <span className="font-cursive text-5xl md:text-6xl text-accent">sweetest moments</span>.
        </h2>
        <p className="text-foreground/80 text-sm leading-relaxed max-w-[45ch]">
          Polaroid snapshots from our journey together. Hover over them to take a closer look at our favorite days.
        </p>
      </div>

      {/* Polaroid Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 pt-8"
        style={{ perspective: 1000 }}
      >
        {MEMORIES.map((memory) => (
          <PolaroidCard
            key={memory.id}
            id={memory.id}
            localUrl={USE_API_PROXY ? memory.apiUrl : memory.localUrl}
            fallbackUrl={memory.fallbackUrl}
            caption={memory.caption}
            date={memory.date}
            className={`${memory.colSpanClass} ${memory.offsetClass}`}
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => setSelected(memory)}
            variant="gallery"
          />
        ))}
      </div>
      </div>

      {/* Lightbox foto */}
      {selected && (
        <div
          className="glass-surface fixed inset-0 z-70 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.caption}
        >
          <button
            type="button"
            aria-label="Tutup foto"
            onClick={() => setSelected(null)}
            className="focus-ring absolute top-6 right-6 w-11 h-11 rounded-full bg-background/90 border border-accent/20 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-surface shadow-elevation-1 active:scale-95 transition-spring duration-300"
          >
            <XIcon size={18} weight="bold" />
          </button>

          <figure
            className="animate-zoom-in bg-surface p-4 pb-6 rounded-card shadow-elevation-3 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-background rounded-inner mb-4 border border-accent/15">
              <img
                src={USE_API_PROXY ? selected.apiUrl : selected.localUrl}
                alt={selected.caption}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== selected.fallbackUrl) {
                    img.src = selected.fallbackUrl;
                  }
                }}
              />
            </div>

            <figcaption className="px-1 flex flex-col gap-2">
              <p className="font-cursive text-3xl text-foreground/90 leading-tight">
                {selected.caption}
              </p>
              <div className="flex justify-between items-center border-t border-accent/20 pt-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/60">
                  {selected.date}
                </span>
                <span className="font-mono text-[9px] text-foreground/40 uppercase tracking-widest">
                  No. 00{selected.id}
                </span>
              </div>
            </figcaption>
          </figure>
        </div>
      )}
      </section>
    </div>
  );
}
