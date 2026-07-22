"use client";

import { useState, useCallback, useTransition } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, User, Sparkles, BookOpen, ShieldAlert, BadgeCheck, GraduationCap } from "lucide-react";

import { type Profile } from "@/lib/types";
import { deleteAvatar, updateProfile, signOut } from "@/app/action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MAJORS } from "@/lib/constants";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InterestSelector } from "@/components/InterestSelector";

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="w-full sm:w-auto px-8 bg-[#6C63FF] hover:bg-[#5b52e0] text-white shadow-lg shadow-[#6C63FF]/20 transition-all duration-200"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Menyimpan...
        </span>
      ) : (
        "Simpan Perubahan"
      )}
    </Button>
  );
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const [imagePreview, setImagePreview] = useState<string | null>(
    profile?.avatar_url || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [major, setMajor] = useState<string>(profile?.major || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Parse interests string "A, B" from DB into array ["A", "B"]
  const [interests, setInterests] = useState<string[]>(() => {
    if (!profile?.interests) return [];
    if (typeof profile.interests === 'string') {
      return (profile.interests as string)
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
    }
    return profile.interests;
  });

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateProfile(
        { message: "", type: "success" },
        formData,
      );
      if (result.type === "error") {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      toast.success("Profil Diperbarui!", { description: data.message });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setErrors({});
    },
    onError: (error) => {
      toast.error("Gagal Memperbarui", { description: error.message });
    },
  });

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    const fullName = formData.get("full_name") as string;
    if (!fullName || fullName.trim().length === 0) {
      newErrors.full_name = "Nama lengkap wajib diisi";
    }
    if (!major) {
      newErrors.major = "Jurusan wajib dipilih";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.set("major", major);
    formData.set("interests", interests.join(","));

    if (!validateForm(formData)) {
      toast.error("Validasi Gagal", {
        description: "Mohon lengkapi semua field yang wajib diisi",
      });
      return;
    }

    // Include the updated image file if selected
    if (imageFile) {
      formData.set("avatar_url", imageFile);
    }

    startTransition(async () => {
      mutate(formData);
    });
  };

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File terlalu besar", {
            description: "Ukuran maksimal file adalah 5MB",
          });
          return;
        }

        if (!file.type.startsWith("image/")) {
          toast.error("Format file tidak valid", {
            description: "Mohon pilih file gambar (PNG, JPEG, atau WebP)",
          });
          return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleRemoveImage = useCallback(async () => {
    setImagePreview(null);
    setImageFile(null);
    const fileInput = document.getElementById("avatar_url") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    if (profile?.avatar_url) {
      const result = await deleteAvatar();
      if (result.type === "success") {
        toast.success("Avatar dihapus", { description: result.message });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    }
  }, [profile?.avatar_url, queryClient]);

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await signOut();
      } catch (err: any) {
        if (err && (err.message === "NEXT_REDIRECT" || err.digest?.startsWith("NEXT_REDIRECT"))) {
          return;
        }
        toast.error("Gagal keluar akun");
      }
    });
  };

  // Badge role styles
  const roleStyles: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
    admin: {
      bg: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
      icon: <ShieldAlert className="h-3.5 w-3.5" />,
      label: "Admin Platform",
    },
    super_admin: {
      bg: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
      icon: <ShieldAlert className="h-3.5 w-3.5" />,
      label: "Admin Platform",
    },
    organizer: {
      bg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
      icon: <BadgeCheck className="h-3.5 w-3.5" />,
      label: "Penyelenggara Event",
    },
    student: {
      bg: "bg-violet-50 dark:bg-violet-950/20 text-[#6C63FF] dark:text-[#8881FF] border-[#6C63FF]/20 dark:border-[#6C63FF]/30",
      icon: <GraduationCap className="h-3.5 w-3.5" />,
      label: "Mahasiswa",
    },
    user: {
      bg: "bg-violet-50 dark:bg-violet-950/20 text-[#6C63FF] dark:text-[#8881FF] border-[#6C63FF]/20 dark:border-[#6C63FF]/30",
      icon: <GraduationCap className="h-3.5 w-3.5" />,
      label: "Mahasiswa",
    },
  };

  const userRole = profile?.role || "student";
  const activeRole = roleStyles[userRole] || roleStyles.student;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      
      {/* ─── PROFILE HEADER CARD ─── */}
      <div className="bg-white dark:bg-card border border-stone-200/80 dark:border-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 sm:space-y-0 sm:flex sm:items-center sm:gap-8">
        {/* Avatar Upload Container */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <Avatar className="h-28 w-28 ring-4 ring-[#6C63FF]/10 dark:ring-border/50 shadow-lg group-hover:opacity-90 transition-opacity">
              <AvatarImage
                src={imagePreview || undefined}
                alt="Avatar profil"
                className="object-cover"
              />
              <AvatarFallback className="bg-stone-50 dark:bg-muted text-stone-400 dark:text-muted-foreground">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar_url"
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-medium rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
            >
              Ubah Foto
            </label>
          </div>
          {imagePreview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Hapus Foto
            </button>
          )}
          <input
            id="avatar_url"
            name="avatar_url"
            type="file"
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>

        {/* User Info & Badges */}
        <div className="flex-1 text-center sm:text-left space-y-2.5">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-foreground">
              {profile?.full_name || "Nama Pengguna"}
            </h2>
            <p className="text-sm text-stone-500 dark:text-muted-foreground">
              {profile?.email || "email@kampus.ac.id"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold border rounded-full ${activeRole.bg}`}
            >
              {activeRole.icon}
              {activeRole.label}
            </span>
          </div>
        </div>
      </div>

      {/* ─── PERSONAL & ACADEMIC INFORMATION CARD ─── */}
      <div className="bg-white dark:bg-card border border-stone-200/80 dark:border-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-100 dark:border-border pb-4">
          <BookOpen className="h-5 w-5 text-[#6C63FF]" />
          <h3 className="text-lg font-bold text-stone-900 dark:text-foreground">
            Informasi Akun & Akademik
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name Input */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-semibold text-stone-700 dark:text-muted-foreground">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="full_name"
              id="full_name"
              defaultValue={profile?.full_name || ""}
              required
              aria-invalid={errors.full_name ? "true" : "false"}
              className={`h-11 rounded-xl border-stone-200 dark:border-border focus:ring-[#6C63FF] focus:border-[#6C63FF] ${
                errors.full_name ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              placeholder="Masukkan nama lengkap Anda"
            />
            {errors.full_name && (
              <p className="text-xs text-red-500 font-semibold mt-1">
                {errors.full_name}
              </p>
            )}
          </div>

          {/* Email Input (Disabled/Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-stone-500 dark:text-muted-foreground">
              Alamat Email (Akun)
            </Label>
            <Input
              type="email"
              id="email"
              value={profile?.email || ""}
              disabled
              className="h-11 rounded-xl bg-stone-50 border-stone-200 dark:border-border text-stone-400 dark:text-muted-foreground/60 cursor-not-allowed"
            />
            <p className="text-xs text-stone-400 dark:text-muted-foreground/50">
              Email tidak dapat diubah karena terikat dengan akun login Anda.
            </p>
          </div>

          {/* Program Studi / Major Select */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="major" className="text-sm font-semibold text-stone-700 dark:text-muted-foreground">
              Program Studi / Jurusan <span className="text-red-500">*</span>
            </Label>
            <Select name="major" value={major} onValueChange={setMajor} required>
              <SelectTrigger
                id="major"
                className={`h-11 rounded-xl border-stone-200 dark:border-border ${
                  errors.major ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Pilih program studi Anda..." />
              </SelectTrigger>
              <SelectContent>
                {MAJORS.map((majorOption) => (
                  <SelectItem key={majorOption} value={majorOption}>
                    {majorOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.major && (
              <p className="text-xs text-red-500 font-semibold mt-1">
                {errors.major}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── INTEREST PREFERENCES CARD ─── */}
      <div className="bg-white dark:bg-card border border-stone-200/80 dark:border-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-100 dark:border-border pb-4">
          <Sparkles className="h-5 w-5 text-[#6C63FF]" />
          <h3 className="text-lg font-bold text-stone-900 dark:text-foreground">
            Preferensi Personalisasi
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-stone-700 dark:text-muted-foreground">
              Minat & Topik Favorit
            </Label>
            <p className="text-xs text-stone-400 dark:text-muted-foreground/60">
              Pilih minimal 1 minat (maksimal 5). Pilihan Anda akan menggerakkan Recommendation Engine untuk mencocokkan event yang paling relevan.
            </p>
          </div>

          <InterestSelector
            value={interests}
            onChange={setInterests}
            maxSelections={5}
          />
        </div>
      </div>

      {/* ─── FORM ACTIONS & ACCOUNT ACTIONS ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        {/* Logout Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          disabled={isPending || isSaving}
          className="w-full sm:w-auto px-6 py-5 border-red-200 dark:border-red-950/40 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/15 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 order-last sm:order-first"
        >
          <LogOut className="h-4 w-4" />
          Keluar Akun
        </Button>

        {/* Save/Cancel Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.location.reload()}
            disabled={isPending || isSaving}
            className="w-full sm:w-28 h-11 border border-stone-200 hover:bg-stone-50 rounded-xl"
          >
            Batal
          </Button>
          <SubmitButton isPending={isPending || isSaving} />
        </div>
      </div>

    </form>
  );
}
