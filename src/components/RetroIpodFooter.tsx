"use client";

import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  PlayIcon,
  PauseIcon,
  CaretRightIcon,
  CaretLeftIcon,
  HeartIcon,
  MusicNoteIcon,
} from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

//  CARA MENGGUNAKAN AUDIO NYATA:
//   1. Taruh file lagu di folder: /public/music/our-song.mp3
//   2. Ubah SONG_SRC di bawah menjadi "/music/our-song.mp3"
//   Format yang didukung: .mp3, .ogg, .wav, .aac
export const SONG_SRC = "/music/Backstreet Boys - Shape Of My Heart (320).mp3";

// Judul & artis yang tampil di layar iPod
const SONG_META = {
  title: "Shape Of My Heart",
  artist: "Backstreet Boys",
  album: "Life Together",
};

// Isi surat. Diketik karakter-demi-karakter agar terasa seperti ditulis tangan.
const LETTER_PARAGRAPHS = [
  "From the very first moment we met, I felt the gravity of a beautiful, unwritten story beginning. Every day with you has been an adventure, a sanctuary, and the sweetest rhythm.",
  "We have built our own quiet language, grown roots deep into the earth, and faced every season hand-in-hand. You are my home, my peace, and my absolute greatest gift.",
  "Here is to every sunset we've watched, every cup of coffee shared, and the infinite chapters that still wait for us ahead. Happy Anniversary.",
];
const LETTER_TEXT = LETTER_PARAGRAPHS.join("\n\n");

// Equalizer mini untuk layar iPod. Tiap bar punya durasi & delay berbeda agar
// gerakannya terasa acak/natural. Mewarisi warna teks lewat `bg-current`.
const EQ_BARS = [
  { dur: 0.7, delay: 0 },
  { dur: 0.95, delay: 0.18 },
  { dur: 0.6, delay: 0.32 },
  { dur: 0.85, delay: 0.1 },
  { dur: 1.05, delay: 0.24 },
];

function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span className="inline-flex items-end gap-[2px] h-2.5 align-middle" aria-hidden="true">
      {EQ_BARS.map((bar, i) => (
        <span
          key={i}
          className="w-[2px] bg-current rounded-full"
          style={{
            height: "100%",
            transformOrigin: "bottom",
            transform: playing ? undefined : "scaleY(0.3)",
            animation: playing
              ? `eq-bounce ${bar.dur}s ease-in-out ${bar.delay}s infinite`
              : "none",
          }}
        />
      ))}
    </span>
  );
}

interface RetroIpodFooterProps {
  audioRef: RefObject<HTMLAudioElement | null>;
}

