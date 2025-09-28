import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { type Profile } from "@/lib/types";
import MobileMenuContainer from "./MobileMenuContainer";

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
      <nav className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4">
        
        {/* Tombol Menu Mobile: Muncul paling kiri di mobile */}
        <div className="md:hidden order-1">
          <MobileMenuContainer
            user={user}
            profile={profile as Profile | null}
          />
        </div>

        {/* Logo: Di tengah (mobile) atau di kiri (desktop) */}
        <Link
          href="/"
          className="order-2 md:order-1 flex items-center gap-2 text-xl font-bold text-primary"
        >
          <Image
            src="/eventsika-logo.png"
            alt="EventSika Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-accent">
            Event<span className="text-primary">Sika</span>
          </span>
        </Link>

        {/* Menu Desktop: Muncul di kanan (hanya desktop) */}
        <div className="hidden md:flex items-center gap-6 order-3 md:order-2">
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
      </nav>
    </header>
  );
}