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
  // Mode full-screen iOS saat dibuka dari Home Screen (Add to Home Screen):
  // tidak ada toolbar/status bar Safari, status bar jadi overlay transparan
  // di atas konten → pin/amplop/transisi benar-benar edge-to-edge tanpa pita.
  appleWebApp: {
    capable: true,
    title: "Our Space",
    statusBarStyle: "black-translucent",
  },
  // Meta legacy untuk iOS lama (Next 16 hanya emit "mobile-web-app-capable").
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
