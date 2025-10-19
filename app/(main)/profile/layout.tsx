"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/profile", label: "Informasi Akun" },
  { href: "/profile/settings", label: "Pengaturan" },
  { href: "/profile/saved-events", label: "Event Tersimpan" },
  { href: "/profile/history", label: "Riwayat Event" },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const currentLabel =
    navLinks.find((link) => link.href === pathname)?.label || navLinks[0].label;

  return (
    <main className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Desktop Navigation - Tabs */}
        <div className="hidden md:block">
          <Tabs value={pathname} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {navLinks.map((link) => (
                <TabsTrigger key={link.href} value={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile Navigation - Select Dropdown */}
        <div className="md:hidden">
          <Select
            value={pathname}
            onValueChange={(value) => router.push(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{currentLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {navLinks.map((link) => (
                <SelectItem key={link.href} value={link.href}>
                  {link.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="mt-6 p-4 sm:p-6">{children}</Card>
      </div>
    </main>
  );
}
