// src/app/profile/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { updateUserPreferences } from "../action";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <main className="py-8 sm:py-12">
      <Card className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Profil Saya</h1>
        <p className="text-gray-600 mb-6">Email: {user.email}</p>

        <form action={updateUserPreferences} className="space-y-6">
          <div>
            <Label htmlFor="major">Jurusan</Label>
            <Input
              type="text"
              name="major"
              id="major"
              defaultValue={user.user_metadata.major || ""}
            />
          </div>

          <div>
            <Label htmlFor="interests">Minat (pisahkan dengan koma)</Label>
            <Input
              type="text"
              name="interests"
              id="interests"
              defaultValue={user.user_metadata.interests || ""}
              placeholder="Contoh: Programming, Desain, Musik"
            />
          </div>

          <div>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
