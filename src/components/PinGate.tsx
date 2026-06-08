"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { HeartIcon } from "@phosphor-icons/react";
import { CONFIG_PINGATE } from "@/config/textConfig";

const PIN_HINT = CONFIG_PINGATE.pinHint;
const SESSION_KEY = "ourspace_unlocked";

const memorySessionFallback: Record<string, string> = {};

function safeSessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return memorySessionFallback[key] ?? null;
  }
}

function safeSessionSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    memorySessionFallback[key] = value;
  }
}

interface PinGateProps {
  onUnlocked: () => void;
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

export default function PinGate({ onUnlocked }: PinGateProps) {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cek session — kalau sudah pernah unlock di tab ini, skip gate
  useEffect(() => {
    if (safeSessionGet(SESSION_KEY) === "true") {
      onUnlocked();
    }
  }, [onUnlocked]);

  // Auto-focus input saat mount
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(focusTimer);
  }, []);

  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = useCallback(async (enteredPin: string) => {
    if (isVerifying) return;
    setIsVerifying(true);

    try {
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: enteredPin }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        safeSessionSet(SESSION_KEY, "true");
        onUnlocked();
      } else {
        // Salah — shake animation + reset
        setError(true);
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin("");
          inputRef.current?.focus();
        }, 600);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPin("");
        inputRef.current?.focus();
      }, 600);
    } finally {
      setIsVerifying(false);
    }
  }, [onUnlocked, isVerifying]);

  // Auto-verify saat 4 digit terisi lengkap
  useEffect(() => {
    if (pin.length === 4) {
      const timer = setTimeout(() => {
        handleVerify(pin);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pin, handleVerify]);

  const handleSubmit = () => {
    handleVerify(pin);
  };

  return (
    <div className="fixed inset-0 z-60 bg-[#170E0D]/90 backdrop-blur-md select-none overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
      {/* Background kustom dengan blend mode */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: "url('/assets/background.webp')" }}
        aria-hidden="true"
      />

      {/* Twinkling ambient stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5" aria-hidden="true">
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

      {/* Swaying corner flowers (matching core theme) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Kiri Atas */}
        <img
          src="/assets/hibiscus_flower/flower_medium_1.svg"
          alt=""
          className="absolute -top-12 -left-12 w-48 h-auto opacity-20 animate-sway"
          style={{ transformOrigin: "top left" }}
        />
        <img
          src="/assets/hibiscus_flower/leaf_1.svg"
          alt=""
          className="absolute -top-4 left-24 w-24 h-auto opacity-15 rotate-45 animate-sway"
          style={{ transformOrigin: "top left" }}
        />

        {/* Kanan Bawah */}
        <img
          src="/assets/hibiscus_flower/flower_medium_2.svg"
          alt=""
          className="absolute -bottom-16 -right-16 w-56 h-auto opacity-20 animate-sway"
          style={{ transformOrigin: "bottom right" }}
        />
        <img
          src="/assets/hibiscus_flower/leaf_2.svg"
          alt=""
          className="absolute bottom-12 right-28 w-24 h-auto opacity-15 -rotate-45 animate-sway"
          style={{ transformOrigin: "bottom right" }}
        />
      </div>

      {/* Wrapper scroll + safe-area: pusatkan kartu dalam tinggi viewport dinamis (dvh)
          dan beri jarak aman dari notch/home indicator iOS agar tidak terpotong. */}
      <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {/* Card — Polaroid Style Paper Card */}
      <div className="relative z-10 w-full max-w-sm bg-[#FFFBF9]/95 border border-accent/20 shadow-elevation-3 rounded-card p-8 sm:p-10 flex flex-col items-center">
        {/* Washi Tape (Selotip Kertas) at the top */}
        <img
          src="/assets/washi_tape.webp"
          alt=""
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-40 h-auto pointer-events-none z-20 select-none -rotate-2"
          aria-hidden="true"
        />

        {/* Heart Lock Icon */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="w-28 h-28 flex items-center justify-center">
            <img
              src="/assets/heart_lock.webp"
              alt="Heart Lock"
              className="w-full h-full object-contain animate-pulse-slow"
              style={{ animationDuration: "4s" }}
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 w-full">
          <h1 className="font-cursive text-4xl text-foreground mb-2">
            {CONFIG_PINGATE.title}
          </h1>
          <p className="font-mono text-xs tracking-[0.2em] text-accent-strong/80 uppercase">
            {CONFIG_PINGATE.subtitle}
          </p>
        </div>

        {/* PIN inputs */}
        <div className="relative w-[272px] h-14 mb-4">
          {/* Actual single input element (invisible, overlaying the entire grid) */}
          <input
            ref={inputRef}
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              const val = e.target.value;
              const cleaned = val.replace(/\D/g, "");
              setError(false);
              setPin(cleaned);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer outline-none"
            aria-label={CONFIG_PINGATE.subtitle}
            autoComplete="off"
            data-lpignore="true"
          />

          {/* Visual boxes */}
          <div
            className={`flex justify-center gap-4 transition-transform ${
              shake ? "animate-[shake_0.5s_ease-in-out]" : ""
            }`}
            style={shake ? { animation: "shake 0.5s ease-in-out" } : {}}
          >
            {[0, 1, 2, 3].map((i) => {
              const digit = pin[i] || "";
              const isBoxFocused = isFocused && (pin.length === i || (pin.length === 4 && i === 3));
              return (
                <div key={i} className="relative w-14 h-14">
                  {/* Custom visual representation */}
                  <div
                    className={`absolute inset-0 z-10 flex items-center justify-center rounded-inner border-2 bg-white/70 outline-none transition-all duration-300 pointer-events-none
                      ${error
                        ? "border-accent-strong bg-accent-strong/10 shadow-[0_0_8px_rgba(181,101,118,0.3)] scale-98"
                        : isBoxFocused
                          ? "border-accent bg-accent/5 shadow-[0_0_12px_rgba(229,152,155,0.4)] scale-105"
                          : digit
                            ? "border-accent/60 bg-accent/5"
                            : "border-foreground/10"
                      }`}
                  >
                    {digit ? (
                      <HeartIcon
                        size={22}
                        weight="fill"
                        className="text-accent animate-[heart-pop_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
                      />
                    ) : (
                      <div
                        className={`w-2.5 h-2.5 rounded-full bg-foreground/20 transition-all duration-300 ${
                          isBoxFocused ? "bg-accent/40 scale-125" : ""
                        }`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        <div className="h-5 text-center mb-6">
          {error && (
            <p className="font-mono text-xs text-accent-strong tracking-wider animate-fade-in">
              {CONFIG_PINGATE.errorText}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="focus-ring w-full py-3.5 rounded-pill bg-accent hover:bg-accent-strong text-white font-mono text-xs font-medium tracking-wider shadow-elevation-1 active:scale-95 transition-spring transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <HeartIcon size={14} weight="fill" />
          {CONFIG_PINGATE.buttonText}
        </button>

        {/* Hint toggle */}
        <div className="text-center mt-6 w-full">
          <button
            onClick={() => setShowHint(!showHint)}
            className="focus-ring font-mono text-[10px] tracking-wider text-foreground/40 hover:text-accent-strong transition-spring transition-colors uppercase cursor-pointer"
          >
            {showHint ? CONFIG_PINGATE.hintButtonHide : CONFIG_PINGATE.hintButtonShow}
          </button>
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-spring ${
              showHint ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 pointer-events-none"
            }`}
          >
            <div className="overflow-hidden">
              <p className="font-cursive text-xl text-accent-strong/80 italic p-1">
                {PIN_HINT}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
        @keyframes heart-pop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
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
