// app/admin/page.tsx
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ApplicationActions } from "./ApplicationActions";

type ApplicationWithEmail = {
  id: string; // id dari pengajuan
  user_id: string;
  organization_name: string;
  contact_person: string;
  created_at: string;
  email: string;
};

async function getPendingApplications(): Promise<ApplicationWithEmail[]> {
  const supabase = createServerClient();

  // 1. Ambil data pengajuan dasar. RLS akan berlaku di sini.
  const { data: applications, error: applicationsError } = await supabase
    .from("organizer_applications")
    .select("id, user_id, organization_name, contact_person, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (applicationsError) {
    console.error("Error fetching applications:", applicationsError.message);
    return [];
  }
  if (!applications) return [];

  // 2. Buat client admin untuk mengambil email secara aman
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. Gabungkan data pengajuan dengan email pengguna
  const applicationsWithEmails = await Promise.all(
    applications.map(async (app) => {
      const {
        data: { user },
        error: userError,
      } = await adminSupabase.auth.admin.getUserById(app.user_id);

      if (userError) {
        console.error(`Error fetching user ${app.user_id}:`, userError.message);
      }

      return {
        ...app,
        email: user?.email || "Tidak dapat mengambil email",
      };
    })
  );

  return applicationsWithEmails;
}

export default async function AdminDashboardPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
    return redirect("/");
  }

  const applications = await getPendingApplications();

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
                  <p className="text-sm text-gray-600">Email: {app.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Kontak: {app.contact_person}
                  </p>
                </div>
                <ApplicationActions
                  applicationId={app.id}
                  userId={app.user_id}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}
