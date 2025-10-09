"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Image from "next/image"; 
import { Button } from "@/components/ui/Button"; 
import { Input } from "@/components/ui/Input"; 

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
    <main className="flex items-center justify-center min-h-screen bg-neutral-light">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Left-side form */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Selamat Datang!</span>
          <span className="font-light text-gray-500 mb-8">
            Silakan masukkan detail akun Anda
          </span>

          <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 text-md font-medium">
                Email
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mt-1"
                placeholder="npm@student.unsika.ac.id"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 text-md font-medium">
                Password
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6"
              variant="primary"
            >
              {isLoading ? "Memproses..." : "Login"}
            </Button>
          </form>

          <div className="text-center text-gray-500 mt-8">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:underline"
            >
              Daftar gratis
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link href="/" className="text-sm text-gray-500 hover:underline">
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Right-side image */}
        <div className="relative">
          <Image
            src="/hero-bg-login.png"
            alt="Event background"
            width={400}
            height={600}
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
            priority
          />
          {/* Overlay text */}
          <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
            <span className="text-white text-xl">
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
