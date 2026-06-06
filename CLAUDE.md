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
- PIN dan hint dikonfigurasi di 2 konstanta atas file: `PIN_CODE` dan `PIN_HINT`
- Shake animation menggunakan inline `<style>` tag di bawah komponen — ini disengaja
  karena keyframe `shake` tidak bisa dipakai sebagai Tailwind arbitrary animation
- `SESSION_KEY` di sessionStorage mencegah user diminta PIN ulang saat navigasi

### GiftBoxHero.tsx
- Petal particles dibuat sebagai state (`setPetals`) agar ter-render ke DOM dulu
  sebelum GSAP timeline dibuat — urutan ini kritis, jangan diubah
- Wash overlay **harus** `position: absolute` (bukan fixed) agar di-clip oleh
  container `overflow-hidden`
- Container utama **harus** punya `isolation: isolate` agar GPU compositing layer
  tidak bocor keluar saat animasi scale wash overlay

### MemoryLane.tsx
- `fallbackUrl` di setiap item MEMORIES adalah URL Unsplash — ini fallback jika
  foto lokal belum diisi. Jangan hapus.
- Lightbox menonaktifkan body scroll (`document.body.style.overflow = "hidden"`)
  saat terbuka dan merestore saat tutup — logika ini ada di `useEffect`
- GSAP floating animation per card berjalan terus-menerus — di-pause saat hover
  dan di-resume saat mouse keluar

### SplitContent.tsx
- Semua `.greeting-card` menggunakan ScrollTrigger dengan `invalidateOnRefresh: true`
  agar posisi dihitung ulang setelah `ScrollTrigger.refresh()` dipanggil dari page.tsx
- Bouquet SVG di kiri adalah `position: sticky` — scroll bersamaan dengan cards di kanan

### RetroIpodFooter.tsx
- `SONG_SRC` dan `SONG_META` di atas file adalah titik konfigurasi untuk lagu
- Typing effect surat dikendalikan oleh `typedCount` state + `useEffect` dengan
  delay per-karakter yang berbeda (spasi, newline, tanda baca)
- Equalizer bars menggunakan CSS animation `eq-bounce` yang sudah di globals.css
- Jika `audioAvailable = false`, mode visual-only aktif dengan interval simulasi progress

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

---

## Urutan Membaca File (untuk task baru)

```
1. AGENTS.md            ← aturan global
2. CLAUDE.md            ← file ini
3. src/app/globals.css  ← token warna, font, keyframes
4. src/app/page.tsx     ← entry point, stage system, audio ref
5. Komponen yang relevan dengan task
```

Untuk perubahan visual → baca `FloralDecor.tsx` dan `globals.css`
Untuk perubahan audio → baca `RetroIpodFooter.tsx` dan `page.tsx`
Untuk perubahan foto → baca `MemoryLane.tsx` (array MEMORIES)
Untuk perubahan teks surat → baca `RetroIpodFooter.tsx` (array LETTER_PARAGRAPHS)
Untuk perubahan milestone → baca `SplitContent.tsx` (array CARDS)
Untuk perubahan PIN → baca `PinGate.tsx` (konstanta PIN_CODE dan PIN_HINT)