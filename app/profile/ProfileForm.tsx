"use client";

import { useFormStatus } from "react-dom";
import { type Profile } from "@/lib/types";
import { updateProfile } from "@/app/action";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useActionState, useState } from "react";
import Image from "next/image";
import { MAJORS } from "@/lib/constants";
import { Select } from "@/components/ui/Select";

const initialState = {
  message: "",
  type: "success" as "success" | "error",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useActionState(updateProfile, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(
    profile?.avatar_url || null
  );

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
    <form action={formAction} className="space-y-6 mt-6">
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
        <Select
          name="major"
          id="major"
          defaultValue={profile?.major || ""}
          required
        >
          <option value="" disabled>
            Pilih jurusan...
          </option>
          {MAJORS.map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
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

      {state?.message && (
        <p
          className={`text-sm p-3 rounded-md ${
            state.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
