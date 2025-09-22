// app/profile/ProfileForm.tsx
"use client";

import { useFormStatus } from "react-dom";
import { type Profile } from "@/lib/types";
import { updateUserPreferences } from "@/app/action";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useActionState } from "react";

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
  const [state, formAction] = useActionState(
    updateUserPreferences,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6 mt-6">
      <h2 className="text-xl font-semibold text-primary border-b pb-2">
        Preferensi Personalisasi
      </h2>
      <div>
        <Label htmlFor="major">Jurusan</Label>
        <Input
          type="text"
          name="major"
          id="major"
          defaultValue={profile?.major || ""}
        />
      </div>

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
