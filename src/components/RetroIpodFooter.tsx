"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Play, Pause, CaretRight, CaretLeft, Heart, MusicNote } from "@phosphor-icons/react";

export default function RetroIpodFooter() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35); // Initial starting percentage
  const [seconds, setSeconds] = useState(128); // 2 mins 8 secs
  const vinylRef = useRef<HTMLDivElement>(null);
  const rotateTween = useRef<gsap.core.Tween | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize and manage GSAP vinyl rotation
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

  // Sync rotation tween with playing state
  useEffect(() => {
    if (!rotateTween.current) return;
    if (isPlaying) {
      rotateTween.current.play();
    } else {
      rotateTween.current.pause();
    }
  }, [isPlaying]);

  // Track progress when playing
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    // Reset progress on skip
    setProgress(0);
    setSeconds(0);
    setIsPlaying(true);
  };

  return (
    <footer
      id="letter"
      className="py-32 px-6 max-w-7xl mx-auto relative z-10 border-t border-[#F2E5E3]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column - Minimalist Retro iPod UI Shell */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#2A1F1D]/65 mb-8">
            Our Soundtrack
          </span>

          {/* iPod Outer Case */}
          <div className="w-[300px] h-[480px] bg-[#FFFBF9] rounded-[38px] p-5 shadow-2xl border-4 border-[#EAE0DE] flex flex-col justify-between items-center relative filter drop-shadow-[0_20px_40px_rgba(42,31,29,0.12)]">
            
            {/* iPod Screen */}
            <div className="w-full h-[180px] bg-[#EEF5E6] rounded-xl border-4 border-[#DDD5D2] p-4 flex flex-col justify-between relative overflow-hidden select-none">
              
              {/* Screen Top Bar */}
              <div className="flex justify-between items-center text-[10px] font-mono text-[#4A5340] border-b border-[#D4DDD0]/60 pb-1">
                <span className="flex items-center gap-1">
                  <MusicNote size={10} weight="fill" />
                  Playing
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  {isPlaying ? "|||" : "PAUSED"}
                </span>
              </div>

              {/* Screen Content Grid */}
              <div className="flex items-center justify-between gap-3 my-2">
                {/* Vinyl Cover Art representation (Spins on play) */}
                <div className="relative w-20 h-20 shrink-0">
                  <div
                    ref={vinylRef}
                    className="w-full h-full bg-[#18181B] rounded-full flex items-center justify-center shadow-inner relative border border-black"
                  >
                    {/* Vinyl Grooves */}
                    <div className="absolute inset-2 rounded-full border border-zinc-800/40" />
                    <div className="absolute inset-4 rounded-full border border-zinc-800/40" />
                    <div className="absolute inset-6 rounded-full border border-zinc-800/40" />
                    
                    {/* Vinyl Center label */}
                    <div className="w-7 h-7 bg-[#FFB7B2] rounded-full border border-zinc-100 flex items-center justify-center">
                      <Heart size={10} weight="fill" className="text-white animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Song Meta Details */}
                <div className="flex-1 min-w-0 font-sans text-left">
                  <h4 className="text-sm font-semibold text-[#303728] truncate tracking-tight">
                    Eternity in a Moment
                  </h4>
                  <p className="text-xs text-[#525B48] truncate font-medium">
                    Our Love Story
                  </p>
                  <p className="text-[10px] text-[#76806C] italic truncate mt-1">
                    Album: Life Together
                  </p>
                </div>
              </div>

              {/* Progress Slider Track */}
              <div className="w-full flex flex-col gap-1">
                <div className="w-full h-2.5 bg-[#D4DDD0] rounded-sm overflow-hidden p-px">
                  <div
                    className="h-full bg-[#525B48] rounded-sm transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {/* Time values */}
                <div className="flex justify-between text-[9px] font-mono text-[#525B48] px-0.5">
                  <span>{formatTime(seconds)}</span>
                  <span>6:05</span>
                </div>
              </div>

            </div>

            {/* Click Wheel Area */}
            <div className="relative w-[220px] h-[220px] rounded-full bg-[#F5ECE9] border-2 border-[#E5DAD7] flex items-center justify-center cursor-pointer shadow-inner">
              
              {/* Center Play Button */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-[#FFFBF9] border border-[#DDD5D2] shadow flex items-center justify-center hover:bg-[#FFEAE8] active:scale-95 transition-transform z-20 cursor-pointer"
              >
                {isPlaying ? (
                  <Pause size={20} weight="fill" className="text-[#E5989B]" />
                ) : (
                  <Play size={20} weight="fill" className="text-[#E5989B] translate-x-px" />
                )}
              </button>

              {/* MENU (Top) */}
              <span className="absolute top-4 font-mono text-xs font-bold text-[#8A7E7B] select-none hover:text-[#2A1F1D]">
                MENU
              </span>

              {/* Fast Forward (Right) */}
              <button
                onClick={handleSkip}
                className="absolute right-4 p-1 text-[#8A7E7B] hover:text-[#2A1F1D] active:scale-90 transition-transform cursor-pointer"
              >
                <CaretRight size={20} weight="bold" />
              </button>

              {/* Rewind (Left) */}
              <button
                onClick={handleSkip}
                className="absolute left-4 p-1 text-[#8A7E7B] hover:text-[#2A1F1D] active:scale-90 transition-transform cursor-pointer"
              >
                <CaretLeft size={20} weight="bold" />
              </button>

              {/* Play/Pause icon (Bottom) */}
              <div
                onClick={togglePlay}
                className="absolute bottom-4 flex items-center gap-1 text-[#8A7E7B] hover:text-[#2A1F1D]"
              >
                <Play size={10} weight="fill" />
                <Pause size={10} weight="fill" />
              </div>

            </div>

          </div>

        </div>

        {/* Right Column - Final Love Letter Stationery */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          <div className="bg-[#FFFDF9] border border-[#F2E5E3] p-8 md:p-12 rounded-4xl shadow-xl relative overflow-hidden max-w-xl mx-auto lg:mx-0 filter drop-shadow-[0_10px_25px_rgba(42,31,29,0.05)]">
            
            {/* Lined stationery paper effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(242,229,227,0.3)_1px,transparent_1px)] bg-size-[100%_2rem] pointer-events-none" style={{ top: "4.5rem" }} />
            
            {/* Wax seal detail in top-right */}
            <div className="absolute top-6 right-6 w-12 h-12 bg-linear-to-tr from-[#9B5DE5]/20 to-[#E5989B]/40 rounded-full flex items-center justify-center border border-[#E5989B]/20 transform rotate-12 pointer-events-none">
              <div className="w-9 h-9 bg-linear-to-tr from-[#E5989B] to-[#FFB7B2] rounded-full flex items-center justify-center shadow-md border border-white/40">
                <Heart size={14} weight="fill" className="text-white" />
              </div>
            </div>

            {/* Letter Header */}
            <div className="mb-8 relative z-10">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#E5989B]">
                To My Forever
              </span>
              <h3 className="font-cursive text-4xl text-[#2A1F1D] mt-2">
                My Dearest,
              </h3>
            </div>

            {/* Letter Body - styled with Dancing Script */}
            <div className="font-cursive text-2xl md:text-3xl text-[#2A1F1D]/85 leading-8 relative z-10 flex flex-col gap-6 pl-2">
              <p>
                From the very first moment we met, I felt the gravity of a beautiful, unwritten story beginning. Every day with you has been an adventure, a sanctuary, and the sweetest rhythm.
              </p>
              <p>
                We have built our own quiet language, grown roots deep into the earth, and faced every season hand-in-hand. You are my home, my peace, and my absolute greatest gift.
              </p>
              <p>
                Here is to every sunset we&apos;ve watched, every cup of coffee shared, and the infinite chapters that still wait for us ahead. Happy Anniversary.
              </p>
              <p className="mt-8 text-right text-[#E5989B]">
                Always & Forever Yours
              </p>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
