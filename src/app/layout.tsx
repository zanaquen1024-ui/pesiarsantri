import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PesiarProvider } from "@/lib/context/pesiar-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Pesiar Santri",
    default: "Pesiar Santri — Sistem Informasi Perizinan & Kunjungan Santri",
  },
  description:
    "Sistem informasi digital terintegrasi untuk mengelola kegiatan pesiar keluar, kunjungan keluarga, perizinan santri, monitoring keterlambatan, dan pemindaian gerbang berbasis QR Code di lingkungan pesantren.",
  keywords: [
    "Pesiar Santri",
    "Perizinan Santri",
    "Kunjungan Santri",
    "Aplikasi Pesantren",
    "Sistem Gerbang Pesantren",
    "QR Code Pesiar",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-pesantren-600 selection:text-white`}
      >
        <PesiarProvider>{children}</PesiarProvider>
      </body>
    </html>
  );
}
