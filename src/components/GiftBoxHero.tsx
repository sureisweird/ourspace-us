"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PetalParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shapePath: string;
}

const PETAL_SHAPES = [
  "M 0 0 C 10 -15 20 -15 30 0 C 20 15 10 15 0 0 Z", // Basic petal
  "M 0 0 C 15 -10 15 -20 0 -30 C -15 -20 -15 -10 0 0 Z", // Heartish leaf
  "M 0 0 C 8 -20 22 -20 30 -5 C 20 10 10 15 0 0 Z", // Asymmetric leaf
  "M 0 0 C 10 -10 25 -5 20 15 C 10 20 0 10 0 0 Z"   // Round petal
];

const PETAL_COLORS = [
  "#FFB7B2", // Pastel Pink
  "#FFC6FF", // Light Magenta
  "#FFD1DC", // Rose Pink
  "#FFF0F5", // Lavender Blush
  "#FFE4E1", // Misty Rose
  "#FFC0CB", // Pink
  "#FFE5EC", // Soft Pink
];

interface GiftBoxHeroProps {
  onOpenComplete: () => void;
}

export default function GiftBoxHero({ onOpenComplete }: GiftBoxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxWrapperRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<SVGGElement>(null);
  const boxBodyRef = useRef<SVGGElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [petals, setPetals] = useState<PetalParticle[]>([]);
  const [isClicked, setIsClicked] = useState(false);

  // Floating ambient animation for the gift box before click
  useGSAP(
    () => {
      if (isClicked) return;

      // Floating loop
      gsap.to(boxWrapperRef.current, {
        y: -15,
        rotation: 2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Lid subtle lift loop
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

  const handleOpenBox = () => {
    if (isClicked) return;
    setIsClicked(true);

    // Generate 120 petals for the explosion
    const generatedPetals: PetalParticle[] = Array.from({ length: 120 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 120;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotation: Math.random() * 360,
        scale: 0.4 + Math.random() * 0.8,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        shapePath: PETAL_SHAPES[Math.floor(Math.random() * PETAL_SHAPES.length)],
      };
    });

    setPetals(generatedPetals);

    // Trigger GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        onOpenComplete();
      },
    });

    // Stop floating, pop box, throw lid
    tl.to(boxWrapperRef.current, {
      y: 0,
      scale: 1.1,
      duration: 0.15,
      ease: "back.out(2)",
    });

    // Hide text instantly or fade it out
    tl.to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.out"
    }, 0);

    // Throw the lid away
    tl.to(lidRef.current, {
      y: -300,
      x: 100,
      rotation: 120,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }, 0.1);

    // Subtle scale-down of box body
    tl.to(boxBodyRef.current, {
      scale: 0.85,
      transformOrigin: "center bottom",
      duration: 0.3,
      ease: "power2.inOut",
    }, 0.1);

    // Petal explosion animation
    tl.fromTo(
      ".petal-particle",
      {
        x: 0,
        y: 0,
        scale: 0.1,
        opacity: 0,
      },
      {
        x: (i) => generatedPetals[i].x * 4,
        y: (i) => generatedPetals[i].y * 4,
        rotation: (i) => generatedPetals[i].rotation + 360,
        scale: (i) => generatedPetals[i].scale,
        opacity: 0.9,
        duration: 1.2,
        stagger: {
          each: 0.005,
          from: "random",
        },
        ease: "power4.out",
      },
      0.15
    );

    // FIX IMPLEMENTASI: Efek mawar raksasa mekar membesar dan sedikit berputar menutup layar
    tl.fromTo(
      washRef.current,
      {
        scale: 0,
        rotation: -45,
        opacity: 0,
      },
      {
        scale: 1,
        rotation: 15,
        opacity: 1,
        duration: 1.3,
        ease: "power3.inOut",
      },
      0.5
    );

    // Fade out everything else di belakang penutup mawar
    tl.to(
      [boxBodyRef.current, ".petal-particle"],
      {
        opacity: 0,
        duration: 0.4,
      },
      1.1
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#170E0D]/95 backdrop-blur-md overflow-hidden select-none"
    >
      {/* Background ambient petal shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[15%] w-8 h-8 rounded-full bg-[#FFB7B2] blur-sm animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-[#FFE4E1] blur-md animate-pulse-slow" />
        <div className="absolute top-[40%] right-[25%] w-6 h-6 rounded-full bg-[#FFC6FF] blur-sm animate-pulse-slow" />
      </div>

      {/* Main interactive area */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated text prompt */}
        <div
          ref={textRef}
          className="text-center mb-16 px-4 cursor-pointer"
          onClick={handleOpenBox}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#FFB7B2] block mb-3 animate-pulse">
            An anniversary gift for you
          </span>
          <h1 className="font-cursive text-4xl md:text-5xl text-[#FFFBF9]">
            Tap to open our memories
          </h1>
        </div>

        {/* Gift Box Container */}
        <div
          ref={boxWrapperRef}
          onClick={handleOpenBox}
          className="relative w-64 h-64 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full filter drop-shadow-[0_20px_35px_rgba(255,183,178,0.25)]"
          >
            {/* Box Body Group */}
            <g ref={boxBodyRef}>
              {/* Main Box Rect */}
              <rect x="50" y="80" width="100" height="90" rx="8" fill="#FFF1F0" />
              {/* Lid Lip Underlay */}
              <rect x="46" y="76" width="108" height="8" rx="2" fill="#E6D3D1" />
              {/* Shadow inside */}
              <path d="M 50 80 L 150 80 L 150 90 L 50 90 Z" fill="#2A1F1D" opacity="0.06" />
              {/* Ribbon Vertical */}
              <rect x="90" y="80" width="20" height="90" fill="#FFB7B2" />
              {/* Ribbon Horizontal */}
              <rect x="50" y="115" width="100" height="20" fill="#FFB7B2" />
              {/* Golden Clasp Circle */}
              <circle cx="100" cy="125" r="8" fill="#FFFBF9" stroke="#FFB7B2" strokeWidth="2" />
            </g>

            {/* Gift Box Lid Group */}
            <g ref={lidRef}>
              {/* Lid Rect */}
              <rect x="44" y="52" width="112" height="26" rx="4" fill="#FFE5EC" />
              {/* Ribbon Vertical Lid */}
              <rect x="90" y="52" width="20" height="26" fill="#FFB7B2" />
              
              {/* Ribbon Bow Left */}
              <path
                d="M 90 52 C 65 30 65 15 88 44 Z"
                fill="#FFB7B2"
                stroke="#FFB7B2"
                strokeWidth="1"
              />
              {/* Ribbon Bow Right */}
              <path
                d="M 110 52 C 135 30 135 15 112 44 Z"
                fill="#FFB7B2"
                stroke="#FFB7B2"
                strokeWidth="1"
              />
              {/* Bow Center knot */}
              <rect x="92" y="46" width="16" height="10" rx="2" fill="#FFE5EC" stroke="#FFB7B2" strokeWidth="2" />
            </g>
          </svg>

          {/* Render Exploding Petals */}
          {petals.map((petal) => (
            <svg
              key={petal.id}
              className="petal-particle absolute w-8 h-8 pointer-events-none"
              style={{
                fill: petal.color,
                left: "calc(50% - 16px)",
                top: "calc(50% - 16px)",
              }}
              viewBox="-20 -20 60 60"
            >
              <path d={petal.shapePath} />
            </svg>
          ))}
        </div>
      </div>

      {/* SCREEN WASH FIX: Sekarang berisi lapisan kelopak mawar mewah untuk transisi penuh */}
      <div
        ref={washRef}
        className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0"
        style={{
          transformOrigin: "center center",
          transform: "scale(0)",
          width: "320vmax",
          height: "320vmax",
          left: "calc(50% - 160vmax)",
          top: "calc(50% - 160vmax)",
        }}
      >
        {/* Layered Luxury SVG Rose Blossom yang menutup layar penuh saat di-scale raksasa */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full transform scale-105"
        >
          {/* Outermost Ring - Memastikan penutupan layar 100% rapat */}
          <circle cx="100" cy="100" r="100" fill="#FFE5EC" />
          <path d="M100 0 C140 0, 200 60, 200 100 C200 140, 140 200, 100 200 C60 200, 0 140, 0 100 C0 60, 60 0, 100 0 Z" fill="#FFE4E1" />
          
          {/* Kelopak Mawar Lapisan Luar */}
          <path d="M100 10 C150 10, 190 50, 190 100 C190 150, 150 190, 100 190 C50 190, 10 150, 10 100 C10 50, 50 100, 100 10 Z" fill="#FFD1DC" opacity="0.95" />
          <path d="M100 25 C140 25, 175 60, 175 100 C175 140, 140 175, 100 175 C60 175, 25 140, 25 100 C25 60, 60 25, 100 25 Z" fill="#FFB7B2" />
          
          {/* Kelopak Mawar Lapisan Tengah */}
          <path d="M100 40 C130 40, 160 70, 160 100 C160 130, 130 160, 100 160 C70 160, 40 130, 40 100 C40 70, 70 40, 100 40 Z" fill="#FFC0CB" />
          <path d="M100 55 C125 55, 145 75, 145 100 C145 125, 125 145, 100 145 C75 145, 55 125, 55 100 C55 75, 75 55, 100 55 Z" fill="#FFAAA6" />
          
          {/* Kelopak Mawar Lapisan Inti / Dalam */}
          <path d="M100 70 C115 70, 130 85, 130 100 C130 115, 115 130, 100 130 C85 130, 70 115, 70 100 C70 85, 85 70, 100 70 Z" fill="#FF8B94" />
          <circle cx="100" cy="100" r="18" fill="#FF6B6B" />
        </svg>
      </div>
    </div>
  );
}