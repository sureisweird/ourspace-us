"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Heart, X } from "@phosphor-icons/react";

interface PolaroidItem {
  id: number;
  localUrl: string;
  fallbackUrl: string;
  caption: string;
  date: string;
  colSpanClass: string;
  offsetClass: string;
}

const MEMORIES: PolaroidItem[] = [
  {
    id: 1,
    localUrl: "/images/memory-1.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
    caption: "Where our fingers met, holding on forever",
    date: "June 14, 2023",
    colSpanClass: "md:col-span-4",
    offsetClass: "md:translate-y-4",
  },
  {
    id: 2,
    localUrl: "/images/memory-2.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
    caption: "A quiet sunset toast under gold skies",
    date: "August 29, 2023",
    colSpanClass: "md:col-span-4",
    offsetClass: "md:-translate-y-8",
  },
  {
    id: 3,
    localUrl: "/images/memory-3.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600",
    caption: "Walking through a golden, silent forest",
    date: "October 12, 2024",
    colSpanClass: "md:col-span-4",
    offsetClass: "md:translate-y-12",
  },
  {
    id: 4,
    localUrl: "/images/memory-4.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
    caption: "A simple heart drawn in the seaside sand",
    date: "January 03, 2025",
    colSpanClass: "md:col-span-6",
    offsetClass: "md:-translate-y-2",
  },
  {
    id: 5,
    localUrl: "/images/memory-5.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=600",
    caption: "Soft lighting, flowers, and your sweet laughter",
    date: "March 18, 2025",
    colSpanClass: "md:col-span-6",
    offsetClass: "md:translate-y-6",
  },
];

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

      cards.forEach((card) => {
        const initialRotation = gsap.utils.random(-5, 5);
        gsap.set(card, { rotation: initialRotation, transformOrigin: "center center" });

        const floatTween = gsap.to(card, {
          y: () => `+=${gsap.utils.random(-8, 8)}`,
          x: () => `+=${gsap.utils.random(-4, 4)}`,
          duration: gsap.utils.random(4, 6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        card.addEventListener("mouseenter", () => {
          floatTween.pause();
          gsap.to(card, {
            scale: 1.05,
            rotation: gsap.utils.random(-1, 1),
            z: 20,
            boxShadow: "0 25px 50px -12px rgba(42,31,29,0.15)",
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            rotation: initialRotation,
            z: 0,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)",
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => floatTween.resume(),
          });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="memories"
      className="py-32 px-6 max-w-7xl mx-auto relative z-10"
    >
      {/* Section Header */}
      <div className="max-w-xl mb-24">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={16} weight="fill" className="text-[#FFB7B2]" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#2A1F1D]/65">
            Chapter I
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-light mb-6 text-[#2A1F1D] leading-tight">
          A physical archive <br />
          of our <span className="font-cursive text-5xl md:text-6xl text-[#E5989B]">sweetest moments</span>.
        </h2>
        <p className="text-[#2A1F1D]/80 text-sm leading-relaxed max-w-[45ch]">
          Polaroid snapshots from our journey together. Hover over them to take a closer look at our favorite days.
        </p>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pt-8">
        {MEMORIES.map((memory) => (
          <div
            key={memory.id}
            onClick={() => setSelected(memory)}
            role="button"
            tabIndex={0}
            aria-label={`Buka foto: ${memory.caption}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(memory);
              }
            }}
            className={`polaroid-card bg-white p-4 pb-6 rounded-sm shadow-md border border-[#F2E5E3]/40 flex flex-col justify-between h-fit cursor-pointer transition-shadow ${memory.colSpanClass} ${memory.offsetClass}`}
            style={{ perspective: 1000 }}
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#FFFBF9] rounded-sm mb-4 border border-[#F2E5E3]/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={memory.localUrl}
                alt={memory.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-500 filter-[grayscale(15%)] hover:filter-[grayscale(0%)]"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== memory.fallbackUrl) {
                    img.src = memory.fallbackUrl;
                  }
                }}
              />
            </div>

            <div className="px-1 flex flex-col gap-2">
              <p className="font-cursive text-2xl text-[#2A1F1D]/90 leading-tight">
                {memory.caption}
              </p>
              <div className="flex justify-between items-center border-t border-[#F2E5E3]/40 pt-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#2A1F1D]/60">
                  {memory.date}
                </span>
                <span className="font-mono text-[9px] text-[#2A1F1D]/40 uppercase tracking-widest">
                  No. 00{memory.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox foto */}
      {selected && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-6 bg-[#170E0D]/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.caption}
        >
          <button
            type="button"
            aria-label="Tutup foto"
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#FFFBF9]/90 border border-[#F2E5E3] flex items-center justify-center text-[#2A1F1D]/70 hover:text-[#2A1F1D] hover:bg-white shadow-md active:scale-95 transition-all"
          >
            <X size={18} weight="bold" />
          </button>

          <figure
            className="animate-zoom-in bg-white p-4 pb-6 rounded-sm shadow-2xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#FFFBF9] rounded-sm mb-4 border border-[#F2E5E3]/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.localUrl}
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
              <p className="font-cursive text-3xl text-[#2A1F1D]/90 leading-tight">
                {selected.caption}
              </p>
              <div className="flex justify-between items-center border-t border-[#F2E5E3]/40 pt-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#2A1F1D]/60">
                  {selected.date}
                </span>
                <span className="font-mono text-[9px] text-[#2A1F1D]/40 uppercase tracking-widest">
                  No. 00{selected.id}
                </span>
              </div>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}