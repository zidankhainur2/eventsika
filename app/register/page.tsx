// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { MdEmail, MdLock } from "react-icons/md";
import { signUpWithRedirect } from "@/app/action"; // Kita akan buat action ini

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

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
          <h1 className="text-4xl font-bold text-primary">EventSika</h1>
          <p className="text-neutral-dark/70 mt-2">
            Temukan Semua Event Kampus di Satu Tempat
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