export default function RetroIpodFooter({ audioRef }: RetroIpodFooterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // audioAvailable: false jika file tidak ditemukan, supaya UI tetap bisa dipakai
  const [audioAvailable, setAudioAvailable] = useState(true);

  // Efek "menulis" surat: mulai saat surat masuk viewport, lalu ketik per karakter.
  const [letterStarted, setLetterStarted] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const vinylRef = useRef<HTMLDivElement>(null);
  const rotateTween = useRef<gsap.core.Tween | null>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  // Penanda agar auto-play (R8.7) hanya dicoba sekali.
  const autoPlayAttempted = useRef(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Mulai efek mengetik saat surat masuk viewport (sekali saja).
  useGSAP(
    () => {
      if (reducedMotion) return;
      ScrollTrigger.create({
        trigger: letterRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => setLetterStarted(true),
      });
    },
    { scope: letterRef }
  );

  // Ketik karakter demi karakter dengan jeda lebih panjang di tanda baca / antar
  // paragraf agar ritmenya terasa seperti orang menulis.
  useEffect(() => {
    if (reducedMotion || !letterStarted || typedCount >= LETTER_TEXT.length) return;

    const prev = LETTER_TEXT[typedCount - 1] ?? "";
    const curr = LETTER_TEXT[typedCount];
    let delay = 26;
    if (curr === " ") delay = 42;
    if (curr === "\n") delay = 110;
    if (".,;!?".includes(prev)) delay = 280;

    const timer = setTimeout(() => setTypedCount((n) => n + 1), delay);
    return () => clearTimeout(timer);
  }, [letterStarted, typedCount, reducedMotion]);

  //  Vinyl rotation GSAP 
  useEffect(() => {
    if (vinylRef.current) {
      rotateTween.current = gsap.to(vinylRef.current, {
        rotation: 360,
        duration: 5,
        ease: "none",
        repeat: -1,
        paused: true,
      });
    }
    return () => {
      if (rotateTween.current) rotateTween.current.kill();
    };
  }, []);

  useEffect(() => {
    if (!rotateTween.current) return;
    if (isPlaying) {
      rotateTween.current.play();
    } else {
      rotateTween.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Auto-play saat pemutar berhasil dimuat (R8.7).
    // Dicoba sekali, idempotent: jika audio sudah diputar (mis. dari gesture tap
    // di GiftBoxHero) jangan saling tabrakan; cukup sinkronkan status. Jika
    // diblokir browser, fallback mulus ke mode siap-putar tanpa error mengganggu.
    const tryAutoPlay = () => {
      if (autoPlayAttempted.current) return;
      const el = audioRef.current;
      if (!el || el.error) return; // audio tidak tersedia → biarkan mode visual
      autoPlayAttempted.current = true;

      // Sudah diputar sebelumnya (gesture GiftBoxHero) → cukup sinkronkan.
      if (!el.paused) {
        setIsPlaying(true);
        return;
      }

      el
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Diblokir browser → tetap siap-putar (bisa diputar manual).
          setIsPlaying(false);
        });
    };

    // Sync initial state if audio is already playing/loaded/errored from page-level trigger
    setIsPlaying(!audio.paused);
    setCurrentTime(audio.currentTime);
    if (audio.duration) {
      setDuration(audio.duration);
    }
    if (audio.error) {
      setAudioAvailable(false);
      setDuration(365);
    } else {
      setAudioAvailable(true);
      // Jika audio sudah siap saat efek berjalan, coba auto-play langsung.
      if (audio.readyState >= 2) tryAutoPlay();
    }

    // Sinkronkan waktu ke state setiap kali audio update
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    // Ambil durasi real dari metadata audio
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioAvailable(true);
    };

    // Pemutar berhasil dimuat → coba auto-play (R8.7).
    const onCanPlay = () => tryAutoPlay();
    const onLoadedData = () => tryAutoPlay();

    // Lagu selesai → reset ke awal
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // File tidak ditemukan → fallback ke mode visual-only
    const onError = () => {
      setAudioAvailable(false);
      // Set durasi palsu supaya UI iPod tetap terlihat indah
      setDuration(365);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("loadeddata", onLoadedData);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("loadeddata", onLoadedData);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [audioRef]);

  useEffect(() => {
    if (audioAvailable || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [audioAvailable, isPlaying, duration]);

  //  Format mm:ss 
  const formatTime = (totalSeconds: number) => {
    if (!totalSeconds || isNaN(totalSeconds)) return "0:00";
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  //  Controls 
  const togglePlay = async () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
    } else {
      if (audio && audioAvailable) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          // Autoplay diblokir browser / file belum tersedia → mode visual
          setIsPlaying(true);
        }
      } else {
        // Tidak ada audio — jalankan animasi visual saja
        setIsPlaying(true);
      }
    }
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (audio && audioAvailable) {
      audio.currentTime = Math.min(duration, audio.currentTime + 15);
    }
  };

  const handleRewind = () => {
    const audio = audioRef.current;
    if (audio && audioAvailable) {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
    } else {
      // Fallback visual: reset ke awal
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audioAvailable || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const newTime = ratio * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Teks surat yang sudah "tertulis" sejauh ini.
  const letterVisible = reducedMotion ? LETTER_TEXT : LETTER_TEXT.slice(0, typedCount);
  const letterParas = letterVisible.split("\n\n");
  const letterTyping = letterStarted && !reducedMotion && typedCount < LETTER_TEXT.length;
  const letterFinished = typedCount >= LETTER_TEXT.length;

  return (
    <footer
      id="letter"
      className="py-32 px-6 max-w-7xl mx-auto relative z-10 border-t border-foreground/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* Left Column - Retro iPod UI */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">

          <span className="font-mono text-xs tracking-[0.25em] uppercase text-foreground/65 mb-8">
            Our Soundtrack
          </span>

          {/* iPod Outer Case */}
          <div className="w-[300px] h-[480px] bg-surface rounded-[38px] p-5 shadow-elevation-3 border-4 border-[#EAE0DE] flex flex-col justify-between items-center relative">

            {/* iPod Screen */}
            <div className="w-full h-[180px] bg-[#EEF5E6] rounded-xl border-4 border-[#DDD5D2] p-4 flex flex-col justify-between relative overflow-hidden select-none">

              {/* Screen Top Bar */}
              <div className="flex justify-between items-center text-[10px] font-mono text-[#4A5340] border-b border-[#D4DDD0]/60 pb-1">
                <span className="flex items-center gap-1">
                  <MusicNoteIcon size={10} weight="fill" />
                  {audioAvailable ? "Playing" : "No Audio"}
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  {isPlaying ? (
                    <>
                      <Equalizer playing={!reducedMotion} />
                      <span>PLAYING</span>
                    </>
                  ) : (
                    "PAUSED"
                  )}
                </span>
              </div>

              {/* Screen Content Grid */}
              <div className="flex items-center justify-between gap-3 my-2">
                {/* Spinning Vinyl */}
                <div className="relative w-20 h-20 shrink-0">
                  <div
                    ref={vinylRef}
                    className="w-full h-full bg-[#18181B] rounded-full flex items-center justify-center shadow-inner relative border border-black"
                  >
                    <div className="absolute inset-2 rounded-full border border-zinc-800/40" />
                    <div className="absolute inset-4 rounded-full border border-zinc-800/40" />
                    <div className="absolute inset-6 rounded-full border border-zinc-800/40" />
                    <div className="w-7 h-7 bg-[#FFB7B2] rounded-full border border-zinc-100 flex items-center justify-center">
                      <HeartIcon size={10} weight="fill" className="text-white animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Song Meta */}
                <div className="flex-1 min-w-0 font-sans text-left">
                  <h4 className="text-sm font-semibold text-[#303728] truncate tracking-tight">
                    {SONG_META.title}
                  </h4>
                  <p className="text-xs text-[#525B48] truncate font-medium">
                    {SONG_META.artist}
                  </p>
                  <p className="text-[10px] text-[#76806C] italic truncate mt-1">
                    Album: {SONG_META.album}
                  </p>
                </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <div
                  className="w-full h-2.5 bg-[#D4DDD0] rounded-sm overflow-hidden p-px cursor-pointer"
                  onClick={handleProgressClick}
                  title="Klik untuk seek"
                >
                  <div
                    className="h-full bg-[#525B48] rounded-sm transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#525B48] px-0.5">
                  <span>{formatTime(currentTime)}</span>
                  <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
                </div>
              </div>

            </div>

            {/* Click Wheel Area */}
            <div className="relative w-[220px] h-[220px] rounded-full bg-[#F5ECE9] border-2 border-[#E5DAD7] flex items-center justify-center cursor-pointer shadow-inner">

              {/* Center Play/Pause Button */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause lagu" : "Putar lagu"}
                className="focus-ring w-16 h-16 rounded-full bg-surface border border-[#DDD5D2] shadow-elevation-1 flex items-center justify-center hover:bg-[#FFEAE8] active:scale-95 transition-spring transition-transform z-20 cursor-pointer"
              >
                {isPlaying ? (
                  <PauseIcon size={20} weight="fill" className="text-accent" />
                ) : (
                  <PlayIcon size={20} weight="fill" className="text-accent translate-x-px" />
                )}
              </button>

              {/* MENU (Top) */}
              <span className="absolute top-4 font-mono text-xs font-bold text-[#8A7E7B] select-none hover:text-foreground">
                MENU
              </span>

              {/* Fast Forward +15s (Right) */}
              <button
                onClick={handleSkipForward}
                aria-label="Maju 15 detik"
                className="focus-ring absolute right-4 p-1 text-[#8A7E7B] hover:text-foreground active:scale-90 transition-spring transition-transform cursor-pointer"
              >
                <CaretRightIcon size={20} weight="bold" />
              </button>

              {/* Rewind -15s (Left) */}
              <button
                onClick={handleRewind}
                aria-label="Mundur 15 detik"
                className="focus-ring absolute left-4 p-1 text-[#8A7E7B] hover:text-foreground active:scale-90 transition-spring transition-transform cursor-pointer"
              >
                <CaretLeftIcon size={20} weight="bold" />
              </button>

              {/* Play/Pause icon (Bottom) */}
              <div
                onClick={togglePlay}
                className="absolute bottom-4 flex items-center gap-1 text-[#8A7E7B] hover:text-foreground"
              >
                <PlayIcon size={10} weight="fill" />
                <PauseIcon size={10} weight="fill" />
              </div>

            </div>

          </div>

          {/* Hint text jika audio file belum ditambahkan */}
          {!audioAvailable && (
            <p className="mt-4 text-center font-mono text-[10px] text-foreground/40 max-w-[260px]">
              Tambahkan lagu ke{" "}
              <code className="bg-accent/10 px-1 rounded">/public/music/our-song.mp3</code>{" "}
              untuk memutar musik nyata.
            </p>
          )}

        </div>

        {/* Right Column - Love Letter */}
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
                To My Forever
              </span>
              <h3 className="font-cursive text-4xl text-foreground mt-2">
                My Dearest,
              </h3>
            </div>
            <div className="font-cursive text-2xl md:text-3xl text-foreground/85 leading-8 relative z-10">
              {reducedMotion ? (
                /* Fallback Gerak_Tereduksi (R8.6): render seluruh teks surat
                   langsung di DOM dalam alur normal — tetap terbaca walau
                   styling/animasi typing gagal diterapkan. */
                <div className="flex flex-col gap-6 pl-2">
                  {LETTER_PARAGRAPHS.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  <p className="mt-8 text-right text-accent">Always &amp; Forever Yours</p>
                </div>
              ) : (
                <>
                  {/* Sizer tak terlihat agar tinggi kartu stabil saat mengetik. */}
                  <div aria-hidden="true" className="invisible flex flex-col gap-6 pl-2">
                    {LETTER_PARAGRAPHS.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                    <p className="mt-8 text-right">Always &amp; Forever Yours</p>
                  </div>

                  <div className="absolute inset-0 flex flex-col gap-6 pl-2">
                    {letterParas.map((para, i) => (
                      <p key={i}>
                        {para}
                        {letterTyping && i === letterParas.length - 1 && (
                          <span className="inline-block w-[2px] h-[1em] align-middle bg-accent ml-0.5 animate-blink" />
                        )}
                      </p>
                    ))}
                    {letterFinished && (
                      <p className="mt-8 text-right text-accent animate-fade-in">
                        Always &amp; Forever Yours
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
