// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton"; // Impor AuthButton
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "EventSika - Info Event Kampus",
  description: "Platform informasi event kampus UNSIKA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* Header Sederhana */}
        <nav className="w-full border-b border-b-foreground/10 h-16">
          <div className="max-w-4xl mx-auto flex justify-between items-center h-full px-4">
            <Link href="/" className="text-xl font-bold text-primary">
              EventSika
            </Link>
            <AuthButton />
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
