"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { HeartIcon } from "@phosphor-icons/react";

const PETAL_COUNT = 45;
const PETAL_ASSET_COUNT = 5;
const FLORAL_ASSET_BASE = "/assets/hibiscus_flower";

const WASH_FLOWERS_COUNT = 16;
const WASH_FLOWERS = Array.from({ length: WASH_FLOWERS_COUNT }).map((_, i) => {
  const isOuter = i >= 4;
  const count = isOuter ? 12 : 4;
  const index = isOuter ? i - 4 : i;
  const angle = (index / count) * Math.PI * 2 + (isOuter ? Math.PI / 6 : 0);
  const distance = isOuter ? 45 : 18;
  
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
  onTransitionComplete?: () => void;
  isTransitioning?: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

interface StarParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
  src: string;
  delay: number;
  duration: number;
  opacity: number;
}

// Pre-defined static stars to avoid hydration mismatch and mount delay
const STATIC_STARS: StarParticle[] = [
  { id: 1, x: 8, y: 15, scale: 0.9, src: "/assets/stars/pink_star_3.svg", delay: 0.5, duration: 4.5, opacity: 0.6 },
  { id: 2, x: 85, y: 12, scale: 1.1, src: "/assets/stars/yellow_star_5.svg", delay: 1.2, duration: 5.2, opacity: 0.5 },
  { id: 3, x: 12, y: 78, scale: 0.7, src: "/assets/stars/pink_star_8.svg", delay: 2.1, duration: 3.8, opacity: 0.4 },
  { id: 4, x: 78, y: 82, scale: 1.0, src: "/assets/stars/yellow_star_12.svg", delay: 0.2, duration: 4.8, opacity: 0.7 },
  { id: 5, x: 25, y: 22, scale: 0.6, src: "/assets/stars/yellow_star_2.svg", delay: 3.1, duration: 5.5, opacity: 0.3 },
  { id: 6, x: 70, y: 28, scale: 0.8, src: "/assets/stars/pink_star_1.svg", delay: 1.7, duration: 4.2, opacity: 0.5 },
  { id: 7, x: 18, y: 45, scale: 1.1, src: "/assets/stars/yellow_star_9.svg", delay: 0.8, duration: 3.5, opacity: 0.6 },
  { id: 8, x: 88, y: 48, scale: 0.7, src: "/assets/stars/pink_star_11.svg", delay: 2.5, duration: 5.0, opacity: 0.4 },
  { id: 9, x: 30, y: 88, scale: 0.8, src: "/assets/stars/yellow_star_4.svg", delay: 1.4, duration: 4.0, opacity: 0.5 },
  { id: 10, x: 65, y: 75, scale: 1.0, src: "/assets/stars/pink_star_6.svg", delay: 0.9, duration: 4.7, opacity: 0.6 },
  { id: 11, x: 50, y: 8, scale: 0.7, src: "/assets/stars/yellow_star_7.svg", delay: 2.8, duration: 5.8, opacity: 0.4 },
  { id: 12, x: 92, y: 28, scale: 0.9, src: "/assets/stars/pink_star_4.svg", delay: 0.3, duration: 3.2, opacity: 0.5 },
  { id: 13, x: 6, y: 55, scale: 0.6, src: "/assets/stars/yellow_star_11.svg", delay: 3.4, duration: 4.9, opacity: 0.3 },
  { id: 14, x: 42, y: 92, scale: 1.1, src: "/assets/stars/pink_star_13.svg", delay: 1.1, duration: 5.1, opacity: 0.6 },
  { id: 15, x: 80, y: 62, scale: 0.8, src: "/assets/stars/yellow_star_13.svg", delay: 2.3, duration: 4.4, opacity: 0.5 },
  { id: 16, x: 15, y: 32, scale: 0.9, src: "/assets/stars/pink_star_7.svg", delay: 0.7, duration: 3.9, opacity: 0.5 },
  { id: 17, x: 82, y: 35, scale: 0.7, src: "/assets/stars/yellow_star_1.svg", delay: 1.9, duration: 4.6, opacity: 0.4 },
  { id: 18, x: 22, y: 65, scale: 1.0, src: "/assets/stars/pink_star_10.svg", delay: 0.1, duration: 5.3, opacity: 0.7 }
];

export default function GiftBoxHero({
  onOpenComplete,
  onTransitionComplete,
  isTransitioning = false,
  audioRef,
}: GiftBoxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxWrapperRef = useRef<HTMLDivElement>(null);
  const envelopeFlapRef = useRef<HTMLImageElement>(null);
  const envelopeBodyRef = useRef<HTMLImageElement>(null);
  const envelopeSealRef = useRef<HTMLImageElement>(null);
  const letterSheetRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [petals, setPetals] = useState<PetalParticle[]>([]);

  useEffect(() => {
    const generatedPetals = Array.from({ length: PETAL_COUNT }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 120;
      const assetIndex = Math.floor(Math.random() * PETAL_ASSET_COUNT) + 1;
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

  const [loadedImages, setLoadedImages] = useState({ body: false, flap: false, seal: false });
  const allImagesLoaded = loadedImages.body && loadedImages.flap && loadedImages.seal;

  const handleLoad = (key: "body" | "flap" | "seal") => {
    setLoadedImages((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: true };
    });
  };

  useEffect(() => {
    setLoadedImages((prev) => {
      const body = envelopeBodyRef.current?.complete || prev.body;
      const flap = envelopeFlapRef.current?.complete || prev.flap;
      const seal = envelopeSealRef.current?.complete || prev.seal;
      if (body !== prev.body || flap !== prev.flap || seal !== prev.seal) {
        return { body, flap, seal };
      }
      return prev;
    });
  }, []);

  const [isClicked, setIsClicked] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [playFailed, setPlayFailed] = useState(false);
  const isOpeningRef = useRef(false);

  // Floating ambient animation for the envelope wrapper
  useGSAP(
    () => {
      if (isClicked) return;

      gsap.to(boxWrapperRef.current, {
        y: -12,
        rotation: 0.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Gently pulse/sway the wax seal
      gsap.to(envelopeSealRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    },
    { scope: containerRef, dependencies: [isClicked] }
  );

  const handleOpenBox = async () => {
    if (isClicked || isOpeningRef.current) return;
    isOpeningRef.current = true;
    setPlayFailed(false);

    const audio = audioRef.current;
    try {
      if (!audio) {
        throw new Error("Audio element is not available");
      }
      await audio.play();
    } catch (err) {
      console.warn("Audio playback failed; envelope opening is gated:", err);
      isOpeningRef.current = false;
      setPlayFailed(true);
      return;
    }

    setIsClicked(true);
  };

  useGSAP(
    () => {
      if (!isClicked || petals.length === 0) return;

      const tl = gsap.timeline({
        onComplete: () => {
          setIsOpened(true);
          onOpenComplete();
        },
      });

      // Click reaction (anticipate)
      tl.to(boxWrapperRef.current, {
        y: 0,
        scale: 1.05,
        duration: 0.15,
        ease: EASE_SPRING,
      });

      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: EASE_OUT,
      }, 0);

      // Wax seal pops and fades away
      tl.to(envelopeSealRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.4,
        ease: "back.in(1.2)",
      }, 0.1);

      // Envelope flap folds open
      tl.to(envelopeFlapRef.current, {
        scaleY: 1,
        duration: 0.6,
        ease: "power2.inOut",
      }, 0.25);

      // Put flap behind the letter once the letter starts sliding up
      tl.set(envelopeFlapRef.current, { zIndex: 5 }, 0.55);

      // Letter slides up out of envelope
      tl.to(letterSheetRef.current, {
        opacity: 1,
        y: -120,
        scale: 1.02,
        duration: 0.8,
        ease: "back.out(1.2)",
      }, 0.55);

      // Trigger the flower and petal animations
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
        0.85
      );

      tl.to(washRef.current, { opacity: 1, duration: 0.15 }, 1.1);

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
        1.15
      );

      tl.to(
        "#wash-bg",
        { opacity: 1, duration: 0.8, ease: "power2.inOut" },
        1.45
      );

      tl.to(
        [
          envelopeBodyRef.current,
          envelopeFlapRef.current,
          letterSheetRef.current,
          ".petal-particle",
          ".ambient-star"
        ],
        { opacity: 0, duration: 0.4 },
        1.8
      );
    },
    { scope: containerRef, dependencies: [isClicked, petals] }
  );

  // Exit transition (Scatter to left and right)
  useGSAP(
    () => {
      if (!isTransitioning) return;

      const exitTl = gsap.timeline({
        onComplete: onTransitionComplete,
      });

      exitTl.to(
        ".wash-flower",
        {
          x: (i) => (WASH_FLOWERS[i].x < 0 ? "-120vw" : "120vw"),
          y: (i) => `${WASH_FLOWERS[i].y * 1.2}vh`,
          scale: (i) => WASH_FLOWERS[i].scale * 0.8,
          rotation: (i) => (WASH_FLOWERS[i].x < 0 ? "-=120" : "+=120"),
          duration: 1.5,
          ease: "power3.inOut",
          stagger: { each: 0.01, from: "center" },
        },
        0
      );

      exitTl.to(
        "#wash-bg",
        {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.1
      );

      exitTl.to(
        containerRef.current,
        {
          backgroundColor: "rgba(23, 14, 13, 0)",
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.1
      );
    },
    { scope: containerRef, dependencies: [isTransitioning, onTransitionComplete] }
  );

  return (
    <div
      ref={containerRef}
      style={{ willChange: "background-color", contain: "layout paint" }}
      className={`fixed inset-0 z-50 flex flex-col items-center bg-[#170E0D]/95 overflow-hidden select-none isolate ${
        isTransitioning ? "pointer-events-none" : ""
      }`}
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[15%] w-8 h-8 rounded-full bg-accent blur-sm animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-surface blur-md animate-pulse-slow" />
        <div className="absolute top-[40%] right-[25%] w-6 h-6 rounded-full bg-accent-strong blur-sm animate-pulse-slow" />
      </div>

      {/* Twinkling ambient stars */}
      {!isOpened && (
        <div className="ambient-star absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {STATIC_STARS.map((star) => (
            <img
              key={star.id}
              src={star.src}
              alt=""
              className="absolute animate-twinkle-float pointer-events-none select-none"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.scale * 16}px`,
                height: `${star.scale * 16}px`,
                opacity: star.opacity,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
      )}

      {!allImagesLoaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 animate-fade-in">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <HeartIcon
              size={36}
              weight="fill"
              className="text-accent animate-pulse"
              style={{ animationDuration: "1.5s" }}
            />
            <div className="absolute inset-0 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-accent/80 uppercase">
            Memuat kenangan...
          </span>
        </div>
      )}

      {/* Main interactive area */}
      {!isOpened && (
        <div
          className={`relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-all duration-700 ease-in-out ${
            allImagesLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {/* Text prompt */}
          <div
            ref={textRef}
            className="text-center mb-12 px-4 cursor-pointer"
            onClick={handleOpenBox}
          >
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-accent block mb-3 animate-pulse">
              An anniversary letter for you
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

          {/* Envelope Wrapper - Proportional aspect ratio matches envelope_body viewBox 1477:1114 */}
          <div
            ref={boxWrapperRef}
            onClick={handleOpenBox}
            className="relative w-[300px] md:w-[380px] aspect-1477/1114 cursor-pointer active:scale-95 transition-transform"
            style={{ perspective: "1000px" }}
          >
            {/* Letter Sheet (Kertas Surat) - Tersembunyi di dalam amplop */}
            <div
              ref={letterSheetRef}
              className="absolute w-[90%] h-[80%] bg-[#FFFBF9] border border-accent/20 rounded-inner shadow-elevation-2 p-5 md:p-6 flex flex-col justify-between opacity-0 pointer-events-none select-none z-10"
              style={{ 
                left: "5%",
                top: "10%",
                willChange: "transform, opacity" 
              }}
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="font-cursive text-xl md:text-2xl text-accent-strong">Dear Favorite Person,</span>
                <p className="font-sans text-[8px] md:text-[9px] uppercase tracking-widest text-foreground/60 mt-2">
                  Hari ini adalah hari istimewa kita.
                </p>
                <p className="font-sans text-[7px] md:text-[8px] uppercase tracking-wider text-foreground/40 mt-1">
                  Mari kita buka lembaran memori indah kita...
                </p>
              </div>
              <div className="flex justify-center">
                <HeartIcon size={14} weight="fill" className="text-accent animate-pulse" />
              </div>
            </div>

            {/* Envelope Body (Badan Amplop) */}
            <img
              ref={envelopeBodyRef}
              src="/assets/envelope/envelope_body.svg"
              alt="Envelope Body"
              onLoad={() => handleLoad("body")}
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20"
              style={{ willChange: "transform, opacity" }}
            />

            {/* Envelope Flap (Tutup Amplop) */}
            <img
              ref={envelopeFlapRef}
              src="/assets/envelope/envelope_flap.svg"
              alt="Envelope Flap"
              onLoad={() => handleLoad("flap")}
              className="absolute pointer-events-none z-30"
              style={{ 
                width: "99.05%",
                height: "62.12%",
                left: "0.47%",
                top: "-62.12%",
                transform: "scaleY(-1)",
                willChange: "transform, opacity",
                transformOrigin: "center bottom" 
              }}
            />

            {/* Envelope Seal (Cap Lilin) */}
            <img
              ref={envelopeSealRef}
              src="/assets/envelope/envelope_seal.svg"
              alt="Wax Seal"
              onLoad={() => handleLoad("seal")}
              className="absolute w-20 h-20 md:w-24 md:h-24 object-contain pointer-events-none z-40"
              style={{ 
                left: "50%",
                top: "56%",
                transform: "translate(-50%, -50%)",
                willChange: "transform, opacity" 
              }}
            />

            {petals.map((petal) => (
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
                  zIndex: 15
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div
        ref={washRef}
        className="pointer-events-none fixed inset-0 z-60 overflow-hidden opacity-0"
      >
        <div id="wash-bg" className="absolute inset-0 bg-accent opacity-0" />

        {WASH_FLOWERS.map((fw) => (
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

      <style>{`
        @keyframes twinkle-float {
          0%, 100% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.25;
          }
          50% {
            transform: translateY(-6px) scale(1.12) rotate(8deg);
            opacity: 0.8;
          }
        }
        .animate-twinkle-float {
          animation: twinkle-float infinite ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-twinkle-float {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}