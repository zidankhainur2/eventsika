"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Profile } from "@/lib/types";
import { deleteAvatar, updateProfile } from "@/app/action";
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
import { User } from "lucide-react";
// Import komponen InterestSelector
import { InterestSelector } from "@/components/InterestSelector";

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="w-full sm:w-auto px-8"
    >
      {isPending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(
    profile?.avatar_url || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [major, setMajor] = useState<string>(profile?.major || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State untuk menyimpan minat dalam bentuk array
  // Mengonversi string "A, B" dari database menjadi array ["A", "B"]
  const [interests, setInterests] = useState<string[]>(() => {
    if (!profile?.interests) return [];
    return profile.interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  });

  const { mutate, isPending } = useMutation({
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

    // Set field manual ke formData
    formData.set("major", major);
    // Gabungkan array interests menjadi string yang dipisahkan koma
    formData.set("interests", interests.join(","));

    if (!validateForm(formData)) {
      toast.error("Validasi Gagal", {
        description: "Mohon lengkapi semua field yang wajib diisi",
      });
      return;
    }

    mutate(formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      {/* Section: Informasi Pribadi */}
      <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold text-foreground border-b pb-4">
          Informasi Pribadi
        </h2>

        {/* Avatar Upload */}
        <div className="space-y-4">
          <Label htmlFor="avatar_url" className="text-sm font-medium">
            Foto Profil
          </Label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Preview */}
            <Avatar className="h-24 w-24 sm:h-20 sm:w-20 ring-4 ring-background shadow-md">
              <AvatarImage
                src={imagePreview || undefined}
                alt="Avatar profil"
                className="object-cover"
              />
              <AvatarFallback className="bg-muted">
                <User className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            {/* Upload Controls */}
            <div className="flex-1 w-full space-y-3">
              <Input
                id="avatar_url"
                name="avatar_url"
                type="file"
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/webp"
                className="w-full cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                aria-describedby="avatar-description"
              />
              <p
                id="avatar-description"
                className="text-xs text-muted-foreground"
              >
                Format yang didukung: PNG, JPEG atau WebP. Maksimal 5MB.
              </p>
              {imagePreview && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-xs w-full sm:w-auto"
                >
                  Hapus Foto
                </Button>
              )}
            </div>
          </div>
        </div>

        <input
          type="hidden"
          name="current_avatar_url"
          defaultValue={profile?.avatar_url || ""}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium">
              Nama Lengkap <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              name="full_name"
              id="full_name"
              defaultValue={profile?.full_name || ""}
              required
              aria-invalid={errors.full_name ? "true" : "false"}
              aria-describedby={
                errors.full_name ? "full_name-error" : undefined
              }
              className={
                errors.full_name
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              placeholder="Masukkan nama lengkap Anda"
            />
            {errors.full_name && (
              <p
                id="full_name-error"
                className="text-sm text-destructive font-medium"
              >
                {errors.full_name}
              </p>
            )}
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label htmlFor="major" className="text-sm font-medium">
              Jurusan <span className="text-destructive">*</span>
            </Label>
            <Select
              name="major"
              value={major}
              onValueChange={setMajor}
              required
            >
              <SelectTrigger
                id="major"
                aria-invalid={errors.major ? "true" : "false"}
                className={
                  errors.major
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
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
              <p className="text-sm text-destructive font-medium">
                {errors.major}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section: Preferensi Personalisasi */}
      <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold text-foreground border-b pb-4">
          Preferensi Event
        </h2>

        <div className="space-y-4">
          <Label className="text-base font-medium">Minat & Topik Favorit</Label>
          <InterestSelector
            value={interests}
            onChange={setInterests}
            maxSelections={5}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={isPending}
          className="w-full sm:w-32"
        >
          Batal
        </Button>
        <SubmitButton isPending={isPending} />
      </div>
    </form>
  );
}
