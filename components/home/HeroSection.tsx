'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { SplashBlobBlue, SplashBlobLime, SplashDotBlue } from "@/components/ui/splashes";

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query)}`);
    }
  };

  const categories = ["Seminar", "Workshop", "Kompetisi", "Webinar", "Sosial"];

  return (
    <section className="relative w-full bg-white py-16 md:py-24 flex items-center justify-center overflow-hidden border-b-2 border-[#0A0A0A]">
      {/* Decorative Splashes — absolute, pointer-events-none */}
      <SplashBlobBlue className="absolute -top-20 -right-20 w-96 h-96 pointer-events-none z-0 animate-pulse" />
      <SplashBlobLime className="absolute -bottom-16 -left-16 w-72 h-72 pointer-events-none z-0" />
      <SplashDotBlue className="absolute top-10 left-1/3 w-8 h-8 pointer-events-none z-0" />

      <div className="container relative z-10 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* KIRI: Text & Search Bar */}
        <div className="lg:col-span-7 text-left flex flex-col items-start space-y-6">
          {/* Logo / Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#0A0A0A] bg-[#CDF22B] text-[#0A0A0A] font-extrabold text-xs uppercase tracking-wider">
            🎉 EKSLUSIF MAHASISWA UNSIKA
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-none text-[#0A0A0A]">
            TEMUKAN<br />
            <span className="text-[#1E45FB]">EVENT</span> KAMPUSMU
          </h1>
          
          <p className="text-base md:text-lg text-[#6B6B6B] max-w-xl font-medium leading-relaxed">
            Platform kegiatan kemahasiswaan UNSIKA. Semua info event kampus dalam satu platform. Tingkatkan kompetensi dan perluas relasi.
          </p>
          
          {/* SearchBar Besar */}
          <form 
            onSubmit={handleSearch} 
            className="w-full max-w-2xl flex flex-col sm:flex-row items-stretch gap-3 pt-2"
          >
            <div className="flex-1 flex items-center bg-white border-2 border-[#0A0A0A] rounded-xl px-4 py-2 shadow-[4px_4px_0px_#0A0A0A] focus-within:translate-x-[2px] focus-within:translate-y-[2px] focus-within:shadow-[2px_2px_0px_#0A0A0A] transition-all">
              <Search className="h-5 w-5 text-[#0A0A0A] shrink-0" aria-hidden="true" />
              <Input 
                type="text" 
                placeholder="Cari event, workshop, seminar..." 
                className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[#0A0A0A] px-3 py-1 h-10 text-base font-semibold"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Cari event"
              />
            </div>
            <Button 
              type="submit" 
              variant="primary"
              className="h-12 sm:h-auto px-6 py-3 shrink-0"
            >
              CARI SEKARANG
            </Button>
          </form>

          {/* Quick Categories */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <Link key={cat} href={`/explore?category=${encodeURIComponent(cat)}`}>
                <Badge variant="lime" className="cursor-pointer">
                  {cat}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* KANAN: Hero Illustration / Image Mockup */}
        <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] flex items-center justify-center">
          <div className="absolute w-72 h-72 bg-[#CDF22B]/20 blur-[80px] -z-10 rounded-full" />
          <div className="relative w-full max-w-sm border-2 border-[#0A0A0A] rounded-2xl shadow-[6px_6px_0px_#0A0A0A] overflow-hidden bg-white aspect-[4/3] transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <Image
              src="/hero-vector.png"
              alt="EventSika Hero"
              fill
              className="object-cover"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
}