"use client";

import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import ProfileForm from "./ProfileForm";
import { FiHeart } from "react-icons/fi";
import { useProfile } from "@/lib/hooks/useEvents";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

async function getApplicationStatus() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("organizer_applications")
    .select("status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data?.status || null;
}

function ProfilePageSkeleton() {
  return (
    <Card className="max-w-2xl mx-auto animate-pulse">
      <div className="h-8 w-1/3 bg-gray-200 rounded-md mb-2"></div>
      <div className="h-5 w-1/2 bg-gray-200 rounded-md mb-8"></div>
      <div className="h-24 w-full bg-gray-100 rounded-lg mb-8"></div>
      <div className="h-16 w-full bg-gray-100 rounded-lg mb-8"></div>
      <div className="space-y-6">
        <div className="h-6 w-1/4 bg-gray-200 rounded-md"></div>
        <div className="h-12 w-full bg-gray-200 rounded-md"></div>
        <div className="h-12 w-full bg-gray-200 rounded-md"></div>
      </div>
    </Card>
  );
}

export default function ProfilePage() {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { data: applicationStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ["applicationStatus"],
    queryFn: getApplicationStatus,
  });

  const isLoading = isProfileLoading || isStatusLoading;

  if (isLoading) {
    return (
      <main className="py-8 sm:py-12">
        <ProfilePageSkeleton />
      </main>
    );
  }

  if (!profile) {
    // Jika tidak ada profil (kemungkinan karena user tidak login), arahkan ke login
    return redirect("/login");
  }

  return (
    <main className="py-8 sm:py-12">
      <Card className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-primary">Profil Saya</h1>
            <p className="text-gray-600 mt-1">Email: {profile.id}</p>{" "}
            {/* Email didapat dari ID di tabel auth.users */}
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
              className="inline-block w-auto px-6 py-2 rounded-lg font-bold transition-colors shadow-md bg-accent hover:bg-yellow-500 text-on-accent"
            >
              Ajukan Sekarang
            </Link>
          </div>
        )}

        {/* ... (Tampilan status pengajuan tetap sama) ... */}

        <div className="mt-8">
          <Link
            href="/profile/saved-events"
            className="group block rounded-lg border p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-neutral-dark group-hover:text-primary">
                  Event Tersimpan
                </h3>
                <p className="text-sm text-gray-500">
                  Lihat semua event yang telah Anda tandai
                </p>
              </div>
              <FiHeart className="h-5 w-5 text-gray-400 transition-colors group-hover:text-primary" />
            </div>
          </Link>
        </div>

        <ProfileForm profile={profile} />
      </Card>
    </main>
  );
}
