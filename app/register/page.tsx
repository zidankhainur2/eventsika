"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { signUpWithRedirect } from "@/app/action";
import Image from "next/image";
import { MAJORS } from "@/lib/constants";
import { toast } from "sonner";

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
    <main className="flex items-center justify-center min-h-screen bg-neutral-light">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Left-side form */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Buat Akun Baru</span>
          <span className="font-light text-gray-500 mb-8">
            Satu langkah lagi menuju dunia event kampus!
          </span>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="full_name" className="mb-2 text-md font-medium">
                Nama Lengkap
              </label>
              <Input
                type="text"
                name="full_name"
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 mt-1"
                placeholder="Nama Lengkap Anda"
                required
              />
            </div>
            <div>
              <label htmlFor="major" className="mb-2 text-md font-medium">
                Jurusan
              </label>
              <Select
                name="major"
                id="major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
                className="w-full p-2 mt-1"
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
                placeholder="email@student.unsika.ac.id"
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
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6"
              variant="accent"
            >
              {isLoading ? "Memproses..." : "Daftar Akun"}
            </Button>
          </form>

          <div className="text-center text-gray-500 mt-8">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:underline"
            >
              Masuk di sini
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
          <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
            <span className="text-white text-xl">
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
