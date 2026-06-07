"use client";

import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from "react";
import { HeartIcon, LockKeyIcon } from "@phosphor-icons/react";

// Ganti PIN_CODE dengan tanggal anniversary kamu, misal "0614" untuk
// tanggal 14 Juni. Jangan lupa ubah hint di bawah juga.
const PIN_CODE = "0614";
const PIN_HINT = "Tanggal pertama kita bertemu 🌸";
const SESSION_KEY = "ourspace_unlocked";

interface PinGateProps {
  onUnlocked: () => void;
}

export default function PinGate({ onUnlocked }: PinGateProps) {
  const [input, setInput] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cek session — kalau sudah pernah unlock di tab ini, skip gate
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      onUnlocked();
    }
  }, [onUnlocked]);

  // Auto-focus input pertama saat mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleVerify = useCallback((pin: string) => {
    if (pin === PIN_CODE) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onUnlocked();
    } else {
      // Salah — shake animation + reset
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setInput(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }, 600);
    }
  }, [onUnlocked]);

  // Auto-verify saat 4 digit terisi lengkap (dijalankan di tick berikutnya untuk mencegah cascading renders)
  useEffect(() => {
    const pin = input.join("");
    if (pin.length === 4) {
      const timer = setTimeout(() => {
        handleVerify(pin);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [input, handleVerify]);

  const handleChange = (index: number, value: string) => {
    // Ambil karakter terakhir jika user mengetik/menimpa
    const val = value.slice(-1);

    // Hanya terima angka atau string kosong (saat didelete)
    if (value !== "" && !/^\d$/.test(val)) return;

    setError(false);

    setInput((prev) => {
      const newInput = [...prev];
      newInput[index] = val;
      return newInput;
    });

    // Auto-advance ke input berikutnya jika diisi
    if (val && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!input[index] && index > 0) {
        // Fokus ke input sebelumnya dan hapus nilainya
        setInput((prev) => {
          const newInput = [...prev];
          newInput[index - 1] = "";
          return newInput;
        });
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Upaya verifikasi TIDAK diblokir meskipun entri PIN kurang dari 4 digit (R4.4).
  const handleSubmit = () => {
    handleVerify(input.join(""));
  };

  return (
    <div className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-[#170E0D]/95 backdrop-blur-md select-none px-4">

      {/* Ambient blobs (dekoratif) */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <div className="absolute top-[10%] left-[15%] w-8 h-8 rounded-full bg-accent blur-sm animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-surface blur-md animate-pulse-slow" />
        <div className="absolute top-[40%] right-[25%] w-6 h-6 rounded-full bg-accent-strong blur-sm animate-pulse-slow" />
      </div>

      {/* Card — Frosted_Glass + bayangan berlapis (R4.1) */}
      <div className="relative z-10 w-full max-w-sm glass-surface shadow-elevation-3 rounded-card p-8 sm:p-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
            <LockKeyIcon size={28} weight="light" className="text-accent-strong" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="font-cursive text-4xl text-foreground mb-2">
            Our Private Space
          </h1>
          <p className="font-mono text-xs tracking-[0.2em] text-accent-strong/80 uppercase">
            Masukkan PIN untuk melanjutkan
          </p>
        </div>

        {/* PIN inputs */}
        <div
          className={`flex justify-center gap-4 mb-4 transition-transform ${
            shake ? "animate-[shake_0.5s_ease-in-out]" : ""
          }`}
          style={shake ? { animation: "shake 0.5s ease-in-out" } : {}}
        >
          {input.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              className={`focus-ring w-14 h-14 text-center text-2xl font-mono rounded-inner border-2 bg-surface/40 text-foreground outline-none transition-spring transition-all duration-200 caret-transparent
                ${error
                  ? "border-accent-strong bg-accent-strong/10"
                  : digit
                    ? "border-accent bg-accent/10"
                    : "border-foreground/20 focus:border-accent"
                }`}
              aria-label={`Digit PIN ke-${i + 1}`}
            />
          ))}
        </div>

        {/* Error message */}
        <div className="h-5 text-center mb-6">
          {error && (
            <p className="font-mono text-xs text-accent-strong tracking-wider animate-fade-in">
              PIN salah. Coba lagi 💔
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="focus-ring w-full py-3 rounded-pill bg-accent hover:bg-accent-strong text-white font-mono text-xs font-medium tracking-wider shadow-elevation-1 active:scale-95 transition-spring transition-all duration-300 flex items-center justify-center gap-2"
        >
          <HeartIcon size={14} weight="fill" />
          BUKA KENANGAN KITA
        </button>

        {/* Hint toggle */}
        <div className="text-center mt-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="focus-ring font-mono text-[10px] tracking-wider text-foreground/40 hover:text-accent-strong transition-spring transition-colors uppercase"
          >
            {showHint ? "Sembunyikan hint" : "Butuh petunjuk?"}
          </button>
          {showHint && (
            <p className="mt-2 font-cursive text-xl text-accent-strong/80 italic">
              {PIN_HINT}
            </p>
          )}
        </div>
      </div>

      {/* Shake keyframe injected inline */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
