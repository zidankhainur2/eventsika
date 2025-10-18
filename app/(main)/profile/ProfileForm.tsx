"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
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

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(
    profile?.avatar_url || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [major, setMajor] = useState<string>(profile?.major || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateProfile(
        { message: "", type: "success" },
        formData
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
        // Validasi ukuran file (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File terlalu besar", {
            description: "Ukuran maksimal file adalah 5MB",
          });
          return;
        }

        // Validasi tipe file
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
    []
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
  }, [profile?.avatar_url]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 -mt-4">
      <h2 className="text-xl font-semibold text-primary border-b pb-2">
        Informasi Pribadi
      </h2>

      <div>
        <Label htmlFor="avatar_url">Foto Profil</Label>
        <div className="mt-1 flex items-center gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <div className="h-full w-full rounded-full overflow-hidden bg-gray-100">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Avatar profil"
                  fill
                  className="object-cover rounded-full"
                  sizes="80px"
                  priority={false}
                />
              ) : (
                <svg
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Avatar placeholder"
                >
                  <path d="M24 20.993V24H0v-2.993A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <Input
              id="avatar_url"
              name="avatar_url"
              type="file"
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/webp"
              className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary file:cursor-pointer hover:file:bg-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-colors"
              aria-describedby="avatar-description"
            />
            <p
              id="avatar-description"
              className="text-xs text-muted-foreground"
            >
              PNG, JPEG atau WebP. Maksimal 5MB.
            </p>
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="text-xs"
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

      <div>
        <Label htmlFor="full_name">
          Nama Lengkap <span className="text-destructive">*</span>
        </Label>
        <Input
          type="text"
          name="full_name"
          id="full_name"
          defaultValue={profile?.full_name || ""}
          required
          aria-invalid={errors.full_name ? "true" : "false"}
          aria-describedby={errors.full_name ? "full_name-error" : undefined}
          className={errors.full_name ? "border-destructive" : ""}
        />
        {errors.full_name && (
          <p id="full_name-error" className="text-sm text-destructive mt-1">
            {errors.full_name}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="major">
          Jurusan <span className="text-destructive">*</span>
        </Label>
        <Select name="major" value={major} onValueChange={setMajor} required>
          <SelectTrigger
            id="major"
            aria-invalid={errors.major ? "true" : "false"}
            className={errors.major ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Pilih jurusan..." />
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
          <p className="text-sm text-destructive mt-1">{errors.major}</p>
        )}
      </div>

      <h2 className="text-xl font-semibold text-primary border-b pb-2 pt-4">
        Preferensi Personalisasi
      </h2>

      <div>
        <Label htmlFor="interests">Minat (pisahkan dengan koma)</Label>
        <Input
          type="text"
          name="interests"
          id="interests"
          defaultValue={profile?.interests || ""}
          placeholder="Contoh: Programming, Desain, Musik"
          aria-describedby="interests-description"
        />
        <p
          id="interests-description"
          className="text-xs text-muted-foreground mt-1"
        >
          Tambahkan minat Anda untuk rekomendasi konten yang lebih personal
        </p>
      </div>

      <div className="flex gap-2">
        <SubmitButton isPending={isPending} />
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={isPending}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
