// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import Footer from "@/components/Footer";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import { createClient } from "@/utils/supabase/server";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EventSika - Info Event Kampus",
  description: "Platform informasi event kampus UNSIKA.",
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

  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${poppins.className} bg-neutral-light`}>
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <nav className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4">
            <Link href="/" className="text-xl font-bold text-primary">
              EventSika
            </Link>

            {/* Navigasi Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/submit-event"
                className="text-sm font-medium text-neutral-dark/80 hover:text-primary transition-colors"
              >
                Submit Event
              </Link>
              <AuthButton user={user} />
            </div>

            {/* Navigasi Mobile */}
            <MobileMenu user={user} />
          </nav>
        </header>

        <div className="w-full max-w-6xl mx-auto px-4">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
