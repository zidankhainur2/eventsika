"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiPlay, FiLoader, FiDownload, FiDatabase } from "react-icons/fi";

import { type Profile, type RecommendationTestResult } from "@/lib/types";
import { runRecommendationTest, bulkExportRecommendations } from "@/app/action";
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

// ── Konstanta skenario ────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: 1,
    label: "S1 (1.0 : 0.0)",
    desc: "Pure Semantic",
    semantic: 1.0,
    rule: 0.0,
  },
  {
    id: 2,
    label: "S2 (0.8 : 0.2)",
    desc: "Dominant Semantic",
    semantic: 0.8,
    rule: 0.2,
  },
  {
    id: 3,
    label: "S3 (0.5 : 0.5)",
    desc: "Balanced",
    semantic: 0.5,
    rule: 0.5,
  },
  {
    id: 4,
    label: "S4 (0.2 : 0.8)",
    desc: "Dominant Rule-Based",
    semantic: 0.2,
    rule: 0.8,
  },
  {
    id: 5,
    label: "S5 (0.0 : 1.0)",
    desc: "Pure Rule-Based",
    semantic: 0.0,
    rule: 1.0,
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────

const fmt = (n?: number) => (n == null || isNaN(n) ? "0.000" : n.toFixed(3));

// ── Komponen utama ────────────────────────────────────────────────────────────

export default function RecommendationTestPage() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[2]);
  const [testResult, setTestResult] = useState<RecommendationTestResult | null>(
    null,
  );
  const [isBulkExporting, setIsBulkExporting] = useState(false);

  // ── Query: semua profil ─────────────────────────────────────────────────────

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery<Profile[]>({
    queryKey: ["allProfiles"],
    queryFn: getAllProfiles,
  });

  // ── Mutation: uji satu user + satu skenario ─────────────────────────────────

  const { mutate: runTest, isPending } = useMutation({
    mutationFn: () =>
      runRecommendationTest(
        selectedUserId,
        activeScenario.semantic,
        activeScenario.rule,
      ) as Promise<RecommendationTestResult>,
    onSuccess: (data) => {
      setTestResult(data);
      toast.success(`Selesai — ${data.recommendations.length} event ditemukan`);
    },
    onError: (e) =>
      toast.error("Test gagal", { description: (e as Error).message }),
  });

  // ── Handler: jalankan uji per-user ──────────────────────────────────────────

  const handleRun = () => {
    if (!selectedUserId) {
      toast.warning("Pilih pengguna terlebih dahulu.");
      return;
    }
    runTest();
  };

  // ── Handler: export CSV per-user (skenario aktif) ───────────────────────────

  const handleExportSingle = () => {
    if (!testResult?.recommendations.length) return;

    const header =
      "rank,id,title,category,vector_score,major_score,tag_score,rule_score,total_score";
    const rows = testResult.recommendations.map((r, i) =>
      [
        i + 1,
        r.id,
        `"${r.title.replace(/"/g, '""')}"`,
        r.category ?? "",
        fmt(r.vector_score),
        fmt(r.major_score),
        fmt(r.tag_score),
        fmt(r.rule_score),
        fmt(r.total_score),
      ].join(","),
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hasil_${activeScenario.label.replace(/[^a-z0-9]/gi, "_")}_${selectedUserId.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Handler: bulk export semua user × semua skenario ───────────────────────

  const handleBulkExport = async () => {
    setIsBulkExporting(true);
    toast.info("Memulai bulk export...", {
      description:
        "Proses ini mungkin memakan waktu 5–15 menit tergantung jumlah user. Jangan tutup halaman ini.",
      duration: 10000,
    });

    try {
      const csv = await bulkExportRecommendations();

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bulk_export_semua_skenario_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Bulk export selesai!", {
        description: "File CSV berhasil diunduh.",
      });
    } catch (e) {
      toast.error("Bulk export gagal", {
        description: (e as Error).message,
      });
    } finally {
      setIsBulkExporting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Judul halaman */}
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Uji Algoritma Rekomendasi
        </h1>
        <p className="text-muted-foreground">
          Simulasi 5 skenario pembobotan weighted hybrid. Skor komponen
          ditampilkan secara transparan.
        </p>
      </div>

      {/* ── Panel kontrol ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pengujian Per-User</CardTitle>
          <CardDescription>
            Pilih skenario dan pengguna, lalu jalankan untuk melihat hasil
            rekomendasi secara individual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pilih skenario */}
          <div className="space-y-2">
            <Label>Skenario Pembobotan (α : β)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {SCENARIOS.map((s) => (
                <Button
                  key={s.id}
                  variant={activeScenario.id === s.id ? "default" : "outline"}
                  onClick={() => setActiveScenario(s)}
                  className="flex flex-col h-auto items-center p-3 gap-1"
                >
                  <span className="font-semibold text-sm">{s.label}</span>
                  <span className="text-xs opacity-70">{s.desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Pilih user + tombol jalankan */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
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
                  {profiles?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.full_name || "Tanpa Nama"}{" "}
                      <span className="text-muted-foreground text-xs ml-1">
                        ({p.major || "Tanpa Jurusan"})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleRun}
                disabled={isPending || !selectedUserId}
              >
                {isPending ? (
                  <FiLoader className="mr-2 animate-spin" />
                ) : (
                  <FiPlay className="mr-2" />
                )}
                Jalankan
              </Button>

              {/* Export CSV untuk hasil per-user yang sedang ditampilkan */}
              {testResult && !isPending && (
                <Button variant="outline" onClick={handleExportSingle}>
                  <FiDownload className="mr-2" />
                  Export CSV
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Panel bulk export ── */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FiDatabase className="h-4 w-4 text-primary" />
            Bulk Export untuk Evaluasi Python
          </CardTitle>
          <CardDescription>
            Export rekomendasi <strong>semua user × semua 5 skenario</strong>{" "}
            sekaligus dalam satu file CSV. Gunakan file ini sebagai input script
            evaluasi Python. Proses mungkin memakan waktu 5–15 menit — jalankan
            dari localhost, bukan dari Vercel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                Format output:{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  user_id, full_name, major, scenario, rank, event_id, title,
                  vector_score, rule_score, total_score
                </code>
              </p>
              <p>Jangan tutup halaman selama proses berlangsung.</p>
            </div>
            <Button
              onClick={handleBulkExport}
              disabled={isBulkExporting}
              className="shrink-0"
            >
              {isBulkExporting ? (
                <>
                  <FiLoader className="mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <FiDatabase className="mr-2" />
                  Bulk Export Semua Skenario
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Tabel hasil per-user ── */}
      {testResult && !isPending && (
        <Card>
          <CardHeader>
            <CardTitle>
              Hasil: {testResult.profile?.full_name || "N/A"} —{" "}
              <span className="text-primary">{activeScenario.label}</span>
            </CardTitle>
            <CardDescription>
              Jurusan: <strong>{testResult.profile?.major || "-"}</strong> |
              Minat: <strong>{testResult.profile?.interests || "-"}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResult.recommendations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Tidak ada rekomendasi. Coba turunkan threshold atau periksa
                profil pengguna.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-center">S_semantic</TableHead>
                      <TableHead className="text-center">S_major</TableHead>
                      <TableHead className="text-center">S_tag</TableHead>
                      <TableHead className="text-center">S_rule</TableHead>
                      <TableHead className="text-center font-bold">
                        S_total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResult.recommendations.map((r, i) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.category} · {r.target_majors?.[0] || "Umum"}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {r.tags?.map((t) => (
                              <Badge
                                key={t}
                                variant="secondary"
                                className="text-xs"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>

                        {/* Semantic score */}
                        <TableCell
                          className={cn(
                            "text-center font-mono text-sm",
                            (r.vector_score ?? 0) > 0.5
                              ? "text-blue-600 font-bold"
                              : "text-muted-foreground",
                          )}
                        >
                          {fmt(r.vector_score)}
                        </TableCell>

                        {/* Major score */}
                        <TableCell
                          className={cn(
                            "text-center font-mono text-sm",
                            (r.major_score ?? 0) >= 1
                              ? "text-green-600 font-bold"
                              : (r.major_score ?? 0) === 0.5
                                ? "text-yellow-600"
                                : "text-muted-foreground",
                          )}
                        >
                          {fmt(r.major_score)}
                        </TableCell>

                        {/* Tag score */}
                        <TableCell
                          className={cn(
                            "text-center font-mono text-sm",
                            (r.tag_score ?? 0) > 0
                              ? "text-purple-600 font-bold"
                              : "text-muted-foreground",
                          )}
                        >
                          {fmt(r.tag_score)}
                        </TableCell>

                        {/* Rule score */}
                        <TableCell className="text-center font-mono text-sm text-orange-600">
                          {fmt(r.rule_score)}
                        </TableCell>

                        {/* Total score */}
                        <TableCell className="text-center font-mono font-bold text-lg text-primary">
                          {fmt(r.total_score)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
