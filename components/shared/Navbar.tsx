import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Bookmark, Search, User } from "lucide-react";

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#0A0A0A] bg-white">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        
        {/* Logo & Primary Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E45FB] rounded-md">
            <Image
              src="/eventsika-logo-text.png"
              alt="EventSika Logo"
              width={165}
              height={32}
              className="w-24 h-auto object-contain mb-3"
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-sm font-semibold uppercase tracking-wide text-[#0A0A0A] hover:text-[#1E45FB] transition-colors">
              Eksplorasi
            </Link>
            <Link href="/about" className="text-sm font-semibold uppercase tracking-wide text-[#0A0A0A] hover:text-[#1E45FB] transition-colors">
              Tentang Kami
            </Link>
          </nav>
        </div>

        {/* Action Navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex text-[#0A0A0A] hover:bg-[#F7F7F5]">
            <Link href="/explore" aria-label="Cari event">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {user ? (
            // Authenticated State
            <>
              <Button variant="ghost" size="icon" asChild className="text-[#0A0A0A] hover:bg-[#F7F7F5]">
                <Link href="/bookmarks" aria-label="Bookmark Tersimpan">
                  <Bookmark className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="text-[#0A0A0A] hover:bg-[#F7F7F5]">
                <Link href="/profile" aria-label="Profil Pengguna">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </>
          ) : (
            // Guest State
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="font-semibold text-sm uppercase tracking-wide text-[#0A0A0A] hover:bg-[#F7F7F5]">
                <Link href="/login">Masuk</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}