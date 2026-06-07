@AGENTS.md
@AGENTS.md

# CLAUDE.md — Tambahan untuk Claude / Kiro

> File ini meng-extend AGENTS.md. Baca AGENTS.md terlebih dahulu,
> lalu ikuti panduan tambahan di bawah ini.

---

## Cara Claude Harus Bekerja di Proyek Ini

### Sebelum menulis kode apapun:
1. Baca file yang relevan terlebih dahulu — jangan asumsikan struktur berdasarkan nama file
2. Cari pola yang sudah ada di codebase dan ikuti pola itu
3. Jika ada konflik antara instruksi user dan AGENTS.md, tanyakan dulu

### Saat membuat perubahan:
- Buat perubahan **sekecil mungkin** yang menyelesaikan masalah
- Jangan refactor kode yang tidak diminta
- Jangan ganti nama variabel, class, atau fungsi yang sudah ada
- Pertahankan komentar yang ada — banyak komentar di sini menjelaskan bug fix

### Saat membuat komponen baru:
- Ikuti struktur `"use client"` di baris pertama (semua komponen adalah Client Component)
- Gunakan `useGSAP` bukan `useEffect` untuk animasi
- Tambahkan `pointer-events-none` dan `aria-hidden="true"` pada semua elemen dekoratif
- Export default, bukan named export, untuk komponen utama

---

## Konteks Visual Proyek

Website ini adalah **hadiah anniversary digital** — setiap keputusan desain disengaja:
- Estetika: romantis, lembut, premium — seperti majalah fashion premium
- Palet: warm off-white + dusty rose + dark brown (bukan putih terang atau hitam pekat)
- Tipografi: mix antara sans-serif light (Geist) + cursive (Dancing Script) untuk kontras
- Animasi: lembut, natural, tidak tiba-tiba — ease "power3.out" dan "sine.inOut"

Jangan "modernisasi" atau "simplifikasi" desain tanpa diminta — estetika ini disengaja.

---

## Panduan Spesifik Per Komponen

### PinGate.tsx
- PIN dan hint dikonfigurasi di 2 konstanta atas file: `PIN_CODE` dan `PIN_HINT`.
- **Single Input Overlay**: Menggunakan satu `<input type="text" pattern="[0-9]*" inputMode="numeric" maxLength={4} />` invisible yang menutupi seluruh kotak visual. Ini mencegah keyboard mobile terpecah atau auto-zoom berulang.
- Kotak visual memetakan digit yang terisi, menampilkan ikon `HeartIcon` dengan animasi pop (`heart-pop`) jika ada digit, atau dot kecil jika kosong. Status fokus diatur oleh state `isFocused`.
- Shake animation menggunakan inline `<style>` keyframes `shake` di bawah komponen karena properti dinamis ini sulit dipicu dengan utility standar.
- Twinkling stars menggunakan static arrays (`STATIC_STARS`) yang di-render langsung untuk mencegah hydration mismatch dan delay rendering di server.

### GiftBoxHero.tsx
- **Model Amplop**: Menggunakan aset amplop interaktif (`envelope_body.svg`, `envelope_flap.svg`, `envelope_seal.svg`) dan kertas surat (`letterSheetRef`).
- Alur Animasi: Seal wax pop & fade -> flap amplop melipat ke atas (`scaleY: 1`) -> `zIndex` flap dipindah ke belakang surat -> kertas surat meluncur ke atas -> ledakan kelopak bunga (petal) dan wash overlay bunga menyebar.
- Petal particles dibuat sebagai state (`setPetals`) agar ter-render ke DOM dulu sebelum GSAP timeline dibuat — urutan ini kritis, jangan diubah.
- Wash overlay **harus** `position: absolute` (bukan fixed) agar di-clip oleh container `overflow-hidden`.
- Container utama **harus** punya `isolation: isolate` agar GPU compositing layer tidak bocor keluar saat animasi scale wash overlay.
- Properti `willChange` diset dinamis ke GPU layer selama transisi, dan **wajib dibersihkan** ke `auto` melalui fungsi callback `releaseOpenWillChange()` setelah transisi selesai untuk menjaga performa memori.
- Mendukung `prefers-reduced-motion` dengan mempercepat transisi (0.4s - 0.5s) dan mematikan efek stagger pada partikel bunga.

### MemoryLane.tsx
- `fallbackUrl` di setiap item MEMORIES adalah URL Unsplash — ini fallback jika
  foto lokal belum diisi. Jangan hapus.
- Lightbox menonaktifkan body scroll (`document.body.style.overflow = "hidden"`)
  saat terbuka dan merestore saat tutup — logika ini ada di `useEffect`
- GSAP floating animation per card berjalan terus-menerus — di-pause saat hover
  dan di-resume saat mouse keluar

### PolaroidCard.tsx
- Menampilkan kartu polaroid fisik lengkap dengan hiasan stiker daun/bunga yang di-render secara acak menggunakan fungsi helper `getStickers(id)`.
- Gambar polaroid didesain siku tajam tanpa rounded corner.
- Mendukung penanganan aksesibilitas keyboard (melalui event `onKeyDown` untuk tombol Enter/Space) dan `aria-label` deskriptif.

### AmbientPetals.tsx
- Partikel kelopak bunga melayang multi-arah yang lambat di background.
- Menggunakan GSAP untuk animasi meluncur di layar secara acak, yang secara dinamis di-pause saat off-screen dan di-resume saat on-screen menggunakan ScrollTrigger.
- Mendukung `prefers-reduced-motion` dengan meletakkan partikel secara statis tanpa gerakan.

