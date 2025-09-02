// src/app/login/page.tsx
"use client"; // <-- Tandai sebagai Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // <-- Impor client untuk browser

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async () => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      // Arahkan ke halaman utama setelah berhasil daftar & login
      router.push("/");
      router.refresh(); // Refresh untuk memperbarui status header
    }
  };

  const handleSignIn = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <main className="bg-neutral-light min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          EventSika
        </h1>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-dark"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-dark"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleSignIn}
              className="flex-1 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleSignUp}
              className="flex-1 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Daftar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
