# AGENTS.md — Our Space (Anniversary Website)

> Panduan wajib untuk semua AI agent yang bekerja di proyek ini.
> Baca seluruh file ini sebelum menyentuh kode apapun.

---

## 1. Stack & Versi

| Layer | Teknologi | Catatan |
|-------|-----------|---------|
| Framework | Next.js (App Router) | Baca `node_modules/next/dist/docs/` sebelum menulis kode Next.js |
| Language | TypeScript strict | Tidak ada `any`, tidak ada `@ts-ignore` tanpa komentar penjelasan |
| Styling | Tailwind CSS v4 | Konfigurasi via `@theme inline` di globals.css, BUKAN tailwind.config |
| Animation | GSAP + ScrollTrigger + `@gsap/react` | Selalu gunakan `useGSAP` hook, bukan `useEffect` untuk GSAP |
| Icons | `@phosphor-icons/react` | Selalu sertakan `weight` prop (fill/light/bold/duotone) |
| Fonts | Geist, Geist Mono, Dancing Script | Diload via `next/font/google`, tersedia sebagai CSS var |

---

## 2. Arsitektur Halaman

Halaman utama (`src/app/page.tsx`) menggunakan **stage system 3 fase**:

```
"pin" → PinGate (fullscreen overlay, verifikasi PIN)
  ↓  onUnlocked()
"gift" → GiftBoxHero (fullscreen overlay, animasi buka amplop & surat)
  ↓  onOpenComplete()
"main" → Konten utama (header + semua section)
```

**Aturan ketat:**
- Jangan ubah urutan stage tanpa diskusi eksplisit
- PIN hardcode di `PinGate.tsx` sebagai `PIN_CODE` — jangan pindahkan ke env
- Audio (`<audio>`) di-mount di `page.tsx` dan di-pass sebagai `audioRef` ke komponen lain
- Autoplay audio HANYA boleh dipanggil dari dalam gesture handler user (GiftBoxHero)
- **Sinkronisasi Warna Body & Chrome iOS**: Latar belakang `html` dan `body` disesuaikan per-stage (`#170E0D` saat pin/gift, `#FFFBF9` saat main) untuk menyamakan warna status bar/toolbar Safari & PWA. Transisi ke stage "main" menggunakan GSAP tween pada `backgroundColor` agar perubahan warna mulus tanpa visual flash.

---

## 3. Komponen & Tanggung Jawab

```
src/components/
├── PinGate.tsx            # Stage 1 — form PIN (menggunakan single invisible input overlay), session storage check
├── GiftBoxHero.tsx        # Stage 2 — animasi SVG amplop & surat + petal explosion + wash overlay
├── FloralDecor.tsx        # Dekorasi bunga SVG di hero section (pointer-events-none)
├── AmbientPetals.tsx      # Partikel kelopak bunga melayang di background (di-render via ScrollTrigger/GSAP secara asinkron)
├── MemoryLane.tsx         # Section polaroid grid + lightbox foto
├── PolaroidCard.tsx       # Kartu polaroid fisik dengan hiasan stiker bunga & daun, mendukung keyboard navigation
├── SplitContent.tsx       # Section milestone cards + bouquet SVG
├── MusicLetterFooter.tsx  # Section footer gabungan (Music Player & Love Letter)
├── IphoneMusicPlayer.tsx  # Pemutar musik visual bergaya Apple Music Now Playing (iPhone layout) + earphone kabel dekoratif
└── LoveLetter.tsx         # Surat cinta romantis dengan pengetikan per-karakter secara organik (typewriter effect)
```

**Jangan gabungkan komponen.** Setiap komponen punya satu tanggung jawab.

---

## 4. Sistem Warna

Semua warna adalah bagian dari identitas visual — jangan ganti sembarangan.

