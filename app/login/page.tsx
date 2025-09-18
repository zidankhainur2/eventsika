// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { MdEmail, MdLock } from "react-icons/md";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuthAction = async (action: "signUp" | "signIn") => {
    setIsLoading(true);
    setError(null);

    const { error } =
      action === "signIn"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 to-neutral-light">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">EventSika</h1>
          <p className="text-neutral-dark/70 mt-2">Selamat datang kembali!</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
            />
          </div>
          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <MdLock className="absolute top-10 left-3 text-gray-400" />
            <Input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={() => handleAuthAction("signIn")}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
            <Button
              onClick={() => handleAuthAction("signUp")}
              disabled={isLoading}
              variant="accent"
            >
              {isLoading ? "Loading..." : "Daftar"}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
