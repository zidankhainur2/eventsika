"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

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

  return (
    <main className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <Tabs value={pathname} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {navLinks.map((link) => (
              <TabsTrigger key={link.href} value={link.href} asChild>
                <Link href={link.href}>{link.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Card className="mt-6">{children}</Card>
      </div>
    </main>
  );
}
