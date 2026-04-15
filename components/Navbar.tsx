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
    // Background di-update mengikuti warm UI
    <header className="sticky top-0 z-50 w-full bg-[#fff8f6]/90 dark:bg-background/90 backdrop-blur-md border-b border-stone-200 dark:border-border transition-colors duration-300">
      <nav className="relative max-w-7xl mx-auto flex h-16 items-center justify-between gap-4 px-6 md:px-12">
        {/* Kiri */}
        <div className="flex flex-1 items-center gap-2 md:flex-none">
          <div className="md:hidden">
            <MobileMenuContainer
              user={user}
              profile={profile as Profile | null}
            />
          </div>
          <Link href="/" className="hidden items-center gap-3 md:flex group">
            <Image
              src="/eventsika-logo.png"
              alt="EventSika Logo"
              width={32}
              height={32}
              className="h-8 w-8 group-hover:scale-110 transition-transform"
            />
            <span className="hidden font-heading text-2xl font-extrabold text-primary sm:block tracking-tight">
              EventSika
            </span>
          </Link>
        </div>

        {/* Tengah: Mobile Logo / Desktop Search */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
          <Link href="/">
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
          <div className="w-full max-w-xl">
            <Searchbar />
          </div>
        </div>

        {/* Kanan */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          {user ? (
            <>
              <div className="hidden items-center md:flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-stone-200 dark:hover:bg-stone-800"
                  asChild
                >
                  <Link href="/profile/saved-events">
                    <FiHeart className="h-5 w-5 text-stone-600 dark:text-stone-300" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-stone-200 dark:hover:bg-stone-800"
                  disabled
                >
                  <FiCalendar className="h-5 w-5 text-stone-600 dark:text-stone-300" />
                </Button>
              </div>
              <UserMenu user={user} profile={profile as Profile | null} />
            </>
          ) : (
            <Button
              asChild
              className="rounded-full font-semibold px-6 shadow-md"
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* Search Bar Mobile */}
      <div className="border-b border-stone-200 dark:border-border bg-[#fff8f6] dark:bg-background px-4 pb-4 md:hidden">
        <Searchbar />
      </div>
    </header>
  );
}
