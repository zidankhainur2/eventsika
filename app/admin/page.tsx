// app/admin/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ApplicationActions } from "./ApplicationActions";


// Tipe data untuk pengajuan, termasuk informasi dari profil
type ApplicationWithProfile = {
  id: string;
  organization_name: string;
  contact_person: string;
  created_at: string;
  profiles: {
    id: string;
    email: string; // Kita perlu email untuk ditampilkan
  } | null;
};

// Fungsi untuk mengambil data pengajuan yang pending
async function getPendingApplications(
  supabase: ReturnType<typeof createClient>
) {
  const { data, error } = await supabase
    .from("organizer_applications")
    .select(
      `
      id,
      organization_name,
      contact_person,
      created_at,
      profiles (
        id,
        email
      )
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }

  // Ambil juga email dari auth.users karena belum ada di profiles
  const applications = await Promise.all(
    data.map(async (app) => {
      if (!app.profiles) {
        const {
          data: { user },
        } = await supabase.auth.admin.getUserById(app.id);
        return {
          ...app,
          profiles: { id: app.id, email: user?.email || "N/A" },
        };
      }
      return app;
    })
  );

  return applications as ApplicationWithProfile[];
}

export default async function AdminDashboardPage() {
  const supabase = createClient();

  // 1. Cek otentikasi pengguna
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // 2. Cek peran pengguna
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
    // Jika bukan super_admin, tendang ke halaman utama
    return redirect("/");
  }

  const applications = await getPendingApplications(supabase);

  return (
    <main className="py-8 sm:py-12">
      <Card className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Dashboard Admin
        </h1>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Pengajuan Organizer Tertunda
        </h2>

        {applications.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-md">
            Tidak ada pengajuan yang perlu ditinjau saat ini.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <p className="font-bold text-lg text-neutral-dark">
                    {app.organization_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {app.profiles?.email ?? "Tidak tersedia"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Kontak: {app.contact_person}
                  </p>
                </div>
                {/* Komponen Aksi terpisah */}
                <ApplicationActions
                  applicationId={app.id}
                  userId={app.profiles?.id ?? ""}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}
