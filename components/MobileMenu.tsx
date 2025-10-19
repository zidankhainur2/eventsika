"use client";

import Link from "next/link";
import {
  FiMenu,
  FiLogIn,
  FiBookOpen,
  FiHeart,
  FiCalendar,
  FiLogOut,
  FiInfo,
} from "react-icons/fi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { signOut } from "@/app/action";
import { CATEGORIES } from "@/lib/constants";
import { type Profile } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function MobileMenu({
  user,
  profile,
}: {
  user: any;
  profile: Profile | null;
}) {
  const displayName = profile?.full_name || user?.email;
  const avatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${displayName}`;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <FiMenu className="h-6 w-6" />
          <span className="sr-only">Buka Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="font-heading text-2xl">Menu</SheetTitle>
        </SheetHeader>

        {user && profile && (
          <div className="px-6">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg p-3 -mx-3 hover:bg-muted"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatarUrl} alt="Avatar" />
                <AvatarFallback>
                  {displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground">Lihat Profil</p>
              </div>
            </Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 space-y-6 mt-4">
          {/* Menu Saya (Hanya untuk user login) */}
          {user && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Menu Saya
              </h3>
              <div className="flex flex-col gap-1">
                <Link
                  href="/profile/saved-events"
                  className="flex items-center gap-3 p-2 rounded-md text-foreground hover:bg-muted"
                >
                  <FiHeart className="h-4 w-4" />
                  <span>Event Tersimpan</span>
                </Link>
                <div
                  className="flex items-center gap-3 p-2 rounded-md text-muted-foreground cursor-not-allowed"
                  aria-disabled="true"
                >
                  <FiCalendar className="h-4 w-4" />
                  <span>Kalender</span>
                </div>
              </div>
            </div>
          )}

          {/* Kategori */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Kategori
            </h3>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${cat}`}
                  className="flex items-center gap-3 p-2 rounded-md text-foreground hover:bg-muted"
                >
                  <FiBookOpen className="h-4 w-4" />
                  <span>{cat}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Informasi
            </h3>
            <div className="flex flex-col gap-1">
              <Link
                href="/about"
                className="flex items-center gap-3 p-2 rounded-md text-foreground hover:bg-muted"
              >
                <FiInfo className="h-4 w-4" />
                <span>Tentang Kami</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 mt-auto border-t">
          {user ? (
            <form action={signOut} className="w-full">
              <Button variant="outline" className="w-full justify-start gap-3">
                <FiLogOut className="h-4 w-4" />
                <span>Keluar</span>
              </Button>
            </form>
          ) : (
            <Button asChild className="w-full">
              <Link href="/login" className="flex items-center gap-3">
                <FiLogIn className="h-4 w-4" />
                <span>Masuk / Daftar</span>
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
