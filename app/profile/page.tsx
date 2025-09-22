// src/app/profile/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { updateUserPreferences } from "../action";
import Link from "next/link";
import { type Profile } from "@/lib/types";

// Fungsi helper untuk mengambil data profil
async function getProfile(
  supabase: ReturnType<typeof createClient>
): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return profile;
}

// Fungsi helper untuk mengecek status aplikasi
async function getApplicationStatus(
  supabase: ReturnType<typeof createClient>
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("organizer_applications")
    .select("status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }
  return data.status;
}

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const profile = await getProfile(supabase);
  const applicationStatus = await getApplicationStatus(supabase);

  return (
    <main className="py-8 sm:py-12">
      <Card className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-primary">Profil Saya</h1>
            <p className="text-gray-600 mt-1">Email: {user.email}</p>
          </div>
          {/* Tampilkan lencana peran */}
          {profile?.role === "organizer" && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
              Organizer
            </span>
          )}
          {profile?.role === "super_admin" && (
            <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
              Super Admin
            </span>
          )}
        </div>

        {/* Bagian untuk pengajuan organizer */}
        {profile?.role === "user" && !applicationStatus && (
          <div className="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <h2 className="font-semibold text-neutral-dark">
              Ingin mempublikasikan event Anda?
            </h2>
            <p className="text-sm text-gray-600 mt-1 mb-3">
              Ajukan diri Anda sebagai organizer untuk mulai membuat event.
            </p>
            <Button
              aschild={true}
              variant="accent"
              className="w-auto px-6 py-2"
            >
              <Link href="/profile/apply-organizer">Ajukan Sekarang</Link>
            </Button>
          </div>
        )}

        {/* Tampilkan status pengajuan jika ada */}
        {applicationStatus === "pending" && (
          <div className="my-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center text-sm">
            <p>
              <strong>Status Pengajuan:</strong> Permohonan Anda sedang
              ditinjau.
            </p>
          </div>
        )}
        {applicationStatus === "rejected" && (
          <div className="my-6 p-4 bg-red-100 text-red-800 rounded-lg text-center text-sm">
            <p>
              <strong>Status Pengajuan:</strong> Mohon maaf, pengajuan Anda
              ditolak.
            </p>
            {/* Opsi untuk mengajukan lagi bisa ditambahkan di sini */}
          </div>
        )}

        <form action={updateUserPreferences} className="space-y-6 mt-6">
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

          <div>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
