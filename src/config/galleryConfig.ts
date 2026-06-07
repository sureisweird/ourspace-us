export interface PolaroidItem {
  id: number;
  localUrl: string;
  apiUrl: string;
  fallbackUrl: string;
  caption: string;
  date: string;
  colSpanClass: string;
  offsetClass: string;
}

export interface HeroPolaroidItem {
  localUrl: string;
  apiUrl: string;
  caption: string;
  date: string;
}

export interface SongMeta {
  title: string;
  artist: string;
  album: string;
  coverSrc: string;
  coverApi: string;
}

// Set ke `true` untuk menggunakan API Proxy (Cloudinary) di production.
// Set ke `false` untuk menggunakan file lokal di folder /public/images.
export const USE_API_PROXY = true;

// 1. Musik & Album Player
export const SONG_SRC = "/music/Backstreet Boys - Shape Of My Heart (320).mp3";

export const SONG_META: SongMeta = {
  title: "Shape Of My Heart",
  artist: "Backstreet Boys",
  album: "Birthday Album",
  coverSrc: "/images/memory-1.jpg",
  coverApi: "/api/images/album",
};

// 2. Polaroid di Hero Section (page.tsx) - Wine clinking scene matching memory-2.jpg
export const HERO_POLAROID: HeroPolaroidItem = {
  localUrl: "/images/memory-1.jpg",
  apiUrl: "/api/images/hero",
  caption: "Toast to the sunset, laughter, and a beautiful year ahead.",
  date: "Cheers to us! 🥂",
};

// 3. Daftar Foto Polaroid di Memory Lane (MemoryLane.tsx)
// Diselaraskan dengan isi gambar memory-1.jpg s/d memory-5.jpg agar akurat
export const MEMORIES: PolaroidItem[] = [
  {
    id: 1,
    localUrl: "/images/memory-3.jpg",
    apiUrl: "/api/images/1",
    fallbackUrl: "",
    caption: "A peaceful walk hand-in-hand through the golden forest.",
    date: "Autumn Wanderlust",
    colSpanClass: "md:col-span-4",
    offsetClass: "",
  },
  {
    id: 2,
    localUrl: "/images/memory-1.jpg",
    apiUrl: "/api/images/2",
    fallbackUrl: "",
    caption: "Intertwined fingers and warm sun rays, holding onto forever.",
    date: "Warm Embrace",
    colSpanClass: "md:col-span-4",
    offsetClass: "",
  },
  {
    id: 3,
    localUrl: "/images/memory-5.jpg",
    apiUrl: "/api/images/3",
    fallbackUrl: "",
    caption: "Cozy hibiscus glow and peaceful nightstand vibes.",
    date: "Hibiscus Glow",
    colSpanClass: "md:col-span-4",
    offsetClass: "",
  },
  {
    id: 4,
    localUrl: "/images/memory-4.jpg",
    apiUrl: "/api/images/4",
    fallbackUrl: "",
    caption: "A heart sketched in the sand as waves wash over.",
    date: "Sunset Beach",
    colSpanClass: "md:col-span-4 md:col-start-3",
    offsetClass: "",
  },
  {
    id: 5,
    localUrl: "/images/memory-2.jpg",
    apiUrl: "/api/images/5",
    fallbackUrl: "",
    caption: "Celebrating you with sunset wine toasts by the sea.",
    date: "Sunset Magic",
    colSpanClass: "md:col-span-4",
    offsetClass: "",
  },
];
