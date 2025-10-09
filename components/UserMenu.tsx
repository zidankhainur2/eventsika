// components/UserMenu.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiLogOut, FiBookmark, FiUser } from "react-icons/fi";
import { signOut } from "@/app/action";
import { type Profile } from "@/lib/types";

interface UserMenuProps {
  user: any;
  profile: Profile | null;
}

export default function UserMenu({ user, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = profile?.full_name || user?.email;
  const avatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${displayName}`;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-2 transition-colors"
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden">
          <Image src={avatarUrl} alt="User Avatar" fill sizes="32px" />
        </div>
        <span className="text-sm font-medium hidden md:block max-w-[100px] truncate">
          {displayName}
        </span>
        <FiChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 overflow-hidden"
          >
            <div className="p-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FiUser />
                <span>Informasi Akun</span>
              </Link>
              <Link
                href="/profile/saved-events"
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FiBookmark />
                <span>Event Tersimpan</span>
              </Link>
              <div className="my-1 h-px bg-gray-200" />
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                >
                  <FiLogOut />
                  <span>Keluar</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
