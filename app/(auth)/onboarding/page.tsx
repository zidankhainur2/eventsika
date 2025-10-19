// zidankhainur2/eventsika/eventsika-ee9c3bd32c06e421ca764b3a68afba6c029dad58/app/(auth)/onboarding/page.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveUserInterests } from "@/app/action";
import { CheckCircle2, Sparkles } from "lucide-react";
import { INTEREST_OPTIONS } from "@/lib/constants"; // Kita akan import dari sini

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

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("interests", selectedInterests.join(","));

    startTransition(async () => {
      const result = await saveUserInterests(formData);
      if (result?.error) {
        alert(result.error);
      } else {
        router.push("/");
      }
    });
  };

  const isSubmitDisabled = selectedInterests.length < MIN_INTERESTS;
  const progress = Math.min(
    (selectedInterests.length / MIN_INTERESTS) * 100,
    100
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-3">
            Halo! Apa saja minatmu?
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Pilih minimal{" "}
            <span className="font-semibold text-primary">
              {MIN_INTERESTS} minat
            </span>{" "}
            agar kami bisa memberimu rekomendasi terbaik
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 px-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedInterests.length} dari {MIN_INTERESTS} dipilih
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card Section */}
        <Card className="p-6 md:p-10 shadow-xl border-border">
          {/* Interest Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            {INTEREST_OPTIONS.map(({ label, emoji }) => {
              const isSelected = selectedInterests.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleInterestToggle(label)}
                  className={`relative group p-4 md:p-5 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 active:scale-95
                    ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-muted hover:bg-secondary text-foreground border-2 border-border hover:border-primary/50"
                    }`}
                >
                  {/* Checkmark */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl md:text-4xl">{emoji}</span>
                    <span className="text-sm md:text-base font-semibold leading-tight">
                      {label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Section */}
          <div className="flex flex-col items-center gap-4">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitDisabled || isPending}
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-lg font-semibold rounded-xl"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Selesai & Mulai Eksplorasi
                </span>
              )}
            </Button>

            {/* Error Message */}
            {isSubmitDisabled && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <p className="text-orange-600 font-medium">
                  Pilih {MIN_INTERESTS - selectedInterests.length} minat lagi
                  untuk melanjutkan
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Kamu bisa mengubah minat ini kapan saja di pengaturan
        </p>
      </div>
    </main>
  );
}