| Nama | Hex | Penggunaan |
|------|-----|-----------|
| Background | `#FFFBF9` | Background utama |
| Foreground | `#2A1F1D` | Teks utama |
| Primary pink | `#E5989B` | CTA, aksen utama |
| Light pink | `#FFB7B2` | Ikon, border, highlight |
| Blush | `#FFC8DD` | Elemen dekoratif |
| Peach | `#FFE5D9` | Elemen dekoratif |
| Dark bg | `#170E0D` | Background overlay (PinGate, GiftBoxHero) |

CSS variable tersedia: `--background`, `--foreground`
Font variable: `--font-geist-sans`, `--font-geist-mono`, `--font-dancing-script`

Tailwind utility tambahan: `font-cursive` → Dancing Script

---

## 5. Animasi — Aturan GSAP

```ts
// ✅ BENAR — gunakan useGSAP dari @gsap/react
import { useGSAP } from "@gsap/react";

useGSAP(() => {
  gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1 });
}, { scope: containerRef, dependencies: [someState] });

// ❌ SALAH — jangan gunakan useEffect untuk animasi GSAP
useEffect(() => {
  gsap.to(ref.current, { opacity: 1 }); // memory leak + tidak cleanup dengan benar
}, []);
```

- ScrollTrigger **harus** di-register: `gsap.registerPlugin(ScrollTrigger)` di level module
- `ScrollTrigger.refresh()` **harus** di-wrap dalam `requestAnimationFrame()`
- Gunakan `invalidateOnRefresh: true` pada semua ScrollTrigger yang punya posisi dinamis
- Set initial GSAP state dengan `gsap.set()` sebelum animasi masuk, bukan hanya di `from`
- **GPU Promotion & Release (`will-change`)**: Selama transisi berat (seperti di `GiftBoxHero.tsx`), promosikan elemen bergerak ke layer GPU dengan menyetel `willChange` ke `transform, opacity` atau `transform`, tetapi **selalu kembalikan** ke `auto` setelah animasi selesai (`onComplete`) untuk menghindari memory leaks dan degradasi performa rendering jangka panjang.
- **Above-The-Fold Animation Optimization**: Untuk transisi masuk halaman, batasi animasi fade/transform awal hanya pada komponen di atas lipatan layar (above-the-fold) seperti `heroRef` daripada memudarkan seluruh container `mainContentRef`. Memaksa rendering fade pada seluruh dokumen offscreen dapat memicu frame drop.

---

## 6. CSS & Tailwind

- Konfigurasi tema ada di `globals.css` dalam blok `@theme inline {}` — **bukan** di file config
- Custom keyframes (`float-leaf`, `pulse-slow`, `fade-in`, `zoom-in`, `sway`, `blink`, `eq-bounce`)
  sudah didefinisikan di `globals.css` — gunakan class `.animate-*` yang sudah ada
- Jangan tambah `overflow: auto` atau `overflow: scroll` pada elemen apapun tanpa alasan kuat
- Elemen dekoratif selalu pakai `pointer-events-none` dan `aria-hidden="true"`
- Scrollbar disembunyikan global di `html` dan `body` — jangan override ini
- **Tema Default Latar Belakang & Grain Overlay**: `html` dan `body` diatur default ke latar gelap `#170E0D`. Selama stage gelap (pin/gift), tambahkan class `stage-dark` pada `body` untuk menyembunyikan background grain overlay (`body::after { display: none }`) guna mengurangi composite pass layar penuh yang membebani GPU saat transisi/partikel berjalan.
- **PWA Full-screen / iOS Display Mode**: Konfigurasi Apple Web App Capable (`capable: true`, `statusBarStyle: "black-translucent"`) diatur di metadata layout dan manifest web app (`manifest.ts`) untuk mendukung tampilan edge-to-edge murni tanpa area notch terpotong pada browser iOS.

---

## 7. Media — Foto & Audio

**Foto (MemoryLane) & Aset Gambar:**
- File lokal: `/public/images/memory-1.jpg` s/d `memory-5.jpg`
- Fallback ke Unsplash URL via `onError` handler — jangan hapus fallback ini
- Format kolom grid menggunakan Tailwind: `md:col-span-4`, `md:col-span-6`
- **Asynchronous Image Decoding**: Untuk gambar-gambar kecil, dekorasi, atau partikel dengan kuantitas tinggi yang memicu animasi performa-kritis (seperti petal dan wash flowers di `GiftBoxHero`), gunakan atribut `decoding="async"` untuk mencegah pemblokiran rendering thread utama browser.

