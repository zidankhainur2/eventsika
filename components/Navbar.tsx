// components/Navbar.tsx
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { type Profile } from "@/lib/types";
import MobileMenuContainer from "./MobileMenuContainer";
import Searchbar from "./Searchbar"; // Import komponen baru
import UserMenu from "./UserMenu"; // Import komponen baru

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4 gap-4">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <MobileMenuContainer
              user={user}
              profile={profile as Profile | null}
            />
          </div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/eventsika-logo.png"
              alt="EventSika Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-primary hidden sm:block">
              EventSika
            </span>
          </Link>
        </div>

        {/* Search Bar - Center */}
        <div className="flex-1 flex justify-center">
          <Searchbar />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {/* Link untuk Super Admin */}
          {profile?.role === "super_admin" && (
            <Link
              href="/admin"
              className="text-sm font-medium text-red-600 hover:text-primary transition-colors"
            >
              Admin
            </Link>
          )}

          {/* Link untuk Organizer & Super Admin */}
          {(profile?.role === "organizer" ||
            profile?.role === "super_admin") && (
            <Link
              href="/organizer/dashboard"
              className="text-sm font-medium text-neutral-dark/80 hover:text-primary transition-colors"
            >
              Dasbor
            </Link>
          )}
        </div>

        {/* User Menu / Login Button */}
        <div className="flex items-center">
          {user ? (
            <UserMenu user={user} profile={profile as Profile | null} />
          ) : (
            <Link
              href="/login"
              className="py-2 px-4 rounded-md text-sm no-underline bg-accent text-on-accent font-semibold hover:bg-yellow-500 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
