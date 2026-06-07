import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Our Space | Happy Anniversary",
  description: "A digital sanctuary celebrating our love, memories, and beautiful moments together.",
};

// viewport-fit=cover WAJIB agar env(safe-area-inset-*) mengembalikan nilai nyata
// di iOS. Tanpa ini, semua padding safe-area diabaikan (selalu 0) sehingga konten
// bisa tertutup notch / Dynamic Island / home indicator.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Default gelap: tampilan awal (PinGate) berlatar gelap. Akan disesuaikan
  // dinamis per-stage di page.tsx agar bar status/toolbar iOS menyatu.
  themeColor: "#170E0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
