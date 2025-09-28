import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import Footer from "@/components/Footer";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "sonner";
import { ProgressBar } from "@/components/ProgressBar";
import { type Profile } from "@/lib/types";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// SEO: Metadata yang lebih kaya dan dinamis
export const metadata: Metadata = {
  metadataBase: new URL("https://eventsika.vercel.app"), // Ganti dengan URL produksi Anda
  title: {
    default: "EventSika - Info Event Kampus",
    template: `%s | EventSika`,
  },
  description:
    "Platform informasi terpusat untuk semua event dan kegiatan di lingkungan kampus UNSIKA. Temukan seminar, workshop, dan acara lainnya.",
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
  themeColor: "#800000",
  openGraph: {
    title: "EventSika - Info Event Kampus",
    description:
      "Platform informasi terpusat untuk semua event dan kegiatan di lingkungan kampus UNSIKA.",
    url: "https://eventsika.vercel.app", // Ganti dengan URL produksi Anda
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null };

  return (
    <html lang="id" className="scroll-smooth">
      {/* UI/UX: Menggunakan flexbox untuk sticky footer */}
      <body
        className={`${poppins.className} bg-neutral-light flex flex-col min-h-screen`}
      >
        {/* Aksesibilitas: Skip to content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 top-0 left-0 bg-accent text-on-accent p-4"
        >
          Lewati ke konten utama
        </a>

        <Toaster position="top-center" richColors />
        <ProgressBar />

        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <nav className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4">
            <Link href="/" className="text-xl font-bold text-primary">
              EventSika
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {profile?.role === "super_admin" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-red-600 hover:text-primary transition-colors"
                >
                  Admin
                </Link>
              )}
              {(profile?.role === "organizer" ||
                profile?.role === "super_admin") && (
                <Link
                  href="/submit-event"
                  className="text-sm font-medium text-neutral-dark/80 hover:text-primary transition-colors"
                >
                  Submit Event
                </Link>
              )}
              <AuthButton user={user} />
            </div>
            <MobileMenu user={user} profile={profile as Profile | null} />
          </nav>
        </header>

        {/* Struktur HTML: Menggunakan tag <main> dan id untuk skip link */}
        <main
          id="main-content"
          className="w-full max-w-6xl mx-auto px-4 flex-grow"
        >
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
