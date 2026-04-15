"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <div className="max-w-7xl mx-auto rounded-3xl bg-primary relative overflow-hidden group shadow-2xl">
      {/* Background Decorators */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-black/20 rounded-full blur-2xl" />

      <div className="relative z-10 px-8 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl text-center md:text-left space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Jangan Lewatkan Keseruan Berikutnya!
          </h2>
          <p className="text-white/80 text-lg font-medium">
            Simpan event favoritmu dan jadilah yang pertama tahu saat ada acara
            kampus terbaru yang sesuai minatmu.
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="bg-white text-primary hover:bg-gray-50 px-10 py-7 rounded-2xl font-extrabold text-lg shadow-xl hover:scale-105 transition-transform active:scale-95 whitespace-nowrap"
        >
          <Link href="/profile/saved-events">Lihat Event Tersimpan</Link>
        </Button>
      </div>
    </div>
  );
}
