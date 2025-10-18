"use client";

import Link from "next/link";
import { FiClock, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { signOut } from "@/app/action";
import { type Profile } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

interface UserMenuProps {
  user: any;
  profile: Profile | null;
}

export default function UserMenu({ user, profile }: UserMenuProps) {
  const displayName = profile?.full_name || user?.email;
  const avatarUrl = profile?.avatar_url;
  const fallbackInitial = displayName?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-auto px-2 py-2 gap-2"
        >
          <Avatar className="h-8 w-8">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback>{fallbackInitial}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:block font-medium">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <FiUser className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/history">
            <FiClock className="mr-2 h-4 w-4" />
            <span>Riwayat Event</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile/settings">
            <FiSettings className="mr-2 h-4 w-4" />
            <span>Pengaturan</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOut} className="w-full">
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full text-left">
              <FiLogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
