"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Sparkle } from "@phosphor-icons/react";

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

export default function SplitContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate cards sliding up on scroll
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
            },
          }
        );
      });

      // Animate bouquet subtle scroll sway
      gsap.to(".bouquet-wrap", {
        rotation: 6,
        y: -15,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: 1,
        },
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
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#2A1F1D]/65 block mb-2">
                Chapter II
              </span>
              <h2 className="text-3xl font-sans font-light tracking-tight text-[#2A1F1D]">
                A bouquet grown from <br />
                <span className="font-cursive text-4xl text-[#E5989B]">years of affection</span>
              </h2>
            </div>

            {/* Bouquet SVG wrapper */}
            <div className="bouquet-wrap w-72 h-96 relative flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(229,152,155,0.15)] bg-[#FFF6F5]/40 rounded-3xl p-6 border border-[#F2E5E3]/30">
              <svg
                viewBox="0 0 200 250"
                className="w-full h-full"
              >
                {/* Stems */}
                <g stroke="#7D8F69" strokeWidth="3" strokeLinecap="round">
                  <line x1="100" y1="120" x2="80" y2="210" />
                  <line x1="100" y1="120" x2="100" y2="215" />
                  <line x1="100" y1="120" x2="120" y2="210" />
                  <line x1="100" y1="120" x2="65" y2="185" />
                  <line x1="100" y1="120" x2="135" y2="185" />
                </g>

                {/* Leaves */}
                <g fill="#93A87D" stroke="#7D8F69" strokeWidth="1">
                  {/* Left leaf */}
                  <path d="M 75 160 C 55 155 50 140 65 135 C 75 140 80 150 75 160 Z" />
                  {/* Right leaf */}
                  <path d="M 125 160 C 145 155 150 140 135 135 C 125 140 120 150 125 160 Z" />
                  {/* Central leaf high */}
                  <path d="M 100 85 C 100 65 110 55 115 70 C 110 80 105 85 100 85 Z" />
                  {/* Leaf left-high */}
                  <path d="M 85 90 C 70 80 65 70 80 75 C 85 80 90 85 85 90 Z" />
                </g>

                {/* Flower 1 - Left Rose (Pink Blush) */}
                <g transform="translate(65, 110)">
                  <circle cx="0" cy="0" r="22" fill="#FFC8DD" />
                  <path d="M -15 -10 C -5 -25 10 -20 15 -5 C 5 15 -10 10 -15 -10 Z" fill="#FFA2B6" opacity="0.8" />
                  <path d="M -8 5 C 5 -10 15 -5 8 12 C -2 15 -5 10 -8 5 Z" fill="#FF85A1" opacity="0.9" />
                  <circle cx="0" cy="0" r="5" fill="#FF7096" />
                </g>

                {/* Flower 2 - Right Rose (Cream Apricot) */}
                <g transform="translate(135, 110)">
                  <circle cx="0" cy="0" r="20" fill="#FFE5D9" />
                  <path d="M -10 -10 C 5 -20 20 -15 10 -2 C 2 12 -12 8 -10 -10 Z" fill="#FFCAD4" opacity="0.8" />
                  <path d="M -5 3 C 5 -8 12 -3 5 10 C -2 10 -3 5 -5 3 Z" fill="#F4ACB7" opacity="0.9" />
                  <circle cx="0" cy="0" r="4" fill="#D8A3A9" />
                </g>

                {/* Flower 3 - Center Red Rose (Deep Rose) */}
                <g transform="translate(100, 95)">
                  <circle cx="0" cy="0" r="26" fill="#E5989B" />
                  <path d="M -18 -12 C -6 -30 15 -25 20 -6 C 10 18 -12 12 -18 -12 Z" fill="#B56576" opacity="0.8" />
                  <path d="M -10 6 C 5 -12 20 -6 10 15 C -2 18 -5 12 -10 6 Z" fill="#9B5DE5" opacity="0.15" />
                  <path d="M -8 2 C 2 -8 12 -4 8 10 C -2 10 -5 6 -8 2 Z" fill="#6D597A" opacity="0.3" />
                  <circle cx="0" cy="0" r="6" fill="#6D597A" />
                </g>

                {/* Flower 4 - Top Bud (Misty Rose) */}
                <g transform="translate(100, 60)">
                  <ellipse cx="0" cy="0" rx="14" ry="12" fill="#FFE5EC" />
                  <path d="M -8 4 C -2 -10 10 -10 8 4 Z" fill="#FFC8DD" />
                  <circle cx="0" cy="0" r="3" fill="#E5989B" />
                </g>

                {/* Bouquet Wrapping Paper Overlay */}
                <path
                  d="M 60 170 C 80 180 120 180 140 170 L 120 220 C 110 225 90 225 80 220 Z"
                  fill="#FFFBF9"
                  stroke="#F2E5E3"
                  strokeWidth="2"
                  opacity="0.9"
                />
                
                {/* Paper Ribbons */}
                <path d="M 60 170 C 85 160 115 160 140 170" fill="none" stroke="#FFB7B2" strokeWidth="2" />

                {/* Wrap Ribbon Bow */}
                <g transform="translate(100, 182)">
                  <ellipse cx="-10" cy="-2" rx="10" ry="6" fill="#FFB7B2" transform="rotate(-15)" />
                  <ellipse cx="10" cy="-2" rx="10" ry="6" fill="#FFB7B2" transform="rotate(15)" />
                  <circle cx="0" cy="-2" r="4" fill="#FF9F9C" />
                  <path d="M -2 0 L -12 18" stroke="#FFB7B2" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 2 0 L 12 18" stroke="#FFB7B2" strokeWidth="3" strokeLinecap="round" />
                </g>
              </svg>

              {/* Floating micro sparks around bouquet */}
              <div className="absolute top-8 left-8 text-[#FFCAD4]/60 animate-bounce">
                <Sparkle size={14} weight="fill" />
              </div>
              <div className="absolute bottom-16 right-8 text-[#FFCAD4]/60 animate-bounce [animation-delay:1.5s]">
                <Sparkle size={16} weight="fill" />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Scrolling Milestone Cards */}
        <div ref={rightColRef} className="lg:col-span-7 flex flex-col gap-12 lg:gap-16">
          {CARDS.map((card, idx) => (
            <div
              key={idx}
              className="greeting-card bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#F2E5E3]/40 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Subtle background color hue pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-[#FFF0EE] to-transparent opacity-60 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

              {/* Card Meta */}
              <div className="flex justify-between items-center mb-8">
                <span className="font-mono text-xs text-[#E5989B] tracking-[0.2em] font-semibold uppercase">
                  {card.year}
                </span>
                <span className="font-mono text-[10px] text-[#2A1F1D]/55 tracking-wider uppercase border border-[#F2E5E3] px-3 py-1 rounded-full bg-[#FFFBF9]">
                  {card.milestone}
                </span>
              </div>

              {/* Card Headline */}
              <h3 className="text-2xl md:text-3xl font-sans font-light text-[#2A1F1D] tracking-tight mb-4">
                {card.title}
              </h3>

              {/* Card Body */}
              <p className="text-[#2A1F1D]/75 text-sm md:text-base leading-relaxed">
                {card.message}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
