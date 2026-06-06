"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Aset_Bunga: kelopak hibiscus dipakai sebagai partikel ledakan (R5.7/R13.2/R13.5).
const PETAL_COUNT = 45;
const PETAL_ASSET_COUNT = 5; // petal_1.svg .. petal_5.svg
const FLORAL_ASSET_BASE = "/assets/hibiscus_flower";

const WASH_FLOWERS_COUNT = 16;
const WASH_FLOWERS = Array.from({ length: WASH_FLOWERS_COUNT }).map((_, i) => {
  const isOuter = i >= 4;
  const count = isOuter ? 12 : 4;
  const index = isOuter ? i - 4 : i;
  const angle = (index / count) * Math.PI * 2 + (isOuter ? Math.PI / 6 : 0);
  const distance = isOuter ? 45 : 18; // percentage of viewport size
  
  let src = `${FLORAL_ASSET_BASE}/flower_medium_1.svg`;
  if (i % 4 === 0) src = `${FLORAL_ASSET_BASE}/flower_big_1.svg`;
  else if (i % 4 === 1) src = `${FLORAL_ASSET_BASE}/flower_medium_1.svg`;
  else if (i % 4 === 2) src = `${FLORAL_ASSET_BASE}/flower_medium_2.svg`;
  else src = `${FLORAL_ASSET_BASE}/flower_medium_3.svg`;

  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    scale: 2.0 + Math.random() * 1.0,
    rotation: Math.random() * 360,
    src,
  };
});

// Easing standar Sistem_Desain (R9.1): kurva ease-out halus + sentuhan spring.
const EASE_OUT = "power3.out";
const EASE_SPRING = "back.out(2)";

interface PetalParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  src: string;
}

