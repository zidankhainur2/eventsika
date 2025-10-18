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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
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
            <span className="font-heading text-xl font-bold text-primary hidden sm:block">
              EventSika
            </span>
          </Link>
        </div>

        {/* Search Bar - Center */}
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-md">
            <Searchbar />
          </div>
        </div>

        {/* Actions & User Menu */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
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
              <UserMenu user={user} profile={profile as Profile | null} />
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
