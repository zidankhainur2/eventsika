// app/onboarding/page.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { saveUserInterests } from "@/app/action"; // Action yang akan kita buat

// Daftar minat yang bisa dipilih
const INTEREST_OPTIONS = [
  "Teknologi",
  "Musik",
  "Olahraga",
  "Seni",
  "Bisnis",
  "Debat",
  "Fotografi",
  "Gaming",
  "Menulis",
  "Film",
  "Sosial",
  "Keagamaan",
];

const MIN_INTERESTS = 3;

export default function OnboardingPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await saveUserInterests(formData);
      if (result?.error) {
        // Di aplikasi nyata, Anda bisa menampilkan pesan error
        alert(result.error);
      } else {
        // Jika sukses, Supabase akan redirect, tapi kita beri fallback
        router.push("/");
      }
    });
  };

  const isSubmitDisabled = selectedInterests.length < MIN_INTERESTS;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-neutral-light">
      <Card className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-primary">
          Halo! Apa saja minatmu?
        </h1>
        <p className="text-neutral-dark/70 mt-2 mb-8">
          Pilih minimal {MIN_INTERESTS} agar kami bisa memberimu rekomendasi
          terbaik.
        </p>

        <form action={handleSubmit}>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200
                    ${
                      isSelected
                        ? "bg-primary text-white shadow-md"
                        : "bg-gray-100 text-neutral-dark hover:bg-gray-200"
                    }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>

          {/* Hidden input untuk mengirim data ke server action */}
          <input
            type="hidden"
            name="interests"
            value={selectedInterests.join(",")}
          />

          <Button
            type="submit"
            disabled={isSubmitDisabled || isPending}
            className="w-full sm:w-auto px-10 mx-auto"
          >
            {isPending ? "Menyimpan..." : "Selesai & Mulai Eksplorasi"}
          </Button>

          {isSubmitDisabled && (
            <p className="text-xs text-red-500 mt-3">
              Pilih {MIN_INTERESTS - selectedInterests.length} lagi
            </p>
          )}
        </form>
      </Card>
    </main>
  );
}
