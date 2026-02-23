"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiPlay, FiLoader } from "react-icons/fi";

import { type Profile, type RecommendationTestResult } from "@/lib/types";
import { runRecommendationTest } from "@/app/action";
import { getAllProfiles } from "@/lib/queries";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Definisi Skenario Pengujian
const SCENARIOS = [
  {
    id: 1,
    label: "Skenario 1 (1.0 : 0.0)",
    desc: "Murni Semantik",
    semantic: 1.0,
    rule: 0.0,
  },
  {
    id: 2,
    label: "Skenario 2 (0.8 : 0.2)",
    desc: "Dominan Semantik",
    semantic: 0.8,
    rule: 0.2,
  },
  {
    id: 3,
    label: "Skenario 3 (0.5 : 0.5)",
    desc: "Seimbang",
    semantic: 0.5,
    rule: 0.5,
  },
  {
    id: 4,
    label: "Skenario 4 (0.2 : 0.8)",
    desc: "Dominan Jurusan",
    semantic: 0.2,
    rule: 0.8,
  },
  {
    id: 5,
    label: "Skenario 5 (0.0 : 1.0)",
    desc: "Murni Jurusan",
    semantic: 0.0,
    rule: 1.0,
  },
];

export default function RecommendationTestPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[2]); // Default Skenario 3

  // 1. Ambil daftar semua profil untuk dropdown
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery<Profile[]>({
    queryKey: ["allProfiles"],
    queryFn: getAllProfiles,
  });

  // 2. Siapkan mutation untuk menjalankan tes dengan parameter tambahan (bobot)
  const {
    mutate: runTest,
    data: testResult,
    isPending: isRunningTest,
    isIdle,
  } = useMutation<
    RecommendationTestResult,
    Error,
    { userId: string; weightSemantic: number; weightRule: number }
  >({
    mutationFn: ({ userId, weightSemantic, weightRule }) =>
      runRecommendationTest(
        userId,
        weightSemantic,
        weightRule,
      ) as Promise<RecommendationTestResult>,
    onError: (error) => {
      toast.error("Test Gagal", { description: error.message });
    },
    onSuccess: () => {
      toast.success(`Test Berhasil (${activeScenario.label})!`);
    },
  });

  const handleRunTest = () => {
    if (!selectedUserId) {
      toast.warning("Pilih Pengguna", {
        description: "Anda harus memilih pengguna untuk diuji.",
      });
      return;
    }
    // Kirimkan userId beserta bobot dari skenario yang sedang aktif
    runTest({
      userId: selectedUserId,
      weightSemantic: activeScenario.semantic,
      weightRule: activeScenario.rule,
    });
  };

  const formatScore = (num?: number) => {
    // Jika num adalah undefined, null, atau bukan angka, kembalikan "0.000"
    if (num === undefined || num === null || isNaN(num)) {
      return "0.000";
    }
    return num.toFixed(3);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Uji Algoritma Rekomendasi
        </h1>
        <p className="text-muted-foreground">
          Pilih pengguna dan skenario pembobotan untuk mensimulasikan hasil
          rekomendasi.
        </p>
      </div>

      {/* --- Bagian Kontrol --- */}
      <Card>
        <CardContent className="pt-6 flex flex-col gap-6">
          {/* Skenario Selection */}
          <div className="space-y-3">
            <Label>Pilih Skenario (Bobot Vektor : Bobot Jurusan)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {SCENARIOS.map((scenario) => (
                <Button
                  key={scenario.id}
                  variant={
                    activeScenario.id === scenario.id ? "default" : "outline"
                  }
                  onClick={() => setActiveScenario(scenario)}
                  className="flex flex-col h-auto items-start p-3 gap-1"
                >
                  <span className="font-semibold">{scenario.label}</span>
                  <span className="text-xs opacity-80 font-normal">
                    {scenario.desc}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Label htmlFor="user-select">Pilih Pengguna</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user-select">
                  <SelectValue
                    placeholder={
                      isLoadingProfiles ? "Memuat..." : "Pilih pengguna..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {profiles?.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.full_name || "Tanpa Nama"}{" "}
                      <span className="text-muted-foreground text-xs ml-2">
                        ({profile.major || "Tanpa Jurusan"})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleRunTest}
              disabled={isRunningTest || !selectedUserId}
              className="w-full sm:w-auto"
            >
              {isRunningTest ? (
                <FiLoader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FiPlay className="mr-2 h-4 w-4" />
              )}
              Jalankan Tes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Bagian Hasil --- */}
      {!isIdle && !isRunningTest && testResult && (
        <Card>
          <CardHeader>
            <CardTitle>
              Hasil Tes untuk: {testResult.profile?.full_name || "N/A"}
            </CardTitle>
            <CardDescription className="flex flex-col gap-2 mt-2">
              <div className="flex flex-wrap gap-x-4">
                <span>
                  Minat:{" "}
                  <span className="font-medium text-primary">
                    {testResult.profile?.interests || "Tidak ada"}
                  </span>
                </span>
                <span>
                  Jurusan:{" "}
                  <span className="font-medium text-primary">
                    {testResult.profile?.major || "Tidak ada"}
                  </span>
                </span>
              </div>
              <div className="text-sm font-semibold text-muted-foreground bg-muted p-2 rounded-md inline-block w-fit mt-2">
                Skenario yang diterapkan: {activeScenario.label} (Semantik:{" "}
                {activeScenario.semantic}, Jurusan: {activeScenario.rule})
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResult.recommendations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Peringkat</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>
                      Skor Vektor (x{activeScenario.semantic})
                    </TableHead>
                    <TableHead>Skor Jurusan (x{activeScenario.rule})</TableHead>
                    <TableHead>Skor Total</TableHead>
                    <TableHead>Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResult.recommendations.map((event, index) => {
                    // Kalkulasi ulang sementara untuk tampilan jika belum didukung backend
                    // Jika total_score sudah dari backend, bagian ini bisa diabaikan
                    const appliedVectorScore =
                      event.vector_score * activeScenario.semantic;
                    const appliedMajorScore =
                      event.major_score * activeScenario.rule;
                    const displayTotal = appliedVectorScore + appliedMajorScore;

                    return (
                      <TableRow key={event.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {event.title}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {event.category} -{" "}
                            {event.target_majors?.[0] || "Umum"}
                          </span>
                        </TableCell>
                        <TableCell
                          className={cn(
                            "font-mono",
                            event.vector_score > 0.4
                              ? "font-bold text-blue-600"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatScore(event.vector_score)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "font-mono",
                            event.major_score > 0
                              ? "font-bold text-green-600"
                              : "text-muted-foreground",
                          )}
                        >
                          +{formatScore(event.major_score)}
                        </TableCell>
                        <TableCell className="font-mono font-bold text-lg text-primary">
                          {formatScore(displayTotal)}
                        </TableCell>
                        <TableCell className="flex flex-wrap gap-1 max-w-xs">
                          {event.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          )) || (
                            <span className="text-xs text-muted-foreground">
                              No Tags
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                Tidak ada rekomendasi yang ditemukan. Pastikan data event cukup.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
