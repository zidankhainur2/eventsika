"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SplashBlobLime, SplashDotBlue, SplashSquareLime } from "@/components/ui/splashes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login Gagal", {
        description: "Email atau password salah. Silakan periksa kembali.",
      });
    } else {
      toast.success("Login Berhasil!", {
        description: "Anda akan diarahkan ke halaman utama.",
      });
      router.push("/");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* Kolom Kiri: Ilustrasi Brand & Background Premium (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E45FB] items-center justify-center p-12 overflow-hidden border-r-2 border-[#0A0A0A]">
        {/* Decorative Splashes */}
        <SplashBlobLime className="absolute -bottom-16 -left-16 w-72 h-72 pointer-events-none z-0" />
        <SplashDotBlue className="absolute top-10 right-10 w-8 h-8 pointer-events-none z-0 fill-white" />
        <SplashSquareLime className="absolute top-1/4 left-10 w-12 h-12 pointer-events-none z-0" />

        <div className="relative z-10 max-w-lg text-white space-y-6">
          {/* Logo Frame */}
          <div className="relative flex items-center justify-center bg-white border-2 border-[#0A0A0A] rounded-2xl p-3 shadow-[4px_4px_0px_#0A0A0A] w-16 h-16 mb-4">
            <Image
              src="/eventsika-logo.png"
              alt="EventSika Logo"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>

          <Link href="/" className="inline-block text-3xl font-extrabold uppercase tracking-tight mb-4 hover:opacity-90 transition-opacity">
            Event<span className="text-[#CDF22B]">Sika</span>
          </Link>
          <h1 className="text-4xl font-extrabold uppercase leading-none tracking-tight">
            TEMUKAN EVENT KAMPUSMU.
          </h1>
          <p className="text-lg text-white/90 leading-relaxed font-semibold">
            Semua kegiatan kemahasiswaan UNSIKA, satu platform. Tingkatkan kompetensi dan perluas relasi.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Logo Mobile */}
            <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-6 hover:opacity-90 transition-opacity">
              <Image
                src="/eventsika-logo.png"
                alt="EventSika Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="text-3xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                Event<span className="text-[#1E45FB]">Sika</span>
              </span>
            </Link>
            <h2 className="text-3xl font-extrabold text-[#0A0A0A] uppercase tracking-tight">MASUK</h2>
            <p className="mt-2 text-[#6B6B6B] font-medium">Silakan masukkan detail akun Anda</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-extrabold uppercase text-xs tracking-wider text-[#0A0A0A]">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="npm@student.unsika.ac.id"
                required
                className="h-12 border-2 border-[#0A0A0A] focus-visible:ring-2 focus-visible:ring-[#1E45FB] rounded-lg text-sm font-semibold"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="font-extrabold uppercase text-xs tracking-wider text-[#0A0A0A]">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 border-2 border-[#0A0A0A] focus-visible:ring-2 focus-visible:ring-[#1E45FB] rounded-lg text-sm font-semibold"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="w-full h-12 text-base font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-[#6B6B6B] font-semibold">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-[#1E45FB] hover:underline">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
