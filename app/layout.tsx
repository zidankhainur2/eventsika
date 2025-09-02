// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import Footer from "@/components/Footer";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EventSika - Info Event Kampus",
  description: "Platform informasi event kampus UNSIKA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${poppins.className} bg-neutral-light`}>
        <header className="sticky top-0 z-50 w-full border-b border-b-foreground/10 bg-white/80 backdrop-blur-sm">
          <nav className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4">
            <Link href="/" className="text-xl font-bold text-primary">
              EventSika
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/submit-event"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Submit Event
              </Link>
              <AuthButton />
            </div>
          </nav>
        </header>

        {/* Tambahkan div wrapper untuk padding global */}
        <div className="w-full max-w-6xl mx-auto px-4">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
