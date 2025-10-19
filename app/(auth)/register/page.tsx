"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { signUpWithRedirect } from "@/app/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MAJORS } from "@/lib/constants";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [major, setMajor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      toast.error("Nama Lengkap Wajib Diisi");
      return false;
    }
    if (!major) {
      toast.error("Jurusan Wajib Dipilih");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Format Email Tidak Valid", {
        description: "Pastikan email Anda mengandung '@' dan '.'",
      });
      return false;
    }
    if (password.length < 6) {
      toast.error("Password Terlalu Pendek", {
        description: "Password harus memiliki minimal 6 karakter.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("full_name", fullName);
    formData.append("major", major);

    const result = await signUpWithRedirect(formData);

    if (result?.error) {
      toast.error("Pendaftaran Gagal", {
        description: result.error,
      });
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
              Buat Akun Baru
            </CardTitle>
            <CardDescription>
              Satu langkah lagi menuju dunia event kampus!
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                type="text"
                name="full_name"
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Lengkap Anda"
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="major">Jurusan</Label>
              <Select
                name="major"
                value={major}
                onValueChange={setMajor}
                required
              >
                <SelectTrigger id="major">
                  <SelectValue placeholder="Pilih jurusan..." />
                </SelectTrigger>
                <SelectContent>
                  {MAJORS.map((majorOption) => (
                    <SelectItem key={majorOption} value={majorOption}>
                      {majorOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@student.unsika.ac.id"
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
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full mt-6">
              {isLoading ? "Memproses..." : "Daftar Akun"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-8">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Masuk di sini
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
              Satu platform, <br />
              semua informasi <br />
              event UNSIKA.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
