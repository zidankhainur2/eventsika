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
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/app/action";

const navLinks = [
  { href: "/dashboard", label: "Ringkasan", icon: FiHome },
  { href: "/dashboard/events", label: "Kelola Event", icon: FiCalendar },
  {
    href: "/dashboard/analytics",
    label: "Analitik",
    icon: FiBarChart2,
    disabled: true,
  },
];

const adminLinks = [
  { href: "/admin", label: "Aplikasi Organizer", icon: FiUsers },
];

export function DashboardNavContent() {
  const pathname = usePathname();
  const { profile } = useProfile();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Image src="/eventsika-logo.png" alt="Logo" width={28} height={28} />
          <span className="font-heading">EventSika</span>
        </Link>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-primary",
              link.disabled && "cursor-not-allowed opacity-50"
            )}
            aria-disabled={link.disabled}
            onClick={(e) => link.disabled && e.preventDefault()}
          >
            <link.icon className="h-4 w-4" />
            <span>{link.label}</span>
          </Link>
        ))}
        {profile?.role === "super_admin" && (
          <>
            <Separator className="my-4" />
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
      <div className="mt-auto p-4 border-t">
        <form action={signOut} className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          >
            <FiLogOut className="h-4 w-4" />
            <span>Keluar</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