### SplitContent.tsx
- Semua `.greeting-card` menggunakan ScrollTrigger dengan `invalidateOnRefresh: true`
  agar posisi dihitung ulang setelah `ScrollTrigger.refresh()` dipanggil dari page.tsx
- Bouquet SVG di kiri adalah `position: sticky` — scroll bersamaan dengan cards di kanan

### MusicLetterFooter.tsx & IphoneMusicPlayer.tsx & LoveLetter.tsx
- `MusicLetterFooter.tsx` menggabungkan pemutar lagu (`IphoneMusicPlayer`) dan surat cinta (`LoveLetter`) di bagian footer.
- `SONG_SRC` didefinisikan di bagian atas `MusicLetterFooter.tsx` untuk konfigurasi file audio nyata.
- `SONG_META` dikonfigurasi di atas `IphoneMusicPlayer.tsx` untuk judul lagu, artis, dan album.
- `IphoneMusicPlayer.tsx` mensimulasikan pemutar lagu bergaya iPhone / Apple Music Now Playing. Mendukung toggle play/pause, seek track via timeline click/scrubber, rewind/forward 15 detik, dan volume slider statis. Equalizer bar menggunakan animasi CSS `eq-bounce`. Terdapat earbud/earphone kabel dekoratif di bawah bodi player yang ikut berayun saat musik berputar.
- Jika `audioAvailable = false` (audio error atau tidak ditemukan), player masuk ke mode visual-only yang mensimulasikan progress berjalan secara otomatis agar UI tidak macet.
- `LoveLetter.tsx` mengelola pengetikan teks surat cinta secara otomatis menggunakan `IntersectionObserver` agar pengetikan baru dimulai saat masuk ke viewport. Kecepatan mengetik bervariasi secara organik berdasarkan karakter (misal: delay ekstra pada spasi, tanda koma, titik, dan baris baru) untuk meniru gaya tulisan tangan manusia. Mendukung `prefers-reduced-motion` dengan langsung memunculkan seluruh teks tanpa animasi mengetik.

---

## Masalah Umum & Solusinya

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Ghost scrollbar muncul sebentar | Elemen overflow sebelum CSS clip aktif | Pastikan `overflow-hidden` ada di html, body, container hero, dan section MemoryLane |
| GSAP animasi tidak jalan | `useEffect` dipakai bukannya `useGSAP` | Ganti ke `useGSAP` dengan `scope` yang benar |
| Kartu milestone stuck di opacity:0 | ScrollTrigger dihitung sebelum layout final | Pastikan `invalidateOnRefresh: true` dan `ScrollTrigger.refresh()` dipanggil di `onComplete` |
| Audio tidak autoplay | Browser policy | Audio hanya boleh di-play dari inside gesture handler (klik GiftBoxHero) |
| Typing effect surat tidak mulai | ScrollTrigger untuk `letterRef` tidak trigger | Periksa `start: "top 78%"` dan pastikan `once: true` ada |
| Petal particles tidak muncul | GSAP dibuat sebelum React render petal | `setPetals()` harus dipanggil sebelum `setIsClicked(true)` |
| Pita warna (status bar/toolbar iOS) tidak menyatu | Default background `body` atau `html` berbeda dengan warna latar belakang overlay gelap | default-kan `html`/`body` ke background gelap `#170E0D`, beri class `stage-dark` pada body saat pin/gift, dan gunakan GSAP `backgroundColor` tween untuk berpindah halus ke `#FFFBF9` saat masuk stage `main`. |
| Keyboard mobile auto-zoom / loop focus | Input PIN terpisah-pisah memicu trigger scroll otomatis per karakter | Gunakan satu overlay input invisible penuh (`inputRef`) dengan pattern `[0-9]*` di atas kotak visual PIN. |
| Frame drop saat transisi masuk stage `main` | Fading pada seluruh layout DOM besar memicu repainting elemen offscreen | Batasi GSAP fade-in masuk hanya pada bagian di atas lipatan layar seperti Hero (`heroRef`), bukan pada seluruh container main. |
| Degradasi performa GPU (lag bertahap) | Kebocoran GPU composite layer akibat properti `will-change` atau overlay grain yang terus aktif | Bersihkan properti `willChange` ke `auto` setelah animasi selesai, dan sembunyikan grain overlay (`body::after { display: none }`) selama stage gelap (`stage-dark`). |

---

## Urutan Membaca File (untuk task baru)

```
1. AGENTS.md            ← aturan global
2. CLAUDE.md            ← file ini
3. src/app/globals.css  ← token warna, font, keyframes
4. src/app/page.tsx     ← entry point, stage system, audio ref
5. Komponen yang relevan dengan task
```

Untuk perubahan visual → baca `FloralDecor.tsx`, `AmbientPetals.tsx`, dan `globals.css`
Untuk perubahan audio → baca `MusicLetterFooter.tsx`, `IphoneMusicPlayer.tsx`, dan `page.tsx`
Untuk perubahan foto → baca `MemoryLane.tsx` (array MEMORIES) dan `PolaroidCard.tsx`
Untuk perubahan teks surat → baca `LoveLetter.tsx` (array LETTER_PARAGRAPHS)
Untuk perubahan milestone → baca `SplitContent.tsx` (array CARDS)
Untuk perubahan PIN → baca `PinGate.tsx` (konstanta PIN_CODE dan PIN_HINT)