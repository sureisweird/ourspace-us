"use client";

import type { RefObject } from "react";
import IphoneMusicPlayer from "./IphoneMusicPlayer";
import LoveLetter from "./LoveLetter";

//  CARA MENGGUNAKAN AUDIO NYATA:
//   1. Taruh file lagu di folder: /public/music/our-song.mp3
//   2. Ubah SONG_SRC di bawah menjadi "/music/our-song.mp3"
//   Format yang didukung: .mp3, .ogg, .wav, .aac
export const SONG_SRC = "/music/Backstreet Boys - Shape Of My Heart (320).mp3";

interface MusicLetterFooterProps {
  audioRef: RefObject<HTMLAudioElement | null>;
}

export default function MusicLetterFooter({ audioRef }: MusicLetterFooterProps) {
  return (
    <footer
      id="letter"
      className="py-32 px-6 max-w-7xl mx-auto relative z-10 border-t border-foreground/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <IphoneMusicPlayer audioRef={audioRef} />
        <LoveLetter />
      </div>
    </footer>
  );
}
