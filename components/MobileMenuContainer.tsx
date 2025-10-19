"use client";

import { type Profile } from "@/lib/types";
import MobileMenu from "@/components/MobileMenu";

interface MobileMenuContainerProps {
  user: any;
  profile: Profile | null;
}

export default function MobileMenuContainer({
  user,
  profile,
}: MobileMenuContainerProps) {
  return <MobileMenu user={user} profile={profile} />;
}
