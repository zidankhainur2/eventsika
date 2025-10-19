"use client";

import Link from "next/link";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { profile } = useProfile();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background">
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-4 px-4 py-6">
          <h2 className="px-4 text-lg font-heading font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                  link.disabled && "cursor-not-allowed opacity-50"
                )}
                aria-disabled={link.disabled}
                onClick={(e) => link.disabled && e.preventDefault()}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            {/* Tampilkan link admin jika role adalah super_admin */}
            {profile?.role === "super_admin" &&
              adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
          </div>
        </nav>
        <div className="mt-auto p-4">
          <Separator className="my-4" />
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
    </aside>
  );
}
