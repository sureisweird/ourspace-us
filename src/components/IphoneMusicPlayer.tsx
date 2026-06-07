"use client";

import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";
import Image from "next/image";
import {
  PlayIcon,
  PauseIcon,
  CaretRightIcon,
  CaretLeftIcon,
  HeartIcon,
  SpeakerLowIcon,
  SpeakerHighIcon,
  DotsThreeIcon,
  ListBulletsIcon,
  ChatTeardropTextIcon,
} from "@phosphor-icons/react";
import { SONG_META, USE_API_PROXY } from "@/config/galleryConfig";
import { CONFIG_SOUNDTRACK } from "@/config/textConfig";



interface EqualizerBarConfig {
  duration: number;
  delay: number;
}

const EQUALIZER_BARS: readonly EqualizerBarConfig[] = [
  { duration: 0.6, delay: 0 },
  { duration: 0.5, delay: 0.15 },
  { duration: 0.7, delay: 0.05 },
  { duration: 0.55, delay: 0.2 },
];

interface IphoneMusicPlayerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
}

export default function IphoneMusicPlayer({ audioRef }: IphoneMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // audioAvailable: false jika file tidak ditemukan, supaya UI tetap bisa dipakai
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const activeCoverSrc = USE_API_PROXY ? SONG_META.coverApi : SONG_META.coverSrc;
  const [prevCoverSrc, setPrevCoverSrc] = useState(activeCoverSrc);

  // Sinkronkan secara sinkron jika activeCoverSrc berubah di file konfigurasi (tanpa useEffect)
  if (activeCoverSrc !== prevCoverSrc) {
    setPrevCoverSrc(activeCoverSrc);
    setCoverFailed(false);
  }

  const coverSrc = coverFailed 
    ? "" 
    : activeCoverSrc;

  // Penanda agar auto-play (R8.7) hanya dicoba sekali.
  const autoPlayAttempted = useRef(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Sync audio ref events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
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

  // Format mm:ss
  const formatTime = (totalSeconds: number) => {
    if (!totalSeconds || isNaN(totalSeconds)) return "0:00";
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Controls
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

  return (
    <div className="lg:col-span-5 flex flex-col items-center justify-center">
      <span className="font-mono text-xs tracking-[0.25em] uppercase text-foreground/65 mb-8">
        {CONFIG_SOUNDTRACK.title}
      </span>

      {/* iPhone Outer Casing */}
      <div className="w-[300px] h-[520px] bg-zinc-900 rounded-[46px] p-3 shadow-elevation-3 border-[6px] border-zinc-800 relative flex flex-col justify-between items-center select-none">
        {/* Side Buttons (Visual decoration) */}
        <div className="absolute left-[-8px] top-24 w-1 h-10 bg-zinc-800 rounded-r-md border-r border-zinc-700" />
        <div className="absolute left-[-8px] top-36 w-1 h-10 bg-zinc-800 rounded-r-md border-r border-zinc-700" />
        <div className="absolute right-[-8px] top-28 w-1 h-14 bg-zinc-800 rounded-l-md border-l border-zinc-700" />

        {/* Earphone dekoratif — menancap di port bawah-tengah */}
        <EarphoneDecor isPlaying={isPlaying} />

        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full absolute right-3" />
        </div>

        {/* iPhone Glass Screen Content */}
        <div className="w-full h-full bg-zinc-950 rounded-[34px] relative flex flex-col justify-between overflow-hidden p-4 pt-9 pb-5 select-none">
          
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[34px]">
            {/* Background base */}
            <div className="absolute inset-0 bg-linear-to-b from-zinc-900/60 to-black" />
            {/* Top glow - matches peach/pink */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[220px] h-[220px] bg-accent/20 rounded-full blur-2xl animate-pulse-slow" />
            {/* Bottom glow */}
            <div className="absolute -bottom-12 -left-12 w-[180px] h-[180px] bg-[#FFC8DD]/10 rounded-full blur-[45px]" />
            <div className="absolute -bottom-16 -right-16 w-[180px] h-[180px] bg-[#FFE5D9]/10 rounded-full blur-[45px]" />
          </div>

          {/* Player UI Content */}
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            
            {/* Header — grabber handle ala Apple Music Now Playing */}
            <div className="flex flex-col items-center w-full">
              <div className="w-9 h-1 rounded-full bg-white/25" />
              <span className="mt-2 text-[9px] tracking-[0.18em] font-semibold uppercase text-white/35 truncate max-w-[180px]">
                {SONG_META.album}
              </span>
            </div>

            {/* Album Cover */}
            <div className="flex-1 flex items-center justify-center my-3 relative">
              <div 
                className={`relative aspect-square rounded-[18px] overflow-hidden transition-all duration-500 ease-out border border-white/10 ${
                  isPlaying 
                    ? "w-[200px] h-[200px] shadow-[0_20px_35px_rgba(0,0,0,0.65),0_10px_20px_rgba(229,152,155,0.2)] scale-100" 
                    : "w-[185px] h-[185px] shadow-[0_10px_20px_rgba(0,0,0,0.5)] scale-[0.95]"
                }`}
              >
                <Image
                  src={coverSrc}
                  alt="Album Cover"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover select-none"
                  onError={() => {
                    setCoverFailed(true);
                  }}
                />
              </div>

              {/* Equalizer dekoratif — overlay bawah-tengah cover */}
              <EqualizerVisualizer isPlaying={isPlaying} />
            </div>

            {/* Song Meta & Actions — gaya Apple Music (artist ter-tint, more bulat) */}
            <div className="w-full flex items-center justify-between px-1.5 gap-2">
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-[14px] font-bold text-white tracking-tight truncate leading-tight">
                  {SONG_META.title}
                </h4>
                <p className="text-[12px] text-accent/90 truncate font-semibold mt-0.5">
                  {SONG_META.artist}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-1 transition-all duration-200 cursor-pointer ${
                    isFavorite ? "text-accent active:scale-90" : "text-white/30 hover:text-white/60"
                  }`}
                  aria-label={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                >
                  <HeartIcon size={18} weight={isFavorite ? "fill" : "regular"} />
                </button>
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer"
                  aria-label="Opsi lainnya"
                >
                  <DotsThreeIcon size={18} weight="bold" />
                </button>
              </div>
            </div>

            {/* Timeline Scrubber */}
            <div className="w-full px-1 mt-3">
              {/* Scrubber Track */}
              <div
                className="group relative w-full h-[3px] bg-white/10 hover:bg-white/25 rounded-full cursor-pointer transition-colors duration-200"
                onClick={handleProgressClick}
                title="Klik untuk seek"
              >
                {/* Active Portion */}
                <div
                  className="h-full bg-white/75 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
                {/* Handle Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
                />
              </div>

              {/* Time Labels */}
              <div className="flex justify-between text-[8px] font-mono text-white/35 mt-1 px-0.5 tracking-wider">
                <span>{formatTime(currentTime)}</span>
                <span>{duration > 0 ? `-${formatTime(Math.max(0, duration - currentTime))}` : "--:--"}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-around w-full px-4 mt-3">
              {/* Rewind */}
              <button
                onClick={handleRewind}
                aria-label="Mundur 15 detik"
                className="text-white/80 hover:text-white active:scale-90 transition-all duration-200 cursor-pointer p-1.5"
              >
                <CaretLeftIcon size={24} weight="fill" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause lagu" : "Putar lagu"}
                className="text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer p-2"
              >
                {isPlaying ? (
                  <PauseIcon size={32} weight="fill" />
                ) : (
                  <PlayIcon size={32} weight="fill" className="translate-x-0.5" />
                )}
              </button>

              {/* Fast Forward */}
              <button
                onClick={handleSkipForward}
                aria-label="Maju 15 detik"
                className="text-white/80 hover:text-white active:scale-90 transition-all duration-200 cursor-pointer p-1.5"
              >
                <CaretRightIcon size={24} weight="fill" />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="w-full flex items-center gap-1.5 px-1 mt-3 text-white/30">
              <SpeakerLowIcon size={11} weight="fill" />
              <div className="flex-1 h-[3px] bg-white/10 rounded-full relative overflow-hidden">
                <div className="w-[70%] h-full bg-white/50 rounded-full" />
              </div>
              <SpeakerHighIcon size={11} weight="fill" />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between w-full px-4 mt-4 text-white/30">
              {/* Lyrics Button */}
              <button className="hover:text-white transition-colors duration-200 cursor-pointer p-1" aria-label="Lirik lagu">
                <ChatTeardropTextIcon size={14} weight="regular" />
              </button>

              {/* AirPlay Output Button */}
              <button className="hover:text-white transition-colors duration-200 cursor-pointer p-1" aria-label="Output AirPlay">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                  <polygon points="12 14 17 20 7 20 12 14" fill="currentColor" />
                </svg>
              </button>

              {/* Queue Button */}
              <button className="hover:text-white transition-colors duration-200 cursor-pointer p-1" aria-label="Daftar putar">
                <ListBulletsIcon size={14} weight="bold" />
              </button>
            </div>

          </div>

          {/* Home Indicator */}
          <div className="w-20 h-[3px] bg-white/20 rounded-full mx-auto mt-2.5 z-10 shrink-0" />

        </div>
      </div>

      {/* Hint text jika audio file belum ditambahkan */}
      {!audioAvailable && (
        <p className="mt-4 text-center font-mono text-[10px] text-foreground/40 max-w-[260px]">
          {CONFIG_SOUNDTRACK.hintText}
        </p>
      )}
    </div>
  );
}

export function EqualizerVisualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="eq-visualizer pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-end gap-1 h-5"
    >
      {EQUALIZER_BARS.map((bar, i) => (
        <span
          key={i}
          className="eq-bar w-[3px] h-4 rounded-full bg-white/85"
          style={
            isPlaying
              ? {
                  transformOrigin: "bottom",
                  animation: `eq-bounce ${bar.duration}s ease-in-out ${bar.delay}s infinite`,
                }
              : {
                  transformOrigin: "bottom",
                  transform: "scaleY(0.3)",
                }
          }
        />
      ))}
    </div>
  );
}

export function EarphoneDecor({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[-7px] left-1/2 -translate-x-1/2 z-0 flex flex-col items-center"
    >
      {/* Plug / connector yang menancap ke port bawah */}
      <div className="w-2.5 h-3 bg-zinc-700 rounded-b-sm border-x border-zinc-600 shadow-sm" />
      <div className="w-1.5 h-2 bg-zinc-500 rounded-b-[2px]" />

      {/* Kabel + earbud yang menjuntai; berayun hanya saat lagu diputar */}
      <div
        className={`origin-top flex items-start gap-9 -mt-px ${
          isPlaying ? "animate-sway" : ""
        }`}
      >
        {/* Cabang kiri */}
        <div className="relative">
          <div className="w-px h-16 bg-zinc-500/80 rounded-full rotate-14 origin-top" />
          <span className="absolute -bottom-1 left-[-3px] w-2 h-2 rounded-full bg-zinc-300 ring-1 ring-[#FFB7B2]/40 shadow-sm" />
        </div>
        {/* Cabang kanan */}
        <div className="relative">
          <div className="w-px h-16 bg-zinc-500/80 rounded-full rotate-[-14deg] origin-top" />
          <span className="absolute -bottom-1 right-[-3px] w-2 h-2 rounded-full bg-zinc-300 ring-1 ring-[#FFB7B2]/40 shadow-sm" />
        </div>
      </div>
    </div>
  );
}
