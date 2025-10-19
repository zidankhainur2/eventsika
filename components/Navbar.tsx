import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { FiHeart, FiCalendar } from "react-icons/fi";

import { type Profile } from "@/lib/types";
import MobileMenuContainer from "./MobileMenuContainer";
import Searchbar from "./Searchbar";
import UserMenu from "./UserMenu";
import { Button } from "./ui/button";

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm md:border-b md:border-border">
      {/* Navigasi Utama */}
      <nav className="relative max-w-6xl mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Kiri: Hamburger (Mobile) / Logo (Desktop) */}
        <div className="flex flex-1 items-center gap-2 md:flex-none">
          <div className="md:hidden">
            <MobileMenuContainer
              user={user}
              profile={profile as Profile | null}
            />
          </div>
          <Link href="/" className="hidden items-center gap-2 md:flex">
            <Image
              src="/eventsika-logo.png"
              alt="EventSika Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="hidden font-heading text-xl font-bold text-primary sm:block">
              EventSika
            </span>
          </Link>
        </div>

        {/* Tengah: Logo (Mobile) / Search (Desktop) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/eventsika-logo.png"
              alt="EventSika Logo"
              width={28}
              height={28}
              className="h-7 w-7"
            />
          </Link>
        </div>
        <div className="hidden flex-1 justify-center px-4 md:flex">
          <div className="w-full max-w-md">
            <Searchbar />
          </div>
        </div>

        {/* Kanan: Aksi Pengguna */}
        <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
          {user ? (
            <>
              <div className="hidden items-center md:flex">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile/saved-events">
                    <FiHeart className="h-5 w-5" />
                    <span className="sr-only">Event Tersimpan</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" disabled>
                  <FiCalendar className="h-5 w-5" />
                  <span className="sr-only">Kalender Event</span>
                </Button>
              </div>
              <UserMenu user={user} profile={profile as Profile | null} />
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* Search Bar untuk Mobile */}
      <div className="border-b border-border bg-background px-4 pb-3 md:hidden">
        <Searchbar />
      </div>
    </header>
  );
}
