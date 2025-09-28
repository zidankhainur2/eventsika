"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { MdEmail, MdLock, MdPerson, MdSchool } from "react-icons/md";
import { signUpWithRedirect } from "@/app/action";
import Image from "next/image";
import { Select } from "@/components/ui/Select";
import { MAJORS } from "@/lib/constants";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [major, setMajor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      setPasswordError("Password harus memiliki minimal 6 karakter.");
      return;
    }
    setPasswordError(null);

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("full_name", fullName);
    formData.append("major", major);

    const result = await signUpWithRedirect(formData);

    if (result?.error) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-neutral-light">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image
            src="/eventsika-logo.png"
            alt="EventSika Logo"
            width={80}
            height={80}
            className="mx-auto"
          />
          <h1 className="text-4xl font-bold text-primary mt-4">EventSika</h1>
          <p className="text-neutral-dark/70 mt-2">Buat Akun untuk Memulai</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Label htmlFor="full_name">Nama Lengkap</Label>
            <MdPerson className="absolute top-10 left-3 text-gray-400" />
            <Input
              type="text"
              name="full_name"
              id="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-10"
              placeholder="Nama Lengkap Anda"
              required
            />
          </div>
          <div className="relative">
            <Label htmlFor="major">Jurusan</Label>
            <MdSchool className="absolute top-10 left-3 text-gray-400" />
            <Select
              name="major"
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              required
              className="pl-10"
            >
              <option value="" disabled>
                Pilih jurusan...
              </option>
              {MAJORS.map((majorOption) => (
                <option key={majorOption} value={majorOption}>
                  {majorOption}
                </option>
              ))}
            </Select>
          </div>
          <div className="relative">
            <Label htmlFor="email">Email</Label>
            <MdEmail className="absolute top-10 left-3 text-gray-400" />
            <Input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              placeholder="email@address.com"
              required
            />
          </div>
          <div className="relative">
            <Label htmlFor="password">Password (minimal 6 karakter)</Label>
            <MdLock className="absolute top-10 left-3 text-gray-400" />
            <Input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="••••••••"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} variant="accent">
              {isLoading ? "Mendaftar..." : "Daftar"}
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Masuk
            </Link>
          </p>
        </form>
      </Card>
    </main>
  );
}
