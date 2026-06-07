"use client";

import { useState } from "react";

const ASSET_BASE = "/assets/hibiscus_flower";

function DecorImage({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={`${ASSET_BASE}/${name}`}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      onError={() => setFailed(true)}
      className={`decor-paint ${className ?? ""}`}
      style={style}
    />
  );
}

function CornerSpray({ className }: { className?: string }) {
  return (
    <div className={`relative aspect-5/6 ${className ?? ""}`}>
      {/* Tint/glow lembut di sekitar aset memakai Token_Desain (R13.9) */}
      <div
        className="absolute left-[18%] top-[34%] h-3/5 w-3/5 rounded-full bg-accent opacity-20 blur-2xl"
        aria-hidden="true"
      />

      {/* Dedaunan dasar */}
      <DecorImage
        name="leaf_2.svg"
        className="absolute bottom-0 left-[2%] w-[58%] origin-bottom-left rotate-[-18deg]"
      />
      <DecorImage
        name="leaf_1.svg"
        className="absolute bottom-[14%] left-[30%] w-[52%] origin-bottom -rotate-2 opacity-95"
      />
      <DecorImage
        name="leaf_3.svg"
        className="absolute bottom-[6%] left-[42%] w-[46%] origin-bottom-right rotate-24 opacity-90"
      />

      {/* Bunga utama */}
      <DecorImage
        name="flower_medium_1.svg"
        className="absolute bottom-[24%] left-[8%] w-[52%]"
      />
      {/* Bunga sekunder lebih kecil */}
      <DecorImage
        name="flower_medium_2.svg"
        className="absolute bottom-[40%] left-[44%] w-[40%]"
      />
      {/* Kuncup/aksen kelopak */}
      <DecorImage
        name="petal_3.svg"
        className="absolute bottom-[10%] left-[24%] w-[20%] rotate-12 opacity-85"
      />
    </div>
  );
}

export default function FloralDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Sudut kiri atas (hanging down) */}
      <div className="absolute -top-12 -left-6 w-32 rotate-110 scale-y-[-1] opacity-90 md:w-44">
        <CornerSpray className="w-full animate-sway [animation-delay:0.7s]" />
      </div>

      {/* Sudut kanan atas (hanging down - mirrored) */}
      <div className="absolute -top-12 -right-6 w-32 scale-x-[-1] rotate-110 scale-y-[-1] opacity-90 md:w-44">
        <CornerSpray className="w-full animate-sway [animation-delay:2.1s]" />
      </div>

      {/* Sudut kiri bawah */}
      <div className="absolute bottom-0 -left-4 w-40 md:w-56">
        <CornerSpray className="w-full animate-sway" />
      </div>

      {/* Sudut kanan bawah (mirror) */}
      <div className="absolute bottom-0 -right-4 w-40 scale-x-[-1] md:w-56">
        <CornerSpray className="w-full animate-sway [animation-delay:1.3s]" />
      </div>

      {/* Aksen bunga kecil melayang */}
      <DecorImage
        name="flower_medium_3.svg"
        className="absolute left-[8%] top-[15%] w-9 opacity-80 animate-pulse-slow md:w-12"
      />
      <DecorImage
        name="petal_1.svg"
        className="absolute right-[12%] top-[18%] w-7 opacity-70 animate-pulse-slow [animation-delay:2s] md:w-10"
      />
      <DecorImage
        name="petal_5.svg"
        className="absolute bottom-[20%] left-1/4 w-6 opacity-60 animate-pulse-slow [animation-delay:3.5s] md:w-8"
      />
    </div>
  );
}
