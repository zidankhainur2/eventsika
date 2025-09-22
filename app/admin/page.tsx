// app/admin/page.tsx
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ApplicationActions } from "./ApplicationActions";

type ApplicationWithProfile = {
  id: string;
  user_id: string;
  organization_name: string;
  contact_person: string;
  created_at: string;
  profile: {
    id: string;
    email: string;
  };
};

async function getPendingApplications(
  supabase: ReturnType<typeof createServerClient>
): Promise<ApplicationWithProfile[]> {
  const { data, error } = await supabase
    .from("organizer_applications")
    .select("id, user_id, organization_name, contact_person, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
  if (!data) return [];

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const applicationsWithEmails = await Promise.all(
    data.map(async (app) => {
      const {
        data: { user },
        error: userError,
      } = await adminSupabase.auth.admin.getUserById(app.user_id);

      if (userError) {
        console.error(`Error fetching user ${app.user_id}:`, userError);
      }

      return {
        ...app,
        profile: {
          id: app.user_id,
          email: user?.email || "Gagal mengambil email",
        },
      };
    })
  );

  return applicationsWithEmails as ApplicationWithProfile[];
}

export default async function AdminDashboardPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") {
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
                    Email: {app.profile.email}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Kontak: {app.contact_person}
                  </p>
                </div>
                <ApplicationActions
                  applicationId={app.id}
                  userId={app.profile.id}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}