**Audio (Music & Player):**
- File lagu: `/public/music/` — format MP3 direkomendasikan.
- `SONG_SRC` dikonfigurasi di atas `MusicLetterFooter.tsx`.
- `SONG_META` dikonfigurasi di atas `IphoneMusicPlayer.tsx`.
- Jika file tidak ada, komponen fallback ke mode visual-only secara otomatis — **jangan break** logika ini.
- Variabel `audioAvailable` mengontrol apakah audio real atau simulasi visual.

---

## 8. Aksesibilitas

- Semua elemen interaktif harus punya `aria-label`
- Lightbox di MemoryLane harus punya `role="dialog"` dan `aria-modal="true"`
- Keyboard navigation: `Enter` dan `Space` harus memicu aksi yang sama dengan klik
- Animasi berat harus menghormati `prefers-reduced-motion` — sudah ada di globals.css
- **Handling Reduced Motion pada Animasi GSAP**: Di level komponen (seperti `GiftBoxHero.tsx`), deteksi `window.matchMedia("(prefers-reduced-motion: reduce)").matches`. Jika bernilai `true`, atur durasi transisi menjadi sangat pendek (misal: 0.4s - 0.5s) dan hilangkan stagger/delay animasi multi-elemen agar visual berganti secara instan atau minim gerakan.

---

## 9. Hal yang DILARANG

- ❌ Jangan hapus atau ubah `SESSION_KEY` di PinGate — ini yang mencegah PIN diminta ulang
- ❌ Jangan pindahkan `<audio>` element dari `page.tsx` ke komponen lain
- ❌ Jangan ubah z-index secara sembarangan — hierarki z: pin(60) > gift(50) > wash(60) > main(10-40)
- ❌ Jangan gunakan `position: fixed` untuk elemen dekoratif — gunakan `absolute` dalam container
- ❌ Jangan tambah dependency baru tanpa mempertimbangkan bundle size
- ❌ Jangan gunakan `document.querySelector` — gunakan React ref
- ❌ Jangan hapus `will-change: transform` dan `isolation: isolate` dari GiftBoxHero container
- ❌ Jangan biarkan properti `will-change` aktif secara permanen pada elemen bergerak setelah animasi selesai — panggil logic pembersihan kembali ke `auto` demi mencegah kebocoran resource GPU.
- ❌ Jangan gunakan multiple inputs untuk form PIN di `PinGate.tsx` — selalu gunakan *single invisible overlay input* di atas visual boxes berukuran penuh untuk menghindari isu kegagalan fokus keyboard dan zoom otomatis browser mobile (khususnya iOS).

---

## 10. Konvensi Penamaan

```
Komponen:    PascalCase        → GiftBoxHero.tsx
Hooks:       camelCase + use   → useGSAP
CSS class:   kebab-case        → .polaroid-card, .petal-particle, .greeting-card
GSAP target: .kebab-case       → gsap.utils.toArray(".polaroid-card")
Const:       SCREAMING_SNAKE   → PIN_CODE, SONG_SRC, SESSION_KEY
Interface:   PascalCase + I    → PolaroidItem, GreetingCardItem
```

---

## 11. Sebelum Submit Perubahan

Checklist minimal:

- [ ] Tidak ada `console.error` baru saat page load
- [ ] Scrollbar tidak muncul (bahkan sebentar) saat hard refresh
- [ ] Semua 3 stage (pin → gift → main) masih berfungsi
- [ ] Audio play/pause masih berfungsi
- [ ] Lightbox foto masih bisa dibuka dan ditutup (klik + Escape)
- [ ] Tidak ada layout shift yang terlihat saat animasi masuk
- [ ] `prefers-reduced-motion` masih dihormati