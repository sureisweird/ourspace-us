"use client";

import { useState, useEffect, useRef } from "react";
import { HeartIcon } from "@phosphor-icons/react";
import { CONFIG_LOVELETTER } from "@/config/textConfig";

const LETTER_PARAGRAPHS = CONFIG_LOVELETTER.paragraphs;
const LETTER_TEXT = LETTER_PARAGRAPHS.join("\n\n");

export default function LoveLetter() {
  const [letterStarted, setLetterStarted] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const letterRef = useRef<HTMLDivElement>(null);

  // Mulai efek mengetik saat surat masuk viewport (sekali saja) menggunakan IntersectionObserver yang lebih handal.
  useEffect(() => {
    if (reducedMotion || letterStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLetterStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (letterRef.current) {
      observer.observe(letterRef.current);
    }

    return () => observer.disconnect();
  }, [reducedMotion, letterStarted]);

  // Efek menulis karakter demi karakter secara organik (meniru gerakan pena manusia).
  useEffect(() => {
    if (reducedMotion || !letterStarted || typedCount >= LETTER_TEXT.length) return;

    const prev = LETTER_TEXT[typedCount - 1] ?? "";
    const curr = LETTER_TEXT[typedCount];
    
    // Kecepatan menulis manusia (lebih lambat & bervariasi dibanding mengetik keyboard)
    let delay = 35;
    
    if (curr === " ") {
      delay = 70; 
    } else if (curr === "\n") {
      delay = 800; 
    } else if (prev === ",") {
      delay = 350; 
    } else if (".;!?".includes(prev)) {
      delay = 650; 
    }

    const timer = setTimeout(() => setTypedCount((n) => n + 1), delay);
    return () => clearTimeout(timer);
  }, [letterStarted, typedCount, reducedMotion]);

  // Teks surat yang sudah "tertulis" sejauh ini.
  const letterVisible = reducedMotion ? LETTER_TEXT : LETTER_TEXT.slice(0, typedCount);
  const letterParas = letterVisible.split("\n\n");
  const letterFinished = typedCount >= LETTER_TEXT.length;

  return (
    <div className="lg:col-span-7 flex flex-col justify-center">

      <div ref={letterRef} className="bg-surface border border-foreground/10 p-8 md:p-12 rounded-card shadow-elevation-2 relative overflow-hidden max-w-xl mx-auto lg:mx-0">

        {/* Lined stationery paper effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(242,229,227,0.3) 1px, transparent 1px)",
            backgroundSize: "100% 2rem",
            top: "4.5rem",
          }}
        />

        {/* Wax seal */}
        <div className="absolute top-6 right-6 w-12 h-12 bg-linear-to-tr from-[#9B5DE5]/20 to-accent/40 rounded-full flex items-center justify-center border border-accent/20 transform rotate-12 pointer-events-none">
          <div className="w-9 h-9 bg-linear-to-tr from-accent to-[#FFB7B2] rounded-full flex items-center justify-center shadow-md border border-white/40">
            <HeartIcon size={14} weight="fill" className="text-white" />
          </div>
        </div>

        {/* Letter Header */}
        <div className="mb-8 relative z-10">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent">
            {CONFIG_LOVELETTER.envelopeSub}
          </span>
          <h3 className="font-cursive text-4xl text-foreground mt-2">
            {CONFIG_LOVELETTER.letterDear}
          </h3>
        </div>
        <div className="font-cursive text-2xl md:text-3xl text-foreground/85 leading-8 relative z-10">
          {reducedMotion ? (
            <div className="flex flex-col gap-6 pl-2">
              {LETTER_PARAGRAPHS.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p className="mt-8 text-right text-accent">{CONFIG_LOVELETTER.signature}</p>
            </div>
          ) : (
            <>
              {/* Sizer tak terlihat agar tinggi kartu stabil saat mengetik. */}
              <div aria-hidden="true" className="invisible flex flex-col gap-6 pl-2">
                {LETTER_PARAGRAPHS.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <p className="mt-8 text-right">{CONFIG_LOVELETTER.signature}</p>
              </div>

              <div className="absolute inset-0 flex flex-col gap-6 pl-2">
                {letterParas.map((para, i) => (
                  <p key={i}>
                    {para}
                  </p>
                ))}
                {letterFinished && (
                  <p className="mt-8 text-right text-accent animate-fade-in">
                    {CONFIG_LOVELETTER.signature}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
