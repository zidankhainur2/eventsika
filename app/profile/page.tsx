// app/profile/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { type Profile } from "@/lib/types";
import ProfileForm from "./ProfileForm"; // Impor komponen form baru

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

        {profile?.role === "user" && !applicationStatus && (
          <div className="my-6 p-4 bg-gray-50 rounded-lg text-center">
            <h2 className="font-semibold text-neutral-dark">
              Ingin mempublikasikan event Anda?
            </h2>
            <p className="text-sm text-gray-600 mt-1 mb-3">
              Ajukan diri Anda sebagai organizer untuk mulai membuat event.
            </p>
            <Link
              href="/profile/apply-organizer"
              className="inline-block w-auto px-6 py-2 rounded-lg font-bold transition-colors shadow-md bg-accent hover:bg-yellow-500 text-on-accent disabled:opacity-50"
            >
              Ajukan Sekarang
            </Link>
          </div>
        )}

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
          </div>
        )}

        {/* Panggil komponen form di sini */}
        <ProfileForm profile={profile} />
      </Card>
    </main>
  );
}
