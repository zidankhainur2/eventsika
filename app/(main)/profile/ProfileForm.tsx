"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Profile } from "@/lib/types";
import { updateProfile } from "@/app/action";
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

  const [major, setMajor] = useState<string>(profile?.major || "");

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
    },
    onError: (error) => {
      toast.error("Gagal Memperbarui", { description: error.message });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("major", major);
    mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
                  alt="Avatar"
                  fill
                  className="object-cover rounded-full"
                  sizes="80px"
                />
              ) : (
                <svg
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.993A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
          </div>
          <Input
            id="avatar_url"
            name="avatar_url"
            type="file"
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/webp"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
        </div>
      </div>

      <input
        type="hidden"
        name="current_avatar_url"
        defaultValue={profile?.avatar_url || ""}
      />

      <div>
        <Label htmlFor="full_name">Nama Lengkap</Label>
        <Input
          type="text"
          name="full_name"
          id="full_name"
          defaultValue={profile?.full_name || ""}
        />
      </div>
      <div>
        <Label htmlFor="major">Jurusan</Label>
        <Select name="major" value={major} onValueChange={setMajor} required>
          <SelectTrigger id="major">
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
        />
      </div>

      <div>
        <SubmitButton isPending={isPending} />
      </div>
    </form>
  );
}
