import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { ProgressBar } from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        url: "/hero-bg.jpg", // Ganti dengan URL gambar OG Anda
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
    images: ["/hero-bg.jpg"], // Ganti dengan URL gambar Twitter Anda
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
        className={`${poppins.className} bg-neutral-light flex flex-col min-h-screen`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 top-0 left-0 bg-accent text-on-accent p-4"
        >
          Lewati ke konten utama
        </a>

        <Toaster position="top-center" richColors />
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>

        <Navbar />

        <main
          id="main-content"
          className="w-full max-w-6xl mx-auto px-4 flex-grow"
        >
          {children}
          <SpeedInsights />
        </main>

        <Footer />
      </body>
    </html>
  );
}
