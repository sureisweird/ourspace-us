"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// AGENTS.md §5: ScrollTrigger harus di-register di level module
gsap.registerPlugin(useGSAP, ScrollTrigger);

const ASSET_BASE = "/assets/hibiscus_flower";

const PETAL_ASSETS = [
  "petal_1.svg",
  "petal_2.svg",
  "petal_3.svg",
  "petal_4.svg",
  "petal_5.svg",
];

interface PetalItem {
  id: number;
  asset: string;
}

export default function AmbientPetals({ solid = false }: { solid?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const [mountedPetals, setMountedPetals] = useState<PetalItem[]>([]);

  // React 19: Pastikan list di-generate di side effect agar rendering pure
  useEffect(() => {
    const list = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      asset: PETAL_ASSETS[i % PETAL_ASSETS.length],
    }));

    // Hindari warning cascading render (setState sinkron dalam effect)
    const timer = setTimeout(() => {
      setMountedPetals(list);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useGSAP(
    () => {
      if (mountedPetals.length === 0) return;

      const elements = gsap.utils.toArray<HTMLElement>(".ambient-particle");
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        // Reduced Motion: Letakkan secara statis, jangan dianimasikan
        elements.forEach((el, index) => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          gsap.set(el, {
            x: ((index * 7) % 85 + 5) / 100 * w,
            y: ((index * 11) % 80 + 10) / 100 * h,
            scale: 0.6 + (index % 5) * 0.15,
            opacity: solid ? 1 : 0.25,
            rotation: index * 25,
            rotationX: 0,
            rotationY: 0,
          });
        });
        return;
      }

      // Jalankan animasi mengambang multi-arah
      tweensRef.current = [];
      elements.forEach((el) => {
        animatePetal(el);
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => tweensRef.current.forEach((t) => t.resume()),
        onEnterBack: () => tweensRef.current.forEach((t) => t.resume()),
        onLeave: () => tweensRef.current.forEach((t) => t.pause()),
        onLeaveBack: () => tweensRef.current.forEach((t) => t.pause()),
      });

      function animatePetal(el: HTMLElement) {
        const w = window.innerWidth;
        const h = window.innerHeight;

        // Tentukan sisi asal (0: Atas, 1: Kanan, 2: Bawah, 3: Kiri)
        const side = Math.floor(Math.random() * 4);
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        const padding = 80; // offset agar muncul mulus dari luar layar

        if (side === 0) {
          // Dari Atas ke Bawah
          startX = Math.random() * w;
          startY = -padding;
          endX = Math.random() * w;
          endY = h + padding;
        } else if (side === 1) {
          // Dari Kanan ke Kiri
          startX = w + padding;
          startY = Math.random() * h;
          endX = -padding;
          endY = Math.random() * h;
        } else if (side === 2) {
          // Dari Bawah ke Atas
          startX = Math.random() * w;
          startY = h + padding;
          endX = Math.random() * w;
          endY = -padding;
        } else {
          // Dari Kiri ke Kanan
          startX = -padding;
          startY = Math.random() * h;
          endX = w + padding;
          endY = Math.random() * h;
        }

        const duration = 16 + Math.random() * 20; // 16s s.d 36s agar sangat lambat & elegan
        const scale = 0.5 + Math.random() * 0.8; // skala bervariasi

        // Setel posisi awal kelopak
        gsap.set(el, {
          x: startX,
          y: startY,
          scale: scale,
          opacity: 0,
          rotation: Math.random() * 360,
          rotationX: Math.random() * 360,
          rotationY: Math.random() * 360,
        });

        // Animasi meluncur melintasi layar
        const tween = gsap.to(el, {
          x: endX,
          y: endY,
          rotation: `+=${360 + Math.random() * 360}`,
          rotationX: `+=${180 + Math.random() * 360}`,
          rotationY: `+=${180 + Math.random() * 360}`,
          duration: duration,
          ease: "none",
          force3D: true,
          onStart: () => {
            // Efek memudar masuk secara lembut saat baru lahir
            gsap.to(el, { opacity: solid ? 1 : 0.5, duration: 3, ease: "power1.inOut" });
          },
          onComplete: () => {
            animatePetal(el);
          },
        });

        const idx = elements.indexOf(el);
        tweensRef.current[idx] = tween;
      }
    },
    { scope: containerRef, dependencies: [mountedPetals] }
  );

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {mountedPetals.map((petal) => (
        <img
          key={petal.id}
          src={`${ASSET_BASE}/${petal.asset}`}
          alt=""
          decoding="async"
          className="ambient-particle decor-paint absolute w-12 h-auto select-none opacity-0"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ))}
    </div>
  );
}
