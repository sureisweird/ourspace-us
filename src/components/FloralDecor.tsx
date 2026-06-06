"use client";

import React from "react";

/**
 * Dekorasi bunga untuk mengisi area hero yang sebelumnya terasa kosong.
 * Semua elemen `pointer-events-none` dan diletakkan pada lapisan z-0 sehingga
 * berada di belakang teks. Ditempatkan di dalam container ber-`relative`.
 */

// Rangkaian bunga sudut (dipakai untuk kiri & kanan secara mirror).
function CornerSpray({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      {/* Tangkai */}
      <g stroke="#A8BE92" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8">
        <path d="M 28 218 C 50 170 60 140 70 100" />
        <path d="M 28 218 C 45 178 85 150 118 118" />
        <path d="M 28 218 C 38 182 50 152 46 108" />
      </g>

      {/* Daun */}
      <g fill="#B6C9A0" opacity="0.85">
        <path d="M 58 152 C 38 147 34 128 50 124 C 60 130 64 144 58 152 Z" />
        <path d="M 98 134 C 116 125 128 132 119 148 C 106 153 98 146 98 134 Z" />
        <path d="M 44 178 C 28 176 24 160 40 158 C 48 164 50 172 44 178 Z" />
      </g>

      {/* Mawar tengah (besar) */}
      <g transform="translate(70, 92)">
        <circle r="25" fill="#FFC8DD" />
        <path d="M -16 -11 C -6 -27 11 -22 17 -6 C 6 16 -11 11 -16 -11 Z" fill="#FFA2B6" opacity="0.85" />
        <path d="M -9 6 C 6 -11 17 -6 9 13 C -2 16 -6 11 -9 6 Z" fill="#FF85A1" opacity="0.9" />
        <circle r="6" fill="#FF7096" />
      </g>

      {/* Mawar kanan atas */}
      <g transform="translate(118, 112)">
        <circle r="18" fill="#FFE5D9" />
        <path d="M -11 -8 C 2 -18 17 -13 10 -1 C 2 12 -12 8 -11 -8 Z" fill="#FFCAD4" opacity="0.85" />
        <circle r="4.5" fill="#E5989B" />
      </g>

      {/* Kuncup bawah kiri */}
      <g transform="translate(46, 112)">
        <ellipse rx="12" ry="14" fill="#FFD1DC" />
        <path d="M -6 5 C -1 -9 10 -9 7 5 Z" fill="#FFB7B2" />
        <circle r="3" fill="#E5989B" />
      </g>
    </svg>
  );
}

// Satu kuntum mawar kecil untuk aksen melayang.
function SmallRose({ className }: { className?: string }) {
  return (
    <svg viewBox="-26 -26 52 52" className={className} aria-hidden="true">
      <circle r="20" fill="#FFD1DC" />
      <path d="M -14 -9 C -5 -23 10 -19 15 -5 C 5 14 -9 9 -14 -9 Z" fill="#FFB7B2" opacity="0.85" />
      <circle r="5" fill="#FF85A1" />
    </svg>
  );
}

export default function FloralDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Sudut kiri bawah */}
      <div className="absolute -left-4 -bottom-10 w-40 md:w-56">
        <CornerSpray className="w-full h-auto animate-sway" />
      </div>

      {/* Sudut kanan bawah (mirror) */}
      <div className="absolute -right-4 -bottom-10 w-40 md:w-56 scale-x-[-1]">
        <CornerSpray className="w-full h-auto animate-sway [animation-delay:1.3s]" />
      </div>

      {/* Aksen mawar kecil melayang */}
      <SmallRose className="absolute left-6 top-2 w-9 md:w-12 opacity-80 animate-pulse-slow" />
      <SmallRose className="absolute right-10 top-6 w-7 md:w-10 opacity-70 animate-pulse-slow [animation-delay:2s]" />
      <SmallRose className="absolute left-1/4 bottom-10 w-6 md:w-8 opacity-60 animate-pulse-slow [animation-delay:3.5s]" />
    </div>
  );
}
