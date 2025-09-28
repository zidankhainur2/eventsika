"use client";

import dynamic from "next/dynamic";
import { type Profile } from "@/lib/types";

// Lakukan dynamic import di dalam Client Component
const MobileMenu = dynamic(() => import("@/components/MobileMenu"), {
  ssr: false,
});

// Tipe props harus sama dengan yang diterima MobileMenu
interface MobileMenuContainerProps {
  user: any;
  profile: Profile | null;
}

export default function MobileMenuContainer({
  user,
  profile,
}: MobileMenuContainerProps) {
  // Render komponen yang sudah di-import secara dinamis
  return <MobileMenu user={user} profile={profile} />;
}
