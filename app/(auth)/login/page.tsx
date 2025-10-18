"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <main className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
        {/* Kolom Kiri: Form */}
        <div className="p-8 sm:p-14 flex flex-col justify-center">
          <CardHeader className="text-left p-0 mb-8">
            <CardTitle className="font-heading text-4xl font-bold">
              Selamat Datang!
            </CardTitle>
            <CardDescription>Silakan masukkan detail akun Anda</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="npm@student.unsika.ac.id"
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full mt-6">
              {isLoading ? "Memproses..." : "Login"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-8">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Daftar gratis
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Gambar */}
        <div className="relative hidden md:block">
          <Image
            src="/hero-bg-login.png"
            alt="Event background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-10 right-6 p-6 bg-black/30 backdrop-blur-sm rounded-lg">
            <span className="text-white text-xl font-medium leading-relaxed">
              Temukan dan <br />
              bagikan event <br />
              kampus terbaik!
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
