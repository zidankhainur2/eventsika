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

export default function RecommendationTestPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // 1. Ambil daftar semua profil untuk dropdown
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery<Profile[]>({
    queryKey: ["allProfiles"],
    queryFn: getAllProfiles,
  });

  // 2. Siapkan mutation untuk menjalankan tes
  const {
    mutate: runTest,
    data: testResult,
    isPending: isRunningTest,
    isIdle,
  } = useMutation<RecommendationTestResult, Error, string>({
    mutationFn: (userId: string) =>
      runRecommendationTest(userId) as Promise<RecommendationTestResult>,
    onError: (error) => {
      toast.error("Test Gagal", { description: error.message });
    },
    onSuccess: () => {
      toast.success("Test Berhasil Dijalankan!");
    },
  });

  const handleRunTest = () => {
    if (!selectedUserId) {
      toast.warning("Pilih Pengguna", {
        description: "Anda harus memilih pengguna untuk diuji.",
      });
      return;
    }
    runTest(selectedUserId);
  };

  const formatScore = (num: number) => {
    return num.toFixed(3); 
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Uji Algoritma Rekomendasi
        </h1>
        <p className="text-muted-foreground">
          Pilih pengguna untuk mensimulasikan hasil rekomendasi berbasis vektor.
        </p>
      </div>

      {/* --- Bagian Kontrol --- */}
      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 items-end">
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
                    {profile.full_name || "Tanpa Nama"}
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
        </CardContent>
      </Card>

      {/* --- Bagian Hasil --- */}
      {!isIdle && !isRunningTest && testResult && (
        <Card>
          <CardHeader>
            <CardTitle>
              Hasil Tes untuk: {testResult.profile?.full_name || "N/A"}
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-x-4">
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
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResult.recommendations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Peringkat</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Skor Jurusan</TableHead>
                    <TableHead>Skor Vektor</TableHead>
                    <TableHead>Skor Total</TableHead>
                    <TableHead>Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResult.recommendations.map((event, index) => (
                    <TableRow key={event.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-mono",
                          event.major_score > 0
                            ? "font-bold text-green-600"
                            : "text-muted-foreground"
                        )}
                      >
                        +{formatScore(event.major_score)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-mono",
                          event.vector_score > 0.4
                            ? "font-bold text-blue-600"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatScore(event.vector_score)}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-lg">
                        {formatScore(event.total_score)}
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
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">
                Tidak ada rekomendasi yang ditemukan.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
