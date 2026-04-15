import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ProgressBar } from "@/components/ProgressBar";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/components/Providers";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Menggunakan Plus Jakarta Sans sesuai permintaan dengan optimasi Next.js
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eventsika.vercel.app"),
  title: {
    default: "EventSika - Info Event UNSIKA",
    template: `%s | EventSika`,
  },
  description:
    "Platform informasi terpusat untuk semua event dan kegiatan di lingkungan kampus UNSIKA. Temukan seminar, workshop, dan acara lainnya.",
  icons: {
    icon: "/eventsika-logo.png",
    shortcut: "/eventsika-logo.png",
    apple: "/eventsika-logo.png",
  },
  keywords: [
    "event kampus",
    "UNSIKA",
    "seminar",
    "workshop",
    "mahasiswa",
    "info event",
  ],
  authors: [
    {
      name: "Team EventSika",
      url: "https://github.com/zidankhainur2/eventsika",
    },
  ],
  creator: "Team EventSika",
  publisher: "Team EventSika",
  robots: "index, follow",
  openGraph: {
    title: "EventSika - Info Event Kampus",
    description:
      "Platform informasi terpusat untuk semua event dan kegiatan di lingkungan kampus UNSIKA.",
    url: "https://eventsika.vercel.app",
    siteName: "EventSika",
    images: [
      {
        url: "/hero-bg.webp",
        width: 1200,
        height: 630,
        alt: "EventSika Hero Image",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EventSika - Info Event Kampus",
    description: "Semua info event kampus UNSIKA dalam satu platform.",
    images: ["/hero-bg.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} bg-background text-foreground flex flex-col min-h-screen`}
      >
        <Providers>
          <ToastProvider />

          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          {children}
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
