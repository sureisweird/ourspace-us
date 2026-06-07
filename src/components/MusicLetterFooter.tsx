"use client";

import type { RefObject } from "react";
import IphoneMusicPlayer from "./IphoneMusicPlayer";
import LoveLetter from "./LoveLetter";

import { SONG_SRC } from "@/config/galleryConfig";

//  CARA MENGGUNAKAN AUDIO NYATA:
//   1. Taruh file lagu di folder: /public/music/our-song.mp3
//   2. Ubah SONG_SRC di galleryConfig.ts
//   Format yang didukung: .mp3, .ogg, .wav, .aac
export { SONG_SRC };

interface MusicLetterFooterProps {
  audioRef: RefObject<HTMLAudioElement | null>;
}

export default function MusicLetterFooter({ audioRef }: MusicLetterFooterProps) {
  return (
    <footer
      id="letter"
      className="py-32 px-6 md:px-12 max-w-5xl mx-auto w-full relative z-10 border-t border-foreground/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <IphoneMusicPlayer audioRef={audioRef} />
        <LoveLetter />
      </div>
    </footer>
  );
}