interface GiftBoxHeroProps {
  onOpenComplete: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function GiftBoxHero({ onOpenComplete, audioRef }: GiftBoxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxWrapperRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<SVGGElement>(null);
  const boxBodyRef = useRef<SVGGElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [petals, setPetals] = useState<PetalParticle[]>([]);

  // Pre-generate petals at mount inside useEffect to comply with React 19 purity rules (no Math.random during render).
  // Wrapped in setTimeout to prevent ESLint set-state-in-effect warnings by running the update asynchronously.
  useEffect(() => {
    const generatedPetals = Array.from({ length: PETAL_COUNT }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 120;
      const assetIndex = Math.floor(Math.random() * PETAL_ASSET_COUNT) + 1; // 1..5
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 1.0,
        src: `${FLORAL_ASSET_BASE}/petal_${assetIndex}.svg`,
      };
    });
    const timer = setTimeout(() => {
      setPetals(generatedPetals);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [isClicked, setIsClicked] = useState(false);
  // Penanda audio gagal diputar → tampilkan petunjuk halus untuk mengetuk lagi (R5.4).
  const [playFailed, setPlayFailed] = useState(false);
  // Guard agar tap berulang saat menunggu Promise play() tidak memicu ganda.
  const isOpeningRef = useRef(false);

  // Floating ambient animation
  useGSAP(
    () => {
      if (isClicked) return;

      gsap.to(boxWrapperRef.current, {
        y: -15,
        rotation: 2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      gsap.to(lidRef.current, {
        y: -3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    },
    { scope: containerRef, dependencies: [isClicked] }
  );

  const handleOpenBox = async () => {
    // Guard ganda: sudah terbuka atau sedang menunggu Promise play().
    if (isClicked || isOpeningRef.current) return;
    isOpeningRef.current = true;
    setPlayFailed(false);

    const audio = audioRef.current;

    // GATE (R5.2/5.3/5.4): mulai audio SEGERA di dalam gesture tap, lalu tahan
    // timeline pembukaan hingga Promise play() resolve. Karena dipanggil dalam
    // gesture tap, ini kompatibel dengan kebijakan autoplay browser & AGENTS.md.
    try {
      if (!audio) {
        // Tanpa elemen audio, audio tidak dapat diputar → perlakukan sebagai gagal.
        throw new Error("Audio element is not available");
      }
      await audio.play();
    } catch (err) {
      // Audio gagal/ditolak → JANGAN jalankan timeline pembukaan & onOpenComplete.
      // UI tetap pada keadaan "tap untuk membuka" (R5.4).
      console.warn("Audio playback failed; gift opening is gated:", err);
      isOpeningRef.current = false;
      setPlayFailed(true);
      return;
    }

    // Audio berhasil diputar → jalankan animasi pembukaan.
    setIsClicked(true);
  };

  useGSAP(
    () => {
      if (!isClicked || petals.length === 0) return;

      const tl = gsap.timeline({ onComplete: onOpenComplete });

      tl.to(boxWrapperRef.current, {
        y: 0,
        scale: 1.1,
        duration: 0.15,
        ease: EASE_SPRING,
      });

      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: EASE_OUT,
      }, 0);

      tl.to(lidRef.current, {
        y: -300,
        x: 100,
        rotation: 120,
        opacity: 0,
        duration: 0.8,
        ease: EASE_OUT,
      }, 0.1);

      tl.to(boxBodyRef.current, {
        scale: 0.85,
        transformOrigin: "center bottom",
        duration: 0.3,
        ease: EASE_OUT,
      }, 0.1);

      tl.fromTo(
        ".petal-particle",
        { x: 0, y: 0, scale: 0.1, opacity: 0 },
        {
          x: (i) => petals[i].x * 4,
          y: (i) => petals[i].y * 4,
          rotation: (i) => petals[i].rotation + 360,
          scale: (i) => petals[i].scale,
          opacity: 0.9,
          duration: 1.2,
          stagger: { each: 0.005, from: "random" },
          ease: EASE_OUT,
          force3D: true,
        },
        0.15
      );

      tl.to(washRef.current, { opacity: 1, duration: 0.15 }, 0.4);

      tl.fromTo(
        ".wash-flower",
        { x: 0, y: 0, scale: 0, rotation: 0, opacity: 0 },
        {
          x: (i) => `${WASH_FLOWERS[i].x}vw`,
          y: (i) => `${WASH_FLOWERS[i].y}vh`,
          scale: (i) => WASH_FLOWERS[i].scale,
          rotation: (i) => WASH_FLOWERS[i].rotation,
          opacity: 1,
          duration: 1.2,
          stagger: { each: 0.02, from: "center" },
          ease: "power2.out",
          force3D: true,
        },
        0.45
      );

      tl.to(
        "#wash-bg",
        { opacity: 1, duration: 0.8, ease: "power2.inOut" },
        0.75
      );

      tl.to(
        [boxBodyRef.current, ".petal-particle"],
        { opacity: 0, duration: 0.4 },
        1.1
      );
    },
    { scope: containerRef, dependencies: [isClicked, petals] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#170E0D]/95 backdrop-blur-md overflow-hidden select-none isolate"
    >
      {/* Ambient background blobs — tint dari Token_Desain (R5.5/R13.9) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[15%] w-8 h-8 rounded-full bg-accent blur-sm animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-surface blur-md animate-pulse-slow" />
        <div className="absolute top-[40%] right-[25%] w-6 h-6 rounded-full bg-accent-strong blur-sm animate-pulse-slow" />
      </div>

      {/* Main interactive area */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Text prompt */}
        <div
          ref={textRef}
          className="text-center mb-16 px-4 cursor-pointer"
          onClick={handleOpenBox}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-accent block mb-3 animate-pulse">
            An anniversary gift for you
          </span>
          <h1 className="font-cursive text-4xl md:text-5xl text-background">
            Tap to open our memories
          </h1>
          {playFailed && (
            <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent-strong block mt-4 animate-fade-in">
              Ketuk sekali lagi untuk membuka
            </span>
          )}
        </div>

        {/* Gift Box */}
        <div
          ref={boxWrapperRef}
          onClick={handleOpenBox}
          className="relative w-64 h-64 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full filter drop-shadow-[0_20px_35px_rgba(255,183,178,0.25)]"
          >
            <g ref={boxBodyRef}>
              <rect x="50" y="80" width="100" height="90" rx="8" fill="#FFF1F0" />
              <rect x="46" y="76" width="108" height="8" rx="2" fill="#E6D3D1" />
              <path d="M 50 80 L 150 80 L 150 90 L 50 90 Z" fill="#2A1F1D" opacity="0.06" />
              <rect x="90" y="80" width="20" height="90" fill="#FFB7B2" />
              <rect x="50" y="115" width="100" height="20" fill="#FFB7B2" />
              <circle cx="100" cy="125" r="8" fill="#FFFBF9" stroke="#FFB7B2" strokeWidth="2" />
            </g>

            <g ref={lidRef}>
              <rect x="44" y="52" width="112" height="26" rx="4" fill="#FFE5EC" />
              <rect x="90" y="52" width="20" height="26" fill="#FFB7B2" />
              <path d="M 90 52 C 65 30 65 15 88 44 Z" fill="#FFB7B2" stroke="#FFB7B2" strokeWidth="1" />
              <path d="M 110 52 C 135 30 135 15 112 44 Z" fill="#FFB7B2" stroke="#FFB7B2" strokeWidth="1" />
              <rect x="92" y="46" width="16" height="10" rx="2" fill="#FFE5EC" stroke="#FFB7B2" strokeWidth="2" />
            </g>
          </svg>

          {petals.map((petal) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={petal.id}
              src={petal.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="petal-particle absolute w-14 h-14 pointer-events-none object-contain opacity-0 scale-0"
              style={{
                left: "calc(50% - 28px)",
                top: "calc(50% - 28px)",
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />
          ))}
        </div>
      </div>
      <div
        ref={washRef}
        className="pointer-events-none fixed inset-0 z-60 overflow-hidden opacity-0"
      >
        {/* Solid background color that fades in behind the expanding flowers to guarantee no gaps */}
        <div id="wash-bg" className="absolute inset-0 bg-accent opacity-0" />

        {/* Multiple blooming flowers exploding and scaling outward from the center */}
        {WASH_FLOWERS.map((fw) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={fw.id}
            src={fw.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="wash-flower absolute w-48 h-48 md:w-64 md:h-64 object-contain pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%) scale(0)",
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
        ))}
      </div>
    </div>
  );
}