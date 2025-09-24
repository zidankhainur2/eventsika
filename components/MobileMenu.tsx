// components/MobileMenu.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/action";

export default function MobileMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuVariants: Variants = {
    hidden: {
      x: 100, // pakai number, bukan "100%"
      transition: {
        type: "tween", // ini valid, sesuai union type Framer Motion
        ease: "easeInOut",
      },
    },
    visible: {
      x: 0,
      transition: {
        type: "tween",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(true)} className="text-2xl text-primary">
        <FiMenu />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-neutral-light z-50 p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-primary">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-3xl text-primary"
                >
                  <FiX />
                </button>
              </div>
              <nav className="flex flex-col gap-6 text-lg font-medium text-neutral-dark">
                {user && (
                  <Link href="/profile" className="hover:text-primary">
                    Profil
                  </Link>
                )}
                <Link href="/submit-event" className="hover:text-primary">
                  Submit Event
                </Link>
                {!user && (
                  <Link
                    href="/login"
                    className="bg-accent text-on-accent text-center rounded-lg py-2 mt-4"
                  >
                    Login / Daftar
                  </Link>
                )}
                {user && (
                  <form action={signOut} className="w-full pt-4 mt-4 border-t">
                    <button
                      type="submit"
                      className="w-full text-left text-red-600"
                    >
                      Logout
                    </button>
                  </form>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
