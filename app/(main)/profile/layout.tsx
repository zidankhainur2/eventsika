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
    <main className="py-8 sm:py-12 px-4 md:px-6 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profil Pengguna</h1>
          <p className="text-muted-foreground">Kelola akun dan preferensi Anda di sini.</p>
        </div>

        {/* Desktop Navigation - Tabs */}
        <div className="hidden md:block">
          <Tabs value={pathname} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted p-1 rounded-lg">
              {navLinks.map((link) => (
                <TabsTrigger key={link.href} value={link.href} asChild className="rounded-md">
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
            <SelectTrigger className="w-full bg-background">
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

        <Card className="border border-border rounded-xl shadow-sm overflow-hidden">
          {children}
        </Card>
      </div>
    </main>
  );
}
