"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiLogIn,
  FiUser,
  FiBookOpen,
  FiTool,
  FiAward,
  FiMonitor,
  FiMusic,
  FiActivity,
  FiHeart,
  FiPlusSquare,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/action";
import { CATEGORIES } from "@/lib/constants";
import { type Profile } from "@/lib/types";
import Portal from "@/components/Portal";

const categoryConfig = {
  Seminar: {
    icon: FiBookOpen,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  Workshop: {
    icon: FiTool,
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  Kompetisi: {
    icon: FiAward,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  Webinar: {
    icon: FiMonitor,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  Konser: { icon: FiMusic, color: "bg-pink-100", iconColor: "text-pink-600" },
  Olahraga: {
    icon: FiActivity,
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
};

export default function MobileMenu({
  user,
  profile,
}: {
  user: any;
  profile: Profile | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.25 } },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <div className="md:hidden">
      <motion.button
        onClick={() => setIsOpen(true)}
        className="p-2 text-2xl text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <FiMenu />
      </motion.button>

      <Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
              />
              <motion.div
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-0 left-0 h-screen w-80 max-w-[85vw] bg-white z-[101] shadow-2xl flex flex-col"
              >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <motion.h2
                    variants={itemVariants}
                    className="text-lg font-semibold text-gray-800"
                  >
                    Menu
                  </motion.h2>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    whileTap={{ scale: 0.9 }}
                    variants={itemVariants}
                  >
                    <FiX className="text-xl text-gray-600" />
                  </motion.button>
                </div>

                {user && profile && (
                  <motion.div
                    variants={itemVariants}
                    className="p-6 bg-gray-50/50 border-b border-gray-100"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <div className="rounded-full overflow-hidden bg-gray-200 w-full h-full">
                          <Image
                            src={
                              profile.avatar_url ||
                              `https://api.dicebear.com/8.x/initials/svg?seed=${
                                profile.full_name || user.email
                              }&backgroundColor=3b82f6`
                            }
                            alt="Avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {profile.full_name || user.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Lihat Profil
                        </p>
                      </div>
                      <FiUser className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </Link>
                  </motion.div>
                )}

                <div className="flex-1 overflow-y-auto p-6">
                  <motion.div variants={itemVariants}>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                      Kategori Event
                    </h3>
                    <div className="space-y-3">
                      {CATEGORIES.map((category) => {
                        const config = categoryConfig[
                          category as keyof typeof categoryConfig
                        ] || {
                          icon: FiBookOpen,
                          color: "bg-gray-100",
                          iconColor: "text-gray-600",
                        };
                        const IconComponent = config.icon;

                        return (
                          <Link
                            key={category}
                            href={`/?category=${encodeURIComponent(category)}`}
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                          >
                            <div
                              className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}
                            >
                              <IconComponent
                                className={`w-5 h-5 ${config.iconColor}`}
                              />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                              {category}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="mt-8 pt-6 border-t border-gray-100"
                  >
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                      Informasi
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/about"
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-800"
                      >
                        <FiHeart className="w-5 h-5" />
                        <span className="font-medium">Tentang Kami</span>
                      </Link>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="p-6 border-t border-gray-100 bg-gray-50/50"
                >
                  {profile?.role === "super_admin" && (
                    <Link
                      href="/admin"
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-800 text-white font-bold hover:bg-primary shadow-md transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  {user ? (
                    <div className="space-y-3 mt-4">
                      {(profile?.role === "organizer" ||
                        profile?.role === "super_admin") && (
                        <Link
                          href="/submit-event"
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-accent text-on-accent font-bold hover:bg-yellow-500 shadow-md transition-colors"
                        >
                          <FiPlusSquare className="w-5 h-5" />
                          <span>Submit Event</span>
                        </Link>
                      )}
                      <form action={signOut} className="w-full">
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-600 bg-red-100 hover:bg-red-200 transition-all duration-200 font-medium"
                        >
                          <FiLogOut className="w-5 h-5" />
                          <span>Keluar</span>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-red-900 shadow-md transition-colors"
                    >
                      <FiLogIn className="w-5 h-5" />
                      <span>Masuk / Daftar</span>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
