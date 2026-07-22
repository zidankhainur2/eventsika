"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCalendar,
  FiBarChart2,
  FiUsers,
  FiLogOut,
  FiCpu,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/app/action";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/dashboard/events", label: "Kelola Event", icon: FiCalendar },
  {
    href: "/dashboard/analytics",
    label: "Analitik",
    icon: FiBarChart2,
    disabled: true,
  },
];

const adminLinks = [
  {
    href: "/dashboard/recommendation-test",
    label: "Uji Algoritma",
    icon: FiCpu,
  },
];

export function DashboardNavContent() {
  const pathname = usePathname();
  const { profile } = useProfile();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center border-b-2 border-[#0A0A0A] px-6 bg-white">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-extrabold text-lg uppercase tracking-tight text-[#0A0A0A]"
        >
          <Image src="/eventsika-logo.png" alt="Logo" width={28} height={28} />
          <span className="font-heading">Event<span className="text-[#1E45FB]">Sika</span></span>
        </Link>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-4 py-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all border-2",
              pathname === link.href
                ? "bg-[#CDF22B] text-[#0A0A0A] border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]"
                : "text-[#6B6B6B] border-transparent hover:bg-[#F7F7F5] hover:text-[#0A0A0A]",
              link.disabled && "cursor-not-allowed opacity-50",
            )}
            aria-disabled={link.disabled}
            onClick={(e) => link.disabled && e.preventDefault()}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            <span>{link.label}</span>
          </Link>
        ))}
        {profile?.role === "super_admin" && (
          <>
            <Separator className="my-4 bg-[#0A0A0A] h-[2px]" />
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all border-2",
                  pathname === link.href
                    ? "bg-[#CDF22B] text-[#0A0A0A] border-[#0A0A0A] shadow-[2px_2px_0px_#0A0A0A]"
                    : "text-[#6B6B6B] border-transparent hover:bg-[#F7F7F5] hover:text-[#0A0A0A]",
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
      <div className="mt-auto p-4 border-t-2 border-[#0A0A0A] bg-white">
        <form action={signOut} className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-[#6B6B6B] hover:text-[#DC2626] hover:bg-[#F7F7F5]"
          >
            <FiLogOut className="h-4 w-4 shrink-0" />
            <span>Keluar</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
